import { supabase } from './supabaseClient';

/**
 * Fetches the monthly base pay for a given pay grade and years of service.
 * @param pay_grade - The service member's pay grade (e.g., 'E-5').
 * @param years_of_service - The number of years in service.
 * @returns The base pay amount, or 0 if not found.
 */
export const getBasePay = async (pay_grade: string, years_of_service: number) => {
  const { data, error } = await supabase
    .from('base_pay')
    .select('pay_2025')
    .eq('pay_grade', pay_grade)
    .lte('years_of_service', years_of_service)
    .order('years_of_service', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching base pay:', error);
    return 0;
  }

  return data?.pay_2025 || 0;
};

/**
 * Fetches the monthly Basic Allowance for Subsistence (BAS) rate for a given rank type.
 * @param rank - The service member's rank (e.g., 'O-3', 'E-7').
 * @returns The BAS rate, or 0 if not found.
 */
export const getBasRate = async (rank: string) => {
    const rankType = rank.charAt(0).toUpperCase();
    const column = rankType === 'O' ? 'officer_rate' : 'enlisted_rate';

    const { data, error } = await supabase
        .from('bas_rates')
        .select(column)
        .eq('year', 2025)
        .single();

    if (error) {
        console.error('Error fetching BAS rate:', error);
        return 0;
    }

    return data ? data[column] : 0;
};

/**
 * Fetches the full list of Military Housing Areas (MHAs) grouped by state.
 * @returns An object where keys are state codes and values are arrays of MHA info.
 */
export const getMhaData = async () => {
    const { data, error } = await supabase
        .from('bah_rates_with_dependants')
        .select('state, MHA_NAME, MHA');

    if (error) {
        console.error('Error fetching MHA data:', error);
        return {};
    }

    // Group the flat list of MHAs by state
    const groupedData = data.reduce((acc, mha) => {
        const { state, MHA_NAME, MHA } = mha;
        if (!acc[state]) {
            acc[state] = [];
        }
        acc[state].push({ label: MHA_NAME, value: MHA });
        return acc;
    }, {});

    return groupedData;
};

/**
 * Fetches the specific BAH rate for a given MHA, rank, and dependency status.
 * @param mha - The Military Housing Area code.
 * @param rank - The service member's rank (e.g., 'E-5').
 * @param dependencyStatus - The member's dependency status.
 * @returns The BAH rate, or 0 if not found.
 */
export const getBahRate = async (mha: string, rank: string, dependencyStatus: 'WITH_DEPENDENTS' | 'WITHOUT_DEPENDENTS') => {
    if (!mha || !rank || !dependencyStatus) return 0;

    const tableName = dependencyStatus === 'WITH_DEPENDENTS' ? 'bah_rates_with_dependants' : 'bah_rates_without_dependants';
    const rankColumn = rank.replace('-', ''); // Format rank for column name (e.g., 'E05')

    const { data, error } = await supabase
        .from(tableName)
        .select(rankColumn)
        .eq('MHA', mha)
        .single();

    if (error) {
        console.error(`Error fetching BAH rate from ${tableName}:`, error);
        return 0;
    }

    return data ? data[rankColumn] : 0;
};