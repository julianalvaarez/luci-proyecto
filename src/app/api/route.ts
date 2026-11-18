import { supabase } from "@/lib/supabase"

export async function GET() {
    const { data, error } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("is_booked", false)
        .order("date")
        .order("start_time")

    if (error) {
        return new Response('Error fetching availability slots', { status: 500 })
    }

    return new Response(JSON.stringify(data), { status: 200 })
}