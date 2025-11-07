'use client';

import { useTheme } from 'next-themes';
import { Icon } from './Icon';
import { ICONS } from '@repo/ui/icons';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = ['light', 'dark', 'system'];
  const icons = [ICONS.THEME_LIGHT, ICONS.THEME_DARK, ICONS.THEME_AUTO];

  const currentThemeIndex = themes.indexOf(theme || 'system');

  const cycleTheme = () => {
    const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    setTheme(themes[nextThemeIndex]);
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-full hover:bg-surface-hover"
    >
      <Icon name={icons[currentThemeIndex]} size={24} />
    </button>
  );
}