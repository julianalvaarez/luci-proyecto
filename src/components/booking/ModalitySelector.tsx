"use client";

import { useBooking } from '@/context/BookingContext';
import { Video, MapPin } from 'lucide-react';

export default function ModalitySelector() {
  const { state, updateState, setStep } = useBooking();

  // In a real app, some services might only be presencial (e.g. Antropometría)
  // We can add logic to disable or skip this step if the service defines the modality.
  
  const handleSelect = (modality: 'online' | 'presencial') => {
    updateState({ modality });
    if (modality === 'online') {
      setStep('intake');
    } else {
      setStep('location');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold">¿Cómo prefieres la consulta?</h2>
        <p className="text-gray-500 mt-2">Elige la modalidad que mejor se adapte a ti.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => handleSelect('online')}
          className={`p-8 bg-white border rounded-3xl shadow-sm transition-all text-center flex flex-col items-center gap-4 group hover:shadow-md ${
            state.modality === 'online' ? 'border-brand-primary bg-emerald-50' : 'border-gray-100'
          }`}
        >
          <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Video className="h-8 w-8 text-brand-primary" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Online</h3>
            <p className="text-gray-400 text-sm mt-1">Vía videollamada</p>
          </div>
        </button>

        <button
          onClick={() => handleSelect('presencial')}
          className={`p-8 bg-white border rounded-3xl shadow-sm transition-all text-center flex flex-col items-center gap-4 group hover:shadow-md ${
            state.modality === 'presencial' ? 'border-brand-primary bg-emerald-50' : 'border-gray-100'
          }`}
        >
          <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MapPin className="h-8 w-8 text-brand-primary" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Presencial</h3>
            <p className="text-gray-400 text-sm mt-1">En consultorio</p>
          </div>
        </button>
      </div>
    </div>
  );
}
