import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useTheme, Icon, ICONS, ICON_SETS, NeumorphicOutset, NeumorphicInset, PillButton, Divider, SegmentedSelector } from '@repo/ui';
import { useOverlay } from '../contexts/OverlayContext';
import { useProfile } from '../contexts/ProfileContext';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { submitBugReport } from '@repo/utils';

export const MainOverlay: React.FC = () => {
  const { overlayType } = useOverlay();

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
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const MenuView: React.FC = () => {
  const { theme } = useTheme();
  const { openOverlay } = useOverlay();

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
      <MenuItem title="Report a Bug" icon={ICONS.BUG} onPress={() => openOverlay('BUG_REPORT')} />
    </View>
  );
};

const AccountView: React.FC = () => {
  const { theme, setThemeMode, themeMode, isDarkMode } = useTheme();
  const { firstName, lastName, email, phone, age, gender, setProfileData } = useProfile();

  const themeOptions = [
    { label: 'Auto', value: 'auto', icon: ICONS.THEME_AUTO },
    { label: 'Light', value: 'light', icon: ICONS.THEME_LIGHT },
    { label: 'Dark', value: 'dark', icon: ICONS.THEME_DARK },
  ];

  const genderOptions = [
    { label: 'Male', value: 'male', icon: ICONS.GENDER_MALE, iconSet: ICON_SETS.FONTISTO },
    { label: 'Female', value: 'female', icon: ICONS.GENDER_FEMALE, iconSet: ICON_SETS.FONTISTO },
  ];

  interface ProfileInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    icon?: string;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
    labelCentered?: boolean;
    reducedHeight?: boolean;
  }

  const ProfileInput = ({ 
    label, 
    value, 
    onChangeText, 
    icon, 
    placeholder, 
    keyboardType = 'default', 
    labelCentered = false,
  }: ProfileInputProps) => (
    <View style={styles.inputSection}>
      <Text style={[theme.typography.label, { color: theme.colors.text, marginBottom: 8, textAlign: labelCentered ? 'center' : 'left' }]}>{label}</Text>
      <NeumorphicInset style={styles.inputWrapper}>
        <View style={styles.inputContent}>
          {icon && (
            <View style={{ position: 'absolute', left: 0, height: '100%', justifyContent: 'center', zIndex: 1 }}>
              <Icon name={icon} size={20} color={theme.colors.primary} iconSet={ICON_SETS.MATERIAL_COMMUNITY} />
            </View>
          )}
          <TextInput
            style={[styles.input, { color: theme.colors.text, textAlign: 'center', paddingVertical: 0 }]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
            keyboardType={keyboardType}
          />
        </View>
      </NeumorphicInset>
    </View>
  );

  return (
    <View style={styles.viewContainer}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.primary, marginBottom: 20, textAlign: 'center' }]}>Profile Details</Text>
        
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <ProfileInput 
              label="First Name" 
              value={firstName} 
              onChangeText={(val: string) => setProfileData({ firstName: val })}
              icon={ICONS.ACCOUNT_OUTLINE}
              placeholder="First Name"
            />
          </View>
          <View style={{ flex: 1 }}>
            <ProfileInput 
              label="Last Name" 
              value={lastName} 
              onChangeText={(val: string) => setProfileData({ lastName: val })}
              icon={ICONS.ACCOUNT_OUTLINE}
              placeholder="Last Name"
            />
          </View>
        </View>

        <ProfileInput 
          label="Email Address" 
          value={email} 
          onChangeText={(val: string) => setProfileData({ email: val })}
          icon={ICONS.EMAIL}
          placeholder="Email Address"
          keyboardType="email-address"
        />

        <ProfileInput 
          label="Phone Number" 
          value={phone} 
          onChangeText={(val: string) => setProfileData({ phone: val })}
          icon={ICONS.PHONE}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <ProfileInput 
              label="Age" 
              value={age} 
              onChangeText={(val: string) => setProfileData({ age: val })}
              placeholder="--"
              keyboardType="number-pad"
              labelCentered
            />
          </View>
          <View style={{ flex: 3 }}>
            <Text style={[theme.typography.label, { color: theme.colors.text, marginBottom: 8, textAlign: 'center' }]}>Gender</Text>
            <SegmentedSelector
              options={genderOptions}
              selectedValues={[gender]}
              onValueChange={(val) => setProfileData({ gender: val as 'male' | 'female' })}
              style={{ marginVertical: 0, marginHorizontal: 0, height: 48 }}
            />
          </View>
        </View>
      </View>

      <Divider style={{ marginVertical: 24 }} />

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.primary, marginBottom: 20, textAlign: 'center' }]}>Theme Preferences</Text>
        <SegmentedSelector
          options={themeOptions}
          selectedValues={[themeMode]}
          onValueChange={(val) => setThemeMode(val as 'auto' | 'light' | 'dark')}
          style={{ marginVertical: 0, marginHorizontal: 0, marginBottom: 8 }}
        />
      </View>

      <Divider style={{ marginVertical: 24 }} />

      {/* App Info */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <View style={styles.settingsRow}>
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>App Version</Text>
          <Text style={[theme.typography.bodybold, { color: theme.colors.text }]}>{Constants.expoConfig?.version || '1.0.0'}</Text>
        </View>
      </View>
    </View>
  );
};

