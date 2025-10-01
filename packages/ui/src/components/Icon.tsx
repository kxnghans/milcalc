/**
 * @file Icon.tsx
 * @description This file defines a generic Icon component that acts as a wrapper around the
 * `@expo/vector-icons` library. It allows for dynamically selecting an icon from any
 * available icon set.
 */

import React from 'react';
import * as Icons from '@expo/vector-icons';

/**
 * A wrapper component for displaying icons from the `@expo/vector-icons` library.
 * @param {object} props - The component props.
 * @param {string} props.name - The name of the icon to display.
 * @param {number} props.size - The size of the icon.
 * @param {string} props.color - The color of the icon.
 * @param {keyof typeof Icons} [props.iconSet='MaterialCommunityIcons'] - The name of the icon set to use.
 * @returns {JSX.Element | null} The rendered icon component, or null if the icon set is invalid.
 */
export const Icon = ({ name, size, color, iconSet = 'MaterialCommunityIcons' }) => {
  // Dynamically select the icon component from the Icons library based on the iconSet prop.
  const IconComponent = Icons[iconSet];

  // If the specified icon set doesn't exist, return null to prevent a crash.
  if (!IconComponent) {
    return null;
  }

  // Render the selected icon component with the provided props.
  return <IconComponent name={name} size={size} color={color} />;
};