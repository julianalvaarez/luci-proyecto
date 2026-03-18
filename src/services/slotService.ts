import { addMinutes, format, parse, startOfDay, addDays, isBefore, isAfter, set } from 'date-fns';

export interface AvailabilityRule {
    id: string;
    location_id?: string;
    day_of_week: number; // 0 (Sun) - 6 (Sat)
    start_time: string; // "HH:mm"
    end_time: string; // "HH:mm"
}

export interface GeneratedSlot {
    start_time: Date;
    end_time: Date;
    status: 'available' | 'locked' | 'reserved';
}

/**
 * Generates slots for a specific date based on availability rules.
 */
export function generateSlotsForDate(
    date: Date,
    rules: AvailabilityRule[],
    durationMinutes: number
): GeneratedSlot[] {
    const dayOfWeek = date.getDay();
    const relevantRules = rules.filter((rule) => rule.day_of_week === dayOfWeek);

    const slots: GeneratedSlot[] = [];

    relevantRules.forEach((rule) => {
        const [startH, startM] = rule.start_time.split(':').map(Number);
        const [endH, endM] = rule.end_time.split(':').map(Number);

        let currentStart = set(startOfDay(date), { hours: startH, minutes: startM });
        const ruleEnd = set(startOfDay(date), { hours: endH, minutes: endM });

        while (isBefore(addMinutes(currentStart, durationMinutes), ruleEnd) ||
            addMinutes(currentStart, durationMinutes).getTime() === ruleEnd.getTime()) {

            const currentEnd = addMinutes(currentStart, durationMinutes);

            slots.push({
                start_time: new Date(currentStart),
                end_time: new Date(currentEnd),
                status: 'available',
            });

            currentStart = currentEnd;
        }
    });

    return slots;
}
