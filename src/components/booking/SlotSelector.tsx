"use client";

import { useBooking } from '@/context/BookingContext';
import { format, addDays, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { Clock, Loader2, CalendarX } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';

const FULL_DAYS_RANGE = Array.from({ length: 30 }, (_, i) => addDays(startOfToday(), i));

export default function SlotSelector() {
  const { state, updateState, setStep } = useBooking();
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableDaysOfWeek, setAvailableDaysOfWeek] = useState<number[]>([]);
  const [fetchingRules, setFetchingRules] = useState(true);

  // 1. Fetch the rules once when modality/location changes to filter the days picker
  useEffect(() => {
    async function fetchRules() {
      setFetchingRules(true);
      try {
        let query = supabase
          .from('availability_rules')
          .select('day_of_week')

        if (state.modality === 'online') {
          query = query.is('location_id', null);
        } else if (state.locationId) {
          query = query.eq('location_id', state.locationId);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        const days = Array.from(new Set(data?.map(r => r.day_of_week) || []));
        setAvailableDaysOfWeek(days);

        // Auto-select first available date if current selectedDate is not available
        const firstAvailable = FULL_DAYS_RANGE.find(d => days.includes(d.getDay()));
        if (firstAvailable && !days.includes(selectedDate.getDay())) {
            setSelectedDate(firstAvailable);
        }
      } catch (error) {
        console.error('Error fetching rules:', error);
      } finally {
        setFetchingRules(false);
      }
    }
    fetchRules();
  }, [state.modality, state.locationId]);

  // 2. Fetch slots for the selected date
  useEffect(() => {
    async function fetchSlots() {
      if (fetchingRules) return;
      setLoading(true);
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const res = await fetch(`/api/available-slots?date=${dateStr}&modality=${state.modality}&locationId=${state.locationId || ''}`);
        const data = await res.json();
        if (data.slots) {
          setSlots(data.slots);
        } else {
          setSlots([]);
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
  }, [selectedDate, fetchingRules, state.modality, state.locationId]);

  const handleSelectSlot = (slot: any) => {
    updateState({ slotId: slot.start_time });
    setStep('contact');
  };

  const filteredDays = FULL_DAYS_RANGE.filter(d => availableDaysOfWeek.includes(d.getDay()));

  if (fetchingRules) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
        <p className="text-gray-400 font-medium">Buscando días disponibles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold">Selecciona fecha y hora</h2>
        <p className="text-gray-500 mt-2">
          Disponibilidad para consulta <span className="text-brand-primary font-bold">{state.modality === 'online' ? 'Online' : 'Presencial'}</span>
        </p>
      </div>

      {/* Date Horizontal Picker */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
        {filteredDays.length > 0 ? (
          filteredDays.map((date) => {
            const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center min-w-[85px] p-5 rounded-3xl border-2 transition-all duration-300 shadow-sm ${
                  isSelected 
                    ? 'border-brand-primary bg-emerald-50 text-brand-primary scale-105 shadow-emerald-100' 
                    : 'border-white bg-white text-gray-400 hover:border-gray-100 hover:bg-gray-50'
                }`}
              >
                <span className="text-[10px] uppercase font-black tracking-widest">{format(date, 'EEE', { locale: es })}</span>
                <span className="text-2xl font-black">{format(date, 'd')}</span>
                <span className="text-[9px] font-bold opacity-60">{format(date, 'MMM', { locale: es })}</span>
              </button>
            );
          })
        ) : (
          <div className="w-full bg-white p-10 rounded-3xl border border-gray-100 text-center">
             <CalendarX className="h-10 w-10 text-gray-300 mx-auto mb-3" />
             <p className="text-gray-500 font-bold">No hay días de atención configurados para esta opción.</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-xl shadow-gray-200/50 min-h-[300px]">
        <div className="flex items-center gap-3 mb-8 text-gray-500 font-bold px-2">
          <Clock className="h-5 w-5 text-brand-primary" />
          <span className="text-sm">Horarios para el {format(selectedDate, "d 'de' MMMM", { locale: es })}</span>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
            <p className="text-sm font-medium text-gray-400">Consultando turnos libres...</p>
          </div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {slots.map((slot) => (
              <button
                key={slot.start_time}
                onClick={() => handleSelectSlot(slot)}
                className="h-15 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-700 font-black text-lg hover:bg-brand-primary hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-emerald-100 active:scale-95 border-2 border-transparent hover:border-brand-primary"
              >
                {format(new Date(slot.start_time), 'HH:mm')}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
            <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-black text-xl italic">¡Oh no!</p>
            <p className="text-gray-400 font-medium mt-1">Ya no quedan turnos disponibles para este día.</p>
          </div>
        )}
      </div>
    </div>
  );
}

