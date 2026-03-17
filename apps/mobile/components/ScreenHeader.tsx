import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Icon, ICONS, ICON_SETS, NeumorphicOutset, Divider } from '@repo/ui';
import DismissKeyboardView from './DismissKeyboardView';
import { useOverlay } from '../contexts/OverlayContext';
import { useProfile } from '../contexts/ProfileContext';
import { BlurView } from 'expo-blur';

interface ScreenHeaderProps {
  title: string;
  isLoading?: boolean;
  onMenuPress?: () => void;
  isMenuOpen?: boolean;
  headerLeft?: React.ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ 
  title, 
  isLoading, 
  onMenuPress: manualOnMenuPress, 
  isMenuOpen: _manualIsMenuOpen,
  headerLeft
}) => {
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { openOverlay } = useOverlay();
  const { isProfileComplete } = useProfile();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);
  const handleMenuPress = manualOnMenuPress ?? togglePopup;

  const handleOptionPress = (type: 'ACCOUNT' | 'BUG_REPORT') => {
    setIsPopupVisible(false);
    
    if (type === 'BUG_REPORT' && !isProfileComplete) {
      Alert.alert(
        'Profile Incomplete',
        'Please complete your profile details (First Name, Last Name, and Email) before reporting a bug so we can follow up with you.',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Update Profile',
            onPress: () => openOverlay('PROFILE')
          }
        ]
      );
      return;
    }
    
    openOverlay(type);
  };

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
        left: headerLeft ? 70 : theme.spacing.m,
        bottom: theme.spacing.s + 10,
    },
    headerLeftContainer: {
        position: 'absolute',
        left: theme.spacing.m,
        bottom: theme.spacing.s - 4,
        zIndex: 20,
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
    },
    modalOverlay: {
        flex: 1,
    },
    blurView: {
        ...StyleSheet.absoluteFillObject,
    },
    popupMenu: {
        position: 'absolute',
        top: insets.top + 44,
        right: theme.spacing.m,
        width: 180,
        borderRadius: theme.borderRadius.m,
        backgroundColor: theme.colors.surface,
        overflow: 'hidden',
    },
    popupContent: {
        padding: theme.spacing.xs,
        borderRadius: theme.borderRadius.m,
    },
    popupItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.m,
        paddingHorizontal: theme.spacing.m,
    },
    popupText: {
        ...theme.typography.label,
        color: theme.colors.text,
        marginLeft: theme.spacing.m,
    },
    modalHeaderMock: {
        height: 44 + insets.top,
        paddingTop: insets.top,
        paddingBottom: theme.spacing.s,
        paddingHorizontal: theme.spacing.m,
        justifyContent: 'center',
    }
  });

  return (
    <DismissKeyboardView style={styles.dismissKeyboard}>
        <View style={styles.container}>
            {headerLeft && (
                <View style={styles.headerLeftContainer}>
                    {headerLeft}
                </View>
            )}
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
                          name={isPopupVisible ? ICONS.CLOSE : ICONS.MENU} 
                          size={24} 
                          color={theme.colors.text}
                          iconSet={ICON_SETS.MATERIAL_COMMUNITY}
                        />
                    </TouchableOpacity>
                </NeumorphicOutset>
            </View>

            <Modal
                transparent
                visible={isPopupVisible}
                animationType="fade"
                onRequestClose={() => setIsPopupVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsPopupVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <BlurView 
                          intensity={20} 
                          tint={isDarkMode ? 'dark' : 'light'} 
                          style={styles.blurView} 
                        />

                        {/* Close button inside modal positioned exactly over header button */}
                        <View style={styles.modalHeaderMock}>
                            <View style={styles.menuContainer}>
                                <NeumorphicOutset
                                    containerStyle={{ borderRadius: 17 }}
                                    contentStyle={styles.menuButton}
                                >
                                    <TouchableOpacity onPress={() => setIsPopupVisible(false)}>
                                        <Icon 
                                            name={ICONS.CLOSE} 
                                            size={24} 
                                            color={theme.colors.text}
                                            iconSet={ICON_SETS.MATERIAL_COMMUNITY}
                                        />
                                    </TouchableOpacity>
                                </NeumorphicOutset>
                            </View>
                        </View>

                        <TouchableWithoutFeedback>
                            <View style={styles.popupMenu}>
                                <NeumorphicOutset contentStyle={styles.popupContent}>
                                    <TouchableOpacity 
                                        style={styles.popupItem}
                                        onPress={() => handleOptionPress('ACCOUNT')}
                                    >
                                        <Icon name={ICONS.ACCOUNT} size={20} color={theme.colors.primary} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
                                        <Text style={styles.popupText}>My Account</Text>
                                    </TouchableOpacity>
                                    <Divider />
                                    <TouchableOpacity 
                                        style={styles.popupItem}
                                        onPress={() => handleOptionPress('BUG_REPORT')}
                                    >
                                        <Icon name={ICONS.BUG} size={20} color={theme.colors.error} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
                                        <Text style={styles.popupText}>Report a Bug</Text>
                                    </TouchableOpacity>
                                </NeumorphicOutset>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    </DismissKeyboardView>
  );
};

export default ScreenHeader;
