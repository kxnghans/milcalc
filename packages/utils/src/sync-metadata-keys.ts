/**
 * Maps Supabase table names to TanStack Query keys for cache invalidation.
 */
export const SYNC_METADATA_QUERY_KEYS: Record<string, string[]> = {
  'pt_muscular_fitness_standards': ['ptStandards'],
  'pt_cardio_respiratory_standards': ['ptStandards'],
  'walk_standards': ['walkStandards'],
  'base_pay_2024': ['basePay'],
  'reserve_drill_pay': ['basePay'],
  'bah_rates_dependents': ['bahRate', 'mhaData'],
  'bah_rates_no_dependents': ['bahRate'],
  'bas_rates': ['basRate'],
  'federal_tax_data': ['federalTaxData', 'maxFederalTaxYear'],
  'state_tax_data': ['stateTaxData', 'maxStateTaxYear'],
  'veterans_disability_compensation': ['disabilityData'],
  'pt_help_details': ['helpContent'],
  'pay_help_details': ['helpContent'],
  'retirement_help_details': ['helpContent'],
  'best_score_help_details': ['helpContent'],
};
