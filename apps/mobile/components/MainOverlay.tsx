import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme, Icon, ICONS, ICON_SETS, NeumorphicOutset, NeumorphicInset, Divider, SegmentedSelector, PillButton } from '@repo/ui';
import { useOverlay } from '../contexts/OverlayContext';
import { useProfile } from '../contexts/ProfileContext';
import Constants from 'expo-constants';
import { BugReportView } from './BugReportView';
import Demographics from './Demographics';
import FormField from './FormField';

export const MainOverlay: React.FC = () => {
  const { overlayType } = useOverlay();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      paddingBottom: theme.spacing.m,
    }
  });

  const renderContent = () => {
    switch (overlayType) {
      case 'MENU':
        return <MenuView />;
      case 'ACCOUNT':
      case 'PROFILE':
      case 'SETTINGS':
        return <AccountView />;
      case 'BUG_REPORT':
        return <BugReportView />;
      case 'PAYWALL':
        return <PaywallView />;
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const MenuView: React.FC = () => {
  const { theme } = useTheme();
  const { openOverlay } = useOverlay();
  const { isProfileComplete } = useProfile();

  const styles = StyleSheet.create({
    viewContainer: {
      paddingHorizontal: theme.spacing.m,
      paddingTop: theme.spacing.s,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    menuIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      marginRight: theme.spacing.m,
    },
    menuIconContent: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const handleBugReportPress = () => {
    if (isProfileComplete) {
      openOverlay('BUG_REPORT');
    } else {
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
    }
  };

  const MenuItem = ({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <NeumorphicOutset containerStyle={styles.menuIconContainer} contentStyle={styles.menuIconContent}>
        <Icon name={icon} size={24} color={theme.colors.primary} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
      </NeumorphicOutset>
      <Text style={[theme.typography.label, { color: theme.colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.viewContainer}>
      <MenuItem title="My Account" icon={ICONS.ACCOUNT} onPress={() => openOverlay('ACCOUNT')} />
      <MenuItem title="Report a Bug" icon={ICONS.BUG} onPress={handleBugReportPress} />
    </View>
  );
};

const AccountView: React.FC = () => {
  const { theme, setThemeMode, themeMode } = useTheme();
  const { firstName, lastName, email, phone, age, gender, accountType, setProfileData } = useProfile();
  const { openOverlay } = useOverlay();

  const styles = StyleSheet.create({
    viewContainer: {
      paddingHorizontal: theme.spacing.m,
      paddingTop: theme.spacing.s,
    },
    section: {
      marginBottom: 0,
    },
    headerText: {
      ...theme.typography.title,
      color: theme.colors.primary,
      marginBottom: theme.spacing.m,
      textAlign: 'center',
      textShadowColor: theme.colors.neumorphic.outset.shadow,
      textShadowRadius: 0.25,
      textShadowOffset: { width: 0, height: 0 },
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: theme.spacing.xs,
    },
    settingsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing.s,
    },
  });

  const themeOptions = [
    { label: 'Auto', value: 'auto', icon: ICONS.THEME_AUTO },
    { label: 'Light', value: 'light', icon: ICONS.THEME_LIGHT },
    { label: 'Dark', value: 'dark', icon: ICONS.THEME_DARK },
  ];

  const accountOptions = [
    { label: 'Free', value: 'free', icon: ICONS.STAR_OUTLINE },
    { label: 'Premium', value: 'premium', icon: ICONS.CROWN },
  ];

  const handleAccountTypeChange = (val: string) => {
    if (val === 'premium' && accountType === 'free') {
      openOverlay('PAYWALL');
    } else {
      setProfileData({ accountType: val as 'free' | 'premium' });
    }
  };

  return (
    <View style={styles.viewContainer}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.headerText}>Profile Details</Text>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: theme.spacing.m }}>
            <FormField
              label="First Name"
              value={firstName}
              onChangeText={(val: string) => setProfileData({ firstName: val })}
              icon={ICONS.ACCOUNT_OUTLINE}
              placeholder="First Name"
              inputStyle={{ textAlign: 'center' }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FormField
              label="Last Name"
              value={lastName}
              onChangeText={(val: string) => setProfileData({ lastName: val })}
              icon={ICONS.ACCOUNT_OUTLINE}
              placeholder="Last Name"
              inputStyle={{ textAlign: 'center' }}
            />
          </View>
        </View>

        <FormField
          label="Email Address"
          value={email}
          onChangeText={(val: string) => setProfileData({ email: val })}
          icon={ICONS.EMAIL}
          placeholder="Email Address"
          keyboardType="email-address"
          inputStyle={{ textAlign: 'center' }}
        />

        <FormField
          label="Phone Number"
          value={phone}
          onChangeText={(val: string) => setProfileData({ phone: val })}
          icon={ICONS.PHONE}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          inputStyle={{ textAlign: 'center' }}
        />

        <Demographics
          age={age}
          setAge={(val) => setProfileData({ age: val })}
          gender={gender}
          setGender={(val) => setProfileData({ gender: val as 'male' | 'female' })}
          inputStyle={{ textAlign: 'center' }}
        />
      </View>

      <Divider style={{ marginVertical: theme.spacing.m }} />

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.headerText}>Theme Preferences</Text>
        <SegmentedSelector
          options={themeOptions}
          selectedValues={[themeMode]}
          onValueChange={(val) => setThemeMode(val as 'auto' | 'light' | 'dark')}
        />
      </View>

      <Divider style={{ marginVertical: theme.spacing.m }} />

      {/* Account Type Section */}
      <View style={styles.section}>
        <Text style={styles.headerText}>Account Type</Text>
        <SegmentedSelector
          options={accountOptions}
          selectedValues={[accountType]}
          onValueChange={handleAccountTypeChange}
        />
      </View>

      <Divider style={{ marginVertical: theme.spacing.m }} />

      {/* App Info */}
      <View style={[styles.section, { marginBottom: theme.spacing.l }]}>
        <View style={styles.settingsRow}>
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>App Version</Text>
          <Text style={[theme.typography.bodybold, { color: theme.colors.text }]}>{Constants.expoConfig?.version || '1.0.0'}</Text>
        </View>
      </View>
    </View>
  );
};

const PaywallView: React.FC = () => {
  const { theme } = useTheme();
  const { setProfileData } = useProfile();
  const { openOverlay } = useOverlay();

  const styles = StyleSheet.create({
    viewContainer: {
      paddingHorizontal: theme.spacing.m,
      paddingTop: theme.spacing.s,
    },
  });

  const handleUpgrade = () => {
    setProfileData({ accountType: 'premium' });
    Alert.alert('Success', 'Welcome to MilCalc Premium!');
    openOverlay('ACCOUNT');
  };

  const BenefitItem = ({ text }: { text: string }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.m }}>
      <Icon name="check-circle" size={20} color={theme.colors.success} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
      <Text style={[theme.typography.body, { color: theme.colors.text, marginLeft: theme.spacing.m }]}>{text}</Text>
    </View>
  );

  return (
    <View style={styles.viewContainer}>
      <View style={{ alignItems: 'center', marginBottom: theme.spacing.l }}>
        <NeumorphicOutset containerStyle={{ width: 80, height: 80, borderRadius: 40, marginBottom: theme.spacing.m }} contentStyle={{ width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}>
          <Icon name={ICONS.CROWN} size={40} color={theme.colors.primary} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
        </NeumorphicOutset>
        <Text style={[theme.typography.title, { color: theme.colors.primary, textAlign: 'center' }]}>Upgrade to Premium</Text>
        <Text style={[theme.typography.body, { color: theme.colors.text, textAlign: 'center', marginTop: theme.spacing.s }]}>Unlock the full potential of MilCalc</Text>
      </View>

      <NeumorphicInset 
        containerStyle={{ borderRadius: 16, marginBottom: theme.spacing.l }}
        contentStyle={{ padding: theme.spacing.m }}
      >
        <BenefitItem text="Ad-free experience" />
        <BenefitItem text="Advanced PT analysis" />
        <BenefitItem text="Detailed Pay breakdowns" />
        <BenefitItem text="Priority support" />
        <BenefitItem text="Cloud sync for all devices" />
      </NeumorphicInset>

      <PillButton
        title="Upgrade Now - $4.99/mo"
        onPress={handleUpgrade}
        containerStyle={{ marginBottom: theme.spacing.m }}
      />
      
      <TouchableOpacity onPress={() => openOverlay('ACCOUNT')} style={{ alignSelf: 'center', padding: theme.spacing.s }}>
        <Text style={[theme.typography.label, { color: theme.colors.text, opacity: 0.7 }]}>Not now, maybe later</Text>
      </TouchableOpacity>
    </View>
  );
};
