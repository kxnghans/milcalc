import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@repo/ui';
import DismissKeyboardView from './DismissKeyboardView';

interface ScreenHeaderProps {
  title: string;
  isLoading?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, isLoading }) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingTop: insets.top,
      paddingBottom: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      // Neumorphic shadow styles
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.neumorphic.outset.shadow,
          shadowOffset: theme.colors.neumorphic.outset.shadowOffset,
          shadowOpacity: theme.colors.neumorphic.outset.shadowOpacity,
          shadowRadius: theme.colors.neumorphic.outset.shadowRadius,
        },
        android: {
          elevation: theme.colors.neumorphic.outset.elevation,
        },
      }),
      zIndex: 10, // Ensure header stays on top
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44 + insets.top, // Standard nav bar height + safe area
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
      ...theme.typography.header,
      color: theme.colors.text,
      textAlign: 'center',
    },
    loaderContainer: {
        position: 'absolute',
        right: theme.spacing.m,
        bottom: theme.spacing.s,
    },
    dismissKeyboard: {
        flex: 0,
    }
  });

  return (
    <DismissKeyboardView style={styles.dismissKeyboard}>
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
            </View>
            {isLoading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator 
                        size="small" 
                        color={isDarkMode ? theme.colors.text : theme.colors.primary} 
                    />
                </View>
            )}
        </View>
    </DismissKeyboardView>
  );
};

export default ScreenHeader;
