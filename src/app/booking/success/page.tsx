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

                <div className="space-y-2">
                    <h1 className="text-4xl font-display font-bold">¡Turno Reservado!</h1>
                    <p className="text-gray-500">Tu turno está agendado con éxito. El pago se realizará el día de la consulta.</p>
                </div>

                <div className="bg-emerald-50 p-6 rounded-3xl space-y-4 text-left">
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-brand-primary mt-1" />
                        <div>
                            <p className="font-bold">Detalles del turno</p>
                            <p className="text-sm text-emerald-800">Recibirás un email con el link a la sesión online o las instrucciones de llegada a la sucursal.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-brand-primary mt-1" />
                        <div>
                            <p className="font-bold">¿Tienes dudas?</p>
                            <p className="text-sm text-emerald-800">Puedes contactarnos por WhatsApp al +54 11 1234 5678</p>
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
