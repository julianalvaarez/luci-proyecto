"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, MapPin, Video, Loader2, FileUp } from 'lucide-react';
import { format as formatTZ, toZonedTime } from 'date-fns-tz';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';
import Link from 'next/link';

const ARG_TZ = 'America/Argentina/Buenos_Aires';

interface WeeklyCalendarProps {
    onOpenManual: () => void;
    onEditManual: (appointment: any) => void;
}

export default function WeeklyCalendar({ onOpenManual, onEditManual }: WeeklyCalendarProps) {
    const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const days = Array.from({ length: 6 }, (_, i) => addDays(currentWeek, i)); // Mon - Sat
    const hours = Array.from({ length: 25 }, (_, i) => {
        const h = Math.floor(i / 2) + 8;
        const m = i % 2 === 0 ? '00' : '30';
        return `${h.toString().padStart(2, '0')}:${m}`;
    });

    const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
    const [selectedDay, setSelectedDay] = useState(new Date());

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

    const getAppointmentsForHour = (day: Date, hour: string) => {
        return appointments.filter(a => {
            if (!a.slots?.start_time) return false;
            // Parse and convert to Argentina TZ
            const utcDate = parseISO(a.slots.start_time);
            const apptZoned = toZonedTime(utcDate, ARG_TZ);
            const dayZoned = toZonedTime(day, ARG_TZ);
            
            const matchesDay = isSameDay(apptZoned, dayZoned);
            const matchesHour = formatTZ(apptZoned, 'HH:mm', { timeZone: ARG_TZ }) === hour;
            
            return matchesDay && matchesHour;
        });
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden text-left relative flex flex-col h-full min-h-[600px]">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-white to-gray-50">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-gray-900 capitalize tracking-tight">{format(currentWeek, 'MMMM yyyy', { locale: es })}</h2>
                    <p className="text-gray-400 font-medium text-sm">Gestiona la agenda y seguimiento de pacientes.</p>
                </div>
                <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                        <button onClick={() => setCurrentWeek(addDays(currentWeek, -7))} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-95 text-gray-600">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={() => setCurrentWeek(addDays(currentWeek, 7))} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-95 text-gray-600">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                    <button
                        onClick={onOpenManual}
                        className="bg-brand-primary text-white px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 hover:bg-brand-secondary transition-all shadow-xl shadow-emerald-100 active:scale-95 text-sm"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Nuevo Turno</span>
                    </button>
                </div>
            </div>

            {/* Mobile Day Selector */}
            <div className="md:hidden flex overflow-x-auto p-4 gap-3 bg-white scrollbar-hide border-b border-gray-50">
                {days.map((day) => {
                    const isSelected = isSameDay(day, selectedDay);
                    const hasAppts = appointments.some(a => {
                       if (!a.slots?.start_time) return false;
                       const apptZoned = toZonedTime(parseISO(a.slots.start_time), ARG_TZ);
                       const dayZoned = toZonedTime(day, ARG_TZ);
                       return isSameDay(apptZoned, dayZoned);
                    });
                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => setSelectedDay(day)}
                            className={`flex flex-col items-center justify-center min-w-[64px] h-20 rounded-2xl transition-all relative ${isSelected ? 'bg-brand-primary text-white shadow-lg shadow-emerald-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">{format(day, 'EEE', { locale: es })}</span>
                            <span className="text-xl font-black mt-1">{format(day, 'd')}</span>
                            {hasAppts && !isSelected && <div className="absolute bottom-2 h-1.5 w-1.5 bg-brand-primary rounded-full" />}
                        </button>
                    );
                })}
            </div>


            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Mobile Daily List View */}
                <div className="md:hidden flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="py-20 text-center flex flex-col items-center gap-4">
                            <div className="relative">
                                <Loader2 className="animate-spin h-10 w-10 text-brand-primary" />
                                <div className="absolute inset-0 h-10 w-10 bg-emerald-500/20 rounded-full blur-xl scale-150 animate-pulse" />
                            </div>
                            <p className="text-gray-400 font-bold text-sm tracking-wide">Actualizando agenda...</p>
                        </div>
                    ) : (
                        <>
                            {hours.map(hour => {
                                const hourAppts = getAppointmentsForHour(selectedDay, hour);
                                if (hourAppts.length === 0) return null;
                                return (
                                    <div key={hour} className="flex gap-4">
                                        <div className="w-12 pt-1">
                                            <span className="text-xs font-black text-gray-300">{hour}</span>
                                        </div>
                                        <div className="flex-1 space-y-2 min-h-[40px] border-l-2 border-gray-50 pl-4 py-1">
                                            {hourAppts.map(appt => (
                                                <div
                                                    key={appt.id}
                                                    onClick={() => setSelectedAppt(appt)}
                                                    className={`p-4 rounded-3xl shadow-sm border border-gray-100 transition-all active:scale-98 bg-white ${appt.services?.modality === 'online' ? 'border-l-4 border-emerald-500' : 'border-l-4 border-blue-500'}`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="font-black text-gray-900 text-sm">{appt.patients?.first_name} {appt.patients?.last_name}</div>
                                                        <div className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${appt.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                            {appt.status === 'paid' ? 'PAGO' : 'PENDIENTE'}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <div className="p-1 px-2 bg-gray-50 rounded-lg flex items-center gap-1 max-w-full overflow-hidden">
                                                            {appt.services?.modality === 'online' ? <Video className="h-3 w-3 text-emerald-500" /> : <MapPin className="h-3 w-3 text-blue-500" />}
                                                            <span className="text-[10px] font-bold text-gray-500 truncate">{appt.services?.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            {hours.every(h => getAppointmentsForHour(selectedDay, h).length === 0) && (
                                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                                    <p className="text-gray-400 font-bold italic">No hay turnos para este día</p>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Desktop Grid View */}
                <div className="hidden md:block flex-1 overflow-x-auto">
                    <div className="min-w-[1000px] h-full flex flex-col">
                        {/* Desktop Header Grid */}
                        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/30 sticky top-0 z-10 backdrop-blur-md">
                            <div className="p-6 border-r border-gray-50 text-right">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Hora</span>
                            </div>
                            {days.map((day) => (
                                <div key={day.toISOString()} className={`p-6 border-r border-gray-50 text-center transition-colors ${isSameDay(day, new Date()) ? 'bg-white' : ''}`}>
                                    <span className={`text-[10px] uppercase font-black tracking-widest ${isSameDay(day, new Date()) ? 'text-brand-primary' : 'text-gray-400'}`}>
                                        {format(day, 'EEE', { locale: es })}
                                    </span>
                                    <div className={`text-2xl font-black mt-1 ${isSameDay(day, new Date()) ? 'text-brand-primary opacity-100 scale-110' : 'text-gray-900 opacity-60'}`}>
                                        {format(day, 'd')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Grid Body */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-sm">
                                    <Loader2 className="animate-spin h-10 w-10 text-brand-primary" />
                                    <p className="text-sm font-bold text-gray-400">Actualizando calendario...</p>
                                </div>
                            ) : (
                                hours.map((hour) => (
                                    <div key={hour} className="grid grid-cols-7 border-b border-gray-50/50 min-h-[100px] group">
                                        <div className="p-4 border-r border-gray-50 text-[10px] font-black text-gray-300 text-right bg-white group-hover:bg-gray-50 transition-colors">
                                            {hour}
                                        </div>
                                        {days.map((day) => {
                                            const dayAppts = getAppointmentsForHour(day, hour);
                                            return (
                                                <div key={day.toISOString() + hour} className="p-3 border-r border-gray-50/50 relative bg-white group-hover:bg-gray-50/50 transition-colors min-h-full">
                                                    {dayAppts.map(appt => (
                                                        <div
                                                            key={appt.id}
                                                            onClick={() => setSelectedAppt(appt)}
                                                            className={`p-4 rounded-2xl text-[11px] border border-gray-100 shadow-sm cursor-pointer mb-2 transition-all hover:scale-[1.02] hover:shadow-xl hover:z-10 group/appt relative overflow-hidden bg-white ${appt.services?.modality === 'online' ? 'border-l-4 border-emerald-500' : 'border-l-4 border-blue-500'}`}
                                                        >
                                                            <div className="font-black text-gray-900 mb-2 truncate group-hover/appt:whitespace-normal">{appt.patients?.first_name} {appt.patients?.last_name}</div>
                                                            <div className="flex flex-col gap-2">
                                                                <div className="inline-flex items-center gap-2 p-1 px-2 bg-gray-50 rounded-lg w-fit">
                                                                    {appt.services?.modality === 'online' ? <Video className="h-3 w-3 text-emerald-500" /> : <MapPin className="h-3 w-3 text-blue-500" />}
                                                                    <span className="font-bold text-gray-500 truncate max-w-[100px]">{appt.services?.name}</span>
                                                                </div>
                                                                <div className={`text-[8px] font-black px-2 py-1 rounded-md w-fit tracking-tighter ${appt.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                                    {appt.status === 'paid' ? 'CONFIRMADO' : 'PENDIENTE'}
                                                                </div>
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
                                        {formatTZ(toZonedTime(parseISO(selectedAppt.slots?.start_time), ARG_TZ), "EEEE d 'de' MMMM, HH:mm", { locale: es, timeZone: ARG_TZ })}
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

