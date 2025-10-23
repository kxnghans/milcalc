import { supabase } from './supabaseClient';

export const getDisabilityData = async () => {
  const { data, error } = await supabase.from('veterans_disability_compensation').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
