import {
  Divider,
  getAlphaColor,
  Icon,
  ICON_SETS,
  ICONS,
  NeumorphicInset,
  NeumorphicOutset,
  SegmentedSelector,
  useTheme,
} from "@repo/ui";
import Constants from "expo-constants";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useOverlay } from "../contexts/OverlayContext";
import { useProfile } from "../contexts/ProfileContext";
import { BugReportView } from "./BugReport/BugReportView";
import { DonationSection } from "./DonationSection";
import FormField from "./FormField";
import Demographics from "./PtCalculator/Demographics";

export const MainOverlay: React.FC = () => {
  const { overlayType } = useOverlay();
  const { theme } = useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: overlayType === "BUG_REPORT" ? 1 : 0,
          paddingBottom: theme.spacing.m,
        },
      }),
    [theme, overlayType],
  );

  const renderContent = () => {
    switch (overlayType) {
      case "MENU":
        return <MenuView />;
      case "ACCOUNT":
      case "PROFILE":
      case "SETTINGS":
        return <AccountView />;
      case "BUG_REPORT":
        return <BugReportView />;
      case "PAYWALL":
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

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        viewContainer: {
          paddingHorizontal: theme.spacing.m,
          paddingTop: theme.spacing.s,
        },
        menuItem: {
          flexDirection: "row",
          alignItems: "center",
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
          justifyContent: "center",
          alignItems: "center",
        },
      }),
    [theme],
  );

  const handleBugReportPress = () => {
    if (isProfileComplete) {
      openOverlay("BUG_REPORT");
    } else {
      Alert.alert(
        "Profile Incomplete",
        "Please complete your profile details (First Name, Last Name, and Email) before reporting a bug so we can follow up with you.",
        [
          { text: "Later", style: "cancel" },
          {
            text: "Update Profile",
            onPress: () => openOverlay("PROFILE"),
          },
        ],
      );
    }
  };

  const MenuItem = ({
    title,
    icon,
    onPress,
  }: {
    title: string;
    icon: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <NeumorphicOutset
        containerStyle={styles.menuIconContainer}
        contentStyle={styles.menuIconContent}
      >
        <Icon
          name={icon}
          size={24}
          color={theme.colors.primary}
          iconSet={ICON_SETS.MATERIAL_COMMUNITY}
        />
      </NeumorphicOutset>
      <Text style={[theme.typography.label, { color: theme.colors.text }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.viewContainer}>
      <MenuItem
        title="My Account"
        icon={ICONS.ACCOUNT}
        onPress={() => openOverlay("ACCOUNT")}
      />
      <MenuItem
        title="Report a Bug"
        icon={ICONS.BUG}
        onPress={handleBugReportPress}
      />
    </View>
  );
};

const AccountView: React.FC = () => {
  const { theme, setThemeMode, themeMode } = useTheme();
  const {
    firstName,
    lastName,
    email,
    phone,
    age,
    gender,
    accountType,
    setProfileData,
  } = useProfile();
  const { openOverlay } = useOverlay();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
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
          textAlign: "center",
          textShadowColor: theme.colors.neumorphic.outset.shadow,
          textShadowRadius: 0.25,
          textShadowOffset: { width: 0, height: 0 },
        },
        row: {
          flexDirection: "row",
          alignItems: "flex-end",
          marginBottom: theme.spacing.xs,
        },
        settingsRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: theme.spacing.s,
        },
        supportPrompt: {
          borderRadius: 16,
          marginTop: theme.spacing.s,
        },
        supportContent: {
          borderRadius: 16,
          paddingVertical: theme.spacing.m,
          paddingHorizontal: theme.spacing.l,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing.m,
        },
        halfContainerRightMargin: {
          flex: 1,
          marginRight: theme.spacing.m,
        },
        halfContainer: {
          flex: 1,
        },
        centeredInput: {
          textAlign: "center" as const,
        },
        dividerMargin: {
          marginVertical: theme.spacing.m,
        },
        lastSection: {
          marginBottom: theme.spacing.xl,
        },
      }),
    [theme],
  );

  const themeOptions = [
    { label: "Auto", value: "auto", icon: ICONS.THEME_AUTO },
    { label: "Light", value: "light", icon: ICONS.THEME_LIGHT },
    { label: "Dark", value: "dark", icon: ICONS.THEME_DARK },
  ];

  const accountOptions = [
    { label: "Free", value: "free", icon: ICONS.STAR_OUTLINE },
    { label: "Premium", value: "premium", icon: ICONS.CROWN },
  ];

  const handleAccountTypeChange = (val: string) => {
    if (val === "premium" && accountType === "free") {
      openOverlay("PAYWALL");
    } else {
      setProfileData({ accountType: val as "free" | "premium" });
    }
  };

  return (
    <View style={styles.viewContainer}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.headerText}>Profile Details</Text>

        <View style={styles.row}>
          <View style={styles.halfContainerRightMargin}>
            <FormField
              label="First Name"
              value={firstName}
              onChangeText={(val: string) => setProfileData({ firstName: val })}
              icon={ICONS.ACCOUNT_OUTLINE}
              placeholder="First Name"
              inputStyle={styles.centeredInput}
            />
          </View>
          <View style={styles.halfContainer}>
            <FormField
              label="Last Name"
              value={lastName}
              onChangeText={(val: string) => setProfileData({ lastName: val })}
              icon={ICONS.ACCOUNT_OUTLINE}
              placeholder="Last Name"
              inputStyle={styles.centeredInput}
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
          inputStyle={styles.centeredInput}
        />

        <FormField
          label="Phone Number"
          value={phone}
          onChangeText={(val: string) => setProfileData({ phone: val })}
          icon={ICONS.PHONE}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          inputStyle={styles.centeredInput}
        />

        <Demographics
          age={age}
          setAge={(val) => setProfileData({ age: val })}
          gender={gender}
          setGender={(val) =>
            setProfileData({ gender: val as "male" | "female" })
          }
          inputStyle={styles.centeredInput}
        />
      </View>

      <Divider style={styles.dividerMargin} />

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.headerText}>Theme Preferences</Text>
        <SegmentedSelector
          options={themeOptions}
          selectedValues={[themeMode]}
          onValueChange={(val) =>
            setThemeMode(val as "auto" | "light" | "dark")
          }
        />
      </View>

      <Divider style={styles.dividerMargin} />

      {/* Account Type Section */}
      <View style={styles.section}>
        <Text style={styles.headerText}>Account Type</Text>
        <SegmentedSelector
          options={accountOptions}
          selectedValues={[accountType]}
          onValueChange={handleAccountTypeChange}
        />
      </View>

      <Divider style={styles.dividerMargin} />

      {/* Support Prompt */}
      <TouchableOpacity
        onPress={() => openOverlay("PAYWALL")}
        activeOpacity={0.85}
      >
        <NeumorphicInset
          containerStyle={styles.supportPrompt}
          contentStyle={styles.supportContent}
        >
          <Icon
            name="heart-outline"
            size={20}
            color={theme.colors.primary}
            iconSet={ICON_SETS.MATERIAL_COMMUNITY}
          />
          <Text
            style={[theme.typography.bodybold, { color: theme.colors.text }]}
          >
            Help us stay free
          </Text>
          <Icon
            name="chevron-right"
            size={20}
            color={getAlphaColor(theme.colors.text, 0.35)}
            iconSet={ICON_SETS.MATERIAL_COMMUNITY}
          />
        </NeumorphicInset>
      </TouchableOpacity>

      <Divider style={styles.dividerMargin} />

      {/* App Info */}
      <View style={[styles.section, styles.lastSection]}>
        <View style={styles.settingsRow}>
          <Text style={[theme.typography.body, { color: theme.colors.text }]}>
            App Version
          </Text>
          <Text
            style={[theme.typography.bodybold, { color: theme.colors.text }]}
          >
            {Constants.expoConfig?.version || "1.0.0"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const PaywallView: React.FC = () => {
  const { theme } = useTheme();
  const { setProfileData } = useProfile();
  const { openOverlay } = useOverlay();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        viewContainer: {
          paddingHorizontal: theme.spacing.m,
          paddingTop: theme.spacing.s,
          paddingBottom: theme.spacing.l,
        },
      }),
    [theme],
  );

  const handleUpgrade = () => {
    setProfileData({ accountType: "premium" });
    Alert.alert("Success", "Welcome to MilCalc Premium!");
    openOverlay("ACCOUNT");
  };

  return (
    <View style={styles.viewContainer}>
      {/* Integrated Premium & Donation Section */}
      <DonationSection
        onDonationComplete={() => openOverlay("ACCOUNT")}
        onUpgradePress={handleUpgrade}
      />
    </View>
  );
};
