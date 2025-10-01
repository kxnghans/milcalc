/**
 * @file useScoreColors.ts
 * @description This file defines a custom React hook that provides a consistent set of colors
 * for different score categories (e.g., excellent, pass, fail).
 */

import { useTheme } from '../contexts/ThemeContext';
import { ScoreCategory } from '@repo/utils';

/**
 * A custom hook that returns a background color and a progress color based on a score category.
 * This ensures that score-related UI elements are colored consistently throughout the app.
 * @param {ScoreCategory} category - The category of the score ('excellent', 'pass', 'fail', or 'none').
 * @returns An object containing `backgroundColor` and `progressColor`.
 */
export const useScoreColors = (category: ScoreCategory) => {
  const { theme } = useTheme();

  // The background color is typically the secondary theme color.
  const backgroundColor = theme.colors.secondary;

  switch (category) {
    // For 'excellent' scores (90+).
    case 'excellent':
      return { backgroundColor, progressColor: theme.colors.ninetyPlus };
    // For passing scores.
    case 'pass':
      return { backgroundColor, progressColor: theme.colors.success };
    // For failing scores.
    case 'fail':
      return { backgroundColor, progressColor: theme.colors.error };
    // For scores that are not applicable or zero.
    case 'none':
    default:
      return { backgroundColor, progressColor: theme.colors.secondary };
  }
};