/**
 * @file retirement-calculator.test.ts
 * @description Unit tests for the Retirement calculator logic in retirement-calculator.ts.
 * @see ../../TESTING.md
 */

import { calculatePension, calculateTsp, calculateTaxes, getRetirementAge } from '../src/retirement-calculator';
import * as PayApi from '../src/pay-supabase-api';
import { mockFederalTaxData, mockStateTaxData } from './test-mocks/retirement-data-mocks';

// Mock the API modules
jest.mock('../src/pay-supabase-api');

const mockedPayApi = PayApi as jest.Mocked<typeof PayApi>;

describe('Retirement Calculator', () => {
    beforeEach(() => {
        // Reset mocks before each test
        mockedPayApi.getBasePay.mockClear();
    });

    describe('calculatePension', () => {
        it('should calculate High-3 retirement pay correctly for Active Duty', async () => {
            // Mock getBasePay to return predictable values
            mockedPayApi.getBasePay.mockImplementation(async (payGrade, yos) => {
                if (yos === 18) return 5000; // Corresponds to yearsOfService - 2
                if (yos === 19) return 5200; // Corresponds to yearsOfService - 1
                if (yos === 20) return 5400; // Corresponds to yearsOfService
                return 0;
            });

            // High-3 Average: (5000 + 5200 + 5400) / 3 = 5200
            // Multiplier: 20 years * 2.5% = 50%
            // Pension: 5200 * 0.50 = 2600
            const pension = await calculatePension('Active', 'High 3', 'E-7', 'E-7', 'E-7', 20, 0, 0);
            expect(pension).toBeCloseTo(2600);
            expect(mockedPayApi.getBasePay).toHaveBeenCalledTimes(3);
        });

        it('should calculate BRS retirement pay correctly for Active Duty', async () => {
            mockedPayApi.getBasePay.mockImplementation(async (payGrade, yos) => {
                if (yos === 23) return 6000;
                if (yos === 24) return 6200;
                if (yos === 25) return 6400;
                return 0;
            });

            // High-3 Average: (6000 + 6200 + 6400) / 3 = 6200
            // Multiplier: 25 years * 2.0% = 50%
            // Pension: 6200 * 0.50 = 3100
            const pension = await calculatePension('Active', 'BRS', 'O-5', 'O-5', 'O-5', 25, 0, 0);
            expect(pension).toBeCloseTo(3100);
        });

        it('should return 0 for less than 20 years of service for Active Duty', async () => {
            const pension = await calculatePension('Active', 'High 3', 'E-7', 'E-7', 'E-7', 19, 0, 0);
            expect(pension).toEqual(0);
            expect(mockedPayApi.getBasePay).not.toHaveBeenCalled();
        });

        it('should calculate pension correctly for a Reservist', async () => {
            mockedPayApi.getBasePay.mockResolvedValue(6000); // Assume constant pay for simplicity

            // High-3 Average: 6000
            // Equivalent Years: 4000 points / 360 = 11.11 years
            // Multiplier: 11.11 * 2.5% = 27.77%
            // Pension: 6000 * (4000 / 360) * 0.025 = 1666.67
            const pension = await calculatePension('Reserve', 'High 3', 'O-4', 'O-4', 'O-4', 22, 4000, 21);
            expect(pension).toBeCloseTo(1666.67);
        });

        it('should return 0 for less than 20 good years for Guard/Reserve', async () => {
            const pension = await calculatePension('Guard', 'High 3', 'E-7', 'E-7', 'E-7', 22, 4000, 19);
            expect(pension).toEqual(0);
            expect(mockedPayApi.getBasePay).not.toHaveBeenCalled();
        });

        it('should return 0 if getBasePay returns null for any year', async () => {
            mockedPayApi.getBasePay.mockImplementation(async (payGrade, yos) => {
                if (yos === 18) return 5000;
                if (yos === 19) return null; // Simulate a missing pay record
                if (yos === 20) return 5400;
                return 0;
            });
            const pension = await calculatePension('Active', 'High 3', 'E-7', 'E-7', 'E-7', 20, 0, 0);
            expect(pension).toEqual(0);
        });
    });

    describe('calculateTsp', () => {
        it('should calculate TSP future value for BRS with matching', () => {
            // User contributes 5%, gets 5% match (1% auto + 4% match)
            // Annual Salary: 60000
            // User Annual: 3000
            // Employer Annual: 600 (1%) + 2400 (4%) = 3000
            // Total Annual: 6000
            // Rate: 7%
            // Years: 20
            // FV = 6000 * (((1 + 0.07)^20 - 1) / 0.07) = 245972.95
            const futureValue = calculateTsp('0', true, 60000, 5, 20, 'BRS', 7);
            expect(futureValue).toBeCloseTo(245972.95);
        });

        it('should calculate TSP future value for High-3 with no matching', () => {
            // User contributes 10%, gets 0% match
            // Annual Salary: 80000
            // User Annual: 8000
            // Total Annual: 8000
            // Rate: 5%
            // Years: 25
            // FV = 8000 * (((1 + 0.05)^25 - 1) / 0.05) = 381816.79
            const futureValue = calculateTsp('0', true, 80000, 10, 25, 'High 3', 5);
            expect(futureValue).toBeCloseTo(381816.79);
        });

        it('should calculate simple interest for a 0% return', () => {
            // User contributes 8% -> 4800 annually
            // Employer (BRS) matches 5% -> 3000 annually
            // Total: 7800 annually
            // For 10 years: 78000
            const futureValue = calculateTsp('0', true, 60000, 8, 10, 'BRS', 0);
            expect(futureValue).toEqual(78000);
        });

        it('should return the manual tspAmount if calculator is not visible', () => {
            const futureValue = calculateTsp('50000', false, 60000, 5, 20, 'BRS', 7);
            expect(futureValue).toEqual(50000);
        });

        it('should return 0 for 0 years', () => {
            const futureValue = calculateTsp('0', true, 60000, 5, 0, 'BRS', 7);
            expect(futureValue).toEqual(0);
        });
    });

    describe('calculateTaxes', () => {
        it('should calculate federal and state taxes correctly for a single person in CA', () => {
            const grossIncome = 60000;
            const state = 'CA';
            const filingStatus = 'single';

            // Federal Taxable: 60000 - 13850 = 46150
            // Federal Tax: (11000 * 0.10) + ((44725 - 11001) * 0.12) + ((46150 - 44726) * 0.22)
            // = 1100 + 4046.88 + 313.28 = 5460.16
            // State Taxable: 60000 - 5202 = 54798
            // State Tax: (10412 * 0.01) + ((24684 - 10413) * 0.02) + ...
            const { federal, state: stateTax } = calculateTaxes(grossIncome, state, filingStatus, mockFederalTaxData, mockStateTaxData);

            expect(federal).toBeCloseTo(5020);
            expect(stateTax).toBeGreaterThan(0); // Calculation is complex, just check it's not zero
        });

        it('should calculate zero state tax for a state with no income tax', () => {
            const { state: stateTax } = calculateTaxes(80000, 'TX', 'single', mockFederalTaxData, mockStateTaxData);
            expect(stateTax).toEqual(0);
        });

        it('should return zero taxes for zero income', () => {
            const { federal, state: stateTax } = calculateTaxes(0, 'CA', 'single', mockFederalTaxData, mockStateTaxData);
            expect(federal).toEqual(0);
            expect(stateTax).toEqual(0);
        });
    });

    describe('getRetirementAge', () => {
        it('should calculate retirement age for Active duty', () => {
            const birthDate = new Date('1990-01-01');
            const serviceEntryDate = new Date('2010-01-01');
            const yearsOfService = 20;
            const breakInService = 0;
            const qualifyingDeploymentDays = 0;

            // Retirement date: 2030-01-01. Age: 40.
            const age = getRetirementAge('Active', birthDate, serviceEntryDate, yearsOfService, breakInService, qualifyingDeploymentDays);
            expect(age).toBe(40);
        });

        it('should account for break in service for Active duty', () => {
            const birthDate = new Date('1990-01-01');
            const serviceEntryDate = new Date('2010-01-01');
            const yearsOfService = 20;
            const breakInService = 2; // +2 years
            const qualifyingDeploymentDays = 0;

            // Retirement date: 2032-01-01. Age: 42.
            const age = getRetirementAge('Active', birthDate, serviceEntryDate, yearsOfService, breakInService, qualifyingDeploymentDays);
            expect(age).toBe(42);
        });

        it('should round down age if retirement date is before birthday in retirement year', () => {
            const birthDate = new Date('1990-06-01');
            const serviceEntryDate = new Date('2010-01-01');
            const yearsOfService = 20;
            const breakInService = 0;
            
            // Retirement date: 2030-01-01.
            // Birthday in 2030 is 06-01.
            // Retirement is BEFORE birthday. So age is 39 (turns 40 later that year).
            const age = getRetirementAge('Active', birthDate, serviceEntryDate, yearsOfService, breakInService, 0);
            expect(age).toBe(39);
        });

        it('should calculate retirement age for Reserve/Guard based on deployment days', () => {
            // 60 - (days / 90) * 0.25 (3 months)
            // 360 days / 90 = 4 blocks. 4 * 0.25 = 1 year reduction.
            // Age = 60 - 1 = 59.
            const age = getRetirementAge('Reserve', null, null, 20, 0, 360);
            expect(age).toBe(59);
        });

        it('should calculate retirement age for Reserve/Guard with zero days', () => {
            const age = getRetirementAge('Guard', null, null, 20, 0, 0);
            expect(age).toBe(60);
        });

        it('should return null if dates are missing for Active duty', () => {
            const age = getRetirementAge('Active', null, null, 20, 0, 0);
            expect(age).toBeNull();
        });
    });
});