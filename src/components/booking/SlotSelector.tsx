"use client";

import { useBooking } from '@/context/BookingContext';
import { format, addDays, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { Clock, Loader2 } from 'lucide-react';

const DAYS = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

export default function SlotSelector() {
  const { state, updateState, setStep } = useBooking();
  const [selectedDate, setSelectedDate] = useState(DAYS[0]);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const res = await fetch(`/api/available-slots?date=${dateStr}&modality=${state.modality}&locationId=${state.locationId || ''}`);
        const data = await res.json();
        if (data.slots) {
          setSlots(data.slots);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
  }, [selectedDate, state.modality, state.locationId]);

  const handleSelectSlot = (slot: any) => {
    // In a real app, internal ID would be used
    updateState({ slotId: format(new Date(slot.start_time), "yyyy-MM-dd'T'HH:mm:ss") });
    setStep('contact');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold">Selecciona fecha y hora</h2>
        <p className="text-gray-500 mt-2">Horarios para modalidad <span className="text-brand-primary font-bold">{state.modality}</span></p>
      </div>

      {/* Date Horizontal Picker */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {DAYS.map((date) => {
          const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          return (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center min-w-[80px] p-4 rounded-2xl border-2 transition-all ${
                isSelected 
                  ? 'border-brand-primary bg-emerald-50 text-brand-primary' 
                  : 'border-white bg-white text-gray-400'
              }`}
            >
              <span className="text-xs uppercase font-bold">{format(date, 'EEE', { locale: es })}</span>
              <span className="text-xl font-bold">{format(date, 'd')}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 min-h-[300px]">
        <div className="flex items-center gap-2 mb-6 text-gray-500 font-medium">
          <Clock className="h-4 w-4" />
          <span>Horarios disponibles para el {format(selectedDate, "d 'de' MMMM", { locale: es })}</span>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
            <p className="text-sm text-gray-400">Buscando horarios...</p>
          </div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {slots.map((slot) => (
              <button
                key={slot.start_time}
                onClick={() => handleSelectSlot(slot)}
                className="h-12 flex items-center justify-center rounded-xl bg-gray-50 text-gray-700 font-medium hover:bg-brand-primary hover:text-white transition-all shadow-sm active:scale-95"
              >
                {format(new Date(slot.start_time), 'HH:mm')}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 italic">No hay horarios disponibles para este día.</p>
          </div>
        )}
      </div>
    </div>
  );
}