const BugReportView: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const { closeOverlay } = useOverlay();
  const { firstName, lastName, email, phone } = useProfile();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Missing Info', 'Please provide a title and description.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const metadata = `
--- User Profile ---
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

--- Divine Metadata ---
OS: ${Platform.OS} ${Platform.Version}
Model: ${Device.modelName}
Brand: ${Device.brand}
App Version: ${Constants.expoConfig?.version}
Bundle ID: ${Constants.expoConfig?.ios?.bundleIdentifier || Constants.expoConfig?.android?.package}
Timestamp: ${new Date().toISOString()}
------------------------
      `;

      await submitBugReport({
        app_id: 'milcalc',
        email: email || 'anonymous@milcalc.app',
        severity: 'medium',
        description: `${title}\n\n${description}\n\n${metadata}`,
        status: 'new',
      });

      setIsSubmitting(false);
      Alert.alert('Thank You', 'Your bug report has been submitted.', [
        { text: 'OK', onPress: closeOverlay }
      ]);
    } catch (error) {
      console.error('Submission failed:', error);
      setIsSubmitting(false);
      Alert.alert('Submission Failed', 'Please try again later or check your connection.');
    }
  };

  return (
    <View style={styles.viewContainer}>
      <Text style={[theme.typography.header, { color: theme.colors.text, marginBottom: theme.spacing.m }]}>Report a Bug</Text>
      
      <Text style={[theme.typography.label, { color: theme.colors.text, marginBottom: theme.spacing.xs }]}>Title</Text>
      <NeumorphicInset style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder="What's the issue?"
          placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
          value={title}
          onChangeText={setTitle}
        />
      </NeumorphicInset>

      <Text style={[theme.typography.label, { color: theme.colors.text, marginTop: theme.spacing.m, marginBottom: theme.spacing.xs }]}>Description</Text>
      <NeumorphicInset style={[styles.inputWrapper, { height: 120, alignItems: 'flex-start', paddingTop: theme.spacing.s }]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text, textAlignVertical: 'top' }]}
          placeholder="Describe what happened..."
          placeholderTextColor={isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </NeumorphicInset>

      <PillButton
        title={isSubmitting ? "Submitting..." : "Submit Report"}
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={{ marginTop: theme.spacing.xl }}
        icon={ICONS.SEND}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  viewContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  section: {
    marginBottom: 16,
  },
  inputSection: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 16,
  },
  menuIconContent: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  inputWrapper: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    fontSize: 16,
    flex: 1,
  },
});
