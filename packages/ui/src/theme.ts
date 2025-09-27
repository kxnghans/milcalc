export const lightColors = {
  primary: '#007AFF',
  secondary: '#E5E5EA',
  background: '#E0E5EC',
  surface: '#E0E5EC',
  text: '#000000',
  border: '#C7C7CC',
  error: '#FF3B30',
  success: '#34C759',
  ninetyPlus: '#007AFF',
  placeholder: '#A3B1C6',
  primaryText: '#FFFFFF',
  neumorphic: {
    outset: {
      shadow: '#A3B1C6',
      highlight: '#FFFFFF',
      shadowOffset: { width: 3, height: 3 },
      highlightOffset: { width: -3, height: -3 },
      shadowOpacity: 0.5,
      highlightOpacity: 1,
      shadowRadius: 6,
      elevation: 10,
    },
    inset: {
      shadow: '#A3B1C680',
      highlight: '#FFFFFFFF',
      borderWidth: 1,
    },
  },
};

export const darkColors = {
  primary: '#007AFF',
  secondary: '#3A3A3C',
  background: '#2C2C2E',
  surface: '#2C2C2E',
  text: '#FFFFFF',
  border: '#2C2C2E',
  error: '#FF3B30',
  success: '#34C759',
  ninetyPlus: '#007AFF',
  placeholder: '#8E8E93',
  primaryText: '#FFFFFF',
  neumorphic: {
    outset: {
      shadow: '#1C1C1E',
      highlight: '#3A3A3C',
      shadowOffset: { width: 3, height: 3 },
      highlightOffset: { width: -3, height: -3 },
      shadowOpacity: 0.5,
      highlightOpacity: 1,
      shadowRadius: 6,
      elevation: 10,
    },
    inset: {
      shadow: '#1C1C1E80',
      highlight: '#3A3A3CFF',
      borderWidth: 1,
    },
  },
};

export const theme = {
  colors: lightColors,
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  typography: {
    header: {
      fontSize: 20,
      fontWeight: '700',
      fontFamily: 'System',
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      fontFamily: 'System',
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'System',
    },
    body: {
      fontSize: 13,
      fontWeight: '400',
      fontFamily: 'System',
    },
      label: {
      fontSize: 15,
      fontWeight: '400',
      fontFamily: 'System',
    },
    caption: {
      fontSize: 11,
      fontWeight: '400',
      fontFamily: 'System',
    },
  },
  borderRadius: {
    s: 4,
    m: 8,
    l: 16,
  },
};