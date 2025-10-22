import { getStateForMha } from './pay-supabase-api';

const parseCurrency = (value: string | number) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  return 0;
};

export const calculatePay = async (inputs, federalTaxData, stateTaxData) => {
  const { basePay, bah, bas, specialPays, additionalIncomes, filingStatus, mha, additionalDeductions, state } = inputs;

  const monthlyBasePay = basePay;
  const monthlyBah = bah;
  const monthlyBas = bas;
  const monthlySpecialPays = Object.values(specialPays).reduce((a, b) => a + parseCurrency(b), 0);
  const monthlyAdditionalIncomes = additionalIncomes.reduce((sum, item) => sum + parseCurrency(item.amount), 0);
  const monthlyAdditionalDeductions = additionalDeductions.reduce((sum, item) => sum + parseCurrency(item.amount), 0);

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

  console.log({taxableIncome, federalStandardDeduction, stateStandardDeduction, federalTaxableIncomeForBrackets, stateTaxableIncomeForBrackets});

  const federalTax = calculateFederalTax(federalTaxableIncomeForBrackets, filingStatus, federalTaxData);
  const stateTax = calculateStateTax(stateTaxableIncomeForBrackets, filingStatus, state, stateTaxData);

  // 4. Return all calculated values
  return { totalIncome: totalIncome / 12, federalTax: federalTax / 12, stateTax: stateTax / 12, ficaTax: ficaTax / 12, federalStandardDeduction, stateStandardDeduction };
};
const calculateFederalTax = (taxableIncome, filingStatus, federalTaxData) => {
  const capitalizedFilingStatus = filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const brackets = federalTaxData.filter(row => row.filing_status === capitalizedFilingStatus);
  let tax = 0;
  let remainingTaxableIncome = taxableIncome;

  for (const bracket of brackets) {
    const bracketMin = parseFloat(bracket.income_bracket_low);
    const bracketMax = bracket.income_bracket_high === 'inf' ? Infinity : parseFloat(bracket.income_bracket_high);
    const taxRate = parseFloat(bracket.tax_rate);

    if (remainingTaxableIncome <= 0) break;

    // Calculate the portion of the remaining taxable income that falls into this bracket
    const amountInThisBracket = Math.min(remainingTaxableIncome, bracketMax) - bracketMin;

    if (amountInThisBracket > 0) {
      tax += amountInThisBracket * taxRate;
      remainingTaxableIncome -= amountInThisBracket;
    }
  }
  return tax;
};

const calculateStateTax = (taxableIncome, filingStatus, state, stateTaxData) => {
  const capitalizedFilingStatus = filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const brackets = stateTaxData.filter(row => row.state === state && row.filing_status === capitalizedFilingStatus);
  let tax = 0;
  let remainingTaxableIncome = taxableIncome;

  for (const bracket of brackets) {
    const bracketMin = parseFloat(bracket.income_bracket_low);
    const bracketMax = bracket.income_bracket_high === 'inf' ? Infinity : parseFloat(bracket.income_bracket_high);
    const taxRate = parseFloat(bracket.tax_rate);

    if (remainingTaxableIncome <= 0) break;

    // Calculate the portion of the remaining taxable income that falls into this bracket
    const amountInThisBracket = Math.min(remainingTaxableIncome, bracketMax) - bracketMin;

    if (amountInThisBracket > 0) {
      tax += amountInThisBracket * taxRate;
      remainingTaxableIncome -= amountInThisBracket;
    }
  }
  return tax;
};