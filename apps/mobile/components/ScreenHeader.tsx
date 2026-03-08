import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Icon, ICONS, ICON_SETS, NeumorphicOutset } from '@repo/ui';
import DismissKeyboardView from './DismissKeyboardView';
import { useOverlay } from '../contexts/OverlayContext';

interface ScreenHeaderProps {
  title: string;
  isLoading?: boolean;
  onMenuPress?: () => void;
  isMenuOpen?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, isLoading, onMenuPress: manualOnMenuPress, isMenuOpen: manualIsMenuOpen }) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { openOverlay, overlayType, isVisible } = useOverlay();

  const isMenuOpen = manualIsMenuOpen ?? (isVisible && overlayType === 'MENU');
  const handleMenuPress = manualOnMenuPress ?? (() => openOverlay('MENU'));

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingTop: insets.top,
      paddingBottom: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
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
      zIndex: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44 + insets.top,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 44, // Room for both left/right icons
    },
    title: {
      ...theme.typography.header,
      color: theme.colors.text,
      textAlign: 'center',
    },
    loaderContainer: {
        position: 'absolute',
        left: theme.spacing.m,
        bottom: theme.spacing.s + 10, // Adjust to center vertically in content area
    },
    menuContainer: {
        position: 'absolute',
        right: theme.spacing.m,
        bottom: theme.spacing.s,
    },
    menuButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
    },
    dismissKeyboard: {
        flex: 0,
    }
  });

  return (
    <DismissKeyboardView style={styles.dismissKeyboard}>
        <View style={styles.container}>
            {isLoading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator 
                        size="small" 
                        color={isDarkMode ? theme.colors.text : theme.colors.primary} 
                    />
                </View>
            )}
            <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
            </View>
            <View style={styles.menuContainer}>
                <NeumorphicOutset
                  containerStyle={{ borderRadius: 17 }}
                  contentStyle={styles.menuButton}
                >
                    <TouchableOpacity onPress={handleMenuPress}>
                        <Icon 
                          name={isMenuOpen ? ICONS.CLOSE : ICONS.MENU} 
                          size={24} 
                          color={theme.colors.text}
                          iconSet={ICON_SETS.MATERIAL_COMMUNITY}
                        />
                    </TouchableOpacity>
                </NeumorphicOutset>
            </View>
        </View>
    </DismissKeyboardView>
  );
};

export default ScreenHeader;
