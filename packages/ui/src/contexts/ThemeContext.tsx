import React, { createContext, useState, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { theme as defaultTheme, lightColors, darkColors } from '../theme';

export const ThemeContext = createContext({
  theme: defaultTheme,
  themeMode: 'light',
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('auto'); // auto, light, dark

  const isDarkMode = useMemo(() => {
    if (themeMode === 'auto') {
      return systemTheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemTheme]);

  const theme = useMemo(() => {
    const colors = isDarkMode ? darkColors : lightColors;
    return { ...defaultTheme, colors };
  }, [isDarkMode]);

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