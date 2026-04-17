import { Tables } from "./types";

export const calculateFederalTax = (
  taxableIncome: number,
  filingStatus: string,
  federalTaxData: Tables<"federal_tax_data">[],
) => {
  const capitalizedFilingStatus =
    filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const brackets = federalTaxData
    .filter((row) => row.filing_status === capitalizedFilingStatus)
    .sort((a, b) => (a.income_bracket_low || 0) - (b.income_bracket_low || 0));

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const bracketMin = bracket.income_bracket_low || 0;
    const bracketMax =
      bracket.income_bracket_high === "inf"
        ? Infinity
        : parseFloat(bracket.income_bracket_high || "0");
    const taxRate = bracket.tax_rate || 0;

    const incomeInBracket = Math.min(remainingIncome, bracketMax - bracketMin);
    tax += incomeInBracket * taxRate;
    remainingIncome -= incomeInBracket;
  }

  return tax;
};

export const calculateStateTax = (
  taxableIncome: number,
  filingStatus: string,
  state: string,
  stateTaxData: Tables<"state_tax_data">[],
) => {
  const capitalizedFilingStatus =
    filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const rawBrackets = stateTaxData
    .filter(
      (row) =>
        row.state === state && row.filing_status === capitalizedFilingStatus,
    )
    .sort((a, b) => (a.income_bracket_low || 0) - (b.income_bracket_low || 0));

  if (rawBrackets.length === 0) {
    return 0;
  }

  const brackets = rawBrackets.map((bracket, index) => {
    const nextBracket = rawBrackets[index + 1];
    let rate = bracket.tax_rate || 0;

    if (state === "CA" && bracket.income_bracket_low === 0 && rate === 1.0) {
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
