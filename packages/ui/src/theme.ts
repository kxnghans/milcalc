/**
 * @file theme.ts
 * @description This file defines the visual theme for the application, including spacing, color palettes for light and dark modes,
 * typography styles, and border radii. It serves as a centralized place for all styling constants.
 */

/**
 * Defines standard spacing units used throughout the application for layout and components.
 */
const spacing = {
  xs: 3,  // Extra small spacing
  s: 8,   // Small spacing
  m: 16,  // Medium spacing
  l: 24,  // Large spacing
  xl: 40, // Extra large spacing
};

/**
 * Color palette for the light theme.
 */
export const lightColors = {
  primary: 'rgba(0, 122, 255, 1)',      // Primary interactive color for buttons, links, etc.
  secondary: 'rgba(229, 229, 234, 1)',  // Secondary color, often for backgrounds of elements.
  background: 'rgba(224, 229, 236, 1)',// App background color.
  surface: 'rgba(224, 229, 236, 1)',   // Color for card surfaces or containers.
  text: 'rgba(0, 0, 0, 1)',             // Primary text color.
  error: 'rgba(236, 52, 40, 1)',        // Color for error messages and indicators.
  success: 'rgba(28, 176, 87, 1)',      // Color for success messages and indicators.
  darkenColor: 'rgba(0, 0, 0, 0.1)',    // Used to darken elements on press or hover.
  inputBackground: 'rgba(0, 0, 0, 0.04)',// Background color for text inputs.
  ninetyPlus: 'rgba(0, 122, 255, 1)',   // Color for scores of 90 and above (excellent).
  placeholder: 'rgba(143, 157, 178, 1)',// Color for placeholder text in inputs.
  disabled: 'rgba(60, 60, 67, 0.45)',   // Color for disabled elements.
  primaryText: 'rgba(255, 255, 255, 1)',// Text color for components with a primary color background.
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

/**
 * Color palette for the dark theme.
 */
export const darkColors = {
  primary: 'rgba(0, 122, 255, 1)',      // Primary interactive color.
  secondary: 'rgba(58, 58, 60, 1)',     // Secondary color.
  background: 'rgba(44, 44, 46, 1)',    // App background color.
  surface: 'rgba(44, 44, 46, 1)',       // Color for card surfaces.
  text: 'rgba(255, 255, 255, 1)',       // Primary text color.
  border: 'rgba(44, 44, 46, 1)',        // Border color, same as background for seamless look.
  error: 'rgba(255, 59, 48, 1)',        // Color for error messages.
  success: 'rgba(52, 199, 89, 1)',      // Color for success messages.
  darkenColor: 'rgba(0, 0, 0, 0.15)',   // Used to darken elements on press or hover.
  inputBackground: 'rgba(0, 0, 0, 0.085)',// Background color for text inputs.
  ninetyPlus: 'rgba(0, 122, 255, 1)',   // Color for scores of 90 and above.
  placeholder: 'rgba(142, 142, 147, 1)',// Color for placeholder text.
  disabled: 'rgba(235, 235, 245, 0.5)', // Color for disabled elements.
  primaryText: 'rgba(255, 255, 255, 1)',// Text color for primary-colored components.
  neumorphic: {
    outset: {
      shadow: 'rgba(0, 0, 0, 0.77)',
      highlight: 'rgba(255, 255, 255, 0.43)',
      shadowOffset: { width: spacing.xs, height: spacing.xs },
      highlightOffset: { width: -spacing.xs, height: -spacing.xs },
      shadowOpacity: 0.5,
      highlightOpacity: 0.15,
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

/**
 * The main theme object that combines colors, spacing, typography, and other styling properties.
 * The light theme is set as the default.
 */
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
      fontSize: 16.5,
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
    bodybold: {
      fontSize: 13,
      fontWeight: '500',
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
    s: 4,   // Small border radius
    m: 8,   // Medium border radius
    l: 16,  // Large border radius
  },
};