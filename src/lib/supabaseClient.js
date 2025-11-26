import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'It appears that the Supabase environment variables are not set. ' +
    'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your environment. ' +
    'Contact the project maintainer for assistance.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
