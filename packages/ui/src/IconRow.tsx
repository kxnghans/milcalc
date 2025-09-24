import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useTheme } from './contexts/ThemeContext';

interface IconRowProps {
  icons: {
    name: string;
    onPress?: () => void;
    href?: string;
  }[];
}

export const IconRow = ({ icons }: IconRowProps) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    iconContainer: {
      flexDirection: 'row',
      marginVertical: theme.spacing.m,
      gap: theme.spacing.m,
    },
    iconBlock: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.l,
      padding: theme.spacing.s,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
  });

  return (
    <View style={styles.iconContainer}>
      {icons.map((icon, index) => {
        const iconContent = (
          <View style={styles.iconBlock}>
            <MaterialCommunityIcons name={icon.name} size={30} color={theme.colors.text} />
          </View>
        );

        if (icon.href) {
          return (
            <Link href={icon.href} asChild key={index}>
              <TouchableOpacity>{iconContent}</TouchableOpacity>
            </Link>
          );
        }

        return (
          <TouchableOpacity onPress={icon.onPress} key={index}>
            {iconContent}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
