import { supabase, sanitizeError } from './supabaseClient';
import { PtStandard, Tables } from './types';

/**
 * Fetches all PT scoring standards for a given gender and age group.
 * @param gender - The user's gender ('Male' or 'Female').
 * @param age_group - The user's age group string (e.g., '<25', '25-29').
 * @returns An array of all standards for that group, or null if an error occurs.
 */
export const getPtStandards = async (gender: string, age_group: string): Promise<PtStandard[] | null> => {
  // 1. Get the age_sex_group_id
  const { data: ageGroupData, error: ageGroupError } = await supabase
    .from('pt_age_sex_groups')
    .select('id')
    .eq('sex', gender)
    .eq('age_range', age_group)
    .single();

  if (ageGroupError || !ageGroupData) {
    console.error('Error fetching age group ID:', sanitizeError(ageGroupError));
    return null;
  }

  const ageSexGroupId = ageGroupData.id;

  // 2. Fetch from unified scoring table
  const { data, error } = await supabase
    .from('pt_scoring_standards')
    .select('exercise_type, performance, points, health_risk_category')
    .eq('age_sex_group_id', ageSexGroupId)
    .order('points', { ascending: false });

  if (error) {
    console.error('Error fetching scoring standards:', sanitizeError(error));
    return null;
  }

  // 3. Add WHtR (age-independent)
  const { data: whtrData, error: whtrError } = await supabase
    .from('pt_scoring_standards')
    .select('exercise_type, performance, points, health_risk_category')
    .eq('exercise_type', 'whtr')
    .order('points', { ascending: false });

  if (whtrError) {
    console.error('Error fetching WHtR standards:', sanitizeError(whtrError));
  }

  const combinedData = [...(data || []), ...(whtrData || [])];

  // 4. Transform to consistent format
  return combinedData.map(item => ({
    exercise: item.exercise_type,
    measurement: item.performance,
    points: item.points,
    healthRiskCategory: item.health_risk_category
  }));
};

/**
 * Fetches passing thresholds (minimums) for all exercises.
 * @param gender - The user's gender.
 * @param age_group - The user's age group.
 * @returns An array of pass/fail standards.
 */
export const getPassFailStandards = async (gender: string, age_group: string): Promise<Tables<'pt_pass_fail_standards'>[] | null> => {
  // Try to find by age group ID first
  const { data: ageGroupData } = await supabase
    .from('pt_age_sex_groups')
    .select('id')
    .eq('sex', gender)
    .eq('age_range', age_group)
    .single();

  const query = supabase.from('pt_pass_fail_standards').select('*');
  
  if (ageGroupData) {
    query.or(`age_sex_group_id.eq.${ageGroupData.id},and(sex.eq.${gender},age_range.eq.${age_group})`);
  } else {
    query.eq('sex', gender).eq('age_range', age_group);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching pass/fail standards:', sanitizeError(error));
    return null;
  }

  return data;
};

/**
 * Fetches all altitude corrections for Run and HAMR.
 */
export const getPtAltitudeCorrections = async (): Promise<Tables<'pt_altitude_corrections'>[] | null> => {
  const { data, error } = await supabase
    .from('pt_altitude_corrections')
    .select('*');

  if (error) {
    console.error('Error fetching altitude corrections:', sanitizeError(error));
    return null;
  }

  return data;
};

/**
 * Fetches altitude walk thresholds.
 */
export const getPtAltitudeWalkThresholds = async (gender: string, age_group: string): Promise<Tables<'pt_altitude_walk_thresholds'>[] | null> => {
  const { data, error } = await supabase
    .from('pt_altitude_walk_thresholds')
    .select('*')
    .eq('sex', gender)
    .eq('age_range', age_group);

  if (error) {
    console.error('Error fetching altitude walk thresholds:', sanitizeError(error));
    return null;
  }

  return data;
};

/**
 * Legacy wrapper for altitude adjustments to minimize breaking changes in hooks.
 */
export const getAltitudeAdjustments = async (exercise: 'run' | 'walk' | 'hamr'): Promise<Tables<'pt_altitude_corrections'>[] | null> => {
    if (exercise === 'run' || exercise === 'hamr') {
        const type = exercise === 'run' ? 'run_2mile' : 'shuttles_20m';
        const data = await getPtAltitudeCorrections();
        return data ? data.filter(d => d.exercise_type === type) : null;
    } else {
        // Walk thresholds are handled differently now, but we return empty for legacy compatibility
        // The calculator will need to call getPtAltitudeWalkThresholds specifically.
        return [];
    }
};

/**
 * Fetches the help content for a specific topic.
 */
export const getHelpContent = async (contentKey: string) => {
  const { data, error } = await supabase
    .from('pt_help_details')
    .select('title, section_header, section_content')
    .eq('content_key', contentKey);

  if (error) {
    console.error('Error fetching help content:', sanitizeError(error));
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const combinedContent = data.reduce((acc: { [key: string]: string | null }, item) => {
    if (item.section_header) {
        const key = item.section_header.toLowerCase().replace(/\s+/g, '_');
        acc[key] = item.section_content;
    }
    return acc;
  }, { title: data[0].title });

  return combinedContent;
};
