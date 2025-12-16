/**
 * @file pay-calculator.test.ts
 * @description Unit tests for the Pay calculator logic in pay-calculator.ts.
 * @see ../../TESTING.md
 */

import { calculatePay, calculateDisabilityIncome, calculateNetPayWithDisability } from '../src/pay-calculator';
import { mockFederalTaxData, mockStateTaxData, mockDisabilityData } from './test-mocks/pay-data-mocks';
import { Tables } from '../src/types';


describe('Pay Calculator', () => {
    beforeEach(() => {
        // Reset mocks before each test
    });

    describe('calculatePay', () => {
        it('should calculate pay correctly for a single individual in CA', () => {
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

            const result = calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);

            expect(result.totalIncome).toBeCloseTo(7700);
            expect(result.ficaTax).toBeCloseTo(405.45);
            expect(result.federalTax).toBeCloseTo(394.33);
            expect(result.stateTax).toBeGreaterThan(0);
        });

        it('should calculate pay correctly for a married individual', () => {
            const inputs = {
                basePay: 7000, // 84k annually
                bah: 2500,
                bas: 450,
                specialPays: {},
                additionalIncomes: [],
                filingStatus: 'Married Filing Jointly',
                mha: 'CA012',
                state: 'CA',
                additionalDeductions: [],
            };

            // Taxable Income: 84000
            // Federal Taxable for Brackets: 84000 - 32200 = 51800
            // Fed Tax: (24800 * 0.10) + ((51800 - 24800) * 0.12) = 2480 + 3240 = 5720 -> 476.67 monthly

            const result = calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);
            expect(result.federalTax).toBeCloseTo(476.67);
        });

        it('should return zero for all taxes with zero income', () => {
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

            const result = calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);

            expect(result.totalIncome).toEqual(0);
            expect(result.ficaTax).toEqual(0);
            expect(result.federalTax).toEqual(0);
            expect(result.stateTax).toEqual(0);
        });

        it('should calculate zero state tax for a state with no income tax', () => {
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

            const result = calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);

            expect(result.stateTax).toEqual(0);
        });

        it('should calculate pay correctly for Single in CO', () => {
            const inputs = {
                basePay: 6000, // 72k annually
                bah: 2200,
                bas: 420,
                specialPays: { 'Flight Pay': 600 },
                additionalIncomes: [],
                filingStatus: 'Single',
                mha: 'CO001',
                state: 'CO',
                additionalDeductions: [{ name: 'SGLI', amount: 30 }],
            };

            // Annual Taxable Income: (6000 + 600) * 12 = 79200
            // Annual Deductions: 30 * 12 = 360
            // Federal Taxable for Brackets: 79200 - 16100 (Single 2026) - 360 = 62740
            // Fed Tax: (12400 * 0.10) + ((50400 - 12400) * 0.12) + ((62740 - 50400) * 0.22) = 1240 + 4560 + 2714.8 = 8514.8 -> 709.57 monthly
            // State Taxable for Brackets (CO): 79200 - 15000 (Single 2025) - 360 = 63840
            // State Tax (CO): 63840 * 0.044 = 2808.96 -> 234.08 monthly

            const result = calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);

            expect(result.federalTax).toBeCloseTo(709.57);
            expect(result.stateTax).toBeCloseTo(234.08);
        });

        it('should handle multiple deductions and special pays', () => {
            const inputs = {
                basePay: 8000, // 96k annually
                bah: 3000,
                bas: 500,
                specialPays: { 'Sub Pay': 1000, 'Demo Pay': 150 },
                additionalIncomes: [],
                filingStatus: 'Married Filing Jointly',
                mha: 'CA012',
                state: 'CA',
                additionalDeductions: [{ name: 'TSP', amount: 800 }, {name: 'Dental', amount: 50}],
            };

            // Annual Taxable: (8000 + 1000 + 150) * 12 = 109800
            // Annual Deductions: (800 + 50) * 12 = 10200
            // Federal Taxable: 109800 - 32200 - 10200 = 67400
            // Fed Tax: (24800 * 0.10) + ((67400 - 24800) * 0.12) = 2480 + 5112 = 7592 -> 632.67 monthly

            const result = calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);
            expect(result.federalTax).toBeCloseTo(632.67);
        });

        it('should correctly apply the hardcoded CA tax rate fix', () => {
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
            // Taxable: 12000 - 5540 = 6460
            // Tax: 6460 * 0.01 = 64.6 -> 5.38 monthly
            const result = calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);
            expect(result.stateTax).toBeCloseTo(5.38);
        });

        it('should handle empty special pays and deductions gracefully', () => {
            const inputs = {
                basePay: 5000,
                bah: 2000,
                bas: 400,
                specialPays: {},
                additionalIncomes: [],
                filingStatus: 'Single',
                mha: 'TX001',
                state: 'TX',
                additionalDeductions: [],
            };
            const result = calculatePay(inputs, mockFederalTaxData as Tables<'federal_tax_data'>[], mockStateTaxData as any[]);
            expect(result.totalIncome).toBeGreaterThan(0);
            expect(result.totalIncome).toBe(7400); // 5000 + 2000 + 400
        });
    });

    describe('calculateDisabilityIncome', () => {
        it('should return the correct disability income for a veteran alone', () => {
            const income = calculateDisabilityIncome('70%', 'Veteran alone', mockDisabilityData as any);
            expect(income).toEqual(1759.19);
        });

        it('should return the correct disability income for a veteran with spouse', () => {
            const income = calculateDisabilityIncome('90%', 'With spouse only', mockDisabilityData as any);
            expect(income).toEqual(2489.96);
        });

        it('should return 0 if dependent status is "none"', () => {
            const income = calculateDisabilityIncome('50%', 'none' as any, mockDisabilityData as any);
            expect(income).toEqual(0);
        });
    });

    describe('calculateNetPayWithDisability', () => {
        it('should return military pay when it is higher than VA disability', () => {
            const result = calculateNetPayWithDisability(5000, 2000);
            expect(result.paySource).toBe('Military');
            expect(result.takeHomePay).toBe(5000);
        });

        it('should return VA disability pay when it is higher than military pay', () => {
            const result = calculateNetPayWithDisability(1000, 3000);
            expect(result.paySource).toBe('VA Disability');
            expect(result.takeHomePay).toBe(3000);
        });

        it('should handle zero inputs correctly', () => {
            const result = calculateNetPayWithDisability(0, 0);
            expect(result.paySource).toBe('Military');
            expect(result.takeHomePay).toBe(0);
        });
    });
});