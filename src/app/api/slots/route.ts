import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url)

    const service_id = searchParams.get("service_id")
    const location_id = searchParams.get("location_id")

    let query = supabase
        .from("availability_slots")
        .select("*")
        .eq("is_booked", false)
        .order("date")
        .order("start_time")

    if (service_id) query = query.eq("service_id", service_id)
    if (location_id) query = query.eq("location_id", location_id)

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}