import { supabase } from './supabaseClient';

/**
 * Fetches the help content for a specific pay-related topic from the Supabase database.
 * @param contentKey - The unique key for the help topic (e.g., 'clothing_allowance').
 * @returns The help content object, or null if not found.
 */
export const getPayHelpContent = async (contentKey: string) => {
  const { data, error } = await supabase
    .from('pay_help_details')
    .select('*')
    .eq('key', contentKey)
    .single(); // Assuming the key is unique and we want a single object

  if (error) {
    console.error('Error fetching pay help content:', error);
    return null;
  }

  return data;
};
