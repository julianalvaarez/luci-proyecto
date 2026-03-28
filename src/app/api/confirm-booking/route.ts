import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export async function POST(req: NextRequest) {
    try {
        const { bookingData } = await req.json();

        // 1. Fetch Service Price
        const { data: service, error: sError } = await supabase
            .from('services')
            .select('*')
            .eq('id', bookingData.serviceId)
            .single();

        if (sError || !service) {
            throw new Error('Service not found');
        }

        // 2. Clear out any previous pending bookings for this same slot to avoid double payment issues
        // (Optional check)

        // 3. Store the pending booking in DB
        const { data: pending, error: pError } = await supabase
            .from('pending_bookings')
            .insert({
                booking_data: bookingData,
                status: 'pending'
            })
            .select()
            .single();

        if (pError) throw pError;

        // 4. Create Mercado Pago Preference
        // Robust base URL detection
        let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!baseUrl && process.env.VERCEL_URL) {
            baseUrl = `https://${process.env.VERCEL_URL}`;
        }
        // Hard fallback to your specific domain to ensure it works in production
        if (!baseUrl) {
            baseUrl = 'https://lucianacresia.vercel.app';
        }

        const preference = new Preference(client);
        
        // Ensure notification_url is a valid absolute URL or omit it
        let notification_url = process.env.MP_WEBHOOK_URL;
        if (!notification_url || !notification_url.startsWith('http')) {
            notification_url = `${baseUrl}/api/webhook/mercadopago`;
        }

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: service.id,
                        title: service.name,
                        unit_price: service.price,
                        quantity: 1,
                        currency_id: 'ARS',
                    },
                ],
                external_reference: pending.id,
                back_urls: {
                    success: `${baseUrl}/booking/success`,
                    failure: `${baseUrl}/booking/failure`,
                    pending: `${baseUrl}/booking/pending`,
                },
                auto_return: 'approved',
                notification_url: notification_url,
            },
        });

        return NextResponse.json({ 
            success: true, 
            init_point: result.init_point, // For direct redirect or opening modal
            preference_id: result.id 
        });
    } catch (error: any) {
        console.error('Preference Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
