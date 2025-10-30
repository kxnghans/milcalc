import { supabase } from './supabaseClient';

export const getHelpContentFromSource = async (source: 'pt' | 'pay' | 'retirement', contentKey: string) => {
  const { data, error } = await supabase
    .from('help_details')
    .select('*')
    .eq('source', source)
    .eq('content_key', contentKey);

  if (error) {
    console.error(`Error fetching help content from help_details for source ${source} and key ${contentKey}:`, error);
    return null;
  }

  return data;
};