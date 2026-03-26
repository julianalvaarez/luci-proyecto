"use client";

import { useBooking } from '@/context/BookingContext';
import { Check, CalendarCheck, ShieldCheck, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabase';

export default function PaymentSummary() {
    const { state } = useBooking();
    const [loading, setLoading] = useState(false);
    const [serviceDetails, setServiceDetails] = useState<any>(null);

    // Fetch the real service data from Supabase instead of hardcoded defaults
    useEffect(() => {
        async function fetchService() {
            if (!state.serviceId) return;
            const { data } = await supabase
                .from('services')
                .select('name, price')
                .eq('id', state.serviceId)
                .single();
            if (data) setServiceDetails(data);
        }
        fetchService();
    }, [state.serviceId]);

    if (!serviceDetails && state.serviceId) {
        return (
            <div className="flex justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    const serviceName = serviceDetails?.name || 'Consulta';
    const price = serviceDetails?.price || 0;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/confirm-booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingData: state,
                }),
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                window.location.href = result.redirect;
            } else {
                throw new Error(result.error || 'Error confirming booking');
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
            toast.error('Hubo un error al confirmar el turno. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-display font-bold">Resumen de tu turno</h2>
                <p className="text-gray-500 mt-2">Revisa los detalles antes de confirmar.</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                        <span className="text-gray-500">Servicio</span>
                        <span className="font-bold">{serviceName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                        <span className="text-gray-500">Modalidad</span>
                        <span className="font-bold uppercase text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md">
                            {state.modality}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                        <span className="text-gray-500">Fecha y Hora</span>
                        <span className="font-bold">{state.slotId?.replace('T', ' ')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Paciente</span>
                        <span className="font-bold">{state.contactData?.firstName} {state.contactData?.lastName}</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-bold">Total a pagar (en consulta)</span>
                        <span className="text-3xl font-display font-bold text-brand-primary">
                            ${price.toLocaleString()}
                        </span>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="w-full h-14 bg-brand-primary text-white rounded-full font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-100"
                    >
                        {loading ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                Confirmar Turno
                                <CalendarCheck className="h-5 w-5" />
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs text-center">
                        <ShieldCheck className="h-4 w-4" />
                        Tus datos están protegidos y tu turno quedará reservado
                    </div>
                </div>
            </div>
        </div>
    );
}
