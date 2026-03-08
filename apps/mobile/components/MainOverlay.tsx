import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useTheme, Icon, ICONS, ICON_SETS, NeumorphicOutset, NeumorphicInset, PillButton, Divider, useDemographicsState } from '@repo/ui';
import { useOverlay } from '../contexts/OverlayContext';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { submitBugReport } from '@repo/utils';

export const MainOverlay: React.FC = () => {
  const { overlayType } = useOverlay();

  const renderContent = () => {
    switch (overlayType) {
      case 'MENU':
        return <MenuView />;
      case 'PROFILE':
        return <ProfileView />;
      case 'SETTINGS':
        return <SettingsView />;
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
      <Text style={[theme.typography.title, { color: theme.colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.viewContainer}>
      <MenuItem title="My Profile" icon={ICONS.ACCOUNT} onPress={() => openOverlay('PROFILE')} />
      <MenuItem title="Settings" icon={ICONS.SETTINGS} onPress={() => openOverlay('SETTINGS')} />
      <MenuItem title="Report a Bug" icon={ICONS.BUG} onPress={() => openOverlay('BUG_REPORT')} />
    </View>
  );
};

const ProfileView: React.FC = () => {
  const { theme } = useTheme();
  const { age, gender } = useDemographicsState();

  return (
    <View style={styles.viewContainer}>
      <Text style={[theme.typography.header, { color: theme.colors.text, marginBottom: theme.spacing.m }]}>My Profile</Text>
      <Text style={[theme.typography.body, { color: theme.colors.text, marginBottom: theme.spacing.m }]}>
        These settings are used across all calculators for accurate calculations.
      </Text>
      
      <View style={styles.profileDetail}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text, opacity: 0.7 }]}>Age</Text>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>{age || 'Not set'}</Text>
      </View>

      <View style={styles.profileDetail}>
        <Text style={[theme.typography.subtitle, { color: theme.colors.text, opacity: 0.7 }]}>Gender</Text>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>{gender || 'Not set'}</Text>
      </View>
      
      <Text style={[theme.typography.caption, { color: theme.colors.text, marginTop: theme.spacing.m, opacity: 0.5, textAlign: 'center' }]}>
        Edit these details in any of the calculator tabs.
      </Text>
    </View>
  );
};

const SettingsView: React.FC = () => {
  const { theme, toggleTheme, themeMode } = useTheme();

  return (
    <View style={styles.viewContainer}>
      <Text style={[theme.typography.header, { color: theme.colors.text, marginBottom: theme.spacing.m }]}>Settings</Text>
      
      <TouchableOpacity onPress={toggleTheme} style={styles.settingsRow}>
        <View style={styles.settingsLabel}>
          <Icon 
            name={themeMode === 'light' ? ICONS.THEME_LIGHT : themeMode === 'dark' ? ICONS.THEME_DARK : ICONS.THEME_AUTO} 
            size={24} 
            color={theme.colors.text} 
            iconSet={ICON_SETS.MATERIAL_COMMUNITY} 
          />
          <Text style={[theme.typography.title, { color: theme.colors.text, marginLeft: theme.spacing.m }]}>Theme Mode</Text>
        </View>
        <Text style={[theme.typography.subtitle, { color: theme.colors.primary }]}>{themeMode.toUpperCase()}</Text>
      </TouchableOpacity>
      
      <Divider />
      
      <View style={styles.settingsRow}>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>App Version</Text>
        <Text style={[theme.typography.bodybold, { color: theme.colors.text }]}>{Constants.expoConfig?.version || '1.0.0'}</Text>
      </View>
      
      <View style={styles.settingsRow}>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>Device</Text>
        <Text style={[theme.typography.bodybold, { color: theme.colors.text }]}>{Device.modelName || 'Unknown Device'}</Text>
      </View>
    </View>
  );
};

const BugReportView: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const { closeOverlay } = useOverlay();
  const { age, gender } = useDemographicsState();
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
        email: 'anonymous@milcalc.app',
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
  profileDetail: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingBottom: 5,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  settingsLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    flex: 1,
  },
});
