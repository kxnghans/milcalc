/**
 * @file pt-utils.ts
 * @description Utility functions for PT scoring and measurement parsing.
 */

/**
 * Converts a time string (e.g., "mm:ss", "mm:ss*", "<= 15:30") to seconds.
 */
export const timeToSeconds = (time: string | number | null): number => {
  if (time === null || time === undefined) return 0;
  const timeStr = String(time).trim();
  if (!timeStr || timeStr.toUpperCase() === "N/A") return 0;

  // Remove prefixes and artifacts
  const cleaned = timeStr.replace(/[<>=* ]/g, "");
  const parts = cleaned.split(":").map(Number);

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return isNaN(Number(cleaned)) ? 0 : Number(cleaned);
};

/**
 * Parses a performance string into a numeric range [min, max].
 */
export const parsePerformanceRange = (
  perf: string | number | null,
): [number, number] => {
  if (perf === null || perf === undefined) return [0, 0];
  const s = String(perf).trim();

  // Range format "X-Y"
  if (s.includes("-")) {
    const parts = s.split("-").map((p) => p.trim());
    if (parts.length === 2) {
      const minStr = parts[0];
      const maxStr = parts[1];
      const min = minStr.includes(":")
        ? timeToSeconds(minStr)
        : parseFloat(minStr.replace(/[<>=* ]/g, ""));
      const max = maxStr.includes(":")
        ? timeToSeconds(maxStr)
        : parseFloat(maxStr.replace(/[<>=* ]/g, ""));
      if (!isNaN(min) && !isNaN(max)) {
        return [min, max];
      }
    }
  }

  // Single value or prefix/suffix (>=, <=, *, etc)
  const val = s.includes(":")
    ? timeToSeconds(s)
    : parseFloat(s.replace(/[<>=* ]/g, "")) || 0;

  if (s.includes(">=") || s.includes(">")) {
    return [val, Infinity];
  }
  if (s.includes("<=") || s.includes("<")) {
    return [-Infinity, val];
  }

  return [val, val];
};

/**
 * Parses an age range string (e.g., "25-29", "60+", "<25") into [min, max].
 */
export const parseAgeRange = (rangeStr: string | null): [number, number] => {
  if (!rangeStr) return [0, 0];
  const s = String(rangeStr).trim();

  if (s.includes("+")) {
    const min = parseInt(s.replace(/[^0-9]/g, ""));
    return [isNaN(min) ? 0 : min, 999];
  }

  if (s.startsWith("<")) {
    const max = parseInt(s.replace(/[^0-9]/g, "")) - 1;
    return [0, isNaN(max) ? 0 : max];
  }

  if (s.includes("-")) {
    const parts = s
      .split("-")
      .map((p) => parseInt(p.trim().replace(/[^0-9]/g, "")));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return [parts[0], parts[1]];
    }
  }

  const val = parseInt(s.replace(/[^0-9]/g, ""));
  return isNaN(val) ? [0, 0] : [val, val];
};
