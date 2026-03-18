"use client";

import React, { createContext, useContext, useState } from 'react';

export type BookingStep = 
  | 'service' 
  | 'location' 
  | 'intake' 
  | 'slots' 
  | 'contact' 
  | 'payment' 
  | 'confirmation';

interface BookingState {
  step: BookingStep;
  serviceId?: string;
  modality?: 'online' | 'presencial';
  locationId?: string;
  isFirstTime?: boolean;
  intakeData?: {
    weight?: number;
    height?: number;
    objective?: string;
    illnesses?: string;
    medication?: string;
    physical_activity?: string;
  };
  slotId?: string;
  contactData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: number;
  };
}

interface BookingContextType {
  state: BookingState;
  setStep: (step: BookingStep) => void;
  updateState: (updates: Partial<BookingState>) => void;
  reset: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>({ step: 'service' });

  const setStep = (step: BookingStep) => setState(prev => ({ ...prev, step }));
  const updateState = (updates: Partial<BookingState>) => setState(prev => ({ ...prev, ...updates }));
  const reset = () => setState({ step: 'service' });

  return (
    <BookingContext.Provider value={{ state, setStep, updateState, reset }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within a BookingProvider');
  return context;
}
