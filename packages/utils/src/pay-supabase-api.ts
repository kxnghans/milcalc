import { handleApiError, supabase } from "./supabaseClient";
import { Tables } from "./types";

type YosFormat = "base_pay" | "reserve_drill_pay";

/**
 * Consolidates YOS column mapping for base pay and reserve drill pay.
 * Maps 'base_pay' to `yos_over_X` or `yos_2_or_less`
 * Maps 'reserve_drill_pay' to `yos_gt_X` or `yos_le_2`
 */
const getYosColumnSelector = <T extends YosFormat>(
  years_of_service: number,
  format: T,
) => {
  const isBase = format === "base_pay";
  const p = isBase ? "yos_over_" : "yos_gt_";

  if (years_of_service >= 40)
    return `${p}40` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 38)
    return `${p}38` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 36)
    return `${p}36` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 34)
    return `${p}34` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 32)
    return `${p}32` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 30)
    return `${p}30` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 28)
    return `${p}28` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 26)
    return `${p}26` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 24)
    return `${p}24` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 22)
    return `${p}22` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 20)
    return `${p}20` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 18)
    return `${p}18` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 16)
    return `${p}16` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 14)
    return `${p}14` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 12)
    return `${p}12` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 10)
    return `${p}10` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 8)
    return `${p}8` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 6)
    return `${p}6` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 4)
    return `${p}4` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 3)
    return `${p}3` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  if (years_of_service >= 2)
    return `${p}2` as keyof Tables<
      T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
    >;
  return (isBase ? "yos_2_or_less" : "yos_le_2") as keyof Tables<
    T extends "base_pay" ? "base_pay_2024" : "reserve_drill_pay"
  >;
};

/**
 * Fetches the monthly base pay for a given pay grade and years of service.
 * @param pay_grade - The service member's pay grade (e.g., 'O-5').
 * @param years_of_service - The number of years in service.
 * @returns The base pay amount, or null if not found.
 */
export const getBasePay = async (
  pay_grade: string,
  years_of_service: number,
): Promise<number | null> => {
  if (!pay_grade) return null;

  const adjusted_pay_grade = pay_grade.endsWith("E")
    ? pay_grade.slice(0, -1)
    : pay_grade;

  const yearsColumn = getYosColumnSelector(years_of_service, "base_pay");

  const { data, error } = await supabase
    .from("base_pay_2024")
    .select(yearsColumn)
    .eq("pay_grade", adjusted_pay_grade)
    .single();

  if (error) {
    handleApiError("Error fetching base pay", error);
    return null;
  }

  return data
    ? Number((data as Tables<"base_pay_2024">)[yearsColumn]) || 0
    : null;
};

/**
 * Fetches the monthly Basic Allowance for Subsistence (BAS) rate for a given rank type.
 * @param rank - The service member's rank (e.g., 'O-3', 'E-7').
 * @returns The BAS rate, or 0 if not found.
 */
export const getBasRate = async (rank: string): Promise<number> => {
  const rankType = rank.charAt(0).toUpperCase();
  const column: keyof Tables<"bas_rates"> =
    rankType === "O" ? "officer_rate" : "enlisted_rate";

  const { data, error } = await supabase
    .from("bas_rates")
    .select(column)
    .eq("year", 2025)
    .single();

  if (error) {
    handleApiError("Error fetching BAS rate", error);
    return 0;
  }

  return data ? Number((data as Tables<"bas_rates">)[column]) || 0 : 0;
};

/**
 * Fetches the full list of Military Housing Areas (MHAs) grouped by state.
 * @returns An object where keys are state codes and values are arrays of MHA info.
 */
export const getMhaData = async () => {
  const { data, error } = await supabase
    .from("bah_rates_2026")
    .select("state, mha_name, mha")
    .eq("has_dependents", true); // Use one side of the table to get unique MHAs

  if (error) {
    handleApiError("Error fetching MHA data", error);
    return {};
  }

  // Group the flat list of MHAs by state
  const groupedData = data.reduce(
    (
      acc: { [key: string]: { label: string; value: string }[] },
      mha: { state: string | null; mha_name: string | null; mha: string },
    ) => {
      const { state, mha_name, mha: mhaCode } = mha;
      if (state) {
        if (!acc[state]) {
          acc[state] = [];
        }
        acc[state].push({ label: mha_name || "Unknown", value: mhaCode });
      }
      return acc;
    },
    {},
  );

  return groupedData;
};

/**
 * Fetches the specific BAH rate for a given MHA, rank, and dependency status.
 * @param mha - The Military Housing Area code.
 * @param rank - The service member's rank (e.g., 'E-5').
 * @param dependencyStatus - The member's dependency status.
 * @returns The BAH rate, or null if not found.
 */
