import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Icons from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useTheme } from './contexts/ThemeContext';

interface IconRowProps {
  icons: {
    name: string;
    onPress?: () => void;
    href?: string;
    iconSet?: keyof typeof Icons;
  }[];
}

export const IconRow = ({ icons }: IconRowProps) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginVertical: theme.spacing.s,
      gap: theme.spacing.m,
    },
    iconBlock: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.s + 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    touchable: {
      flex: 1,
    },
  });

  return (
    <View style={styles.iconContainer}>
      {icons.map((icon, index) => {
        const Icon = Icons[icon.iconSet || 'MaterialCommunityIcons'];
        const iconContent = (
          <View style={styles.iconBlock}>
            <Icon name={icon.name} size={25} color={theme.colors.text} />
          </View>
        );

        if (icon.href) {
          return (
            <Link href={icon.href} asChild key={index}>
              <TouchableOpacity style={styles.touchable}>{iconContent}</TouchableOpacity>
            </Link>
          );
        }

        return (
          <TouchableOpacity onPress={icon.onPress} key={index} style={styles.touchable}>
            {iconContent}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
