import { supabase } from './supabaseClient';

export const getRetirementHelpContent = async (contentKey: string) => {
  if (!contentKey) return null;

  const { data, error } = await supabase
    .from('retirement_help_details')
    .select('*')
    .eq('title', contentKey);

  if (error) {
    console.error('Error fetching retirement help content:', error);
    return null;
  }

  return data;
};