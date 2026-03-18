import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ConfirmationEmail } from '@/components/emails/ConfirmationEmail';
import { AdminNotificationEmail } from '@/components/emails/AdminNotificationEmail';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { bookingData } = await req.json();

        // 1. Calculate end time
        const start = new Date(bookingData.slotId); // e.g., "2026-03-12T15:00:00"
        const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration

        // 2. Create Slot
        const { data: slot, error: slotError } = await supabase
            .from('slots')
            .insert({
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                status: 'reserved'
            })
            .select()
            .single();

        if (slotError) {
            console.error('Error creating slot:', slotError);
            return NextResponse.json({ error: 'Failed to reserve slot' }, { status: 400 });
        }

        // 3. Create Patient (or find existing)
        const { data: patient, error: pError } = await supabase
            .from('patients')
            .upsert({
                email: bookingData.contactData.email,
                first_name: bookingData.contactData.firstName,
                last_name: bookingData.contactData.lastName,
                phone: bookingData.contactData.phone,
                age: bookingData.contactData.age
            }, { onConflict: 'email' })
            .select()
            .single();

        if (pError) throw pError;

        // 4. Create Appointment (Confirmed directly since there's no payment)
        const { data: appointment, error: aError } = await supabase
            .from('appointments')
            .insert({
                patient_id: patient.id,
                slot_id: slot.id,
                service_id: bookingData.serviceId,
                location_id: bookingData.locationId || null,
                status: 'paid', // We mark it as paid/confirmed so it shows in the calendar
                first_time: bookingData.isFirstTime,
            })
            .select()
            .single();

        if (aError) {
            // Also rollback slot
            await supabase.from('slots').delete().eq('id', slot.id);
            throw aError;
        }

        // 5. Create Intake Form if exists
        if (bookingData.isFirstTime && bookingData.intakeData) {
            await supabase.from('intake_forms').insert({
                appointment_id: appointment.id,
                ...bookingData.intakeData
            });
        }

        // 6. Send Emails
        try {
            const serviceName = bookingData.serviceId === '1' ? 'Consulta Online' : 'Consulta Presencial';
            const dateStr = start.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
            const timeStr = start.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

            // Render to HTML strings to avoid Resend automatic render issues
            const confirmationHtml = await render(
               React.createElement(ConfirmationEmail, {
                    patientName: bookingData.contactData.firstName,
                    serviceName: serviceName,
                    date: dateStr,
                    time: timeStr,
                    modality: bookingData.modality,
                    location: bookingData.modality === 'presencial' ? 'Consultorio Palermo' : undefined
                })
            );

            const adminNotifyHtml = await render(
                React.createElement(AdminNotificationEmail, {
                    patientName: `${bookingData.contactData.firstName} ${bookingData.contactData.lastName}`,
                    patientEmail: bookingData.contactData.email,
                    patientPhone: bookingData.contactData.phone,
                    serviceName: serviceName,
                    date: dateStr,
                    time: timeStr,
                    modality: bookingData.modality
                })
            );

            // Send to Patient
            const patientEmailRes = await resend.emails.send({
                from: 'NutriBooking <onboarding@resend.dev>',
                to: bookingData.contactData.email,
                subject: 'Confirmación de tu turno - Lic. Luciana Cresia',
                html: confirmationHtml
            });
            console.log('Resend Patient Email Response:', patientEmailRes);

            // Send to Admin
            const adminEmailRes = await resend.emails.send({
                from: 'NutriBooking <onboarding@resend.dev>',
                to: 'julialva2008@gmail.com',
                subject: `Nuevo Turno: ${bookingData.contactData.firstName} ${bookingData.contactData.lastName}`,
                html: adminNotifyHtml
            });
            console.log('Resend Admin Email Response:', adminEmailRes);
        } catch (emailError) {
            console.error('Error sending emails block:', emailError);
            // Don't fail the whole booking if email fails
        }

        return NextResponse.json({ success: true, redirect: '/booking/success' });
    } catch (error: any) {
        console.error('Booking Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
