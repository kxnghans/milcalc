// A simple utility to parse currency strings into numbers
export const parseCurrency = (value: string | number) => {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    return parseFloat(value.replace(/[^\d.-]/g, "")) || 0;
  }
  return 0; // Return 0 if value is undefined, null, etc.
};
