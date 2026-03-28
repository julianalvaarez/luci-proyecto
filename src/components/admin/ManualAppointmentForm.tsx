"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { X, Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

interface ManualAppointmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function ManualAppointmentForm({ onClose, onSuccess, initialData }: ManualAppointmentFormProps) {
  const [services, setServices] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!initialData;

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: isEdit ? {
      firstName: initialData.patients?.first_name || '',
      lastName: initialData.patients?.last_name || '',
      email: initialData.patients?.email || '',
      phone: initialData.patients?.phone || '',
      service_id: initialData.service_id || '',
      location_id: initialData.location_id || '',
      date: initialData.slots?.start_time ? format(new Date(initialData.slots.start_time), 'yyyy-MM-dd') : '',
      time: initialData.slots?.start_time ? format(new Date(initialData.slots.start_time), 'HH:mm') : '',
      notes: initialData.notes || '',
      first_time: initialData.first_time || false
    } : {
      first_time: false
    }
  });
  const selectedServiceId = watch('service_id');

  useEffect(() => {
    async function fetchData() {
      const [{ data: s }, { data: l }] = await Promise.all([
        supabase.from('services').select('*'),
        supabase.from('locations').select('*')
      ]);
      setServices(s || []);
      setLocations(l || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const selectedService = services.find(s => s.id === selectedServiceId);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const start = new Date(`${data.date}T${data.time}:00`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const locationId = selectedService?.modality === 'online' ? null : data.location_id;

      // 1. Check if the slot is already occupied
      const { data: bookedSlots, error: checkError } = await supabase
        .from('appointments')
        .select(`
          id,
          slots!inner (
            start_time
          )
        `)
        .neq('status', 'cancelled');

      if (checkError) throw checkError;

      const requestedStart = start.toISOString();
      const isTimeOccupied = bookedSlots?.some(booked => {
        if (isEdit && booked.id === initialData.id) return false; // Ignore current appointment if editing

        const slotData = Array.isArray(booked.slots) ? booked.slots[0] : booked.slots;
        if (!slotData) return false;

        const bookedStart = new Date(slotData.start_time).toISOString();
        return bookedStart === requestedStart;
      });

      if (isTimeOccupied) {
        throw new Error('Ese horario ya se encuentra ocupado por otro turno activo.');
      }

      if (isEdit) {
        // 1. Update Patient
        const { error: pError } = await supabase
          .from('patients')
          .update({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
          })
          .eq('id', initialData.patient_id);

        if (pError) throw pError;

        // 2. Update Slot
        const { error: sError } = await supabase
          .from('slots')
          .update({
            start_time: start.toISOString(),
            end_time: end.toISOString()
          })
          .eq('id', initialData.slot_id);

        if (sError) throw sError;

        // 3. Update Appointment
        const { error: aError } = await supabase
          .from('appointments')
          .update({
            service_id: data.service_id,
            location_id: locationId,
            notes: data.notes,
            first_time: data.first_time
          })
          .eq('id', initialData.id);

        if (aError) throw aError;
      } else {
        // 1. Create or Find Patient
        const { data: patient, error: pError } = await supabase
          .from('patients')
          .upsert({
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
          }, { onConflict: 'email' })
          .select()
          .single();

        if (pError) throw pError;

        // 2. Create Slot
        const { data: slot, error: sError } = await supabase
          .from('slots')
          .insert({
            start_time: start.toISOString(),
            end_time: end.toISOString(),
            status: 'reserved'
          })
          .select()
          .single();

        if (sError) throw sError;

        // 3. Create Appointment
        const { error: aError } = await supabase
          .from('appointments')
          .insert({
            patient_id: patient.id,
            slot_id: slot.id,
            service_id: data.service_id,
            location_id: locationId,
            status: 'paid', // Manual appointments are usually considered confirmed
            notes: data.notes,
            first_time: data.first_time
          });

        if (aError) throw aError;
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline-block" /></div>;

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl flex items-end sm:items-center justify-center z-[150] p-0 sm:p-4 text-left">
      <div className="bg-white w-full max-w-2xl rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 sm:zoom-in duration-300 max-h-[92vh] flex flex-col">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div>
            <h3 className="text-2xl font-black text-gray-900">{isEdit ? 'Editar Turno' : 'Nuevo Turno'}</h3>
            <p className="text-gray-400 text-sm font-medium">Completa los datos del paciente y horario.</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white hover:bg-gray-100 rounded-2xl transition-all shadow-sm">
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8 overflow-y-auto scrollbar-hide">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase text-brand-primary tracking-widest px-1">Información Personal</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 px-1">Nombre</label>
                <input {...register('firstName', { required: true })} className="w-full h-14 px-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all font-bold text-gray-700 outline-none" placeholder="Ej: Juan" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 px-1">Apellido</label>
                <input {...register('lastName', { required: true })} className="w-full h-14 px-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all font-bold text-gray-700 outline-none" placeholder="Ej: Perez" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 px-1">Email</label>
                <input {...register('email', { required: true })} className="w-full h-14 px-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all font-bold text-gray-700 outline-none" placeholder="juan@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 px-1">Teléfono</label>
                <input {...register('phone')} className="w-full h-14 px-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all font-bold text-gray-700 outline-none" placeholder="+54 9 11..." />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-50">
            <h4 className="text-[10px] font-black uppercase text-brand-primary tracking-widest px-1">Detalles del Servicio</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 px-1">Servicio</label>
                <select {...register('service_id', { required: true })} className="w-full h-14 px-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all font-bold text-gray-700 outline-none appearance-none">
                  <option value="">Seleccionar...</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              {selectedService?.modality === 'presencial' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 px-1">Sucursal</label>
                  <select {...register('location_id', { required: true })} className="w-full h-14 px-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all font-bold text-gray-700 outline-none appearance-none">
                    <option value="">Seleccionar...</option>
                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 px-1">Fecha</label>
              <input type="date" {...register('date', { required: true })} className="w-full h-14 px-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all font-bold text-gray-700 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 px-1">Hora</label>
              <input type="time" {...register('time', { required: true })} className="w-full h-14 px-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all font-bold text-gray-700 outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 px-1">Notas (Opcional)</label>
            <textarea {...register('notes')} className="w-full p-5 bg-gray-50 rounded-[2rem] border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all font-medium text-gray-700 outline-none" rows={3} placeholder="Detalles relevantes..." />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 pb-4">
            <button type="button" onClick={onClose} className="flex-1 h-15 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black hover:bg-gray-100 transition-all sm:order-1">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="flex-[2] h-15 py-4 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 sm:order-2 active:scale-95 disabled:opacity-50">
              {submitting ? <Loader2 className="animate-spin h-6 w-6" /> : <Save className="h-6 w-6" />}
              <span>{isEdit ? 'Guardar Cambios' : 'Confirmar Turno'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

