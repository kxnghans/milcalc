import { useTheme } from '../contexts/ThemeContext';
import { ScoreCategory } from '@repo/utils';

export const useScoreColors = (category: ScoreCategory) => {
  const { theme } = useTheme();

  const backgroundColor = theme.colors.secondary;

  switch (category) {
    case 'excellent':
      return { backgroundColor, progressColor: theme.colors.ninetyPlus };
    case 'pass':
      return { backgroundColor, progressColor: theme.colors.success };
    case 'fail':
      return { backgroundColor, progressColor: theme.colors.error };
    case 'none':
    default:
      return { backgroundColor, progressColor: theme.colors.secondary };
  }
};