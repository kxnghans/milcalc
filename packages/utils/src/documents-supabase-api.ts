import { supabase } from './supabaseClient';

/**
 * Fetches a list of documents from the database based on a category.
 * @param category - The category of documents to fetch (e.g., 'PT', 'PAY').
 * @returns An array of document objects.
 */
export const getDocumentsByCategory = async (category: string) => {
  if (!category) return [];

  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('category', category)
    .order('id');

  if (error) {
    console.error('Error fetching documents:', error);
    return [];
  }

  return data || [];
};
