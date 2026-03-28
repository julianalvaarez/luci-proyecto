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
            
            if (response.ok && result.init_point) {
                // Redirect to Mercado Pago checkout
                window.location.href = result.init_point;
            } else {
                throw new Error(result.error || 'Error creating payment preference');
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
            toast.error('Hubo un error al procesar el pago. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-display font-bold">Resumen de tu turno</h2>
                <p className="text-gray-500 mt-2">Para confirmar tu reserva, debes abonar el total a través de <span className="text-blue-600 font-bold">Mercado Pago</span>.</p>
            </div>

            <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                    <ShieldCheck className="h-32 w-32 text-brand-primary" />
                </div>

                <div className="space-y-5 relative z-10">
                    <div className="flex justify-between items-center pb-5 border-b border-gray-50">
                        <span className="text-gray-500 font-medium font-sans italic">Servicio</span>
                        <span className="font-bold text-gray-800">{serviceName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-5 border-b border-gray-50">
                        <span className="text-gray-500 font-medium font-sans italic">Modalidad</span>
                        <span className="font-bold uppercase text-[10px] tracking-wider px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full">
                            {state.modality === 'online' ? '🌎 Online' : '📍 Presencial'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-5 border-b border-gray-50">
                        <span className="text-gray-500 font-medium font-sans italic">Fecha y Hora</span>
                        <span className="font-bold text-gray-800">
                            {state.slotId && new Date(state.slotId).toLocaleDateString('es-AR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium font-sans italic">Paciente</span>
                        <span className="font-bold text-gray-800">
                            {state.contactData?.firstName} {state.contactData?.lastName}
                        </span>
                    </div>
                </div>

                <div className="pt-8 border-t-2 border-dashed border-gray-100 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 text-center md:text-left">
                        <div>
                            <span className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">Total a pagar ahora</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-4xl font-display font-black text-brand-primary">
                                    ${price.toLocaleString()}
                                </span>
                                <span className="text-gray-400 font-medium">ARS</span>
                            </div>
                        </div>
                        <div className="bg-blue-50 px-5 py-3 rounded-2xl flex items-center gap-3 border-2 border-blue-100 shadow-sm">
                            <img src="https://www.mercadopago.com/instore/merchant/static/images/logo_mp.png" alt="Mercado Pago" className="h-6" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-blue-700 uppercase tracking-tighter leading-none">Pago Seguro</span>
                                <span className="text-[10px] font-medium text-blue-400 leading-none mt-1">Mercado Pago</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="w-full h-18 py-5 bg-brand-primary text-white rounded-full font-black text-xl hover:bg-brand-secondary transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <>
                                Pagar con Mercado Pago
                                <Check className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-6 text-gray-400 text-xs text-center font-medium">
                        <ShieldCheck className="h-4 w-4" />
                        Tu pago es procesado de forma segura por Mercado Pago
                    </div>

                </div>
            </div>
        </div>
    );
}
