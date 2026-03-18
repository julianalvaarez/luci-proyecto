// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Solo inicializamos si tenemos la URL, para evitar errores en el build de Vercel
export const supabase = createClient(
    supabaseUrl || 'https://tmp.supabase.co',
    supabaseAnonKey || 'tmp'
);
