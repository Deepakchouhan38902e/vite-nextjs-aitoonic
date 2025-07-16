// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';

// Load from .env (must be prefixed with VITE_ in Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);