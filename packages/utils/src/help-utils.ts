import { supabase } from './supabaseClient';

export const getHelpContentFromSource = async (source: 'pt' | 'pay' | 'retirement', contentKey: string) => {
  let tableName = '';
  let query = supabase.from(tableName).select('*');

  switch (source) {
    case 'pt':
      tableName = 'help_details';
      query = supabase.from(tableName).select('title, section_header, section_content').eq('exercise', contentKey);
      break;
    case 'pay':
      tableName = 'pay_help_details';
      query = supabase.from(tableName).select('title, purpose_description, recipient_group, report_section').eq('title', contentKey);
      break;
    case 'retirement':
      tableName = 'retirement_help_details';
      query = supabase.from(tableName).select('title, purpose_description, calculation_details, example').eq('title', contentKey);
      break;
    default:
      return null;
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching help content from ${tableName}:`, error);
    return null;
  }

  return data;
};