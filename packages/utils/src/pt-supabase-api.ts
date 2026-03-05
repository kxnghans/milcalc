import { supabase, sanitizeError } from './supabaseClient';
import { PtStandard, Tables } from './types';

/**
 * Fetches all PT standards for a given gender and age group from multiple tables.
 * @param gender - The user's gender ('Male' or 'Female').
 * @param age_group - The user's age group string (e.g., '<25', '25-29').
 * @returns An array of all standards for that group, or null if an error occurs.
 */
export const getPtStandards = async (gender: string, age_group: string): Promise<PtStandard[] | null> => {
  // 1. Get the age_sex_group_id from the pt_age_sex_groups table
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

  // 2. Fetch data from pt_muscular_fitness_standards and pt_cardio_respiratory_standards in parallel
  const [muscularResult, cardioResult] = await Promise.all([
    supabase
      .from('pt_muscular_fitness_standards')
      .select('exercise_type, reps, time, points')
      .eq('age_sex_group_id', ageSexGroupId)
      .order('points', { ascending: false }),
    supabase
      .from('pt_cardio_respiratory_standards')
      .select('run_time, shuttles_range, points')
      .eq('age_sex_group_id', ageSexGroupId)
      .order('points', { ascending: false })
  ]);

  const { data: muscularData, error: muscularError } = muscularResult;
  const { data: cardioData, error: cardioError } = cardioResult;

  if (muscularError) {
    console.error('Error fetching muscular fitness standards:', sanitizeError(muscularError));
    return null;
  }


  if (cardioError) {
    console.error('Error fetching cardio standards:', sanitizeError(cardioError));
    return null;
  }

  // 4. Combine and transform the data into a consistent format
  const standards: PtStandard[] = [];

  if (muscularData) {
    for (const item of muscularData) {
      standards.push({
        exercise: item.exercise_type,
        measurement: item.reps || item.time, // Use reps or time as the measurement
        points: item.points || 0,
      });
    }
  }

  if (cardioData) {
    for (const item of cardioData) {
      if (item.run_time) {
        standards.push({
          exercise: 'run',
          measurement: item.run_time,
          points: item.points || 0,
        });
      }
      if (item.shuttles_range) {
        standards.push({
          exercise: 'shuttles',
          measurement: item.shuttles_range,
          points: item.points || 0,
        });
      }
    }
  }

  return standards;
};

/**
 * Fetches all walk standards for a given gender.
 * @param gender - The user's gender ('Male' or 'Female').
 * @returns An array of all walk standards for that group, or null if an error occurs.
 */
export const getWalkStandards = async (gender: string) => {
  const { data, error } = await supabase
    .from('walk_standards')
    .select('*')
    .eq('gender', gender);

  if (error) {
    console.error('Error fetching walk standards:', sanitizeError(error));
    return null;
  }

  return data;
};

/**
 * Fetches all altitude adjustments for a given exercise.
 * @param exercise - The exercise ('run', 'walk', or 'hamr').
 * @returns An array of all altitude adjustments for that exercise, or null if an error occurs.
 */
export const getAltitudeAdjustments = async <T extends 'run' | 'walk' | 'hamr'>(
  exercise: T
): Promise<Tables<T extends 'run' ? 'run_altitude_adjustments' : T extends 'walk' ? 'walk_altitude_adjustments' : 'hamr_altitude_adjustments'>[] | null> => {
    let query;
    if (exercise === 'run') {
        query = supabase.from('run_altitude_adjustments').select('*');
    } else if (exercise === 'walk') {
        query = supabase.from('walk_altitude_adjustments').select('*');
    } else if (exercise === 'hamr') {
        query = supabase.from('hamr_altitude_adjustments').select('*');
    } else {
        return null;
    }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching altitude adjustments for ${exercise}:`, sanitizeError(error));
    return null;
  }

  return data as unknown as Tables<T extends 'run' ? 'run_altitude_adjustments' : T extends 'walk' ? 'walk_altitude_adjustments' : 'hamr_altitude_adjustments'>[];
};


/**
 * Fetches the help content for a specific topic from the Supabase database.
 * @param contentKey - The unique key for the help topic (e.g., 'push_ups_1min').
 * @returns The help content object, or null if not found.
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

  // Combine the sections into a single object with section_header as keys
  const combinedContent = data.reduce((acc: { [key: string]: string | null }, item) => {
    if (item.section_header) {
        // Use a lowercase, snake_case version of the header as the key
        const key = item.section_header.toLowerCase().replace(/\s+/g, '_');
        acc[key] = item.section_content;
    }
    return acc;
  }, { title: data[0].title });

  return combinedContent;
};