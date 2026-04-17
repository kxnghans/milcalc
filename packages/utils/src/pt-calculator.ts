/**
 * @file pt-calculator.ts
 * @description This file contains the core logic for calculating Air Force Physical Fitness (PT) scores.
 * It uses a unified schema and human-readable performance strings from the database.
 */

import {
  findScore,
  getAgeGroupString,
  getPerformanceForScore,
} from "./pt-lookup";
import { parseAgeRange, timeToSeconds } from "./pt-utils";
import { PtInputs, PtPerformance, PtStandard, Tables } from "./types";

/**
 * Calculates score for WHtR.
 */
export const getWhtrScore = (
  standards: PtStandard[],
  whtr: number,
): { points: number; healthRiskCategory: string | null } => {
  if (!whtr) return { points: 0, healthRiskCategory: null };
  // Force 2-decimal rounding before comparison to prevent "rounding into failure"
  const roundedWhtr = parseFloat(whtr.toFixed(2));
  return findScore(
    standards.filter((s) => s.exercise === "whtr"),
    roundedWhtr,
    false,
  ); // Lower is better for WHtR
};

/**
 * Calculates score and health risk for any exercise.
 */
export const getScoreForExercise = (
  standards: PtStandard[],
  component: string,
  performance: PtPerformance,
  altitudeGroup?: string,
  altitudeCorrections?: Tables<"pt_altitude_corrections">[],
  rawMeasurement?: string,
): { points: number; healthRiskCategory: string | null } => {
  const componentStandards = standards.filter((s) => s.exercise === component);
  if (componentStandards.length === 0)
    return { points: 0, healthRiskCategory: null };

  let perfValue = 0;
  let higherIsBetter = true;

  if (component === "run" || component === "run_2mile") {
    higherIsBetter = false;
    perfValue = (performance.minutes || 0) * 60 + (performance.seconds || 0);
    if (perfValue === 0) return { points: 0, healthRiskCategory: null };

    // Apply correction
    if (altitudeGroup && altitudeGroup !== "normal" && altitudeCorrections) {
      const correction = altitudeCorrections.find(
        (c) =>
          c.exercise_type === "run_2mile" &&
          c.altitude_group === altitudeGroup &&
          perfValue >= timeToSeconds(c.perf_start) &&
          perfValue <= timeToSeconds(c.perf_end),
      );
      if (correction) perfValue -= correction.correction;
    }
  } else if (component === "shuttles" || component === "shuttles_20m") {
    perfValue = performance.shuttles || 0;
    higherIsBetter = true;

    if (altitudeGroup && altitudeGroup !== "normal" && altitudeCorrections) {
      const correction = altitudeCorrections.find(
        (c) =>
          c.exercise_type === "shuttles_20m" &&
          c.altitude_group === altitudeGroup,
      );
      if (correction) perfValue += correction.correction;
    }
  } else if (component === "forearm_plank_time") {
    perfValue = (performance.minutes || 0) * 60 + (performance.seconds || 0);
    higherIsBetter = true;
  } else {
    perfValue = performance.reps || 0;
    higherIsBetter = true;
  }

  return findScore(
    componentStandards,
    perfValue,
    higherIsBetter,
    rawMeasurement,
  );
};

/**
 * Checks if the walk test passes.
 */
export const checkWalkPass = (
  age: number,
  gender: string,
  minutes: number,
  seconds: number,
  passFailStandards: Tables<"pt_pass_fail_standards">[],
  walkAltitudeThresholds: Tables<"pt_altitude_walk_thresholds">[],
  altitudeGroup?: string,
): "pass" | "fail" | "n/a" => {
  const userTime = minutes * 60 + seconds;
  if (userTime === 0) return "n/a";

  let maxTime = 0;

  if (altitudeGroup && altitudeGroup !== "normal" && walkAltitudeThresholds) {
    const threshold = walkAltitudeThresholds.find((t) => {
      const [min, max] = parseAgeRange(t.age_range);
      return (
        t.sex.toLowerCase() === gender.toLowerCase() &&
        t.altitude_group === altitudeGroup &&
        age >= min &&
        age <= max
      );
    });
    if (threshold) maxTime = timeToSeconds(threshold.max_time);
  } else {
    const ageGroup = getAgeGroupString(age);
    const standard = passFailStandards.find(
      (s) =>
        s.exercise_type === "walk_2km" &&
        s.gender.toLowerCase() === gender.toLowerCase() &&
        s.age_group === ageGroup,
    );
    if (standard) maxTime = timeToSeconds(standard.min_performance);
  }

  if (!maxTime) return "n/a";
  return userTime <= maxTime ? "pass" : "fail";
};

/**
 * Main calculation entry point.
 */
