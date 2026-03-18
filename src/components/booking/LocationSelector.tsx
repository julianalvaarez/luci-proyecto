"use client";

import { useBooking } from '@/context/BookingContext';
import { MapPin, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LocationSelector() {
    const { state, updateState, setStep } = useBooking();
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLocations() {
            const { data } = await supabase
                .from('locations')
                .select('*')
                .eq('is_active', true);
            
            if (data) setLocations(data);
            setLoading(false);
        }
        fetchLocations();
    }, []);

    if (state.modality === 'online') return null;

    const handleSelect = (id: string) => {
        updateState({ locationId: id });
        setStep('intake');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
                <p className="text-gray-400">Cargando sucursales...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-display font-bold">Elige una sucursal</h2>
                <p className="text-gray-500 mt-2">¿Dónde prefieres realizar tu consulta presencial?</p>
            </div>

            <div className="grid gap-4">
                {locations.map((l) => (
                    <button
                        key={l.id}
                        onClick={() => handleSelect(l.id)}
                        className="flex items-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-brand-primary hover:shadow-md transition-all group text-left"
                    >
                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center mr-4">
                            <MapPin className="h-5 w-5 text-brand-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">{l.name}</h3>
                            <p className="text-gray-400 text-sm">{l.address}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
