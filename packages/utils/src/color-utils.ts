export type ScoreCategory = 'excellent' | 'pass' | 'fail' | 'none';
export type PerformanceCategory = 'excellent' | 'pass' | 'fail' | 'none';

export const getScoreCategory = (score: number | string, maxScore: number): ScoreCategory => {
  if (score === 'pass') return 'pass';
  if (score === 'fail') return 'fail';
  if (score === 'n/a' || typeof score !== 'number' || score === 0) {
    return 'none';
  }

  const ninetyPercent = maxScore * 0.9;
  const seventyFivePercent = maxScore * 0.75;

  if (score >= ninetyPercent) {
    return 'excellent';
  }
  if (score >= seventyFivePercent) {
    return 'pass';
  }
  return 'fail';
};

export const getPerformanceCategory = (
  value: number,
  passThreshold: number,
  ninetyPercentileThreshold: number,
  invertScale: boolean = false
): PerformanceCategory => {
  if (value === 0) return 'none';

  if (invertScale) { // Lower is better
    if (value > passThreshold) return 'fail';
    if (value <= ninetyPercentileThreshold) return 'excellent';
    return 'pass';
  } else { // Higher is better
    if (value < passThreshold) return 'fail';
    if (value >= ninetyPercentileThreshold) return 'excellent';
    return 'pass';
  }
};