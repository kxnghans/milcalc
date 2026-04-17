/**
 * @file Icon.tsx
 * @description This file defines a generic Icon component that acts as a wrapper around the
 * `@expo/vector-icons` library. It allows for dynamically selecting an icon from any
 * available icon set.
 */

import * as Icons from "@expo/vector-icons";
import React from "react";
import { StyleProp, TextStyle } from "react-native";

interface IconProps {
  name: string;
  size: number;
  color: string;
  iconSet?: keyof typeof Icons;
  style?: StyleProp<TextStyle>;
}

/**
 * A wrapper component for displaying icons from the `@expo/vector-icons` library.
 * @param {IconProps} props - The component props.
 * @returns {JSX.Element | null} The rendered icon component, or null if the icon set is invalid.
 */
export const Icon = ({
  name,
  size,
  color,
  iconSet = "MaterialCommunityIcons",
  style,
}: IconProps) => {
  // Dynamically select the icon component from the Icons library based on the iconSet prop.
  const IconComponent = Icons[iconSet] as React.ComponentType<{
    name: string;
    size: number;
    color: string;
    style?: StyleProp<TextStyle>;
  }>;

  // If the specified icon set doesn't exist, return null to prevent a crash.
  if (!IconComponent) {
    return null;
  }

  // Render the selected icon component with the provided props.
  return <IconComponent name={name} size={size} color={color} style={style} />;
};
