import React, { createContext, useState, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { theme as defaultTheme, lightColors, darkColors } from '../theme';

export const ThemeContext = createContext({
  theme: defaultTheme,
  themeMode: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('auto'); // auto, light, dark

  const theme = useMemo(() => {
    let colors;
    if (themeMode === 'light') {
      colors = lightColors;
    } else if (themeMode === 'dark') {
      colors = darkColors;
    } else { // auto
      colors = systemTheme === 'dark' ? darkColors : lightColors;
    }
    return { ...defaultTheme, colors };
  }, [themeMode, systemTheme]);

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
