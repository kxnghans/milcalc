import { useTheme } from '../contexts/ThemeContext';
import { ScoreCategory } from '@repo/utils';

export const useScoreColors = (category: ScoreCategory) => {
  const { theme } = useTheme();

  switch (category) {
    case 'excellent':
      return { color: theme.colors.ninetyPlus };
    case 'pass':
      return { color: theme.colors.success };
    case 'fail':
      return { color: theme.colors.error };
    case 'none':
    default:
      return { color: theme.colors.text };
  }
};