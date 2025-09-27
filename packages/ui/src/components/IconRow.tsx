import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Icons from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useTheme } from "../contexts/ThemeContext";
import NeumorphicOutset from './NeumorphicOutset';

interface IconRowProps {
  icons: {
    name: string;
    onPress?: () => void;
    href?: string;
    iconSet?: keyof typeof Icons;
  }[];
  style?: ViewStyle;
}

export const IconRow = ({ icons, style }: IconRowProps) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      gap: theme.spacing.m,
    },
    iconBlock: {
      padding: theme.spacing.s + 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    touchable: {
      flex: 1,
    },
  });

  return (
    <View style={[styles.iconContainer, style]}>
      {icons.map((icon, index) => {
        const Icon = Icons[icon.iconSet || 'MaterialCommunityIcons'];
        const iconContent = (
          <NeumorphicOutset 
            containerStyle={{
              borderRadius: theme.borderRadius.l,
              margin: theme.spacing.s,
            }}
            contentStyle={{
              backgroundColor: theme.colors.background,
              borderRadius: theme.borderRadius.l,
              overflow: 'hidden',
            }}
          >
            <View style={styles.iconBlock}>
                <Icon name={icon.name} size={25} color={theme.colors.text} />
            </View>
          </NeumorphicOutset>
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