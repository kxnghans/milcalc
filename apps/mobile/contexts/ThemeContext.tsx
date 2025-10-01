/**
 * @file ThemeContext.tsx
 * @description This file defines a React Context and Provider for managing the application's theme.
 * It allows components to access the current theme and provides a function to toggle between modes.
 * NOTE: This file is a duplicate of the ThemeProvider in `@repo/ui`. It's recommended to use the shared provider.
 */

import React, { createContext, useState, useContext, useMemo } from 'react';
import { Appearance } from 'react-native';
import { theme as defaultTheme, lightColors, darkColors } from '@repo/ui';

/**
 * The context that holds the theme information and toggle function.
 */
export const ThemeContext = createContext({
  theme: defaultTheme,
  themeMode: 'light', // The current theme mode ('light', 'dark', or 'auto').
  toggleTheme: () => {}, // A function to cycle through the theme modes.
});

/**
 * A custom hook that provides easy access to the ThemeContext.
 * @returns The current theme context value.
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * The provider component that wraps the application and makes the theme context available.
 */
export const ThemeProvider = ({ children }) => {
  // Get the system's color scheme preference.
  const systemTheme = Appearance.getColorScheme();
  // State to manage the current theme mode: 'auto', 'light', or 'dark'.
  const [themeMode, setThemeMode] = useState('auto');

  // `useMemo` is used to create the final theme object. It only recalculates when the theme mode or system theme changes.
  const theme = useMemo(() => {
    let colors;
    if (themeMode === 'light') {
      colors = lightColors;
    } else if (themeMode === 'dark') {
      colors = darkColors;
    } else { // 'auto' mode
      // In 'auto' mode, the theme follows the system setting.
      colors = systemTheme === 'dark' ? darkColors : lightColors;
    }
    return { ...defaultTheme, colors };
  }, [themeMode, systemTheme]);

  /**
   * A function to cycle through the available theme modes: auto -> light -> dark -> auto.
   */
  const toggleTheme = () => {
    setThemeMode(prevMode => {
      if (prevMode === 'auto') return 'light';
      if (prevMode === 'light') return 'dark';
      return 'auto';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};