export const calculatePtScore = (
  inputs: PtInputs,
  standards: PtStandard[],
  passFailStandards: Tables<"pt_pass_fail_standards">[],
  altitudeCorrections: Tables<"pt_altitude_corrections">[],
  walkAltitudeThresholds: Tables<"pt_altitude_walk_thresholds">[],
) => {
  if (inputs.age == null || !inputs.gender) {
    return {
      totalScore: 0,
      cardioScore: 0,
      pushupScore: 0,
      coreScore: 0,
      whtrScore: 0,
      isPass: false,
      walkPassed: "n/a",
      cardioRiskCategory: null as string | null,
      whtrRiskCategory: null as string | null,
    };
  }

  let earnedPoints = 0;
  let totalPossiblePoints = 100;
  let cardioRiskCategory: string | null = null;
  let whtrRiskCategory: string | null = null;

  // WHtR
  let whtrScore: number | string = 0;
  if (inputs.isWhtrExempt) {
    whtrScore = "Exempt";
    totalPossiblePoints -= 20;
  } else {
    const res = getWhtrScore(standards, inputs.whtr || 0);
    whtrScore = res.points;
    whtrRiskCategory = res.healthRiskCategory;
    earnedPoints += res.points;
  }

  // Strength
  let pushupScore: number | string = 0;
  if (inputs.isStrengthExempt) {
    pushupScore = "Exempt";
    totalPossiblePoints -= 15;
  } else {
    const res = getScoreForExercise(standards, inputs.pushupComponent, {
      reps: inputs.pushups,
    });
    pushupScore = res.points;
    earnedPoints += res.points;
  }

  // Core
  let coreScore: number | string = 0;
  if (inputs.isCoreExempt) {
    coreScore = "Exempt";
    totalPossiblePoints -= 15;
  } else {
    const perf =
      inputs.coreComponent === "forearm_plank_time"
        ? { minutes: inputs.plankMinutes, seconds: inputs.plankSeconds }
        : {
            reps:
              inputs.coreComponent === "sit_ups_1min"
                ? inputs.situps
                : inputs.reverseCrunches,
          };
    const res = getScoreForExercise(standards, inputs.coreComponent, perf);
    coreScore = res.points;
    earnedPoints += res.points;
  }

  // Cardio
  let cardioScore: number | string = 0;
  let walkPassed: "pass" | "fail" | "n/a" = "n/a";
  if (inputs.isCardioExempt) {
    cardioScore = "Exempt";
    totalPossiblePoints -= 50;
  } else if (inputs.cardioComponent === "walk") {
    walkPassed = checkWalkPass(
      inputs.age,
      inputs.gender,
      inputs.walkMinutes || 0,
      inputs.walkSeconds || 0,
      passFailStandards,
      walkAltitudeThresholds,
      inputs.altitudeGroup,
    );
    totalPossiblePoints -= 50;
  } else {
    const res = getScoreForExercise(
      standards,
      inputs.cardioComponent === "run" ? "run_2mile" : "shuttles_20m",
      {
        minutes: inputs.runMinutes,
        seconds: inputs.runSeconds,
        shuttles: inputs.shuttles,
      },
      inputs.altitudeGroup,
      altitudeCorrections,
    );
    cardioScore = res.points;
    cardioRiskCategory = res.healthRiskCategory;
    earnedPoints += res.points;
  }

  const compositeScore =
    totalPossiblePoints > 0 ? (earnedPoints / totalPossiblePoints) * 100 : 100;

  // Note: The 2025 model defines pass as composite >= 75 AND meeting component minimums.
  // In our CSV, minimums are the absolute lowest value that yields > 0 points.
  const isPass =
    compositeScore >= 75 &&
    (inputs.isStrengthExempt ||
      (typeof pushupScore === "number" && pushupScore > 0)) &&
    (inputs.isCoreExempt || (typeof coreScore === "number" && coreScore > 0)) &&
    (inputs.isCardioExempt ||
      (inputs.cardioComponent === "walk"
        ? walkPassed === "pass"
        : typeof cardioScore === "number" && cardioScore > 0)) &&
    (inputs.isWhtrExempt || (typeof whtrScore === "number" && whtrScore > 0));

  return {
    totalScore: compositeScore,
    cardioScore,
    pushupScore,
    coreScore,
    whtrScore,
    isPass,
    walkPassed,
    cardioRiskCategory,
    whtrRiskCategory,
  };
};

/**
 * Calculates the best possible total score from a set of individual exercise scores.
 */
export const calculateBestScore = (scores: {
  [key: string]: number | string;
}): number => {
  let totalPossiblePoints = 100;
  let earnedPoints = 0;

  const whtrScore = typeof scores.whtr === "number" ? scores.whtr : 0;
  const strengthScore = Math.max(
    typeof scores.push_ups_1min === "number" ? scores.push_ups_1min : 0,
    typeof scores.hand_release_pushups_2min === "number"
      ? scores.hand_release_pushups_2min
      : 0,
  );
  const coreScore = Math.max(
    typeof scores.sit_ups_1min === "number" ? scores.sit_ups_1min : 0,
    typeof scores.cross_leg_reverse_crunch_2min === "number"
      ? scores.cross_leg_reverse_crunch_2min
      : 0,
    typeof scores.forearm_plank_time === "number"
      ? scores.forearm_plank_time
      : 0,
  );
  const cardioScore = Math.max(
    typeof scores.run === "number" ? scores.run : 0,
    typeof scores.run_2mile === "number" ? scores.run_2mile : 0,
    typeof scores.shuttles === "number" ? scores.shuttles : 0,
    typeof scores.shuttles_20m === "number" ? scores.shuttles_20m : 0,
  );

  if (scores.whtr === "Exempt") totalPossiblePoints -= 20;
  else earnedPoints += whtrScore;

  // Alternate PT Score Trap: Only exempt if ALL alternate exercises are exempt
  if (
    scores.push_ups_1min === "Exempt" &&
    scores.hand_release_pushups_2min === "Exempt"
  ) {
    totalPossiblePoints -= 15;
  } else {
    earnedPoints += strengthScore;
  }

  if (
    scores.sit_ups_1min === "Exempt" &&
    scores.cross_leg_reverse_crunch_2min === "Exempt" &&
    scores.forearm_plank_time === "Exempt"
  ) {
    totalPossiblePoints -= 15;
  } else {
    earnedPoints += coreScore;
  }

  if (
    scores.run === "Exempt" &&
    scores.run_2mile === "Exempt" &&
    scores.shuttles === "Exempt" &&
    scores.shuttles_20m === "Exempt"
  ) {
    totalPossiblePoints -= 50;
  } else {
    earnedPoints += cardioScore;
  }

  return totalPossiblePoints > 0
    ? (earnedPoints / totalPossiblePoints) * 100
    : 100;
};
