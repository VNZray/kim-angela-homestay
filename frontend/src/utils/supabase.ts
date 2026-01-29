import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Check your .env file.');
}

// Create standard Supabase client with anon key
// We use Firebase for authentication and pass Firebase UID explicitly in queries
// Security is handled by Firebase auth + application-level checks
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
