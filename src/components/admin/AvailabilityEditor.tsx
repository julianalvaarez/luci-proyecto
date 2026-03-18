"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Globe, MapPin, Loader2, Save } from 'lucide-react';
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
  const [saving, setSaving] = useState(false);

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

  const addRule = () => {
    const newRule: Rule = {
      id: `temp-${Math.random()}`,
      day_of_week: 1,
      start_time: '09:00',
      end_time: '12:00',
      location_id: null // null is online
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (id: string, updates: Partial<Rule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const removeRule = async (id: string) => {
    if (!id.startsWith('temp-')) {
      await supabase.from('availability_rules').delete().eq('id', id);
    }
    setRules(rules.filter(r => r.id !== id));
  };

  const saveRules = async () => {
    setSaving(true);
    try {
      // Logic: Delete all and re-insert or upsert. For simplicity in this admin tool:
      const rulesToUpsert = rules.map(({ id, ...rest }) => {
        // If it's a temp ID, omit it to let Postgres generate a UUID
        if (id.startsWith('temp-')) return rest;
        return { id, ...rest };
      });

      // Clear existing rules for this user (if we had a user_id filter, here we just upsert all)
      // Note: A more robust way would be to only update changed ones.
      const { error } = await supabase.from('availability_rules').upsert(rulesToUpsert);
      if (error) throw error;
      
      // Re-fetch to get real IDs
      const { data } = await supabase.from('availability_rules').select('*');
      if (data) setRules(data);
      
      toast.success('Disponibilidad guardada correctamente');
    } catch (error: any) {
      toast.error('Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Cargando disponibilidad...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Disponibilidad</h2>
          <p className="text-gray-400 text-sm">Define tus horarios semanales por modalidad y sucursal.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
          <button 
            onClick={addRule}
            className="border-2 border-brand-primary text-brand-primary px-6 py-2 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Agregar Horario
          </button>
          <button 
            onClick={saveRules}
            disabled={saving}
            className="bg-brand-primary text-white px-8 py-2 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 w-full sm:w-auto"
          >
            {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 shadow-sm relative">
            <button 
              onClick={() => removeRule(rule.id)}
              className="absolute top-4 right-4 md:hidden p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <div className={`hidden md:flex h-12 w-12 rounded-xl items-center justify-center shrink-0 ${!rule.location_id ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
              {!rule.location_id ? <Globe className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Día</label>
                <select 
                  value={rule.day_of_week}
                  onChange={(e) => updateRule(rule.id, { day_of_week: parseInt(e.target.value) })}
                  className="w-full h-10 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-brand-primary"
                >
                  {DAYS_NAMES.map((name, index) => (
                    <option key={index} value={index}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Desde</label>
                <input 
                  type="time" 
                  value={rule.start_time.substring(0, 5)} 
                  onChange={(e) => updateRule(rule.id, { start_time: e.target.value })}
                  className="w-full h-10 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Hasta</label>
                <input 
                  type="time" 
                  value={rule.end_time.substring(0, 5)} 
                  onChange={(e) => updateRule(rule.id, { end_time: e.target.value })}
                  className="w-full h-10 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-400">Ubicación</label>
                <select 
                  value={rule.location_id || 'online'}
                  onChange={(e) => updateRule(rule.id, { location_id: e.target.value === 'online' ? null : e.target.value })}
                  className="w-full h-10 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="online">🌎 Online</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>📍 {loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={() => removeRule(rule.id)}
              className="hidden md:block p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all shrink-0"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
        {rules.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 italic">No hay reglas de disponibilidad configuradas.</p>
            <button onClick={addRule} className="text-brand-primary font-bold mt-2 hover:underline">+ Agregar mi primera regla</button>
          </div>
        )}
      </div>

      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4">
        <div className="bg-brand-primary text-white p-2 rounded-lg">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-emerald-900">Generación de Slots (60 min)</h4>
          <p className="text-emerald-700 text-sm mt-1">
            Los pacientes verán turnos cada una hora dentro de los rangos que definas. 
            Asegúrate de guardar los cambios para que se reflejen en el sistema de reservas.
          </p>
        </div>
      </div>
    </div>
  );
}
