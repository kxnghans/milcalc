

import { Tables, Json } from './types';



const parseCurrency = (value: string | number) => {

  if (typeof value === 'number') return value;

  if (typeof value === 'string') return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;

  return 0;

};



interface PayCalculatorInputs {

  basePay: number;

  bah: number;

  bas: number;

  specialPays: { [key: string]: string | number };

  additionalIncomes: { name: string; amount: string | number }[];

  filingStatus: string;

  mha: string;

  additionalDeductions: { name: string; amount: string | number }[];

  state: string;

}

type DependentStatus = 'veteran alone' | 'veteran with spouse' | 'veteran with spouse and one parent' | 'none' | 'veteran with spouse only';
type DisabilityPercentage = "10%" | "20%" | "30%" | "40%" | "50%" | "60%" | "70%" | "80%" | "90%" | "100%";


export const calculatePay = (

  inputs: PayCalculatorInputs,

  federalTaxData: Tables<'federal_tax_data'>[],

  stateTaxData: Tables<'state_tax_data'>[]

) => {

  const { basePay, bah, bas, specialPays, additionalIncomes, filingStatus, mha, additionalDeductions, state } = inputs;



  const monthlyBasePay = basePay || 0;

  const monthlyBah = bah || 0;

  const monthlyBas = bas || 0;

  const monthlySpecialPays = Object.values(specialPays).reduce((a: number, b: string | number) => a + parseCurrency(b), 0);

  const monthlyAdditionalIncomes = additionalIncomes.reduce(

    (sum: number, item: { amount: string | number }) => sum + parseCurrency(item.amount),

    0

  );

  const monthlyAdditionalDeductions = additionalDeductions.reduce(

    (sum: number, item: { amount: string | number }) => sum + parseCurrency(item.amount),

    0

  );



  const annualBasePay = monthlyBasePay * 12;

  const annualBah = monthlyBah * 12;

  const annualBas = monthlyBas * 12;

  const annualSpecialPays = monthlySpecialPays * 12;

  const annualAdditionalIncomes = monthlyAdditionalIncomes * 12;

  const annualAdditionalDeductions = monthlyAdditionalDeductions * 12;



  // 1. Correctly define taxable and non-taxable income

  const taxableIncome = annualBasePay + annualSpecialPays + annualAdditionalIncomes;

  const nonTaxableIncome = annualBah + annualBas;

  const totalIncome = taxableIncome + nonTaxableIncome;



  // 2. Calculate FICA tax based on taxable income

  const FICA_RATE = 0.0765; // 6.2% Social Security + 1.45% Medicare

  const ficaTax = taxableIncome * FICA_RATE;



  // 3. Calculate Federal and State tax based on taxable income

  const capitalizedFilingStatus = filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);

  const federalStandardDeduction = federalTaxData.find(row => row.filing_status === capitalizedFilingStatus)?.standard_deduction || 0;

  const stateStandardDeduction = stateTaxData.find(row => row.state === state && row.filing_status === capitalizedFilingStatus)?.standard_deduction || 0;



  const federalTaxableIncomeForBrackets = Math.max(0, taxableIncome - federalStandardDeduction - annualAdditionalDeductions);

  const stateTaxableIncomeForBrackets = Math.max(0, taxableIncome - stateStandardDeduction - annualAdditionalDeductions);



  const federalTax = calculateFederalTax(federalTaxableIncomeForBrackets, filingStatus, federalTaxData);

  const stateTax = calculateStateTax(stateTaxableIncomeForBrackets, filingStatus, state, stateTaxData);



  // 4. Return all calculated values

  return { totalIncome: totalIncome / 12, federalTax: federalTax / 12, stateTax: stateTax / 12, ficaTax: ficaTax / 12, federalStandardDeduction, stateStandardDeduction };

};

export const calculateDisabilityIncome = (
    disabilityPercentage: DisabilityPercentage,
    dependentStatus: DependentStatus,
    disabilityData: Tables<'veterans_disability_compensation'>[]
  ): number => {
    if (!disabilityPercentage || !dependentStatus || dependentStatus === 'none' || !disabilityData) {
      return 0;
    }
  
    const row = disabilityData.find(d => d.dependent_status.trim().toLowerCase() === dependentStatus.trim().toLowerCase());
  
    if (row) {
      const rate = row[disabilityPercentage];
      return rate === null ? 0 : rate;
    } else {
      return 0;
    }
  };

  export const calculateNetPayWithDisability = (
    militaryPay: number,
    vaDisabilityPay: number
  ) => {
    if (vaDisabilityPay > militaryPay) {
      return {
        paySource: 'VA Disability',
        takeHomePay: vaDisabilityPay,
      };
    }
    return {
      paySource: 'Military',
      takeHomePay: militaryPay,
    };
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



  // Reconstruct brackets from the flawed data structure

  const brackets = rawBrackets.map((bracket, index) => {

    const nextBracket = rawBrackets[index + 1];

    let rate = bracket.tax_rate || 0;



    // Hardcoded fix for incorrect tax rate in the data for CA's first bracket

    if (state === 'CA' && bracket.income_bracket_low === 0 && rate === 1.0) {

      rate = 0.01;

    }



    return {

      min: bracket.income_bracket_low || 0,

      max: nextBracket ? (nextBracket.income_bracket_low || 0) - 1 : Infinity, // -1 to make it non-overlapping

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