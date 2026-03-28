import Link from 'next/link';
import { CheckCircle, Calendar, MessageSquare, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center text-brand-primary animate-bounce">
                        <CheckCircle className="h-12 w-12" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-display font-bold text-gray-900 leading-tight">¡Turno Confirmado!</h1>
                    <p className="text-gray-500 font-medium">Hemos recibido tu pago y tu turno está agendado con éxito. 🎉</p>
                </div>

                <div className="bg-emerald-50/50 backdrop-blur-sm p-8 rounded-[40px] space-y-6 text-left border border-emerald-100/50 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                            <Calendar className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Tu reserva está lista</p>
                            <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                                Ya puedes agendar el link de acceso si es online, o presentarte en la sucursal el día indicado.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
                            <MessageSquare className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">¿Tienes dudas?</p>
                            <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                                Puedes contactarnos por WhatsApp al <span className="font-bold">+54 9 11 6536-8186</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Link
                        href="/"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-8 text-sm font-medium text-white shadow-lg shadow-emerald-200 transition-all hover:bg-brand-secondary hover:scale-105"
                    >
                        Volver al inicio
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
