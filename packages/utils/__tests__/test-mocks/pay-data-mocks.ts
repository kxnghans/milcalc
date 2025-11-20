/**
 * @file pay-data-mocks.ts
 * @description Provides mock data for Pay calculator unit tests.
 */

import { Tables } from '../../src/types';

// Simulates data from `federal_tax_data`
export const mockFederalTaxData: Tables<'federal_tax_data'>[] = [
    // Single
    { id: 1, filing_status: 'Single', standard_deduction: 13850, income_bracket_low: 0, income_bracket_high: '11000', tax_rate: 0.10, year: 2023, state: null, personal_exemption: null, amt_exemption: null, eitc_value: null, eitc_parameter: null, children: null },
    { id: 2, filing_status: 'Single', standard_deduction: 13850, income_bracket_low: 11000, income_bracket_high: '44725', tax_rate: 0.12, year: 2023, state: null, personal_exemption: null, amt_exemption: null, eitc_value: null, eitc_parameter: null, children: null },
    { id: 3, filing_status: 'Single', standard_deduction: 13850, income_bracket_low: 44725, income_bracket_high: '95375', tax_rate: 0.22, year: 2023, state: null, personal_exemption: null, amt_exemption: null, eitc_value: null, eitc_parameter: null, children: null },

    // Married
    { id: 4, filing_status: 'Married', standard_deduction: 27700, income_bracket_low: 0, income_bracket_high: '22000', tax_rate: 0.10, year: 2023, state: null, personal_exemption: null, amt_exemption: null, eitc_value: null, eitc_parameter: null, children: null },
    { id: 5, filing_status: 'Married', standard_deduction: 27700, income_bracket_low: 22000, income_bracket_high: '89450', tax_rate: 0.12, year: 2023, state: null, personal_exemption: null, amt_exemption: null, eitc_value: null, eitc_parameter: null, children: null },
    { id: 6, filing_status: 'Married', standard_deduction: 27700, income_bracket_low: 89450, income_bracket_high: '190750', tax_rate: 0.22, year: 2023, state: null, personal_exemption: null, amt_exemption: null, eitc_value: null, eitc_parameter: null, children: null },

    // Head of Household
    { id: 7, filing_status: 'Head of Household', standard_deduction: 20800, income_bracket_low: 0, income_bracket_high: '15700', tax_rate: 0.10, year: 2023, state: null, personal_exemption: null, amt_exemption: null, eitc_value: null, eitc_parameter: null, children: null },
    { id: 8, filing_status: 'Head of Household', standard_deduction: 20800, income_bracket_low: 15700, income_bracket_high: '59850', tax_rate: 0.12, year: 2023, state: null, personal_exemption: null, amt_exemption: null, eitc_value: null, eitc_parameter: null, children: null },
];

// Simulates data from `state_tax_data`
export const mockStateTaxData: any[] = [
    // California - Single
    { id: 1, state: 'CA', filing_status: 'Single', standard_deduction: 5202, income_bracket_low: 0, income_bracket_high: '10412', tax_rate: 0.01, year: 2023 },
    { id: 2, state: 'CA', filing_status: 'Single', standard_deduction: 5202, income_bracket_low: 10412, income_bracket_high: '24684', tax_rate: 0.02, year: 2023 },
    { id: 3, state: 'CA', filing_status: 'Single', standard_deduction: 5202, income_bracket_low: 24684, income_bracket_high: '38959', tax_rate: 0.04, year: 2023 },
    { id: 4, state: 'CA', filing_status: 'Single', standard_deduction: 5202, income_bracket_low: 38959, income_bracket_high: '54081', tax_rate: 0.06, year: 2023 },

    // California - Married
    { id: 5, state: 'CA', filing_status: 'Married', standard_deduction: 10404, income_bracket_low: 0, income_bracket_high: '20824', tax_rate: 0.01, year: 2023 },
    { id: 6, state: 'CA', filing_status: 'Married', standard_deduction: 10404, income_bracket_low: 20824, income_bracket_high: '49368', tax_rate: 0.02, year: 2023 },
    
    // Colorado - Flat tax
    { id: 7, state: 'CO', filing_status: 'Single', standard_deduction: 12550, income_bracket_low: 0, income_bracket_high: 'inf', tax_rate: 0.044, year: 2023 },
    { id: 8, state: 'CO', filing_status: 'Married', standard_deduction: 25100, income_bracket_low: 0, income_bracket_high: 'inf', tax_rate: 0.044, year: 2023 },
    { id: 9, state: 'CO', filing_status: 'Head of Household', standard_deduction: 19000, income_bracket_low: 0, income_bracket_high: 'inf', tax_rate: 0.044, year: 2023 },
];

// Simulates data from `veterans_disability_compensation`
export const mockDisabilityData = [
    {
      "dependent_status": "Veteran alone",
      "10%": 171.23,
      "20%": 338.49,
      "30%": 524.31,
      "40%": 755.28,
      "50%": 1075.16,
      "60%": 1361.88,
      "70%": 1716.28,
      "80%": 1995.01,
      "90%": 2241.91,
      "100%": 3737.85
    },
    {
      "dependent_status": "veteran with spouse only",
      "10%": null,
      "20%": null,
      "30%": 580.31,
      "40%": 829.28,
      "50%": 1167.16,
      "60%": 1471.88,
      "70%": 1844.28,
      "80%": 2139.01,
      "90%": 2361.91,
      "100%": 3946.85
    }
  ];
  