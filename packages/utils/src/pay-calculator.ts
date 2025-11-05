import { getStateForMha } from './pay-supabase-api';

const parseCurrency = (value: string | number) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value.replace(/[^\d.-]/g, '')) || 0;
  return 0;
};

export const calculatePay = async (inputs, federalTaxData, stateTaxData) => {
  const { basePay, bah, bas, specialPays, additionalIncomes, filingStatus, mha, additionalDeductions, state } = inputs;

  const monthlyBasePay = basePay || 0;
  const monthlyBah = bah || 0;
  const monthlyBas = bas || 0;
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

  const federalTax = calculateFederalTax(federalTaxableIncomeForBrackets, filingStatus, federalTaxData);
  const stateTax = calculateStateTax(stateTaxableIncomeForBrackets, filingStatus, state, stateTaxData);

  // 4. Return all calculated values
  return { totalIncome: totalIncome / 12, federalTax: federalTax / 12, stateTax: stateTax / 12, ficaTax: ficaTax / 12, federalStandardDeduction, stateStandardDeduction };
};
const calculateFederalTax = (taxableIncome, filingStatus, federalTaxData) => {
  const capitalizedFilingStatus = filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const brackets = federalTaxData
    .filter(row => row.filing_status === capitalizedFilingStatus)
    .sort((a, b) => parseFloat(a.income_bracket_low) - parseFloat(b.income_bracket_low));

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const bracketMin = parseFloat(bracket.income_bracket_low);
    const bracketMax = bracket.income_bracket_high === 'inf' ? Infinity : parseFloat(bracket.income_bracket_high);
    const taxRate = parseFloat(bracket.tax_rate);

    const incomeInBracket = Math.min(remainingIncome, bracketMax - bracketMin);
    tax += incomeInBracket * taxRate;
    remainingIncome -= incomeInBracket;
  }

  return tax;
};

const calculateStateTax = (taxableIncome, filingStatus, state, stateTaxData) => {
  const capitalizedFilingStatus = filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const rawBrackets = stateTaxData
    .filter(row => row.state === state && row.filing_status === capitalizedFilingStatus)
    .sort((a, b) => parseFloat(a.income_bracket_low) - parseFloat(b.income_bracket_low));

  if (rawBrackets.length === 0) {
    return 0;
  }

  // Reconstruct brackets from the flawed data structure
  const brackets = rawBrackets.map((bracket, index) => {
    const nextBracket = rawBrackets[index + 1];
    let rate = parseFloat(bracket.tax_rate);

    // Hardcoded fix for incorrect tax rate in the data for CA's first bracket
    if (state === 'CA' && parseFloat(bracket.income_bracket_low) === 0 && rate === 1.0) {
      rate = 0.01;
    }

    return {
      min: parseFloat(bracket.income_bracket_low),
      max: nextBracket ? parseFloat(nextBracket.income_bracket_low) - 1 : Infinity, // -1 to make it non-overlapping
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