/**
 * @file pay-calculator.test.ts
 * @description Unit tests for the Pay calculator logic in pay-calculator.ts.
 * @see ../../TESTING.md
 */

import { calculatePay, calculateDisabilityIncome } from '../src/pay-calculator';
import { mockFederalTaxData, mockStateTaxData, mockDisabilityData } from './test-mocks/pay-data-mocks';
import { Tables } from '../src/types';
import * as DisabilityApi from '../src/disability-supabase-api';

jest.mock('../src/disability-supabase-api');

const mockedDisabilityApi = DisabilityApi as jest.Mocked<typeof DisabilityApi>;


describe('Pay Calculator', () => {
    beforeEach(() => {
        // Reset mocks before each test
        mockedDisabilityApi.getDisabilityData.mockClear();
    });

    describe('calculatePay', () => {
        it('should calculate pay correctly for a single individual in CA', async () => {
            const inputs = {
                basePay: 5000, // 60k annually
                bah: 2000,
                bas: 400,
                specialPays: { bonus: 100 },
                additionalIncomes: [{ name: 'Side Gig', amount: 200 }],
                filingStatus: 'Single',
                mha: 'CA012',
                state: 'CA',
                additionalDeductions: [{ name: 'TSP', amount: 500 }],
            };

            const result = await calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);

            expect(result.totalIncome).toBeCloseTo(7700);
            expect(result.ficaTax).toBeCloseTo(405.45);
            expect(result.federalTax).toBeCloseTo(419.17);
            expect(result.stateTax).toBeGreaterThan(0);
        });

        it('should calculate pay correctly for a married individual', async () => {
            const inputs = {
                basePay: 7000, // 84k annually
                bah: 2500,
                bas: 450,
                specialPays: {},
                additionalIncomes: [],
                filingStatus: 'Married',
                mha: 'CA012',
                state: 'CA',
                additionalDeductions: [],
            };

            // Taxable Income: 84000
            // Federal Taxable for Brackets: 84000 - 27700 = 56300
            // Fed Tax: (22000 * 0.10) + ((56300 - 22000) * 0.12) = 2200 + 4116 = 6316 -> 526.33 monthly

            const result = await calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);
            expect(result.federalTax).toBeCloseTo(526.33);
        });

        it('should return zero for all taxes with zero income', async () => {
            const inputs = {
                basePay: 0,
                bah: 0,
                bas: 0,
                specialPays: {},
                additionalIncomes: [],
                filingStatus: 'Single',
                mha: 'TX001',
                state: 'TX',
                additionalDeductions: [],
            };

            const result = await calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);

            expect(result.totalIncome).toEqual(0);
            expect(result.ficaTax).toEqual(0);
            expect(result.federalTax).toEqual(0);
            expect(result.stateTax).toEqual(0);
        });

        it('should calculate zero state tax for a state with no income tax', async () => {
            const inputs = {
                basePay: 5000,
                bah: 1500,
                bas: 400,
                specialPays: {},
                additionalIncomes: [],
                filingStatus: 'Single',
                mha: 'TX001',
                state: 'TX', // Texas has no state income tax
                additionalDeductions: [],
            };

            const result = await calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);

            expect(result.stateTax).toEqual(0);
        });

        it('should calculate pay correctly for Head of Household in CO', async () => {
            const inputs = {
                basePay: 6000, // 72k annually
                bah: 2200,
                bas: 420,
                specialPays: { 'Flight Pay': 600 },
                additionalIncomes: [],
                filingStatus: 'Head of Household',
                mha: 'CO001',
                state: 'CO',
                additionalDeductions: [{ name: 'SGLI', amount: 30 }],
            };

            // Annual Taxable Income: (6000 + 600) * 12 = 79200
            // Annual Deductions: 30 * 12 = 360
            // Federal Taxable for Brackets: 79200 - 20800 (HoH) - 360 = 58040
            // Fed Tax: (15700 * 0.10) + ((58040 - 15700) * 0.12) = 1570 + 5080.8 = 6650.8 -> 554.23 monthly
            // State Taxable for Brackets (CO): 79200 - 19000 (HoH) - 360 = 59840
            // State Tax (CO): 59840 * 0.044 = 2632.96 -> 219.41 monthly

            const result = await calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);

            expect(result.federalTax).toBeCloseTo(554.23);
            expect(result.stateTax).toBeCloseTo(219.41);
        });

        it('should handle multiple deductions and special pays', async () => {
            const inputs = {
                basePay: 8000, // 96k annually
                bah: 3000,
                bas: 500,
                specialPays: { 'Sub Pay': 1000, 'Demo Pay': 150 },
                additionalIncomes: [],
                filingStatus: 'Married',
                mha: 'CA012',
                state: 'CA',
                additionalDeductions: [{ name: 'TSP', amount: 800 }, {name: 'Dental', amount: 50}],
            };

            // Annual Taxable: (8000 + 1000 + 150) * 12 = 109800
            // Annual Deductions: (800 + 50) * 12 = 10200
            // Federal Taxable: 109800 - 27700 - 10200 = 71900
            // Fed Tax: (22000 * 0.10) + ((71900 - 22000) * 0.12) = 2200 + 5988 = 8188 -> 682.33 monthly

            const result = await calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);
            expect(result.federalTax).toBeCloseTo(682.33);
        });

        it('should correctly apply the hardcoded CA tax rate fix', async () => {
            const inputs = {
                basePay: 1000, // 12k annually, low enough to fall in the first bracket
                bah: 0,
                bas: 0,
                specialPays: {},
                additionalIncomes: [],
                filingStatus: 'Single',
                mha: 'CA012',
                state: 'CA',
                additionalDeductions: [],
            };
            
            // The buggy data would give a 100% tax rate. The fix makes it 1%.
            // Taxable: 12000 - 5202 = 6798
            // Tax: 6798 * 0.01 = 67.98 -> 5.67 monthly
            const result = await calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);
            expect(result.stateTax).toBeCloseTo(5.67);
        });
    });

    describe('calculateDisabilityIncome', () => {
        it('should return the correct disability income for a veteran alone', async () => {
            mockedDisabilityApi.getDisabilityData.mockResolvedValue(mockDisabilityData as any);

            const income = await calculateDisabilityIncome('70%', 'veteran alone');
            expect(income).toEqual(1716.28);
            expect(mockedDisabilityApi.getDisabilityData).toHaveBeenCalledTimes(1);
        });

        it('should return the correct disability income for a veteran with spouse', async () => {
            mockedDisabilityApi.getDisabilityData.mockResolvedValue(mockDisabilityData as any);

            const income = await calculateDisabilityIncome('90%', 'veteran with spouse only');
            expect(income).toEqual(2361.91);
        });

        it('should return 0 if dependent status is "none"', async () => {
            const income = await calculateDisabilityIncome('50%', 'none' as any);
            expect(income).toEqual(0);
            expect(mockedDisabilityApi.getDisabilityData).not.toHaveBeenCalled();
        });
    });
});