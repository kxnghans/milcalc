import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Read the environment variables from the correct source for Expo (mobile)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Check if the variables are loaded correctly
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or Anon Key are missing from your environment variables.');
}

// Create and export the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Sanitizes error messages from Supabase/Cloudflare.
 * If the error message contains HTML (e.g., a 521 'Web server is down' page),
 * it returns a user-friendly 'Service Unavailable' message.
 */
export const sanitizeError = (error: unknown): string => {
  if (!error) return 'Unknown error';
  let message = '';
  
  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    message = String((error as { message: unknown }).message);
  } else {
    message = JSON.stringify(error);
  }

  if (message.includes('<!DOCTYPE html>')) {
    return 'Service Unavailable (Supabase is waking up)';
  }
  return message;
};
