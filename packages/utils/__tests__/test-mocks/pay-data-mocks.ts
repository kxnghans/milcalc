/**
 * @file pay-data-mocks.ts
 * @description Provides mock data for Pay calculator unit tests.
 */

import { Tables } from '../../src/types';

// Simulates data from `federal_tax_data` (2026 data from Supabase)
export const mockFederalTaxData: Tables<'federal_tax_data'>[] = [
    // Single
    { id: 1, filing_status: 'Single', standard_deduction: 16100, income_bracket_low: 0, income_bracket_high: '12400', tax_rate: 0.10, year: 2026, state: 'Federal', personal_exemption: 0, amt_exemption: 90100, eitc_value: 8680, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
    { id: 4, filing_status: 'Single', standard_deduction: 16100, income_bracket_low: 12401, income_bracket_high: '50400', tax_rate: 0.12, year: 2026, state: 'Federal', personal_exemption: 0, amt_exemption: 90100, eitc_value: 8680, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
    { id: 7, filing_status: 'Single', standard_deduction: 16100, income_bracket_low: 50401, income_bracket_high: '105700', tax_rate: 0.22, year: 2026, state: 'Federal', personal_exemption: 0, amt_exemption: 90100, eitc_value: 8680, eitc_parameter: 'Income at Max Credit', children: 'No Children' },

    // Married Filing Jointly (Mapped to 'Married' in tests usually, check mapping)
    // Note: The app logic typically capitalizes 'married' -> 'Married'. The DB has 'Married Filing Jointly'.
    // The mismatch might cause issues if not handled. The DB result says 'Married Filing Jointly'.
    // If the app sends 'Married', capitalized 'Married'. DB check `row.filing_status === 'Married'`. It won't match 'Married Filing Jointly'.
    // Wait, let's check `pay-calculator.ts`: `row.filing_status === capitalizedFilingStatus`.
    // If user selects "Married", capitalized is "Married". DB has "Married Filing Jointly".
    // This implies the current app might be BROKEN for Married status with the new 2026 data if the string doesn't match!
    // Or maybe the 'Married' in the previous mock was simplifying 'Married Filing Jointly'.
    // I will use 'Married' here to match the TEST input expectation for now, OR I should update the test input to 'Married Filing Jointly'.
    // Actually, looking at Turn 16 output, the ID 2, 5, 8 are 'Married Filing Jointly'.
    // I will use 'Married' in the mock for now to keep existing tests passing logic-wise, but I should probably flag this as a potential real bug.
    // However, the prompt is "is the pay and retirement mock data consistent with our actual tables".
    // If actual table says "Married Filing Jointly", I should put that.
    // BUT if I do, the test `should calculate pay correctly for a married individual` which passes `filingStatus: 'Married'` will FAIL to find the bracket (returns 0 tax).
    // This reveals a potential regression/bug in the app vs data.
    // For now, I will use 'Married' to mimic the *intended* match, but I'll add a comment.
    // actually, let's verify if 'Married' exists in DB. Query `SELECT DISTINCT filing_status FROM federal_tax_data`.
    
    // I'll proceed with 'Married' for the mock to make tests functional, assuming the app maps it or I'll update the test to use 'Married Filing Jointly'.
    // Updating test to 'Married Filing Jointly' is better.
    { id: 2, filing_status: 'Married Filing Jointly', standard_deduction: 32200, income_bracket_low: 0, income_bracket_high: '24800', tax_rate: 0.10, year: 2026, state: 'Federal', personal_exemption: 0, amt_exemption: 140200, eitc_value: 8680, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
    { id: 5, filing_status: 'Married Filing Jointly', standard_deduction: 32200, income_bracket_low: 24801, income_bracket_high: '100800', tax_rate: 0.12, year: 2026, state: 'Federal', personal_exemption: 0, amt_exemption: 140200, eitc_value: 8680, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
    { id: 8, filing_status: 'Married Filing Jointly', standard_deduction: 32200, income_bracket_low: 100801, income_bracket_high: '211400', tax_rate: 0.22, year: 2026, state: 'Federal', personal_exemption: 0, amt_exemption: 140200, eitc_value: 8680, eitc_parameter: 'Income at Max Credit', children: 'No Children' },

    // Head of Household
    { id: 3, filing_status: 'Head of Household', standard_deduction: 24150, income_bracket_low: 0, income_bracket_high: '17700', tax_rate: 0.10, year: 2026, state: 'Federal', personal_exemption: 0, amt_exemption: null, eitc_value: null, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
    { id: 6, filing_status: 'Head of Household', standard_deduction: 24150, income_bracket_low: 17701, income_bracket_high: '67450', tax_rate: 0.12, year: 2026, state: 'Federal', personal_exemption: 0, amt_exemption: null, eitc_value: null, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
    { id: 9, filing_status: 'Head of Household', standard_deduction: 24150, income_bracket_low: 67451, income_bracket_high: '105700', tax_rate: 0.22, year: 2026, state: 'Federal', personal_exemption: 0, amt_exemption: null, eitc_value: null, eitc_parameter: 'Income at Max Credit', children: 'No Children' },
];

// Simulates data from `state_tax_data` (2025 data from Supabase)
export const mockStateTaxData: any[] = [
    // California - Single
    { id: 13, year: 2025, state: 'CA', filing_status: 'Single', tax_rate: 1.0, income_bracket_low: 0, income_bracket_high: 'inf', standard_deduction: 5540, personal_exemption: 149 },
    { id: 15, year: 2025, state: 'CA', filing_status: 'Single', tax_rate: 0.02, income_bracket_low: 10756, income_bracket_high: 'inf', standard_deduction: 5540, personal_exemption: 149 },
    { id: 17, year: 2025, state: 'CA', filing_status: 'Single', tax_rate: 0.04, income_bracket_low: 25499, income_bracket_high: 'inf', standard_deduction: 5540, personal_exemption: 149 },
    { id: 19, year: 2025, state: 'CA', filing_status: 'Single', tax_rate: 0.06, income_bracket_low: 40245, income_bracket_high: 'inf', standard_deduction: 5540, personal_exemption: 149 },
    { id: 21, year: 2025, state: 'CA', filing_status: 'Single', tax_rate: 0.08, income_bracket_low: 55866, income_bracket_high: 'inf', standard_deduction: 5540, personal_exemption: 149 },

    // California - Married Filing Jointly
    { id: 14, year: 2025, state: 'CA', filing_status: 'Married Filing Jointly', tax_rate: 1.0, income_bracket_low: 0, income_bracket_high: 'inf', standard_deduction: 11080, personal_exemption: 298 },
    { id: 16, year: 2025, state: 'CA', filing_status: 'Married Filing Jointly', tax_rate: 0.02, income_bracket_low: 21512, income_bracket_high: 'inf', standard_deduction: 11080, personal_exemption: 298 },
    { id: 18, year: 2025, state: 'CA', filing_status: 'Married Filing Jointly', tax_rate: 0.04, income_bracket_low: 50998, income_bracket_high: 'inf', standard_deduction: 11080, personal_exemption: 298 },
    { id: 20, year: 2025, state: 'CA', filing_status: 'Married Filing Jointly', tax_rate: 0.06, income_bracket_low: 80490, income_bracket_high: 'inf', standard_deduction: 11080, personal_exemption: 298 },
    
    // Colorado - Single
    { id: 33, year: 2025, state: 'CO', filing_status: 'Single', tax_rate: 0.044, income_bracket_low: 0, income_bracket_high: 'inf', standard_deduction: 15000, personal_exemption: 0 },
    // Colorado - Married
    { id: 34, year: 2025, state: 'CO', filing_status: 'Married Filing Jointly', tax_rate: 0.044, income_bracket_low: 0, income_bracket_high: 'inf', standard_deduction: 30000, personal_exemption: 0 },
];

// Simulates data from `veterans_disability_compensation`
export const mockDisabilityData = [
    {
      "dependent_status": "Veteran alone",
      "10%": 175.51,
      "20%": 346.95,
      "30%": 537.42,
      "40%": 774.16,
      "50%": 1102.04,
      "60%": 1395.93,
      "70%": 1759.19,
      "80%": 2044.89,
      "90%": 2297.96,
      "100%": 3831.3
    },
    {
      "dependent_status": "With spouse only",
      "10%": null,
      "20%": null,
      "30%": 601.42,
      "40%": 859.16,
      "50%": 1208.04,
      "60%": 1523.93,
      "70%": 1908.19,
      "80%": 2214.89,
      "90%": 2489.96,
      "100%": 4044.91
    }
  ];