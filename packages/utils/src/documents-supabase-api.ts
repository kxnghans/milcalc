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

/**
 * Fetches help details for a specific exercise from the database.
 * @param exercise - The exercise to fetch help details for.
 * @returns An array of help detail objects.
 */
export const getHelpDetailsByExercise = async (exercise: string) => {
  if (!exercise) return [];

  const { data, error } = await supabase
    .from('help_details')
    .select('*')
    .eq('exercise', exercise)
    .order('id');

  if (error) {
    console.error('Error fetching help details:', error);
    return [];
  }

  return data || [];
};
