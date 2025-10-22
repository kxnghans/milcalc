import { supabase } from './supabaseClient';

/**
 * Fetches the monthly base pay for a given pay grade and years of service.
 * @param pay_grade - The service member's pay grade (e.g., 'O-5').
 * @param years_of_service - The number of years in service.
 * @returns The base pay amount, or 0 if not found.
 */
export const getBasePay = async (pay_grade: string, years_of_service: number) => {
  if (!pay_grade) return 0;

  let yearsColumn = 'yos_2_or_less';
  if (years_of_service >= 40) yearsColumn = 'yos_over_40';
  else if (years_of_service >= 38) yearsColumn = 'yos_over_38';
  else if (years_of_service >= 36) yearsColumn = 'yos_over_36';
  else if (years_of_service >= 34) yearsColumn = 'yos_over_34';
  else if (years_of_service >= 32) yearsColumn = 'yos_over_32';
  else if (years_of_service >= 30) yearsColumn = 'yos_over_30';
  else if (years_of_service >= 28) yearsColumn = 'yos_over_28';
  else if (years_of_service >= 26) yearsColumn = 'yos_over_26';
  else if (years_of_service >= 24) yearsColumn = 'yos_over_24';
  else if (years_of_service >= 22) yearsColumn = 'yos_over_22';
  else if (years_of_service >= 20) yearsColumn = 'yos_over_20';
  else if (years_of_service >= 18) yearsColumn = 'yos_over_18';
  else if (years_of_service >= 16) yearsColumn = 'yos_over_16';
  else if (years_of_service >= 14) yearsColumn = 'yos_over_14';
  else if (years_of_service >= 12) yearsColumn = 'yos_over_12';
  else if (years_of_service >= 10) yearsColumn = 'yos_over_10';
  else if (years_of_service >= 8) yearsColumn = 'yos_over_8';
  else if (years_of_service >= 6) yearsColumn = 'yos_over_6';
  else if (years_of_service >= 4) yearsColumn = 'yos_over_4';
  else if (years_of_service >= 3) yearsColumn = 'yos_over_3';
  else if (years_of_service >= 2) yearsColumn = 'yos_over_2';

  const { data, error } = await supabase
    .from('base_pay_2024')
    .select(yearsColumn)
    .eq('pay_grade', pay_grade)
    .single();

  if (error) {
    console.error('Error fetching base pay:', error);
    return 0;
  }

  return data ? data[yearsColumn] : 0;
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
        .from('bah_rates_dependents')
        .select('state, mha_name, mha');

    if (error) {
        console.error('Error fetching MHA data:', error);
        return {};
    }

    // Group the flat list of MHAs by state
    const groupedData = data.reduce((acc, mha) => {
        const { state, mha_name, mha: mhaCode } = mha;
        if (!acc[state]) {
            acc[state] = [];
        }
        acc[state].push({ label: mha_name, value: mhaCode });
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

    const tableName = dependencyStatus === 'WITH_DEPENDENTS' ? 'bah_rates_dependents' : 'bah_rates_no_dependents';
    
    // Correctly format the rank into a column name, padding with a zero if necessary
    const parts = rank.split('-');
    const letter = parts[0];
    const number = parts[1];
    const paddedNumber = number.length === 1 ? '0' + number : number;
    const rankColumn = (letter + paddedNumber).toLowerCase();

    const { data, error } = await supabase
        .from(tableName)
        .select(rankColumn)
        .eq('mha', mha)
        .single();

    if (error) {
        console.error(`Error fetching BAH rate from ${tableName}:`, error);
        return 0;
    }

    return data ? data[rankColumn] : 0;
};

export const getPayHelpContent = async (contentKey: string) => {
  if (!contentKey) return null;

  const { data, error } = await supabase
    .from('pay_help_details')
    .select('*')
    .eq('title', contentKey)
    .single();

  if (error) {
    console.error('Error fetching pay help content:', error);
    return null;
  }

  return data;
};

export const getFederalTaxData = async (year: number) => {
  const { data, error } = await supabase
    .from('federal_tax_data')
    .select('*')
    .eq('year', year);

  if (error) {
    console.error('Error fetching federal tax data:', error);
    return [];
  }

  return data || [];
};

export const getStateTaxData = async (year: number) => {
  const { data, error } = await supabase
    .from('state_tax_data')
    .select('*')
    .eq('year', year);

  if (error) {
    console.error('Error fetching state tax data:', error);
    return [];
  }

  return data || [];
};

export const getMaxFederalTaxYear = async () => {
  const { data, error } = await supabase
    .from('federal_tax_data')
    .select('year')
    .order('year', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching max federal tax year:', error);
    return null;
  }
  return data ? data.year : null;
};

export const getMaxStateTaxYear = async () => {
  const { data, error } = await supabase
    .from('state_tax_data')
    .select('year')
    .order('year', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching max state tax year:', error);
    return null;
  }
  return data ? data.year : null;
};