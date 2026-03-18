"use client";

import { useBooking } from '@/context/BookingContext';
import { useForm } from 'react-hook-form';

export default function IntakeForm() {
    const { state, updateState, setStep } = useBooking();
    const { register, handleSubmit } = useForm({
        defaultValues: state.intakeData || {}
    });

    const onSubmit = (data: any) => {
        updateState({ intakeData: data, isFirstTime: state.isFirstTime });
        setStep('slots');
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-display font-bold">Cuéntame de ti</h2>
                <p className="text-gray-500 mt-2">¿Es tu primera consulta?</p>
            </div>

            <div className="flex justify-center gap-4">
                {['si', 'no'].map((val) => (
                    <button
                        key={val}
                        onClick={() => updateState({ isFirstTime: val === 'si' })}
                        className={`px-8 py-3 rounded-full border-2 transition-all font-medium ${(val === 'si' && state.isFirstTime) || (val === 'no' && state.isFirstTime === false)
                                ? 'border-brand-primary bg-emerald-50 text-brand-primary'
                                : 'border-gray-100 bg-white text-gray-500'
                            }`}
                    >
                        {val === 'si' ? 'Primera Vez' : 'Seguimiento'}
                    </button>
                ))}
            </div>

            {state.isFirstTime && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-8 rounded-3xl border border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Peso (kg)</label>
                            <input type="number" step="0.1" {...register('weight')} className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-0 transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Altura (cm)</label>
                            <input type="number" {...register('height')} className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-0 transition-colors" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Objetivo</label>
                        <textarea {...register('objective')} className="w-full p-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-0 transition-colors" rows={2} placeholder="Ej: Bajar de peso, ganar masa muscular..." />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Actividad física</label>
                        <input {...register('physical_activity')} className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-0 transition-colors" placeholder="Ej: 3 veces por semana gimnasio" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Enfermedades o Alergias</label>
                            <textarea {...register('illnesses')} className="w-full p-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-0 transition-colors" rows={2} placeholder="Opcional..." />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Medicación actual</label>
                            <textarea {...register('medication')} className="w-full p-4 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-0 transition-colors" rows={2} placeholder="Opcional..." />
                        </div>
                    </div>
                    <button type="submit" className="w-full h-12 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-colors mt-4">
                        Continuar
                    </button>
                </form>
            )}

            {state.isFirstTime === false && (
                <button
                    onClick={() => setStep('slots')}
                    className="w-full h-12 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-colors"
                >
                    Continuar al calendario
                </button>
            )}
        </div>
    );
}
