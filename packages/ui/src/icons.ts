/**
 * @file icons.ts
 * @description This file centralizes the names of all icons used in the application.
 * Using a centralized file like this makes it easy to manage, update, and reuse icons consistently.
 */

/**
 * A mapping of semantic icon names to their specific names in the icon library.
 * This allows for easy swapping of icons without changing the code that uses them.
 * All icons are from the 'MaterialCommunityIcons' set unless specified otherwise.
 */
export const ICONS = {
  BEST_SCORE: 'file-chart-outline', // Icon for the Best Score screen.
  PDF: 'file-pdf-box',              // Icon for opening PDF documents.
  DOCUMENT: 'file-document',        // Icon for a generic document.
  THEME_LIGHT: 'weather-sunny',     // Icon for the light theme.
  THEME_DARK: 'weather-night',      // Icon for the dark theme.
  THEME_AUTO: 'brightness-auto',    // Icon for the automatic/system theme.
  GENDER_MALE: 'male',              // Icon for the male gender selector.
  GENDER_FEMALE: 'female',          // Icon for the female gender selector.
  HOME: 'home-outline',             // Icon for the home/main tab (unselected).
  HOME_FILLED: 'home',              // Icon for the home/main tab (selected).
  HELP: 'help-circle-outline',      // Icon for help or information tooltips.
  WEIGHT_LIFTER: 'weight-lifter',   // A general-purpose fitness icon.
};

/**
 * Defines the keys for the icon sets available via `@expo/vector-icons`.
 * This allows for specifying which icon library to use for a particular icon.
 */
export const ICON_SETS = {
    MATERIAL_COMMUNITY: 'MaterialCommunityIcons',
    FONTISTO: 'Fontisto',
};