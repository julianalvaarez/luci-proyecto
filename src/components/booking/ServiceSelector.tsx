"use client";

import { useBooking } from '@/context/BookingContext';
import { Video, User, Activity, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ServiceSelector() {
    const { updateState, setStep } = useBooking();
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServices() {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('price', { ascending: true });
            
            if (data) setServices(data);
            setLoading(false);
        }
        fetchServices();
    }, []);

    const handleSelect = (service: any) => {
        const modality = service.modality; // Use modality from DB
        
        updateState({
            serviceId: service.id,
            modality: modality as 'online' | 'presencial'
        });

        if (modality === 'online') {
            setStep('intake');
        } else {
            setStep('location');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
                <p className="text-gray-400">Cargando servicios...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-display font-bold">¿Qué servicio necesitas?</h2>
                <p className="text-gray-500 mt-2">Selecciona el tipo de consulta para comenzar.</p>
            </div>

            <div className="grid gap-4">
                {services.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => handleSelect(s)}
                        className="flex items-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-brand-primary hover:shadow-md transition-all group text-left"
                    >
                        <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                            {s.modality === 'online' ? (
                                <Video className="h-6 w-6 text-brand-primary" />
                            ) : s.name.toLowerCase().includes('antropo') ? (
                                <Activity className="h-6 w-6 text-brand-primary" />
                            ) : (
                                <User className="h-6 w-6 text-brand-primary" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{s.name}</h3>
                            <p className="text-emerald-600 font-semibold">${Number(s.price).toLocaleString()}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
