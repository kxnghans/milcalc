/**
 * Maps Supabase table names to TanStack Query keys for cache invalidation.
 */
export const SYNC_METADATA_QUERY_KEYS: Record<string, string[]> = {
  'pt_scoring_standards': ['ptStandards'],
  'pt_pass_fail_standards': ['passFailStandards'],
  'pt_altitude_corrections': ['altitudeCorrections'],
  'pt_altitude_walk_thresholds': ['walkAltitudeThresholds'],
  'base_pay_2024': ['basePay'],
  'reserve_drill_pay': ['basePay'],
  'bah_rates_2026': ['bahRate', 'mhaData'],
  'bas_rates': ['basRate'],
  'federal_tax_data': ['federalTaxData', 'maxFederalTaxYear'],
  'state_tax_data': ['stateTaxData', 'maxStateTaxYear'],
  'veterans_disability_compensation': ['disabilityData'],
  'pt_help_details': ['helpContent'],
  'pay_help_details': ['helpContent'],
  'retirement_help_details': ['helpContent'],
  'best_score_help_details': ['helpContent'],
  'documents': ['documents'],
};
