import {
  parseAgeRange,
  parsePerformanceRange,
  timeToSeconds,
} from "./pt-utils";
import { PtPerformance, PtStandard, Tables } from "./types";

/**
 * Determines the appropriate age group string based on age.
 */
export const getAgeGroupString = (age: number): string | null => {
  if (age < 25) return "<25";
  if (age >= 25 && age <= 29) return "25-29";
  if (age >= 30 && age <= 34) return "30-34";
  if (age >= 35 && age <= 39) return "35-39";
  if (age >= 40 && age <= 44) return "40-44";
  if (age >= 45 && age <= 49) return "45-49";
  if (age >= 50 && age <= 54) return "50-54";
  if (age >= 55 && age <= 59) return "55-59";
  if (age >= 60) return "60+";
  return null;
};

/**
 * Finds the score and health risk category for a given performance value.
 */
export const findScore = (
  standards: PtStandard[],
  performanceValue: number,
  higherIsBetter: boolean,
  rawMeasurement?: string,
): { points: number; healthRiskCategory: string | null } => {
  // 1. Try exact string match first if rawMeasurement is provided
  if (rawMeasurement) {
    const exact = standards.find((s) => s.measurement === rawMeasurement);
    if (exact) {
      return {
        points: exact.points,
        healthRiskCategory: exact.healthRiskCategory ?? null,
      };
    }
  }

  let bestMatch: PtStandard | null = null;
  let limitValue = higherIsBetter ? -1 : Infinity;

  for (const s of standards) {
    const [min, max] =
      s.performanceRange || parsePerformanceRange(s.measurement);

    let match = false;
    if (higherIsBetter) {
      match = performanceValue >= min;
    } else {
      match = performanceValue <= max;
    }

    if (match) {
      if (higherIsBetter) {
        // We want the HIGHEST threshold we have met (the largest min)
        if (min > limitValue) {
          limitValue = min;
          bestMatch = s;
        } else if (
          min === limitValue &&
          (!bestMatch || s.points > bestMatch.points)
        ) {
          // Tie-breaker: take higher points if thresholds are equal
          bestMatch = s;
        }
      } else {
        // We want the LOWEST threshold we are under (the smallest max)
        if (max < limitValue) {
          limitValue = max;
          bestMatch = s;
        } else if (
          max === limitValue &&
          (!bestMatch || s.points > bestMatch.points)
        ) {
          // Tie-breaker
          bestMatch = s;
        }
      }
    }
  }

  return {
    points: bestMatch ? bestMatch.points : 0,
    healthRiskCategory: bestMatch
      ? (bestMatch.healthRiskCategory ?? null)
      : null,
  };
};

/**
 * Gets the maximum points possible for a given exercise component.
 */
export const getMaxScoreForExercise = (component: string): number => {
  if (
    component === "run" ||
    component === "run_2mile" ||
    component === "shuttles" ||
    component === "shuttles_20m" ||
    component === "walk"
  )
    return 50;
  if (component === "whtr") return 20;
  return 15;
};

/**
 * Gets semantic min/max thresholds for muscular components.
 */
export const getMinMaxValues = (standards: PtStandard[], component: string) => {
  const compStandards = standards.filter((s) => s.exercise === component);
  if (compStandards.length === 0) return { min: 0, max: 0 };

  const passThreshold = getPerformanceForScore(standards, component, 0.1);
  const maxPoints = Math.max(...compStandards.map((s) => s.points));
  const maxPointsThreshold = getPerformanceForScore(
    standards,
    component,
    maxPoints,
  );

  return { min: passThreshold, max: maxPointsThreshold };
};

/**
 * Gets performance value required to achieve a target score.
 */
export const getPerformanceForScore = (
  standards: PtStandard[],
  component: string,
  targetScore: number,
): number => {
  const comp =
    component === "run"
      ? "run_2mile"
      : component === "shuttles"
        ? "shuttles_20m"
        : component;
  const candidates = standards.filter(
    (s) => s.exercise === comp && s.points >= targetScore,
  );
  if (candidates.length === 0) {
    const allComp = standards.filter((s) => s.exercise === comp);
    if (allComp.length === 0) return 0;
    const allValues = allComp.map(
      (c) => parsePerformanceRange(c.measurement)[0],
    );
    return comp === "run_2mile"
      ? Math.min(...allValues)
      : Math.max(...allValues);
  }

  const higherIsBetter = !(comp === "run_2mile");
  const values = candidates.map((c) => {
    const [min, max] =
      c.performanceRange || parsePerformanceRange(c.measurement);
    return higherIsBetter ? min : max;
  });

  return higherIsBetter ? Math.min(...values) : Math.max(...values);
};

/**
 * Gets semantic min/max thresholds for cardio components.
 */
export const getCardioMinMaxValues = (
  standards: PtStandard[],
  passFailStandards: Tables<"pt_pass_fail_standards">[],
  component: string,
) => {
  if (component === "walk") {
    const s = passFailStandards.find((s) => s.exercise_type === "walk_2km");
    return { min: s ? timeToSeconds(s.min_performance) : 0, max: 0 };
  }

  const comp =
    component === "run"
      ? "run_2mile"
      : component === "shuttles"
        ? "shuttles_20m"
        : component;
  const compStandards = standards.filter((s) => s.exercise === comp);
  if (compStandards.length === 0) return { min: 0, max: 0 };

  const passThreshold = getPerformanceForScore(standards, comp, 0.1);
  const maxPoints = Math.max(...compStandards.map((s) => s.points));
  const maxPointsThreshold = getPerformanceForScore(standards, comp, maxPoints);

  return { min: passThreshold, max: maxPointsThreshold };
};

/**
 * Gets dynamic help text for a specific performance.
 * Note: getScoreForExercise expected to be provided or imported from pt-calculator.
 * To avoid circular dependency, we might need to pass it in or move it here.
 */
export const getDynamicHelpText = (
  componentKey: string,
  age: number,
  gender: string,
  performance: PtPerformance,
  score: number,
): string => {
  if (!age || !gender) return "";
  let perfText = "";
  if (performance.reps) perfText = `${performance.reps} reps`;
  else if (performance.minutes || performance.seconds)
    perfText = `${performance.minutes || 0}:${String(performance.seconds || 0).padStart(2, "0")}`;
  else if (performance.shuttles) perfText = `${performance.shuttles} shuttles`;

  return perfText
    ? `For a ${age}-year-old ${gender}, ${perfText} results in ${score.toFixed(2)} points.`
    : "";
};
