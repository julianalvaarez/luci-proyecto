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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-left">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold">{isEdit ? 'Editar Turno' : 'Crear Turno Manual'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-4 md:space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-400 uppercase">Nombre</label>
              <input {...register('firstName', { required: true })} className="w-full h-11 px-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary" placeholder="Ej: Juan" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-400 uppercase">Apellido</label>
              <input {...register('lastName', { required: true })} className="w-full h-11 px-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary" placeholder="Ej: Perez" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-400 uppercase">Email</label>
              <input {...register('email', { required: true })} className="w-full h-11 px-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary" placeholder="juan@email.com" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-400 uppercase">Teléfono</label>
              <input {...register('phone')} className="w-full h-11 px-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary" placeholder="+54..." />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-50">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-400 uppercase">Servicio</label>
              <select {...register('service_id', { required: true })} className="w-full h-11 px-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary">
                <option value="">Seleccionar...</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            {selectedService?.modality === 'presencial' && (
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-400 uppercase">Sucursal</label>
                <select {...register('location_id', { required: true })} className="w-full h-11 px-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary">
                  <option value="">Seleccionar...</option>
                  {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-400 uppercase">Fecha</label>
              <input type="date" {...register('date', { required: true })} className="w-full h-11 px-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-400 uppercase">Hora</label>
              <input type="time" {...register('time', { required: true })} className="w-full h-11 px-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-400 uppercase">Notas (Opcional)</label>
            <textarea {...register('notes')} className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-primary" rows={2} placeholder="Algún detalle relevante del paciente..." />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 h-12 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="flex-[2] h-12 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-secondary transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
              {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
              {isEdit ? 'Guardar Cambios' : 'Crear Turno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
