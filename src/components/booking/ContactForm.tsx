"use client";

import { useBooking } from '@/context/BookingContext';
import { useForm } from 'react-hook-form';

export default function ContactForm() {
    const { state, updateState, setStep } = useBooking();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: state.contactData || {}
    });

    const onSubmit = (data: any) => {
        updateState({ contactData: data });
        setStep('payment');
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-display font-bold">Datos de contacto</h2>
                <p className="text-gray-500 mt-2">¿A quién le enviamos la confirmación del turno?</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Nombre</label>
                        <input
                            {...register('firstName', { required: true })}
                            className={`w-full h-11 px-4 rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} focus:ring-0 transition-colors`}
                            placeholder="Juan"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Apellido</label>
                        <input
                            {...register('lastName', { required: true })}
                            className={`w-full h-11 px-4 rounded-xl border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} focus:ring-0 transition-colors`}
                            placeholder="Pérez"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                        className={`w-full h-11 px-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:ring-0 transition-colors`}
                        placeholder="juan.perez@email.com"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Teléfono</label>
                        <input
                            {...register('phone', { required: true })}
                            className={`w-full h-11 px-4 rounded-xl border ${errors.phone ? 'border-red-500' : 'border-gray-200'} focus:ring-0 transition-colors`}
                            placeholder="+54 11 1234 5678"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Edad</label>
                        <input
                            type="number"
                            {...register('age', { required: true })}
                            className={`w-full h-11 px-4 rounded-xl border ${errors.age ? 'border-red-500' : 'border-gray-200'} focus:ring-0 transition-colors`}
                            placeholder="30"
                        />
                    </div>
                </div>

                <button type="submit" className="w-full h-12 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-all mt-4 shadow-lg shadow-emerald-200">
                    Confirmar y Pagar
                </button>
            </form>
        </div>
    );
}
