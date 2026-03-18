"use client";

import { BookingProvider, useBooking, BookingStep } from '@/context/BookingContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

// Step components
import ServiceSelector from '@/components/booking/ServiceSelector';
import LocationSelector from '@/components/booking/LocationSelector';
import IntakeForm from '@/components/booking/IntakeForm';
import SlotSelector from '@/components/booking/SlotSelector';
import ContactForm from '@/components/booking/ContactForm';
import PaymentSummary from '@/components/booking/PaymentSummary';

function BookingSteps() {
    const { state, setStep } = useBooking();

    const renderStep = () => {
        switch (state.step) {
            case 'service': return <ServiceSelector />;
            case 'location': return <LocationSelector />;
            case 'intake': return <IntakeForm />;
            case 'slots': return <SlotSelector />;
            case 'contact': return <ContactForm />;
            case 'payment': return <PaymentSummary />;
            default: return <ServiceSelector />;
        }
    };

    const stepsOrder: BookingStep[] = ['service', 'location', 'intake', 'slots', 'contact', 'payment'];
    const currentIndex = stepsOrder.indexOf(state.step);

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() => currentIndex > 0 && setStep(stepsOrder[currentIndex - 1])}
                        className={`flex items-center text-sm font-medium transition-opacity ${currentIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Volver
                    </button>
                    <span className="text-sm font-medium text-gray-400">Paso {currentIndex + 1} de {stepsOrder.length}</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-brand-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / stepsOrder.length) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={state.step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <BookingProvider>
                <BookingSteps />
            </BookingProvider>
        </div>
    );
}
