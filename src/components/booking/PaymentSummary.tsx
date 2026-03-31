"use client";

import { useBooking } from '@/context/BookingContext';
import { Check, CalendarCheck, ShieldCheck, Loader2, Copy, FileUp, CheckCircle, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function PaymentSummary() {
    const { state, updateState } = useBooking();
    const [loading, setLoading] = useState(false);
    const [serviceDetails, setServiceDetails] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [paymentReceiptUrl, setPaymentReceiptUrl] = useState<string | null>(null);
    const router = useRouter();

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

    const handleCopy = async (text: string, type: string) => {
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                toast.success(`${type} copiado correctamente`);
            } else {
                // Fallback for non-secure contexts (e.g. mobile over local network, older browsers)
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    toast.success(`${type} copiado correctamente`);
                } catch (err) {
                    toast.error(`No se pudo copiar el ${type} automáticamente.`);
                }
                textArea.remove();
            }
        } catch (err) {
            console.error('Failed to copy', err);
            toast.error(`No se pudo copiar el ${type} automáticamente.`);
        }
    };

    const uploadFile = async (file: File) => {
        try {
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const supabaseFileName = `${Math.random()}.${fileExt}`;
            const filePath = `receipts/${supabaseFileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('payment-receipts')
                .upload(filePath, file);

            if (uploadError) throw uploadError;
            
            const fileUrl = data.path;
            setPaymentReceiptUrl(fileUrl);
            setFileName(file.name);
            updateState({ paymentReceiptUrl: fileUrl });
            
            toast.success('Comprobante subido exitosamente');
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Error al subir el comprobante. Intenta nuevamente.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            await uploadFile(file);
        }
    };

    const handleConfirm = async () => {
        if (!paymentReceiptUrl) {
            toast.error('Debes subir el comprobante para confirmar el turno.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/confirm-booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingData: { ...state, paymentReceiptUrl },
                }),
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                // Redirect user to a success view
                router.push('/booking/success');
            } else {
                throw new Error(result.error || 'Error agendando tu turno');
            }
        } catch (error) {
            console.error('Error confirming booking:', error);
            toast.error('Hubo un error al confirmar. Intenta nuevamente o contactános por WhatsApp.');
        } finally {
            setLoading(false);
        }
    };

    if (!serviceDetails && state.serviceId) {
        return (
            <div className="flex justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    const serviceName = serviceDetails?.name || 'Consulta';
    const price = serviceDetails?.price || 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
                <h2 className="text-3xl font-display font-bold">Confirma tu turno</h2>
                <p className="text-gray-500 mt-2">Sigue los pasos a continuación para abonar y asegurar tu horario.</p>
            </div>

            <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8 relative overflow-hidden">
                <div className="space-y-5 relative z-10">
                    <div className="flex justify-between items-center pb-5 border-b border-gray-50">
                        <span className="text-gray-500 font-medium font-sans italic">Servicio</span>
                        <span className="font-bold text-gray-800">{serviceName}</span>
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
                    <div className="flex justify-between items-center pb-5 border-b border-gray-50">
                        <span className="text-gray-500 font-medium font-sans italic">Paciente</span>
                        <span className="font-bold text-gray-800">
                            {state.contactData?.firstName} {state.contactData?.lastName}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium font-sans italic">Abonar</span>
                        <span className="text-2xl font-display font-black text-brand-primary">
                            ${price.toLocaleString()} <span className="text-sm font-medium text-gray-400">ARS</span>
                        </span>
                    </div>
                </div>

                <div className="pt-8 border-t-2 border-dashed border-gray-100 relative z-10 space-y-8">
                    {/* Pasos a seguir */}
                    <div>
                        <h3 className="font-black text-lg mb-4 text-gray-800">Pasos para confirmar:</h3>
                        
                        <div className="space-y-6">
                            {/* Paso 1 y 2 */}
                            <div className="flex gap-4">
                                <div className="h-8 w-8 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-black shrink-0">1</div>
                                <div className="space-y-3 w-full">
                                    <p className="font-bold text-gray-700 leading-snug">
                                        Copia el Alias o CBU, transfiere el monto exacto y <span className="text-brand-primary">guarda la foto o captura del comprobante</span> para subirla a continuación.
                                    </p>
                                    
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Alias</p>
                                                <p className="font-bold text-gray-800 tracking-wider font-mono">KUCHNIA</p>
                                            </div>
                                            <button onClick={() => handleCopy('KUCHNIA', 'Alias')} className="p-2 text-gray-400 hover:text-brand-primary hover:bg-emerald-50 rounded-xl transition-all">
                                                <Copy className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="h-px bg-gray-200" />
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">CBU</p>
                                                <p className="font-bold text-gray-800 tracking-wider font-mono">0140056403517359027039</p>
                                            </div>
                                            <button onClick={() => handleCopy('0140056403517359027039', 'CBU')} className="p-2 text-gray-400 hover:text-brand-primary hover:bg-emerald-50 rounded-xl transition-all">
                                                <Copy className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Paso 3 */}
                            <div className="flex gap-4">
                                <div className="h-8 w-8 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-black shrink-0">2</div>
                                <div className="w-full">
                                    <p className="font-bold text-gray-700 mb-3">Sube una foto o PDF del comprobante <span className="text-red-500">*</span></p>
                                    <div className="flex flex-col sm:flex-row gap-4 items-center border-2 border-dashed border-gray-200 hover:border-brand-primary transition-all p-4 rounded-3xl bg-gray-50/50">
                                        <div className="shrink-0 w-full sm:w-auto">
                                            <label className={`w-full cursor-pointer px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${paymentReceiptUrl ? 'bg-emerald-100 text-brand-primary shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-primary hover:text-brand-primary shadow-sm'}`}>
                                                {isUploading ? (
                                                    <><Loader2 className="h-5 w-5 animate-spin" /><span>Subiendo...</span></>
                                                ) : paymentReceiptUrl ? (
                                                    <><CheckCircle className="h-5 w-5" /><span>Cambiar</span></>
                                                ) : (
                                                    <><FileUp className="h-5 w-5" /><span>Seleccionar</span></>
                                                )}
                                                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} disabled={isUploading} />
                                            </label>
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            {paymentReceiptUrl ? (
                                                <div>
                                                    <p className="text-sm font-bold text-emerald-600">¡Comprobante adjuntado!</p>
                                                    {fileName && <p className="text-[10px] text-gray-500 truncate max-w-[200px] mt-0.5">{fileName}</p>}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400">Es obligatorio subir el comprobante para confirmar el turno.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleConfirm}
                            disabled={loading || !paymentReceiptUrl}
                            className={`w-full h-16 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${paymentReceiptUrl ? 'bg-brand-primary text-white shadow-xl shadow-emerald-200 hover:bg-brand-secondary' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>Confirmar Mi Turno <Check className="h-6 w-6" /></>
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {/* Aviso Whatsapp */}
            <div className="text-center p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2rem]">
                <p className="text-gray-500 text-sm font-medium mb-3 flex items-center justify-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    ¿Tienes dudas con el pago o reserva?
                </p>
                <a href="https://wa.me/5491165368186" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#20BE5A] transition-all shadow-lg shadow-[#25D366]/20">
                    <MessageCircle className="h-5 w-5" />
                    Escribir por WhatsApp
                </a>
            </div>

        </div>
    );
}
