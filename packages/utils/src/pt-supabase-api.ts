import { supabase, sanitizeError } from './supabaseClient';
import { PtStandard, Tables } from './types';
import { parsePerformanceRange } from './pt-utils';

/**
 * Fetches all PT scoring standards for a given gender and age group.
 * @param gender - The user's gender ('Male' or 'Female').
 * @param age_group - The user's age group string (e.g., '<25', '25-29').
 * @returns An array of all standards for that group, or null if an error occurs.
 */
export const getPtStandards = async (gender: string, age_group: string): Promise<PtStandard[] | null> => {
  // 1. Fetch from unified scoring table using gender and age_group directly
  const { data, error } = await supabase
    .from('pt_scoring_standards')
    .select('exercise_type, performance, points, health_risk_category')
    .eq('gender', gender)
    .eq('age_group', age_group)
    .order('points', { ascending: false });

  if (error) {
    console.error('Error fetching scoring standards:', sanitizeError(error));
    return null;
  }

  // 2. Add WHtR (age/gender independent in the new schema)
  const { data: whtrData, error: whtrError } = await supabase
    .from('pt_scoring_standards')
    .select('exercise_type, performance, points, health_risk_category')
    .eq('exercise_type', 'whtr')
    .order('points', { ascending: false });

  if (whtrError) {
    console.error('Error fetching WHtR standards:', sanitizeError(whtrError));
  }

  const combinedData = [...(data || []), ...(whtrData || [])];

  // 3. Transform to consistent format and pre-parse performance ranges
  return combinedData.map(item => ({
    exercise: item.exercise_type,
    measurement: item.performance,
    performanceRange: parsePerformanceRange(item.performance),
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
  const { data, error } = await supabase
    .from('pt_pass_fail_standards')
    .select('*')
    .eq('gender', gender)
    .eq('age_group', age_group);

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
export const getPtAltitudeWalkThresholds = async (gender: string): Promise<Tables<'pt_altitude_walk_thresholds'>[] | null> => {
  const { data, error } = await supabase
    .from('pt_altitude_walk_thresholds')
    .select('*')
    .eq('sex', gender);

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

interface PtBundleResponse {
    standards: (Tables<'pt_scoring_standards'> & { exercise_type: string })[];
    pass_fail: Tables<'pt_pass_fail_standards'>[];
    corrections: Tables<'pt_altitude_corrections'>[];
    walk_thresholds: Tables<'pt_altitude_walk_thresholds'>[];
}

/**
 * Fetches all necessary PT reference data in a single handshake.
 * @param gender - The user's gender.
 * @param age_group - The user's age group.
 * @returns A bundled object containing all scoring and altitude standards.
 */
export const getPtStandardsBundle = async (gender: string, age_group: string): Promise<{
    standards: PtStandard[];
    passFail: Tables<'pt_pass_fail_standards'>[];
    corrections: Tables<'pt_altitude_corrections'>[];
    walkThresholds: Tables<'pt_altitude_walk_thresholds'>[];
} | null> => {
    const { data, error } = await (supabase.rpc as unknown as (name: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>)('get_pt_standards_bundle', {
        p_gender: gender,
        p_age_group: age_group
    });

    if (error || !data) {
        console.error('Error fetching PT standards bundle:', sanitizeError(error));
        return null;
    }

    const bundleData = data as unknown as PtBundleResponse;

    return {
        standards: (bundleData.standards || []).map((item) => ({
            exercise: item.exercise_type,
            measurement: item.performance,
            performanceRange: parsePerformanceRange(item.performance),
            points: item.points,
            healthRiskCategory: item.health_risk_category
        })),
        passFail: bundleData.pass_fail || [],
        corrections: bundleData.corrections || [],
        walkThresholds: bundleData.walk_thresholds || []
    };
};