export const getBahRate = async (
  mha: string,
  rank: string,
  dependencyStatus: "WITH_DEPENDENTS" | "WITHOUT_DEPENDENTS",
): Promise<number | null> => {
  if (!mha || !rank || !dependencyStatus) return null;

  const hasDependents = dependencyStatus === "WITH_DEPENDENTS";

  const parts = rank.split("-");
  const letter = parts[0];
  let number = parts[1];
  let isEnlisted = false;

  if (number.endsWith("E")) {
    isEnlisted = true;
    number = number.slice(0, -1);
  }

  const paddedNumber = number.length === 1 ? "0" + number : number;
  let rankColumn = (letter + paddedNumber).toLowerCase();

  if (isEnlisted) {
    rankColumn += "e";
  }

  // This is a hardcoded list of columns that exist in the table.
  const existingColumns: string[] = [
    "e01",
    "e02",
    "e03",
    "e04",
    "e05",
    "e06",
    "e07",
    "e08",
    "e09",
    "w01",
    "w02",
    "w03",
    "w04",
    "w05",
    "o01e",
    "o02e",
    "o03e",
    "o01",
    "o02",
    "o03",
    "o04",
    "o05",
    "o06",
    "o07",
    "o08",
    "o09",
    "o10",
  ];

  if (!existingColumns.includes(rankColumn)) {
    console.warn(
      `Column ${rankColumn} does not exist in bah_rates_2026. Returning null.`,
    );
    return null;
  }

  const { data, error } = await supabase
    .from("bah_rates_2026")
    .select(rankColumn)
    .eq("mha", mha)
    .eq("has_dependents", hasDependents)
    .single();

  if (error) {
    handleApiError("Error fetching BAH rate from bah_rates_2026", error);
    return null;
  }

  return data
    ? (data as unknown as Record<string, number | null>)[rankColumn]
    : null;
};

export const getPayHelpContent = async (contentKey: string) => {
  if (!contentKey) return null;

  const { data, error } = await supabase
    .from("pay_help_details")
    .select("*")
    .eq("title", contentKey);

  if (error) {
    handleApiError("Error fetching pay help content", error);
    return null;
  }

  return data;
};

export const getFederalTaxData = async (year: number) => {
  const { data, error } = await supabase
    .from("federal_tax_data")
    .select("*")
    .eq("year", year);

  if (error) {
    handleApiError("Error fetching federal tax data", error);
    return [];
  }

  return data || [];
};

export const getStateTaxData = async (year: number) => {
  const { data, error } = await supabase
    .from("state_tax_data")
    .select("*")
    .eq("year", year);

  if (error) {
    handleApiError("Error fetching state tax data", error);
    return [];
  }

  // Sanitize data: Fix CA 1.0 tax rate bug in source data
  const sanitizedData = (data || []).map((row) => {
    if (
      row.state === "CA" &&
      row.income_bracket_low === 0 &&
      row.tax_rate === 1.0
    ) {
      return { ...row, tax_rate: 0.01 };
    }
    return row;
  });

  return sanitizedData;
};

export const getMaxFederalTaxYear = async () => {
  const { data, error } = await supabase
    .from("federal_tax_data")
    .select("year")
    .order("year", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    handleApiError("Error fetching max federal tax year", error);
    return null;
  }
  return data ? data.year : null;
};

export const getMaxStateTaxYear = async () => {
  const { data, error } = await supabase
    .from("state_tax_data")
    .select("year")
    .order("year", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    handleApiError("Error fetching max state tax year", error);
    return null;
  }
  return data ? data.year : null;
};

export const getPayGrades = async () => {
  const { data, error } = await supabase
    .from("base_pay_2024")
    .select("pay_grade");

  if (error) {
    handleApiError("Error fetching pay grades", error);
    return [];
  }

  return data ? data.map((item) => item.pay_grade) : [];
};

export const getReserveDrillPay = async (
  pay_grade: string,
  years_of_service: number,
): Promise<number> => {
  if (!pay_grade) return 0;

  const adjusted_pay_grade = pay_grade.endsWith("E")
    ? pay_grade.slice(0, -1)
    : pay_grade;

  const yearsColumn = getYosColumnSelector(
    years_of_service,
    "reserve_drill_pay",
  );

  const { data, error } = await supabase
    .from("reserve_drill_pay")
    .select(yearsColumn)
    .eq("pay_grade", adjusted_pay_grade)
    .single();

  if (error) {
    handleApiError("Error fetching reserve drill pay", error);
    return 0;
  }

  return data
    ? Number((data as Tables<"reserve_drill_pay">)[yearsColumn]) || 0
    : 0;
};
