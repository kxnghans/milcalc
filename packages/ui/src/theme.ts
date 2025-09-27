const spacing = {
  xs: 3,
  s: 8,
  m: 16,
  l: 24,
  xl: 40,
};

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
      shadow: '#000000',
      highlight: '#FFFFFF',
      shadowOffset: { width: spacing.xs, height: spacing.xs },
      highlightOffset: { width: -spacing.xs, height: -spacing.xs },
      shadowOpacity: 0.1,
      highlightOpacity: 0.9,
      shadowRadius: 6,
      elevation: 10,
    },
    inset: {
      shadow: '#0000001A',
      highlight: '#FFFFFFE6',
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
      shadow: '#000000',
      highlight: '#FFFFFF',
      shadowOffset: { width: spacing.xs, height: spacing.xs },
      highlightOffset: { width: -spacing.xs, height: -spacing.xs },
      shadowOpacity: 0.6,
      highlightOpacity: 0.2,
      shadowRadius: 6,
      elevation: 10,
    },
    inset: {
      shadow: '#00000080',
      highlight: '#FFFFFF14',
      borderWidth: 1,
    },
  },
};

export const theme = {
  colors: lightColors,
  spacing: spacing,
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