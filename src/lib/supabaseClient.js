/**
 * supabaseClient.js is the module that is responsible for accessing the Supabase backend.
 * It initializes the Supabase client using environment variables for the URL and anon key.
 * If the environment variables are not set, it logs a warning to the console.
 */

// Loading the Supabase client library
import { createClient } from '@supabase/supabase-js';

// Load the env variables for Supabase URL and Anon Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If either the URL or Anon Key is missing, log a warning to the console
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'It appears that the Supabase environment variables are not set. ' +
    'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your environment. ' +
    'Contact the project maintainer for assistance.'
  );
}
// Exporting the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
