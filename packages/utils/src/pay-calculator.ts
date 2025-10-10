
/**
 * @file pay-calculator.ts
 * @description This file contains the core logic for calculating military pay, allowances, and taxes.
 */

import { 
    basePayData,
    basData,
    bahRates2025,
    taxData2022 
} from '@repo/data';

// --- DATA TYPE DEFINITIONS ---

interface PayChart {
    [key: string]: { [key: string]: number };
}

interface BasePayData {
    commissioned_officers_2025: PayChart;
    warrant_officers_2025: PayChart;
    enlisted_members_2025: PayChart;
    [key: string]: PayChart; // Allow for other years/categories
}

interface BasData {
    [key: string]: { // Year, e.g., '2025-01-01'
        officers: number;
        enlisted: number;
        bas_ii: number;
    };
}

interface BahData {
    file: string;
    year: number;
    sections: BahSection[];
}

interface BahSection {
    section_key: 'WITH_DEPENDENTS' | 'WITHOUT_DEPENDENTS';
    section_title: string;
    rows: BahRate[];
}

interface BahRate {
    MHA: string;
    MHA_NAME: string;
    [key: string]: string | number; // Rank columns like E01, O02, etc.
}


// --- CALCULATION FUNCTIONS ---

/**
 * Calculates the monthly base pay for a service member.
 * @param rank - The pay grade of the service member (e.g., 'E-5', 'O-3').
 * @param yearsInService - The number of years the member has served.
 * @returns The monthly base pay amount, or 0 if not found.
 */
export const calculateBasePay = (rank: string, yearsInService: number): number => {
    if (!rank || yearsInService < 0) return 0;

    const payData = basePayData as BasePayData;
    let payChart: PayChart | undefined;

    const rankType = rank.charAt(0).toUpperCase();

    if (rankType === 'O') {
        payChart = payData.commissioned_officers_2025;
    } else if (rankType === 'W') {
        payChart = payData.warrant_officers_2025;
    } else if (rankType === 'E') {
        payChart = payData.enlisted_members_2025;
    } else {
        return 0; // Invalid rank type
    }

    const rankPayLevels = payChart[rank];
    if (!rankPayLevels) return 0;

    // Determine the correct years of service key (e.g., 'over_2', 'over_10')
    const serviceKeys = Object.keys(rankPayLevels)
        .map(key => parseInt(key.replace('over_', '').replace('2_or_less', '0')))
        .sort((a, b) => b - a); // Sort in descending order

    for (const serviceYear of serviceKeys) {
        if (yearsInService >= serviceYear) {
            const key = serviceYear === 0 ? '2_or_less' : `over_${serviceYear}`;
            return rankPayLevels[key] || 0;
        }
    }

    return 0;
};

/**
 * Calculates the monthly Basic Allowance for Subsistence (BAS).
 * @param rank - The pay grade of the service member.
 * @returns The monthly BAS amount.
 */
export const calculateBAS = (rank: string): number => {
    if (!rank) return 0;

    const basRates = (basData as BasData)['2025-01-01'];
    const rankType = rank.charAt(0).toUpperCase();

    if (rankType === 'O') {
        return basRates.officers;
    } else if (rankType === 'E') {
        return basRates.enlisted;
    }

    return 0;
};

/**
 * Calculates the monthly Basic Allowance for Housing (BAH).
 * @param rank - The pay grade of the service member.
 * @param dependencyStatus - Whether the member has dependents ('WITH_DEPENDENTS' or 'WITHOUT_DEPENDENTS').
 * @param mha - The Military Housing Area (MHA) code.
 * @returns The monthly BAH amount.
 */
export const calculateBAH = async (rank: string, dependencyStatus: 'WITH_DEPENDENTS' | 'WITHOUT_DEPENDENTS', mha: string): Promise<number> => {
    if (!rank || !dependencyStatus) return 0;

    if (mha && mha !== 'non-locality') {
        const bahData = await getBahRate(mha);
        if (!bahData) return 0;

        const rankColumn = `${rank.replace('-', '').toLowerCase()}_${dependencyStatus.toLowerCase()}`;
        return bahData[rankColumn] || 0;

    } else if (mha === 'non-locality') {
        const nonLocalityBahData = await getNonLocalityBahRate(rank);
        if (!nonLocalityBahData) return 0;

        const rateColumn = dependencyStatus === 'WITH_DEPENDENTS' ? 'rate_with_deps' : 'rate_without_deps';
        return nonLocalityBahData[rateColumn] || 0;
    }

    return 0;
};

/**
 * Calculates an estimated federal tax withholding.
 * This is a simplified model and does not account for all deductions and credits.
 * @param totalIncome - The total monthly income.
 * @param filingStatus - The tax filing status (e.g., 'single', 'married').
 * @returns The estimated monthly federal tax.
 */
export const calculateFederalTax = (totalIncome: number, filingStatus: string): number => {
    if (totalIncome <= 0) return 0;

    const annualIncome = totalIncome * 12;

    // Simplified 2024 tax brackets
    const brackets = {
        single: [
            { rate: 0.10, threshold: 0 },
            { rate: 0.12, threshold: 11600 },
            { rate: 0.22, threshold: 47150 },
            { rate: 0.24, threshold: 100525 },
            { rate: 0.32, threshold: 191950 },
            { rate: 0.35, threshold: 243725 },
            { rate: 0.37, threshold: 609350 },
        ],
        married_filing_jointly: [
            { rate: 0.10, threshold: 0 },
            { rate: 0.12, threshold: 23200 },
            { rate: 0.22, threshold: 94300 },
            { rate: 0.24, threshold: 201050 },
            { rate: 0.32, threshold: 383900 },
            { rate: 0.35, threshold: 487450 },
            { rate: 0.37, threshold: 731300 },
        ],
    };

    const selectedBrackets = brackets[filingStatus] || brackets.single;
    let tax = 0;
    let incomeToTax = annualIncome;

    for (let i = selectedBrackets.length - 1; i >= 0; i--) {
        const { rate, threshold } = selectedBrackets[i];
        if (incomeToTax > threshold) {
            tax += (incomeToTax - threshold) * rate;
            incomeToTax = threshold;
        }
    }

    return tax / 12; // Return monthly tax
};
