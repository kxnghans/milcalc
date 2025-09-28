const spacing = {
  xs: 3,
  s: 8,
  m: 16,
  l: 24,
  xl: 40,
};

export const lightColors = {
  primary: 'rgba(0, 122, 255, 1)',
  secondary: 'rgba(229, 229, 234, 1)',
  background: 'rgba(224, 229, 236, 1)',
  surface: 'rgba(224, 229, 236, 1)',
  text: 'rgba(0, 0, 0, 1)',
  border: 'rgba(199, 199, 204, 1)',
  error: 'rgba(255, 59, 48, 1)',
  success: 'rgba(52, 199, 89, 1)',
  darkenColor: 'rgba(0, 0, 0, 0.1)',
  inputBackground: 'rgba(0, 0, 0, 0.04)',
  ninetyPlus: 'rgba(0, 122, 255, 1)',
  placeholder: 'rgba(143, 157, 178, 1)',
  disabled: 'rgba(60, 60, 67, 0.25)',
  primaryText: 'rgba(255, 255, 255, 1)',
  neumorphic: {
    outset: {
      shadow: 'rgba(0, 0, 0, 1)',
      highlight: 'rgba(255, 255, 255, 1)',
      shadowOffset: { width: spacing.xs, height: spacing.xs },
      highlightOffset: { width: -spacing.xs, height: -spacing.xs },
      shadowOpacity: 0.2,
      highlightOpacity: 0.9,
      shadowRadius: 3.5,
      elevation: 10,
    },
    inset: {
      shadow: 'rgba(0, 0, 0, 0.1)',
      highlight: 'rgba(255, 255, 255, 0.9)',
      borderWidth: 1,
    },
  },
};

export const darkColors = {
  primary: 'rgba(0, 122, 255, 1)',
  secondary: 'rgba(58, 58, 60, 1)',
  background: 'rgba(44, 44, 46, 1)',
  surface: 'rgba(44, 44, 46, 1)',
  text: 'rgba(255, 255, 255, 1)',
  border: 'rgba(44, 44, 46, 1)',
  error: 'rgba(255, 59, 48, 1)',
  success: 'rgba(52, 199, 89, 1)',
  darkenColor: 'rgba(0, 0, 0, 0.15)',
  inputBackground: 'rgba(0, 0, 0, 0.085)',
  ninetyPlus: 'rgba(0, 122, 255, 1)',
  placeholder: 'rgba(142, 142, 147, 1)',
  disabled: 'rgba(235, 235, 245, 0.5)',
  primaryText: 'rgba(255, 255, 255, 1)',
  neumorphic: {
    outset: {
      shadow: 'rgba(0, 0, 0, 0.77)',
      highlight: 'rgba(255, 255, 255, 0.43)',
      shadowOffset: { width: spacing.xs, height: spacing.xs },
      highlightOffset: { width: -spacing.xs, height: -spacing.xs },
      shadowOpacity: 0.6,
      highlightOpacity: 0.2,
      shadowRadius: 3,
      elevation: 10,
    },
    inset: {
      shadow: 'rgba(0, 0, 0, 0.5)',
      highlight: 'rgba(255, 255, 255, 0.08)',
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