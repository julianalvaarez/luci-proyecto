"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, MapPin, Video, Loader2, FileUp } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface WeeklyCalendarProps {
    onOpenManual: () => void;
    onEditManual: (appointment: any) => void;
}

export default function WeeklyCalendar({ onOpenManual, onEditManual }: WeeklyCalendarProps) {
    const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const days = Array.from({ length: 6 }, (_, i) => addDays(currentWeek, i)); // Mon - Sat
    const hours = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`); // 08:00 to 20:00

    const [selectedAppt, setSelectedAppt] = useState<any | null>(null);

    useEffect(() => {
        async function fetchAppointments() {
            setLoading(true);
            const { data, error } = await supabase
                .from('appointments')
                .select('*, patients(*), services(*), locations(*), slots(*), intake_forms(*)')
                .neq('status', 'cancelled');

            if (data) setAppointments(data);
            setLoading(false);
        }
        fetchAppointments();
    }, [currentWeek]);

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden text-left relative">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold capitalize">{format(currentWeek, 'MMMM yyyy', { locale: es })}</h2>
                    <p className="text-gray-400 text-sm">Calendario de turnos semanal</p>
                </div>
                <div className="flex items-center gap-2 justify-between md:justify-end w-full md:w-auto">
                    <div className="flex gap-1">
                        <button onClick={() => setCurrentWeek(addDays(currentWeek, -7))} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={() => setCurrentWeek(addDays(currentWeek, 7))} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                    <button
                        onClick={onOpenManual}
                        className="bg-brand-primary text-white px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-brand-secondary transition-all shadow-lg shadow-emerald-100"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Nuevo Turno</span>
                        <span className="sm:hidden">Nuevo</span>
                    </button>
                </div>
            </div>

            {/* Grid Container */}
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">

                    {/* Grid */}
                    <div className="grid grid-cols-7 border-b border-gray-50 bg-gray-50/50">
                        <div className="p-4 border-r border-gray-100"></div> {/* Time column spacer */}
                        {days.map((day) => (
                            <div key={day.toISOString()} className="p-4 border-r border-gray-100 text-center">
                                <span className="text-xs uppercase font-bold text-gray-400">{format(day, 'EEE', { locale: es })}</span>
                                <div className="text-xl font-bold">{format(day, 'd')}</div>
                            </div>
                        ))}
                    </div>

                    <div className="relative">
                        {loading ? (
                            <div className="p-20 text-center flex flex-col items-center gap-2">
                                <Loader2 className="animate-spin text-brand-primary" />
                                <p className="text-sm text-gray-400">Cargando agenda...</p>
                            </div>
                        ) : (
                            hours.map((hour) => (
                                <div key={hour} className="grid grid-cols-7 border-b border-gray-50 min-h-[50px]">
                                    <div className="p-4 border-r border-gray-100 text-sm font-medium text-gray-400 text-right">
                                        {hour}
                                    </div>
                                    {days.map((day) => {
                                        const dayAppointments = appointments.filter(a => {
                                            const apptDate = a.slots?.start_time ? parseISO(a.slots.start_time) : null;
                                            return apptDate && isSameDay(apptDate, day) && format(apptDate, 'HH:mm') === hour;
                                        });

                                        return (
                                            <div key={day.toISOString() + hour} className="p-2 border-r border-gray-100 relative group min-h-[80px]">
                                                {dayAppointments.map(appt => (
                                                    <div
                                                        key={appt.id}
                                                        onClick={() => setSelectedAppt(appt)}
                                                        className={`p-3 rounded-xl text-[10px] shadow-sm cursor-pointer mb-1 transition-all hover:scale-[1.02] hover:shadow-md border-l-4 ${appt.services?.modality === 'online' ? 'bg-emerald-50 text-emerald-800 border-emerald-500' : 'bg-blue-50 text-blue-800 border-blue-500'
                                                            }`}
                                                    >
                                                        <div className="font-bold truncate text-[11px] mb-0.5">{appt.patients?.first_name} {appt.patients?.last_name}</div>
                                                        <div className="flex items-center gap-1 opacity-70 truncate line-clamp-1 leading-tight">
                                                            {appt.services?.modality === 'online' ? <Video className="h-2 w-2 flex-shrink-0" /> : <MapPin className="h-2 w-2 flex-shrink-0" />}
                                                            {appt.services?.name}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Appointment Details Modal */}
            {selectedAppt && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4 text-left">
                    <div className="bg-white w-full max-h-[90vh] overflow-y-auto max-w-lg rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold">Detalles del Turno</h3>
                            <button onClick={() => setSelectedAppt(null)} className="p-2 hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-700">
                                ✕
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                                <div className="h-16 w-16 bg-emerald-100 text-brand-primary rounded-full flex items-center justify-center text-2xl font-bold uppercase">
                                    {selectedAppt.patients?.first_name[0]}{selectedAppt.patients?.last_name[0]}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold">{selectedAppt.patients?.first_name} {selectedAppt.patients?.last_name}</h4>
                                    <p className="text-gray-500 text-sm">{selectedAppt.patients?.email}</p>
                                    <Link href={`https://wa.me/${selectedAppt.patients?.phone}`} target="_blank" className="text-gray-500 underline hover:text-blue-400 text-sm">{selectedAppt.patients?.phone}</Link>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                    <span className="text-gray-500 font-medium">Servicio</span>
                                    <span className="font-bold text-right">{selectedAppt.services?.name}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                    <span className="text-gray-500 font-medium">Horario</span>
                                    <span className="font-bold text-brand-primary">
                                        {format(parseISO(selectedAppt.slots?.start_time), 'EEEE d MMMM, HH:mm', { locale: es })}
                                    </span>
                                </div>
                                {selectedAppt.services?.modality === 'presencial' && selectedAppt.locations && (
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                        <span className="text-gray-500 font-medium">Sucursal</span>
                                        <span className="font-bold">{selectedAppt.locations.name}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                    <span className="text-gray-500 font-medium">Estado del Pago</span>
                                    <span className={`font-bold uppercase text-xs px-2 py-1 rounded-md ${selectedAppt.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                        {selectedAppt.status === 'paid' ? 'Confirmado' : 'Pendiente'}
                                    </span>
                                </div>

                                {selectedAppt.intake_forms && selectedAppt.intake_forms.length > 0 && (
                                    <div className="mt-4 p-5 border border-emerald-100 bg-emerald-50 rounded-3xl space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                                            <h5 className="font-bold text-emerald-800 uppercase text-xs tracking-wider">Ficha de Primera Consulta</h5>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-4 text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-[10px] font-bold uppercase">Edad</span>
                                                <span className="font-semibold text-emerald-900">{selectedAppt.intake_forms[0].age || '-'} años</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-[10px] font-bold uppercase">Peso</span>
                                                <span className="font-semibold text-emerald-900">{selectedAppt.intake_forms[0].weight ? `${selectedAppt.intake_forms[0].weight} kg` : '-'}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-500 text-[10px] font-bold uppercase">Altura</span>
                                                <span className="font-semibold text-emerald-900">{selectedAppt.intake_forms[0].height ? `${selectedAppt.intake_forms[0].height} cm` : '-'}</span>
                                            </div>
                                            <div className="col-span-full flex flex-col pt-1 border-t border-emerald-100/50">
                                                <span className="text-gray-500 text-[10px] font-bold uppercase">Objetivo Principal</span>
                                                <span className="font-medium text-emerald-900 leading-tight">{selectedAppt.intake_forms[0].objective || '-'}</span>
                                            </div>
                                            <div className="col-span-full flex flex-col pt-1 border-t border-emerald-100/50">
                                                <span className="text-gray-500 text-[10px] font-bold uppercase">Actividad Física</span>
                                                <span className="font-medium text-emerald-900 leading-tight">{selectedAppt.intake_forms[0].physical_activity || '-'}</span>
                                            </div>
                                            <div className="col-span-full flex flex-col pt-1 border-t border-emerald-100/50">
                                                <span className="text-gray-500 text-[10px] font-bold uppercase">Enfermedades Diagnosticadas</span>
                                                <span className="font-medium text-emerald-900 leading-tight">{selectedAppt.intake_forms[0].diagnosed_diseases || '-'}</span>
                                            </div>
                                            <div className="col-span-full flex flex-col pt-1 border-t border-emerald-100/50">
                                                <span className="text-gray-500 text-[10px] font-bold uppercase">Medicamentos</span>
                                                <span className="font-medium text-emerald-900 leading-tight">{selectedAppt.intake_forms[0].medications || '-'}</span>
                                            </div>
                                            <div className="col-span-full flex flex-col pt-1 border-t border-emerald-100/50">
                                                <span className="text-gray-500 text-[10px] font-bold uppercase">¿Consultó nutricionista antes?</span>
                                                <span className="font-medium text-emerald-900 leading-tight">{selectedAppt.intake_forms[0].previous_nutritionist_visit === true ? 'Sí' : 'No'}</span>
                                            </div>
                                            
                                            {selectedAppt.intake_forms[0].blood_analysis_url && (
                                                <div className="col-span-full pt-3">
                                                    <a 
                                                        href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blood-analysis/${selectedAppt.intake_forms[0].blood_analysis_url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-emerald-100 text-brand-primary rounded-2xl font-bold hover:bg-emerald-100 transition-all text-xs"
                                                    >
                                                        <FileUp className="h-4 w-4" />
                                                        Ver Análisis de Sangre (PDF)
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => {
                                        toast(({ closeToast }: { closeToast?: () => void }) => (
                                            <div className="flex flex-col gap-2">
                                                <span className="font-bold text-gray-800">¿Estás seguro de cancelar este turno?</span>
                                                <span className="text-sm text-gray-500">El horario volverá a estar disponible.</span>
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={async () => {
                                                            if (closeToast) closeToast();
                                                            selectedAppt._cancelling = true;
                                                            setSelectedAppt({ ...selectedAppt });
                                                            try {
                                                                await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', selectedAppt.id);
                                                                setAppointments(appointments.filter(a => a.id !== selectedAppt.id));
                                                                setSelectedAppt(null);
                                                                toast.success('Turno cancelado correctamente');
                                                            } catch (error) {
                                                                toast.error('Error al cancelar el turno');
                                                                selectedAppt._cancelling = false;
                                                                setSelectedAppt({ ...selectedAppt });
                                                            }
                                                        }}
                                                        className="bg-red-50 text-red-600 px-3 py-2 rounded-md font-bold hover:bg-red-100 flex-1 transition-colors"
                                                    >
                                                        Sí, cancelar
                                                    </button>
                                                    <button
                                                        onClick={() => { if (closeToast) closeToast(); }}
                                                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md font-bold hover:bg-gray-200 flex-1 transition-colors"
                                                    >
                                                        No, volver
                                                    </button>
                                                </div>
                                            </div>
                                        ), { autoClose: false, closeOnClick: false });
                                    }}
                                    disabled={selectedAppt._cancelling}
                                    className="flex-1 cursor-pointer h-12 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center"
                                >
                                    {selectedAppt._cancelling ? <Loader2 className="animate-spin h-5 w-5" /> : 'Cancelar Turno'}
                                </button>
                                <button
                                    onClick={() => {
                                        onEditManual(selectedAppt);
                                        setSelectedAppt(null);
                                    }}
                                    className="flex-1 cursor-pointer h-12 border-2 border-brand-primary text-brand-primary rounded-xl font-bold hover:bg-emerald-50 transition-all"
                                >
                                    Editar Turno
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

