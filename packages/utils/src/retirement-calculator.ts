


import { getBasePay } from './pay-supabase-api';

import { Tables } from './types';

type Component = 'Active' | 'Reserve' | 'Guard';
type RetirementSystem = 'High 3' | 'BRS';


export const calculatePension = async (
  component: Component,
  retirementSystem: RetirementSystem,
  high3PayGrade1: string,
  high3PayGrade2: string,
  high3PayGrade3: string,
  yearsOfService: number,
  points: number,
  goodYears: number,
  vaDisabilityPay: number = 0,
  disabilityPercentage: number = 0
): Promise<number> => {
  if (component === 'Active') {
    if (yearsOfService < 20) {
      return 0;
    }
  } else {
    if (goodYears < 20) {
      return 0;
    }
  }

  if (!high3PayGrade1 || !high3PayGrade2 || !high3PayGrade3 || !yearsOfService || yearsOfService < 3) {
    return 0;
  }

  const [pay1, pay2, pay3] = await Promise.all([
    getBasePay(high3PayGrade1, yearsOfService - 2),
    getBasePay(high3PayGrade2, yearsOfService - 1),
    getBasePay(high3PayGrade3, yearsOfService)
  ]);

  if (pay1 === null || pay2 === null || pay3 === null) {
    return 0;
  }

  const high3 = (pay1 + pay2 + pay3) / 3;

  let grossPension = 0;
  if (component === 'Active') {
    const multiplier = retirementSystem === 'High 3' ? 0.025 : 0.02;
    grossPension = high3 * yearsOfService * multiplier;
  } else {
    // Reserve/Guard: Points are capped at 130 per year for pension purposes (Title 10 U.S.C. § 12733)
    const cappedPoints = Math.min(points, goodYears * 130);
    const equivalentYears = cappedPoints / 360;
    const multiplier = retirementSystem === 'High 3' ? 0.025 : 0.02;
    grossPension = high3 * equivalentYears * multiplier;
  }

  // Statutory VA Offset (CRDP Rule):
  // If disability < 50%, retirement pay is reduced dollar-for-dollar by disability pay.
  // If disability >= 50%, the user receives BOTH (CRDP).
  if (disabilityPercentage < 50) {
    return Math.max(0, grossPension - vaDisabilityPay);
  }

  return grossPension;
};



export const calculateTsp = (
  tspAmount: string,
  isTspCalculatorVisible: boolean,
  avgSalary: number,
  contributionPercentage: number,
  years: number,
  retirementSystem: RetirementSystem,
  tspReturn: number
): number => {
  if (!isTspCalculatorVisible) {
    return parseFloat(tspAmount) || 0;
  }

  if (!avgSalary || !contributionPercentage || !years) {
    return 0;
  }

  const userContribution = avgSalary * (contributionPercentage / 100);
  let employerContribution = 0;

  if (retirementSystem === 'BRS') {
    const automaticContribution = avgSalary * 0.01;
    
    // Statutory Tiered Matching: 100% on first 3%, 50% on next 2%
    const userPct = contributionPercentage / 100;
    let matchPct = 0;
    if (userPct > 0) {
      matchPct += Math.min(userPct, 0.03); // 100% match on first 3%
      if (userPct > 0.03) {
        matchPct += Math.min(userPct - 0.03, 0.02) * 0.5; // 50% match on next 2%
      }
    }
    
    const matchingContribution = avgSalary * matchPct;
    employerContribution = automaticContribution + matchingContribution;
  }

  const totalAnnualContribution = userContribution + employerContribution;
  const monthlyContribution = totalAnnualContribution / 12;
  const annualRate = tspReturn / 100;
  const monthlyRate = annualRate / 12;
  const totalMonths = years * 12;

  if (annualRate === 0) {
    return totalAnnualContribution * years;
  }

  // Monthly Compounding Formula: FV = P * [((1 + r)^n - 1) / r]
  const futureValue = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  return futureValue;
};

