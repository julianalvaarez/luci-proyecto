"use client";

import { useBooking } from '@/context/BookingContext';
import { useForm } from 'react-hook-form';
import { supabase } from '@/utils/supabase/client';
import { useState } from 'react';
import { FileUp, CheckCircle, Loader2 } from 'lucide-react';

export default function IntakeForm() {
    const { state, updateState, setStep } = useBooking();
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: state.intakeData || {}
    });

    const uploadFile = async (file: File) => {
        try {
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const supabaseFileName = `${Math.random()}.${fileExt}`;
            const filePath = `patient_analyses/${supabaseFileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('blood-analysis')
                .upload(filePath, file);

            if (uploadError) throw uploadError;
            
            const fileUrl = data.path;
            setValue('blood_analysis_url', fileUrl);
            setFileName(file.name); // Store original filename for display
            
            // Immediately sync with global state so UI reflects "PDF Cargado"
            updateState({ 
                intakeData: { 
                    ...state.intakeData, 
                    blood_analysis_url: fileUrl 
                } 
            });

            return fileUrl;
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error al subir el PDF. Por favor intenta de nuevo.');
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== 'application/pdf') {
                alert('Por favor sube un archivo PDF.');
                return;
            }
            await uploadFile(file);
        }
    };

    const onSubmit = (data: any) => {
        updateState({ intakeData: data, isFirstTime: state.isFirstTime });
        setStep('slots');
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-display font-bold">Cuéntame de ti</h2>
                <p className="text-gray-500 mt-2">Personaliza tu experiencia eligiendo el tipo de consulta</p>
            </div>

            <div className="flex justify-center gap-4">
                {['si', 'no'].map((val) => (
                    <button
                        key={val}
                        onClick={() => updateState({ isFirstTime: val === 'si' })}
                        className={`px-8 py-4 rounded-3xl border-2 transition-all font-bold flex flex-col items-center gap-2 ${(val === 'si' && state.isFirstTime) || (val === 'no' && state.isFirstTime === false)
                                ? 'border-brand-primary bg-emerald-50 text-brand-primary'
                                : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                            }`}
                    >
                        <span className="text-lg">{val === 'si' ? 'Primera Vez' : 'Seguimiento'}</span>
                        <span className="text-[10px] uppercase tracking-widest opacity-60">
                            {val === 'si' ? 'Consulta Inicial' : 'Control'}
                        </span>
                    </button>
                ))}
            </div>

            {state.isFirstTime && (
                <div className="space-y-6">
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                        <p className="text-sm font-bold text-brand-primary">Todas las preguntas son opcionales, completa solo lo que desees.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 md:p-10 rounded-[40px] shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Peso (kg) <span className="text-gray-400 font-normal">(Opcional)</span></label>
                                <input type="number" step="0.1" {...register('weight')} className="w-full h-12 bg-gray-50 px-4 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary transition-all" placeholder="Ej: 70.4" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Altura (cm) <span className="text-gray-400 font-normal">(Opcional)</span></label>
                                <input type="number" {...register('height')} className="w-full h-12 bg-gray-50 px-4 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary transition-all" placeholder="Ej: 175" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Objetivo Principal <span className="text-gray-400 font-normal">(Opcional)</span></label>
                            <textarea {...register('objective')} className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary transition-all h-24" placeholder="¿Cuál es tu principal meta con la nutrición?" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Actividad Física <span className="text-gray-400 font-normal">(Opcional)</span></label>
                            <input {...register('physical_activity')} className="w-full h-12 bg-gray-50 px-4 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary transition-all" placeholder="Ej: CrossFit 4 veces por semana" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Enfermedades Diagnosticadas <span className="text-gray-400 font-normal">(Opcional)</span></label>
                                <textarea {...register('diagnosed_diseases')} className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary transition-all h-24" placeholder="Escribe aquí si tienes alguna condición médica..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Medicamentos <span className="text-gray-400 font-normal">(Opcional)</span></label>
                                <textarea {...register('medications')} className="w-full bg-gray-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-brand-primary transition-all h-24" placeholder="Lista los medicamentos que tomas habitualmente..." />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-center border-2 border-dashed border-gray-100 p-6 rounded-3xl group hover:border-brand-primary transition-all">
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900">Análisis de Sangre</h4>
                                <p className="text-xs text-gray-500 mt-1">Sube tu último hemograma (opcional, PDF)</p>
                            </div>
                            <div className="shrink-0">
                                <label className={`relative cursor-pointer px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${state.intakeData?.blood_analysis_url ? 'bg-emerald-50 text-brand-primary' : 'bg-brand-primary text-white hover:bg-brand-secondary'}`}>
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            <span>Subiendo...</span>
                                        </>
                                    ) : state.intakeData?.blood_analysis_url ? (
                                        <>
                                            <CheckCircle className="h-5 w-5" />
                                            <span>PDF Cargado</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileUp className="h-5 w-5" />
                                            <span>Subir PDF</span>
                                        </>
                                    )}
                                    <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} disabled={isUploading} />
                                </label>
                                {state.intakeData?.blood_analysis_url && (
                                    <div className="mt-2 text-center">
                                        <p className="text-[10px] text-emerald-600 font-bold">¡Listo!</p>
                                        {fileName && <p className="text-[9px] text-gray-400 truncate max-w-[120px] mx-auto">{fileName}</p>}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700">¿Consultaste previamente con un nutricionista? <span className="text-gray-400 font-normal">(Opcional)</span></label>
                            <div className="flex gap-4">
                                {['si', 'no'].map((val) => (
                                    <label key={val} className="flex-1">
                                        <input type="radio" value={val} {...register('previous_nutritionist_visit')} className="hidden peer" />
                                        <div className="text-center p-3 rounded-2xl border-2 border-gray-100 peer-checked:border-brand-primary peer-checked:bg-emerald-50 cursor-pointer transition-all font-medium text-gray-500 peer-checked:text-brand-primary">
                                            {val === 'si' ? 'Sí' : 'No'}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="w-full h-14 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-100 mt-4">
                            Siguiente
                        </button>
                    </form>
                </div>
            )}

            {state.isFirstTime === false && (
                <div className="bg-white p-12 rounded-[40px] shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-gray-100 text-center space-y-8 animate-in fade-in zoom-in duration-300">
                    <div className="bg-emerald-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="h-10 w-10 text-brand-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-display font-bold">¡Hola de nuevo!</h3>
                        <p className="text-gray-500 mt-3 text-lg">Pasaremos directamente a agendar tu próximo control.</p>
                    </div>
                    <button
                        onClick={() => setStep('slots')}
                        className="w-full h-16 bg-brand-primary text-white rounded-full font-black text-lg hover:bg-brand-secondary transition-all hover:scale-[1.02] active:scale-98 shadow-xl shadow-emerald-200"
                    >
                        Siguiente
                    </button>
                </div>
            )}

        </div>
    );
}
