"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Globe, MapPin, Loader2, Save, X, CalendarX } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';

interface Exception {
  id: string;
  date: string;
  is_blocked: boolean;
}

interface Rule {
  id: string;
  location_id: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

const DAYS_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function AvailabilityEditor() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Partial<Rule> | null>(null);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [newExceptionDate, setNewExceptionDate] = useState('');

  useEffect(() => {
    async function fetchData() {
      const [{ data: rulesData }, { data: locationsData }] = await Promise.all([
        supabase.from('availability_rules').select('*'),
        supabase.from('locations').select('*')
      ]);

      if (rulesData) setRules(rulesData);
      if (locationsData) setLocations(locationsData);

      const { data: expData, error: expError } = await supabase
        .from('availability_exceptions')
        .select('*')
        .eq('is_blocked', true)
        .order('date');

      if (!expError && expData) {
        setExceptions(expData);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingRule({
      day_of_week: 1,
      start_time: '09:00',
      end_time: '12:00',
      location_id: null
    });
    setIsModalOpen(true);
  };

  const openEditModal = (rule: Rule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('availability_rules')
        .upsert(editingRule)
        .select()
        .single();

      if (error) throw error;

      if (editingRule.id) {
        setRules(rules.map(r => r.id === data.id ? data : r));
        toast.success('Horario actualizado');
      } else {
        setRules([...rules, data]);
        toast.success('Horario agregado');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!ruleToDelete) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('availability_rules')
        .delete()
        .eq('id', ruleToDelete);

      if (error) throw error;

      setRules(rules.filter(r => r.id !== ruleToDelete));
      toast.success('Horario eliminado');
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    } finally {
      setSubmitting(false);
      setRuleToDelete(null);
    }
  };

  const handleAddException = async () => {
    if (!newExceptionDate) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('availability_exceptions')
        .insert([{ date: newExceptionDate, is_blocked: true }])
        .select()
        .single();

      if (error) throw error;
      setExceptions([...exceptions, data]);
      setNewExceptionDate('');
      toast.success('Día bloqueado correctamente');
    } catch (error: any) {
      toast.error('Error: Asegúrate de haber creado la tabla exceptions en la base de datos.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteException = async (id: string) => {
    if (!confirm('¿Seguro quieres desbloquear este día?')) return;
    try {
      const { error } = await supabase
        .from('availability_exceptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setExceptions(exceptions.filter(e => e.id !== id));
      toast.success('Día desbloqueado');
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline-block mr-2 text-brand-primary" /> Cargando disponibilidad...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gestión de Horarios</h2>
          <p className="text-gray-500 font-medium mt-1 text-sm md:text-base">Configura tus franjas de disponibilidad semanal.</p>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all shadow-xl shadow-emerald-100 group active:scale-95"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
            <Plus className="h-5 w-5" />
          </div>
          <span>Agregar Horario</span>
        </button>
      </div>

      <div className="grid gap-8">
        {DAYS_NAMES.map((dayName, dayIndex) => {
          const dayRules = rules
            .filter(r => r.day_of_week === dayIndex)
            .sort((a, b) => a.start_time.localeCompare(b.start_time));

          if (dayRules.length === 0) return null;

          return (
            <div key={dayName} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 px-2">
                <div className="h-2 w-2 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <h3 className="text-lg font-black uppercase tracking-widest text-gray-400">{dayName}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-100 to-transparent" />
              </div>

              <div className="grid gap-3 sm:gap-4">
                {dayRules.map((rule) => {
                  const location = locations.find(l => l.id === rule.location_id);
                  return (
                    <div
                      key={rule.id}
                      className="bg-white p-4 sm:p-5 rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${!rule.location_id ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                        {!rule.location_id ? <Globe className="h-7 w-7" /> : <MapPin className="h-7 w-7" />}
                      </div>

                      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-y-4 sm:gap-4 items-center w-full">
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Horario</p>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-emerald-500" />
                            <p className="font-black text-gray-800 text-lg">
                              {rule.start_time.substring(0, 5)} <span className="text-gray-300 font-light mx-1">/</span> {rule.end_time.substring(0, 5)}
                            </p>
                          </div>
                        </div>

                        <div className="col-span-1 lg:col-span-2">
                          <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">Modalidad / Sucursal</p>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${!rule.location_id ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                            <p className="font-bold text-gray-700 truncate text-base">
                              {!rule.location_id ? 'Consulta Online' : `${location?.name || 'Sucursal'}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                        <button
                          onClick={() => openEditModal(rule)}
                          className="flex-1 sm:flex-none py-3 px-5 sm:p-3 text-emerald-600 bg-emerald-50 sm:bg-transparent sm:text-gray-400 hover:text-brand-primary hover:bg-emerald-50 rounded-2xl transition-all flex items-center justify-center gap-2"
                          title="Editar"
                        >
                          <Clock className="h-5 w-5" />
                          <span className="sm:hidden font-bold">Editar</span>
                        </button>
                        <button
                          onClick={() => {
                            setRuleToDelete(rule.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="flex-1 sm:flex-none py-3 px-5 sm:p-3 text-red-500 bg-red-50 sm:bg-transparent sm:text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all flex items-center justify-center gap-2"
                          title="Eliminar"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sm:hidden font-bold">Borrar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {rules.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 animate-in zoom-in duration-500">
            <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Clock className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Sin horarios definidos</h3>
            <p className="text-gray-400 mt-2 max-w-xs mx-auto">Comienza agregando tus franjas de atención para que los pacientes puedan reservar.</p>
            <button
              onClick={openAddModal}
              className="mt-8 text-brand-primary font-black flex items-center gap-2 mx-auto bg-white px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Plus className="h-5 w-5" />
              Configurar primer horario
            </button>
          </div>
        )}
      </div>



      {/* Excepciones */}
      <div className="pt-10 mt-10 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Días Bloqueados (Excepciones)</h2>
            <p className="text-gray-500 font-medium mt-1 text-sm md:text-base">Maneja feriados o días en los que no tomarás turnos.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="date"
              className="flex-1 border sm:w-48 bg-gray-50 border-2 focus:border-red-500 rounded-xl px-4 font-bold text-gray-700 outline-none"
              value={newExceptionDate}
              onChange={e => setNewExceptionDate(e.target.value)}
            />
            <button
              onClick={handleAddException}
              className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
              disabled={!newExceptionDate || submitting}
            >
              <CalendarX className="h-5 w-5" />
              Bloquear
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exceptions.map(exc => {
            // Se asume timezone local UTC para evitar q cambie el dia mostrado
            const localDateStr = new Date(exc.date + "T00:00:00").toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            return (
              <div key={exc.id} className="bg-white border border-gray-100 p-4 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-xl hover:border-red-100 transition-all group overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <CalendarX className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-black text-gray-800 capitalize leading-tight">{localDateStr}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-red-400 mt-1">Día bloqueado completo</p>
                  </div>
                </div>
                <button title="Desbloquear" onClick={() => handleDeleteException(exc.id)} className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            );
          })}
          {exceptions.length === 0 && (
            <div className="col-span-full text-center py-10 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CalendarX className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-900 font-bold text-lg">No hay días bloqueados</p>
              <p className="text-gray-400 mt-1">Los turnos se rigen enteramente por tus franjas horarias normales.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl flex items-end sm:items-center justify-center z-[120] p-0 sm:p-4 text-left group">
          <div className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 sm:zoom-in duration-300">
            <div className="p-8 pb-4 flex justify-between items-center decoration-gray-100">
              <div>
                <h3 className="text-2xl font-black text-gray-900">{editingRule?.id ? 'Editar Horario' : 'Nuevo Horario'}</h3>
                <p className="text-gray-400 text-sm font-medium">Define el rango y modalidad.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="p-8 pt-4 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Día de la semana</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingRule({ ...editingRule!, day_of_week: idx })}
                      className={`h-11 rounded-xl font-bold text-xs transition-all ${editingRule?.day_of_week === idx ? 'bg-brand-primary text-white shadow-lg shadow-emerald-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {DAYS_NAMES[idx].substring(0, 2)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Desde</label>
                  <div className="relative group">
                    <input
                      type="time"
                      value={editingRule?.start_time?.substring(0, 5)}
                      onChange={(e) => setEditingRule({ ...editingRule!, start_time: e.target.value })}
                      className="w-full h-14 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all px-4 font-bold text-gray-700 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Hasta</label>
                  <div className="relative">
                    <input
                      type="time"
                      value={editingRule?.end_time?.substring(0, 5)}
                      onChange={(e) => setEditingRule({ ...editingRule!, end_time: e.target.value })}
                      className="w-full h-14 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-brand-primary focus:bg-white transition-all px-4 font-bold text-gray-700 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Modalidad / Ubicación</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingRule({ ...editingRule!, location_id: null })}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${!editingRule?.location_id ? 'border-brand-primary bg-emerald-50' : 'border-gray-50 bg-white hover:border-gray-100'}`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${!editingRule?.location_id ? 'bg-brand-primary text-white' : 'bg-gray-50 text-gray-400'}`}>
                      <Globe className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className={`font-bold text-sm ${!editingRule?.location_id ? 'text-emerald-900' : 'text-gray-700'}`}>Consulta Online</p>
                      <p className="text-[10px] text-gray-500">Video llamada</p>
                    </div>
                  </button>

                  {locations.map(loc => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setEditingRule({ ...editingRule!, location_id: loc.id })}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${editingRule?.location_id === loc.id ? 'border-blue-500 bg-blue-50' : 'border-gray-50 bg-white hover:border-gray-100'}`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${editingRule?.location_id === loc.id ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className={`font-bold text-sm ${editingRule?.location_id === loc.id ? 'text-blue-900' : 'text-gray-700'}`}>{loc.name}</p>
                        <p className="text-[10px] text-gray-500">Presencial</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 bg-gray-50 text-gray-500 rounded-2xl font-black hover:bg-gray-100 transition-all sm:order-1"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] h-14 bg-brand-primary text-white rounded-2xl font-black hover:bg-brand-secondary transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 sm:order-2 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                  <span>{editingRule?.id ? 'Guardar Cambios' : 'Confirmar Horario'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl flex items-center justify-center z-[130] p-6 text-left">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 animate-in fade-in zoom-in duration-300 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
            <div className="h-24 w-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-bounce transition-all">
              <Trash2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">¿Eliminar horario?</h3>
            <p className="text-gray-500 mb-10 font-medium leading-relaxed">
              Los pacientes ya no verán turnos en este rango. Esta acción no se puede deshacer.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                disabled={submitting}
                className="w-full h-15 py-4 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 active:scale-95"
              >
                {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Trash2 className="h-5 w-5" />}
                <span>Sí, eliminar ahora</span>
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full h-15 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black hover:bg-gray-100 transition-all"
              >
                No, mantener
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}