export const calculateTaxes = (
  grossIncome: number,
  state: string,
  filingStatus: string,
  federalTaxData: Tables<'federal_tax_data'>[],
  stateTaxData: Tables<'state_tax_data'>[]
) => {
  if (!grossIncome || !state || !filingStatus) {
    return { federal: 0, state: 0, federalStandardDeduction: 0, stateStandardDeduction: 0 };
  }

  const capitalizedFilingStatus = filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const federalStandardDeduction = federalTaxData.find(row => row.filing_status === capitalizedFilingStatus)?.standard_deduction || 0;
  const stateStandardDeduction =
    stateTaxData.find(row => row.state === state && row.filing_status === capitalizedFilingStatus)?.standard_deduction || 0;

  const federalTaxableIncomeForBrackets = Math.max(0, grossIncome - federalStandardDeduction);
  const stateTaxableIncomeForBrackets = Math.max(0, grossIncome - stateStandardDeduction);

  const federalTax = calculateFederalTax(federalTaxableIncomeForBrackets, filingStatus, federalTaxData);
  const stateTax = calculateStateTax(stateTaxableIncomeForBrackets, filingStatus, state, stateTaxData);

  return { federal: federalTax > 0 ? federalTax : 0, state: stateTax > 0 ? stateTax : 0, federalStandardDeduction, stateStandardDeduction };
};

const calculateFederalTax = (
  taxableIncome: number,
  filingStatus: string,
  federalTaxData: Tables<'federal_tax_data'>[]
) => {
  const capitalizedFilingStatus = filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const brackets = federalTaxData
    .filter(row => row.filing_status === capitalizedFilingStatus)
    .sort((a, b) => (a.income_bracket_low || 0) - (b.income_bracket_low || 0));

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const bracketMin = bracket.income_bracket_low || 0;
    const bracketMax = bracket.income_bracket_high === 'inf' ? Infinity : parseFloat(bracket.income_bracket_high || '0');
    const taxRate = bracket.tax_rate || 0;

    const incomeInBracket = Math.min(remainingIncome, bracketMax - bracketMin);
    tax += incomeInBracket * taxRate;
    remainingIncome -= incomeInBracket;
  }

  return tax;
};

const calculateStateTax = (
  taxableIncome: number,
  filingStatus: string,
  state: string,
  stateTaxData: Tables<'state_tax_data'>[]
) => {
  const capitalizedFilingStatus = filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const rawBrackets = stateTaxData
    .filter(row => row.state === state && row.filing_status === capitalizedFilingStatus)
    .sort((a, b) => (a.income_bracket_low || 0) - (b.income_bracket_low || 0));

  if (rawBrackets.length === 0) {
    return 0;
  }

  const brackets = rawBrackets.map((bracket, index) => {
    const nextBracket = rawBrackets[index + 1];
    let rate = bracket.tax_rate || 0;

    if (state === 'CA' && bracket.income_bracket_low === 0 && rate === 1.0) {
      rate = 0.01;
    }

    return {
      min: bracket.income_bracket_low || 0,
      max: nextBracket ? (nextBracket.income_bracket_low || 0) - 1 : Infinity,
      rate: rate,
    };
  });

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const bracketSize = bracket.max - bracket.min + 1;
    const incomeInBracket = Math.min(remainingIncome, bracketSize);
    tax += incomeInBracket * bracket.rate;
    remainingIncome -= incomeInBracket;
  }

  return tax;
};

export const getRetirementAge = (
  component: Component,
  birthDate: Date | null,
  serviceEntryDate: Date | null,
  yearsOfService: number,
  breakInService: number,
  qualifyingDeploymentDays: number
): number | null => {
  if (component === 'Active') {
    if (!birthDate || !serviceEntryDate) return null;
    const retirementDate = new Date(serviceEntryDate);
    const totalYears = (yearsOfService || 0) + (breakInService || 0);
    retirementDate.setFullYear(retirementDate.getFullYear() + totalYears);
    
    let ageAtRetirement = retirementDate.getFullYear() - birthDate.getFullYear();
    const m = retirementDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && retirementDate.getDate() < birthDate.getDate())) {
      ageAtRetirement--;
    }
    return ageAtRetirement;
  } else {
    return 60 - Math.floor(qualifyingDeploymentDays / 90) * 0.25;
  }
};
