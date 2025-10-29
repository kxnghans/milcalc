
import { getBasePay } from './pay-supabase-api';
import { getDisabilityData } from './disability-supabase-api';

export const calculatePension = async (component, retirementSystem, high3PayGrade1, high3PayGrade2, high3PayGrade3, yearsOfService, points, goodYears) => {

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



  const pay1 = await getBasePay(high3PayGrade1, yearsOfService - 2);

  const pay2 = await getBasePay(high3PayGrade2, yearsOfService - 1);

  const pay3 = await getBasePay(high3PayGrade3, yearsOfService);



  const high3 = (pay1 + pay2 + pay3) / 3;



  if (component === 'Active') {

    const multiplier = retirementSystem === 'High 3' ? 0.025 : 0.02;

    return high3 * yearsOfService * multiplier;

  } else {

    // Note: For Reserve/Guard, this calculation uses current pay tables as an estimate.

    // A fully accurate calculation would require future pay tables for the year the member begins drawing retired pay.

    const equivalentYears = points / 360;

    const multiplier = retirementSystem === 'High 3' ? 0.025 : 0.02;

    return high3 * equivalentYears * multiplier;

  }

};

export const calculateDisabilityIncome = async (disabilityPercentage, dependentStatus) => {
  if (!disabilityPercentage || !dependentStatus || dependentStatus === 'none') {
    return 0;
  }

  const disabilityData = await getDisabilityData();
  const row = disabilityData.find(d => d.dependent_status === dependentStatus);

  if (row) {
    return row[disabilityPercentage];
  } else {
  }
};

export const calculateTsp = (tspAmount, isTspCalculatorVisible, avgSalary, contributionPercentage, years, retirementSystem, tspReturn) => {
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
    const matchingContribution = Math.min(avgSalary * 0.04, userContribution);
    employerContribution = automaticContribution + matchingContribution;
  }

  const totalAnnualContribution = userContribution + employerContribution;
  const rate = tspReturn / 100;

  if (rate === 0) {
    return totalAnnualContribution * years;
  }

  const futureValue = totalAnnualContribution * ( (Math.pow(1 + rate, years) - 1) / rate );

  return futureValue;
};

export const calculateTaxes = (grossIncome, state, filingStatus, federalTaxData, stateTaxData) => {
  if (!grossIncome || !state || !filingStatus) {
    return { federal: 0, state: 0, federalStandardDeduction: 0, stateStandardDeduction: 0 };
  }

  const capitalizedFilingStatus = filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const federalStandardDeduction = federalTaxData.find(row => row.filing_status === capitalizedFilingStatus)?.standard_deduction || 0;
  const stateStandardDeduction = stateTaxData.find(row => row.state === state && row.filing_status === capitalizedFilingStatus)?.standard_deduction || 0;

  const federalTaxableIncomeForBrackets = Math.max(0, grossIncome - federalStandardDeduction);
  const stateTaxableIncomeForBrackets = Math.max(0, grossIncome - stateStandardDeduction);

  const federalTax = calculateFederalTax(federalTaxableIncomeForBrackets, filingStatus, federalTaxData);
  const stateTax = calculateStateTax(stateTaxableIncomeForBrackets, filingStatus, state, stateTaxData);

  return { federal: federalTax > 0 ? federalTax : 0, state: stateTax > 0 ? stateTax : 0, federalStandardDeduction, stateStandardDeduction };
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
  const brackets = stateTaxData
    .filter(row => row.state === state && row.filing_status === capitalizedFilingStatus)
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

