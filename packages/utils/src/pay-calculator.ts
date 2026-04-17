import { sumFinancialItems, sumFinancialMap } from "./math-utils";
import { calculateFederalTax, calculateStateTax } from "./tax-utils";
import { DependentStatus, DisabilityPercentage, Tables } from "./types";

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

export const calculatePay = (
  inputs: PayCalculatorInputs,
  federalTaxData: Tables<"federal_tax_data">[],
  stateTaxData: Tables<"state_tax_data">[],
) => {
  const {
    basePay,
    bah,
    bas,
    specialPays,
    additionalIncomes,
    filingStatus,
    additionalDeductions,
    state,
  } = inputs;

  const monthlyBasePayRaw = basePay || 0;
  // Statutory Senior Officer Pay Cap (Executive Level II)
  // For 2024, the cap is $18,444.17 monthly ($221,330 annually)
  const LEVEL_II_CAP = 18444.17;
  const monthlyBasePay =
    monthlyBasePayRaw > LEVEL_II_CAP ? LEVEL_II_CAP : monthlyBasePayRaw;

  const monthlyBah = bah || 0;
  const monthlyBas = bas || 0;
  const monthlySpecialPays = sumFinancialMap(specialPays);
  const monthlyAdditionalIncomes = sumFinancialItems(additionalIncomes);
  const monthlyAdditionalDeductions = sumFinancialItems(additionalDeductions);

  const annualBasePay = monthlyBasePay * 12;
  const annualBah = monthlyBah * 12;
  const annualBas = monthlyBas * 12;
  const annualSpecialPays = monthlySpecialPays * 12;
  const annualAdditionalIncomes = monthlyAdditionalIncomes * 12;
  const annualAdditionalDeductions = monthlyAdditionalDeductions * 12;

  // 1. Correctly define taxable and non-taxable income
  const taxableIncome =
    annualBasePay + annualSpecialPays + annualAdditionalIncomes;
  const nonTaxableIncome = annualBah + annualBas;
  const totalIncome = taxableIncome + nonTaxableIncome;

  // 2. Calculate FICA tax based on taxable income (Military Rule: Base Pay only)
  const FICA_RATE = 0.0765; // 6.2% Social Security + 1.45% Medicare
  const ficaTax = annualBasePay * FICA_RATE;

  // 3. Calculate Federal and State tax based on taxable income
  const capitalizedFilingStatus =
    filingStatus.charAt(0).toUpperCase() + filingStatus.slice(1);
  const federalStandardDeduction =
    federalTaxData.find((row) => row.filing_status === capitalizedFilingStatus)
      ?.standard_deduction || 0;
  const stateStandardDeduction =
    stateTaxData.find(
      (row) =>
        row.state === state && row.filing_status === capitalizedFilingStatus,
    )?.standard_deduction || 0;

  const federalTaxableIncomeForBrackets = Math.max(
    0,
    taxableIncome - federalStandardDeduction - annualAdditionalDeductions,
  );
  const stateTaxableIncomeForBrackets = Math.max(
    0,
    taxableIncome - stateStandardDeduction - annualAdditionalDeductions,
  );

  const federalTax = calculateFederalTax(
    federalTaxableIncomeForBrackets,
    filingStatus,
    federalTaxData,
  );
  const stateTax = calculateStateTax(
    stateTaxableIncomeForBrackets,
    filingStatus,
    state,
    stateTaxData,
  );

  // 4. Return all calculated values
  return {
    totalIncome: totalIncome / 12,
    federalTax: federalTax / 12,
    stateTax: stateTax / 12,
    ficaTax: ficaTax / 12,
    federalStandardDeduction,
    stateStandardDeduction,
  };
};

export const calculateDisabilityIncome = (
  disabilityPercentage: DisabilityPercentage,
  dependentStatus: DependentStatus,
  disabilityData: Tables<"veterans_disability_compensation">[],
): number => {
  if (
    !disabilityPercentage ||
    disabilityPercentage === "0%" ||
    !dependentStatus ||
    dependentStatus === "none" ||
    !disabilityData
  ) {
    return 0;
  }

  const row = disabilityData.find(
    (d) =>
      d.dependent_status.trim().toLowerCase() ===
      dependentStatus.trim().toLowerCase(),
  );

  if (row) {
    // disabilityPercentage is narrowed here to NOT be "0%", but TS might still complain if we index directly
    // because Tables<'veterans_disability_compensation'> Row type doesn't have "0%" as a key.
    const rate =
      row[disabilityPercentage as Exclude<DisabilityPercentage, "0%">];
    return rate === null ? 0 : rate;
  } else {
    return 0;
  }
};

export const calculateNetPayWithDisability = (
  militaryPay: number,
  vaDisabilityPay: number,
) => {
  if (vaDisabilityPay > militaryPay) {
    return {
      paySource: "VA Disability",
      takeHomePay: vaDisabilityPay,
    };
  }
  return {
    paySource: "Military",
    takeHomePay: militaryPay,
  };
};
