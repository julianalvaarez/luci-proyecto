import { addMinutes, startOfDay, isBefore, set } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const ARG_TZ = 'America/Argentina/Buenos_Aires';

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
 * Uses Argentina timezone to ensure consistency between server and client.
 */
export function generateSlotsForDate(
    date: Date,
    rules: AvailabilityRule[],
    durationMinutes: number
): GeneratedSlot[] {
    // 1. Get the target date in Argentina timezone
    const zonedDate = toZonedTime(date, ARG_TZ);
    const dayOfWeek = zonedDate.getDay();
    const relevantRules = rules.filter((rule) => rule.day_of_week === dayOfWeek);

    const slots: GeneratedSlot[] = [];

    relevantRules.forEach((rule) => {
        const [startH, startM] = rule.start_time.split(':').map(Number);
        const [endH, endM] = rule.end_time.split(':').map(Number);

        // 2. Create local times (HH:mm) in the target timezone
        let currentStart = fromZonedTime(set(startOfDay(zonedDate), { hours: startH, minutes: startM }), ARG_TZ);
        const ruleEnd = fromZonedTime(set(startOfDay(zonedDate), { hours: endH, minutes: endM }), ARG_TZ);

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
