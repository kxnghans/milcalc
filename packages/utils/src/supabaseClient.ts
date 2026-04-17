import { createClient } from "@supabase/supabase-js";

import { Database } from "./types";

// Main Project (PT, Pay, Taxes)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Bug Reporting Project
const bugSupabaseUrl = process.env.EXPO_PUBLIC_BUG_SUPABASE_URL;
const bugSupabaseAnonKey = process.env.EXPO_PUBLIC_BUG_SUPABASE_ANON_KEY;

// Check if the main variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Main Supabase URL and/or Anon Key are missing from your environment variables.",
  );
}

// Check if the bug reporting variables are loaded
if (!bugSupabaseUrl || !bugSupabaseAnonKey) {
  console.warn(
    "Bug Reporting Supabase URL and/or Anon Key are missing. Bug reporting will be disabled.",
  );
}

// Create and export the main Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create and export the bug reporting Supabase client
export const bugSupabase =
  bugSupabaseUrl && bugSupabaseAnonKey
    ? createClient<Database>(bugSupabaseUrl, bugSupabaseAnonKey)
    : null;

/**
 * Sanitizes error messages from Supabase/Cloudflare.
 * If the error message contains HTML (e.g., a 521 'Web server is down' page),
 * it returns a user-friendly 'Service Unavailable' message.
 */
export const sanitizeError = (error: unknown): string => {
  if (!error) return "Unknown error";
  let message = "";

  if (typeof error === "string") {
    message = error;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    message = String((error as { message: unknown }).message);
  } else {
    message = JSON.stringify(error);
  }

  if (message.includes("<!DOCTYPE html>")) {
    return "Service Unavailable (Supabase is waking up)";
  }
  return message;
};

/**
 * Standard utility to securely log and sanitize API errors across the system.
 */
export const handleApiError = (context: string, error: unknown): void => {
  console.error(`${context}:`, sanitizeError(error));
};
