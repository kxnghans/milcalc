/**
 * @file retirement-data-mocks.ts
 * @description Provides mock data for Retirement calculator unit tests.
 */

import { Tables } from '../../src/types';

export const mockFederalTaxData: Tables<'federal_tax_data'>[] = [
  // Single 2026
  { id: 1, year: 2026, state: 'Federal', filing_status: 'Single', tax_rate: 0.1, income_bracket_low: 0, income_bracket_high: '12400', standard_deduction: 16100, personal_exemption: 0, amt_exemption: 90100, eitc_value: 8680, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
  { id: 4, year: 2026, state: 'Federal', filing_status: 'Single', tax_rate: 0.12, income_bracket_low: 12401, income_bracket_high: '50400', standard_deduction: 16100, personal_exemption: 0, amt_exemption: 90100, eitc_value: 8680, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
  { id: 7, year: 2026, state: 'Federal', filing_status: 'Single', tax_rate: 0.22, income_bracket_low: 50401, income_bracket_high: '105700', standard_deduction: 16100, personal_exemption: 0, amt_exemption: 90100, eitc_value: 8680, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
  
  // Married 2026
  { id: 2, year: 2026, state: 'Federal', filing_status: 'Married Filing Jointly', tax_rate: 0.1, income_bracket_low: 0, income_bracket_high: '24800', standard_deduction: 32200, personal_exemption: 0, amt_exemption: 140200, eitc_value: 8680, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
  { id: 5, year: 2026, state: 'Federal', filing_status: 'Married Filing Jointly', tax_rate: 0.12, income_bracket_low: 24801, income_bracket_high: '100800', standard_deduction: 32200, personal_exemption: 0, amt_exemption: 140200, eitc_value: 8680, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
];

export const mockStateTaxData: any[] = [
  // CA Single 2025
  { id: 13, year: 2025, state: 'CA', filing_status: 'Single', tax_rate: 1.0, income_bracket_low: 0, income_bracket_high: 'inf', standard_deduction: 5540, personal_exemption: 149 },
  { id: 15, year: 2025, state: 'CA', filing_status: 'Single', tax_rate: 0.02, income_bracket_low: 10756, income_bracket_high: 'inf', standard_deduction: 5540, personal_exemption: 149 },
  { id: 17, year: 2025, state: 'CA', filing_status: 'Single', tax_rate: 0.04, income_bracket_low: 25499, income_bracket_high: 'inf', standard_deduction: 5540, personal_exemption: 149 },
  { id: 19, year: 2025, state: 'CA', filing_status: 'Single', tax_rate: 0.06, income_bracket_low: 40245, income_bracket_high: 'inf', standard_deduction: 5540, personal_exemption: 149 },
  { id: 21, year: 2025, state: 'CA', filing_status: 'Single', tax_rate: 0.08, income_bracket_low: 55866, income_bracket_high: 'inf', standard_deduction: 5540, personal_exemption: 149 },

  // TX (Mock for no tax state)
  {
    id: 999,
    year: 2025,
    state: 'TX',
    filing_status: 'Single',
    tax_rate: 0,
    income_bracket_low: 0,
    income_bracket_high: 'inf',
    standard_deduction: 0,
    personal_exemption: 0,
  },
];