/**
 * @file color-utils.ts
 * @description This file contains utility functions for categorizing scores and performance values.
 * These categories are then used throughout the UI to apply consistent coloring (e.g., for scores and progress bars).
 */

/**
 * Defines the possible categories for a calculated score.
 * 'excellent' - Typically for scores 90% or higher.
 * 'pass' - For scores that meet the minimum passing criteria but are not excellent.
 * 'fail' - For scores below the passing criteria.
 * 'none' - For scores that are not applicable or zero.
 */
export type ScoreCategory = 'excellent' | 'pass' | 'fail' | 'none';

/**
 * Defines the possible categories for a raw performance value (e.g., reps, time).
 */
export type PerformanceCategory = 'excellent' | 'pass' | 'fail' | 'none';

/**
 * Determines the category of a score based on its value relative to the maximum possible score.
 * @param score - The score to categorize. Can be a number or a string ('pass', 'fail', 'n/a').
 * @param maxScore - The maximum possible score for the component.
 * @returns The `ScoreCategory` for the given score.
 */
export const getScoreCategory = (score: number | string, maxScore: number, treatZeroAsFail: boolean = false): ScoreCategory => {
  // Handle special string-based scores first (e.g., from the walk component).
  if (score === 'pass') return 'pass';
  if (score === 'fail') return 'fail';
  if (typeof score !== 'number' || score === 'n/a') {
    return 'none';
  }

  if (score === 0 && !treatZeroAsFail) {
    return 'none';
  }

  // Define thresholds based on percentages of the max score.
  const ninetyPercent = maxScore * 0.9;

  if (score >= ninetyPercent) {
    return 'excellent';
  }
  if (score > 0) {
    return 'pass';
  }
  return 'fail';
};

/**
 * Determines the category of a raw performance value based on defined thresholds.
 * @param value - The performance value (e.g., reps, seconds).
 * @param passThreshold - The threshold to pass.
 * @param ninetyPercentileThreshold - The threshold for an "excellent" performance.
 * @param invertScale - If true, lower values are considered better (e.g., for run times).
 * @returns The `PerformanceCategory` for the given value.
 */
export const getPerformanceCategory = (
  value: number,
  passThreshold: number,
  ninetyPercentileThreshold: number,
  invertScale: boolean = false
): PerformanceCategory => {
  if (value === 0) return 'none';

  if (invertScale) { // Lower values are better (e.g., time).
    if (value > passThreshold) return 'fail';
    if (value <= ninetyPercentileThreshold) return 'excellent';
    return 'pass';
  } else { // Higher values are better (e.g., reps).
    if (value < passThreshold) return 'fail';
    if (value >= ninetyPercentileThreshold) return 'excellent';
    return 'pass';
  }
};