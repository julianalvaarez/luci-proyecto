import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Payment, MercadoPagoConfig } from 'mercadopago';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { AdminNotificationEmail } from '@/components/emails/AdminNotificationEmail';
import React from 'react';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || '',
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Webhook received:', body);

        const type = body.type || body.topic;
        const paymentId = body.data?.id || body.id;

        if (type === 'payment' && paymentId) {
            console.log('Processing payment:', paymentId);
            const payment = new Payment(client);
            const paymentDetails = await payment.get({ id: paymentId });

            if (paymentDetails.status === 'approved') {
                const bookingId = paymentDetails.external_reference;
                console.log('Payment approved for bookingId:', bookingId);

                // 1. Fetch pending booking data
                const { data: pending, error: pendingError } = await supabase
                    .from('pending_bookings')
                    .select('*')
                    .eq('id', bookingId)
                    .single();

                if (pendingError || !pending || pending.status === 'paid') {
                    console.log('Booking already processed or not found:', bookingId);
                    return NextResponse.json({ ok: true });
                }

                // 2. Perform the actual booking insertion logic
                const bookingData = pending.booking_data;
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

                if (slotError) {
                    console.error('Slot Error:', slotError);
                    throw slotError;
                }

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

                if (patientError) {
                    console.error('Patient Error:', patientError);
                    throw patientError;
                }

                // C. Create Appointment
                const { data: appointment, error: appointmentError } = await supabase
                    .from('appointments')
                    .insert({
                        patient_id: patient.id,
                        slot_id: slot.id,
                        service_id: bookingData.serviceId,
                        location_id: bookingData.locationId || null,
                        status: 'paid',
                        first_time: bookingData.isFirstTime,
                    })
                    .select()
                    .single();

                if (appointmentError) {
                    console.error('Appointment Error:', appointmentError);
                    throw appointmentError;
                }

                // D. Create Intake Form if First Time
                if (bookingData.isFirstTime && bookingData.intakeData) {
                    await supabase.from('intake_forms').insert({
                        appointment_id: appointment.id,
                        ...bookingData.intakeData,
                        age: bookingData.contactData?.age
                    });
                }

                // E. Mark as paid
                await supabase
                    .from('pending_bookings')
                    .update({ status: 'paid' })
                    .eq('id', bookingId);

                // F. Send Emails
                try {
                    const { data: service } = await supabase.from('services').select('name').eq('id', bookingData.serviceId).single();
                    const serviceName = service?.name || 'Consulta';
                    const dateStr = start.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
                    const timeStr = start.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

                    console.log('Generating Admin Notification Email HTML...');
                    const adminNotifyHtml = await render(
                        React.createElement(AdminNotificationEmail, {
                            patientName: `${bookingData.contactData.firstName} ${bookingData.contactData.lastName}`,
                            patientEmail: bookingData.contactData.email,
                            patientPhone: bookingData.contactData.phone,
                            serviceName: serviceName,
                            date: dateStr,
                            time: timeStr,
                            modality: bookingData.modality,
                            intakeData: bookingData.isFirstTime ? bookingData.intakeData : undefined
                        })
                    );

                    console.log('Sending email to admin: lucianacresiaalvarez@gmail.com');
                    const { data: adminEmailData, error: adminEmailError } = await resend.emails.send({
                        from: 'onboarding@resend.dev',
                        to: 'lucianacresiaalvarez@gmail.com',
                        subject: `NUEVO TURNO PAGADO: ${bookingData.contactData.firstName} ${bookingData.contactData.lastName}`,
                        html: adminNotifyHtml
                    });

                    if (adminEmailError) {
                        console.error('Error from Resend:', adminEmailError);
                    } else {
                        console.log('Admin notification email sent successfully:', adminEmailData);
                    }
                } catch (emailError) {
                    console.error('Error in email sending process:', emailError);
                }
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        console.error('Webhook Error (Critical):', error);
        return NextResponse.json({ error: error.message }, { status: 200 });
    }
}
