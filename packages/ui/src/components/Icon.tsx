import React from 'react';
import * as Icons from '@expo/vector-icons';

export const Icon = ({ name, size, color, iconSet = 'MaterialCommunityIcons' }) => {
  const IconComponent = Icons[iconSet];
  if (!IconComponent) {
    return null;
  }
  return <IconComponent name={name} size={size} color={color} />;
};
