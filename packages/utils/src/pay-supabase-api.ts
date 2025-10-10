import { supabase } from './supabaseClient';

/**
 * Fetches the BAH rate for a specific MHA, rank, and dependency status.
 * @param mha - The Military Housing Area code.
 * @returns The BAH data object for the given MHA, or null if not found.
 */
export const getBahRate = async (mha: string) => {
  const { data, error } = await supabase
    .from('bah_rates_2025')
    .select('*')
    .eq('mha', mha)
    .single();

  if (error) {
    console.error('Error fetching BAH rate:', error);
    return null;
  }

  return data;
};

/**
 * Fetches the non-locality BAH rate for a specific rank.
 * @param rank - The user's rank.
 * @returns The non-locality BAH data object for the given rank, or null if not found.
 */
export const getNonLocalityBahRate = async (rank: string) => {
  const { data, error } = await supabase
    .from('non_locality_bah_rates_2025')
    .select('*')
    .eq('rank', rank)
    .single();

  if (error) {
    console.error('Error fetching non-locality BAH rate:', error);
    return null;
  }

  return data;
};