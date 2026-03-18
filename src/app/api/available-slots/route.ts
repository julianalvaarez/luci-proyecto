import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateSlotsForDate } from '@/services/slotService';
import { format, parseISO } from 'date-fns';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get('date');
  const modality = searchParams.get('modality');
  const locationId = searchParams.get('locationId');

  if (!dateStr || !modality) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const selectedDate = parseISO(dateStr);
    
    // 1. Fetch Availability Rules for this day and modality/location
    const query = supabase
      .from('availability_rules')
      .select('*')
      .eq('day_of_week', selectedDate.getDay());

    if (modality === 'online') {
      // For online, location_id must be NULL as per our schema
      query.is('location_id', null);
    } else {
      // For presencial, find by locationId (UUID)
      if (locationId && locationId !== 'null' && locationId !== '') {
        query.eq('location_id', locationId);
      } else {
        return NextResponse.json({ slots: [] }); // No location selected for presencial
      }
    }

    const { data: rules, error: rulesError } = await query;

    if (rulesError) {
      console.error('Rules query error:', rulesError);
      throw rulesError;
    }

    // 2. Fetch existing appointments and their slot times
    const { data: bookedSlots, error: bookedError } = await supabase
      .from('appointments')
      .select(`
        status,
        slots!inner (
          start_time
        )
      `)
      .neq('status', 'cancelled');

    if (bookedError) throw bookedError;

    // 3. Generate potential slots based on rules
    const generatedSlots = generateSlotsForDate(selectedDate, rules || [], 60);

    // 4. Filter out already booked slots by comparing start_time
    const filteredSlots = generatedSlots.filter(generatedSlot => {
      const generatedStart = generatedSlot.start_time.toISOString();
      
      const isBooked = bookedSlots?.some(booked => {
        if (!booked.slots) return false;
        // In some cases Supabase might return an array for the join if types are ambiguous
        const slotData = Array.isArray(booked.slots) ? booked.slots[0] : booked.slots;
        if (!slotData) return false;
        
        const bookedStart = new Date(slotData.start_time).toISOString();
        return bookedStart === generatedStart;
      });

      return !isBooked;
    });

    return NextResponse.json({ slots: filteredSlots });
  } catch (error: any) {
    console.error('Available slots API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
