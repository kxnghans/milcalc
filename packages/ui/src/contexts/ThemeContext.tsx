/**
 * @file ThemeContext.tsx
 * @description This file defines the React Context and Provider for managing the application's theme.
 * It allows components to access the current theme (light/dark) and provides a function to toggle between modes.
 * It supports 'light', 'dark', and 'auto' (system) theme modes.
 */

import React, { createContext, useState, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { theme as defaultTheme, lightColors, darkColors } from '../theme';

/**
 * The context that holds the theme information and toggle function.
 * Components can subscribe to this context to receive theme updates.
 */
export const ThemeContext = createContext({
  theme: defaultTheme,
  themeMode: 'light', // The current theme mode ('light', 'dark', or 'auto').
  isDarkMode: false,  // A boolean flag indicating if the dark mode is currently active.
  toggleTheme: () => {}, // A function to cycle through the theme modes.
});

/**
 * A custom hook that provides easy access to the ThemeContext.
 * @returns The current theme context value.
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * The provider component that wraps the application and makes the theme context available to all children.
 * It manages the theme state and handles the logic for switching between light, dark, and auto modes.
 */
export const ThemeProvider = ({ children }) => {
  // `useColorScheme` from React Native detects the user's system theme preference.
  const systemTheme = useColorScheme();
  // State to manage the current theme mode. Can be 'auto', 'light', or 'dark'.
  const [themeMode, setThemeMode] = useState('auto');

  // `useMemo` is used to recalculate `isDarkMode` only when `themeMode` or `systemTheme` changes.
  const isDarkMode = useMemo(() => {
    if (themeMode === 'auto') {
      // In 'auto' mode, the theme follows the system setting.
      return systemTheme === 'dark';
    }
    // Otherwise, it's based on the user's explicit selection.
    return themeMode === 'dark';
  }, [themeMode, systemTheme]);

  // `useMemo` is used to create the final theme object. It merges the base theme with the
  // appropriate color palette (light or dark) and only recalculates when `isDarkMode` changes.
  const theme = useMemo(() => {
    const colors = isDarkMode ? darkColors : lightColors;
    return { ...defaultTheme, colors };
  }, [isDarkMode]);

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
    <ThemeContext.Provider value={{ theme, themeMode, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};