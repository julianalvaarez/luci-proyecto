import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { AdminNotificationEmail } from '@/components/emails/AdminNotificationEmail';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { bookingData } = await req.json();

        // 1. Fetch Service
        const { data: service, error: sError } = await supabase
            .from('services')
            .select('*')
            .eq('id', bookingData.serviceId)
            .single();

        if (sError || !service) {
            throw new Error('Service not found');
        }

        const start = new Date(bookingData.slotId);
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        // A. Create Slot
        const { data: slot, error: slotError } = await supabase
            .from('slots')
            .insert({
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                status: 'reserved'
            })
            .select()
            .single();

        if (slotError) throw slotError;

        // B. Create/Upsert Patient
        const { data: patient, error: patientError } = await supabase
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

        if (patientError) throw patientError;

        // C. Create Appointment (Status pending, since payment needs manual verification)
        const { data: appointment, error: appointmentError } = await supabase
            .from('appointments')
            .insert({
                patient_id: patient.id,
                slot_id: slot.id,
                service_id: bookingData.serviceId,
                location_id: bookingData.locationId || null,
                status: 'pending',
                first_time: bookingData.isFirstTime,
                payment_receipt_url: bookingData.paymentReceiptUrl || null
            })
            .select()
            .single();

        if (appointmentError) throw appointmentError;

        // D. Create Intake Form if First Time
        if (bookingData.isFirstTime && bookingData.intakeData) {
            await supabase.from('intake_forms').insert({
                appointment_id: appointment.id,
                ...bookingData.intakeData,
                age: bookingData.contactData?.age
            });
        }

        // E. Send Emails
        try {
            const dateStr = start.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
            const timeStr = start.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

            const adminNotifyHtml = await render(
                React.createElement(AdminNotificationEmail, {
                    patientName: `${bookingData.contactData.firstName} ${bookingData.contactData.lastName}`,
                    patientEmail: bookingData.contactData.email,
                    patientPhone: bookingData.contactData.phone,
                    serviceName: service.name,
                    date: dateStr,
                    time: timeStr,
                    modality: bookingData.modality,
                    intakeData: bookingData.isFirstTime ? bookingData.intakeData : undefined
                })
            );

            resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'lucianacresiaalvarez@gmail.com',
                subject: `NUEVO TURNO SOLICITADO: ${bookingData.contactData.firstName} ${bookingData.contactData.lastName}`,
                html: adminNotifyHtml
            });
        } catch (emailError) {
            console.error('Error in email sending process:', emailError);
        }

        return NextResponse.json({ success: true, redirect: '/booking/success' });
    } catch (error: any) {
        console.error('Confirm Booking Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
