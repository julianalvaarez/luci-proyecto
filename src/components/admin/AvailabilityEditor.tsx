"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Globe, MapPin, Loader2, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';

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

  useEffect(() => {
    async function fetchData() {
      const [{ data: rulesData }, { data: locationsData }] = await Promise.all([
        supabase.from('availability_rules').select('*'),
        supabase.from('locations').select('*')
      ]);
      
      if (rulesData) setRules(rulesData);
      if (locationsData) setLocations(locationsData);
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

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline-block mr-2 text-brand-primary" /> Cargando disponibilidad...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Disponibilidad</h2>
          <p className="text-gray-400 text-sm">Define tus horarios semanales por modalidad y sucursal.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all shadow-lg shadow-emerald-100"
        >
          <Plus className="h-5 w-5" />
          Agregar Horario
        </button>
      </div>

      <div className="grid gap-4">
        {rules.sort((a,b) => a.day_of_week - b.day_of_week || a.start_time.localeCompare(b.start_time)).map((rule) => {
          const location = locations.find(l => l.id === rule.location_id);
          return (
            <div key={rule.id} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-all group">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${!rule.location_id ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {!rule.location_id ? <Globe className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
              </div>
              
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Día</p>
                  <p className="font-bold text-gray-700">{DAYS_NAMES[rule.day_of_week]}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Rango</p>
                  <p className="font-bold text-gray-700">{rule.start_time.substring(0, 5)} - {rule.end_time.substring(0, 5)}</p>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">Modalidad / Sucursal</p>
                  <p className="font-bold text-gray-700 truncate">
                    {!rule.location_id ? '🌎 Consulta Online' : `📍 ${location?.name || 'Sucursal'}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEditModal(rule)}
                  className="p-2.5 text-gray-400 hover:text-brand-primary hover:bg-emerald-50 rounded-xl transition-all"
                  title="Editar"
                >
                  <Clock className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => {
                    setRuleToDelete(rule.id);
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Eliminar"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
        {rules.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 italic">No hay reglas de disponibilidad configuradas.</p>
            <button onClick={openAddModal} className="text-brand-primary font-bold mt-2 hover:underline">+ Agregar mi primera regla</button>
          </div>
        )}
      </div>

      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4">
        <div className="bg-brand-primary text-white p-2 rounded-lg">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-emerald-900">Generación Automática</h4>
          <p className="text-emerald-700 text-sm mt-1">
            Los pacientes verán turnos cada una hora según estos rangos. 
            Cualquier cambio aquí se aplica instantáneamente.
          </p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 text-left">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-2xl font-bold">{editingRule?.id ? 'Editar Horario' : 'Nuevo Horario'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-all">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSaveRule} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Día de la semana</label>
                <select 
                  value={editingRule?.day_of_week}
                  onChange={(e) => setEditingRule({...editingRule!, day_of_week: parseInt(e.target.value)})}
                  className="w-full h-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary px-4 font-medium"
                >
                  {DAYS_NAMES.map((name, index) => (
                    <option key={index} value={index}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Desde</label>
                  <input 
                    type="time" 
                    value={editingRule?.start_time?.substring(0, 5)} 
                    onChange={(e) => setEditingRule({...editingRule!, start_time: e.target.value})}
                    className="w-full h-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary px-4 font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400">Hasta</label>
                  <input 
                    type="time" 
                    value={editingRule?.end_time?.substring(0, 5)} 
                    onChange={(e) => setEditingRule({...editingRule!, end_time: e.target.value})}
                    className="w-full h-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary px-4 font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400">Modalidad / Ubicación</label>
                <select 
                  value={editingRule?.location_id || 'online'}
                  onChange={(e) => setEditingRule({...editingRule!, location_id: e.target.value === 'online' ? null : e.target.value})}
                  className="w-full h-12 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary px-4 font-medium"
                >
                  <option value="online">🌎 Consulta Online</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>📍 {loc.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-14 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] h-14 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                  {editingRule?.id ? 'Actualizar' : 'Guardar Horario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[130] p-4 text-left">
          <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200 text-center">
            <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">¿Eliminar horario?</h3>
            <p className="text-gray-500 mb-8">Esta acción no se puede deshacer y los pacientes ya no verán turnos en este rango.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 h-12 bg-gray-100 text-gray-600 rounded-full font-bold hover:bg-gray-200"
              >
                No, volver
              </button>
              <button 
                onClick={confirmDelete}
                disabled={submitting}
                className="flex-1 h-12 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
