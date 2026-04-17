/**
 * @file math-utils.ts
 * @description Standardized mathematical and financial calculation utilities.
 */

/**
 * Parses a currency string or number into a valid float.
 * Removes symbols like $, commas, etc.
 */
export const parseCurrency = (
  value: string | number | null | undefined,
): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    return parseFloat(value.replace(/[^\d.-]/g, "")) || 0;
  }
  return 0;
};

/**
 * Standardized reducer for summing an array of items with a numeric or string amount.
 */
export const sumFinancialItems = <T extends { amount: string | number }>(
  items: T[] | null | undefined,
): number => {
  if (!items) return 0;
  return items.reduce((sum, item) => sum + parseCurrency(item.amount), 0);
};

/**
 * Standardized reducer for summing the values of an object (map).
 */
export const sumFinancialMap = (
  map: { [key: string]: string | number } | null | undefined,
): number => {
  if (!map) return 0;
  return Object.values(map).reduce(
    (sum: number, val: string | number) => sum + parseCurrency(val),
    0,
  );
};
