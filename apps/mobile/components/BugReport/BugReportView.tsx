import {
  Card,
  getAlphaColor,
  Icon,
  ICON_SETS,
  ICONS,
  NeumorphicInset,
  PillButton,
  SegmentedSelector,
  useTheme,
} from "@repo/ui";
import { submitBugReport } from "@repo/utils";
import Constants from "expo-constants";
import * as Device from "expo-device";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { useOverlay } from "../../contexts/OverlayContext";
import { useProfile } from "../../contexts/ProfileContext";
import DismissKeyboardView from "../DismissKeyboardView";
import FormField from "../FormField";

type BugCategory = "UI/UX" | "Calculation" | "Sync" | "Other";

export const BugReportView: React.FC = () => {
  const { theme } = useTheme();
  const { closeOverlay, setOverlayFooter } = useOverlay();
  const { firstName, lastName, email, phone, accountType } = useProfile();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<BugCategory>("UI/UX");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPremium = accountType === "premium";

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scrollView: {
          flex: 1,
        },
        scrollContent: {
          paddingHorizontal: 12, // Match MainCalculatorLayout content padding
          paddingTop: theme.spacing.s,
          paddingBottom: theme.spacing.xl * 2, // Increased to ensure content isn't hidden behind sticky footer
        },
        headerCard: {
          // Individually override NeumorphicOutset default margins
          marginTop: 0,
          marginBottom: theme.spacing.l, // Changed from small to large
          marginLeft: 0,
          marginRight: 0,
        },
        headerCardContent: {
          alignItems: "center",
          paddingVertical: 0, // Card already provides 16px padding
        },
        headerIconContainer: {
          marginBottom: theme.spacing.s, // Reduced from 16 to 8
        },
        headerIconBg: {
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
        },
        headerInset: {
          backgroundColor: getAlphaColor(theme.colors.error, 0.1),
        },
        headerTitle: {
          color: theme.colors.text,
          textAlign: "center" as const,
          textShadowColor: theme.colors.neumorphic.outset.shadow,
          textShadowRadius: 0.25,
          textShadowOffset: { width: 0, height: 0 },
        },
        priorityText: {
          color: theme.colors.primary,
          fontWeight: "700" as const,
          marginLeft: 6,
        },
        helpText: {
          color: theme.colors.text,
          textAlign: "center" as const,
          marginTop: theme.spacing.xs,
          opacity: 0.7,
        },
        priorityBadge: {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: getAlphaColor(theme.colors.primary, 0.1),
          paddingHorizontal: theme.spacing.m,
          paddingVertical: 6,
          borderRadius: 12,
          marginTop: theme.spacing.s,
          borderWidth: 1,
          borderColor: getAlphaColor(theme.colors.primary, 0.2),
        },
        formContainer: {
          gap: 0, // FormField has its own marginBottom: theme.spacing.m
        },
        formSection: {
          gap: theme.spacing.s,
          marginBottom: theme.spacing.m, // Match FormField marginBottom
        },
        labelRow: {
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: theme.spacing.xs,
        },
        textAreaWrapper: {
          height: 140,
        },
        textArea: {
          height: "100%",
          textAlignVertical: "top",
          textAlign: "left",
          left: 0,
          paddingTop: theme.spacing.xs,
        },
        selector: {
          // Individually override NeumorphicOutset default margins for the selector
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          paddingVertical: 0,
        },
        stickyFooter: {
          paddingHorizontal: theme.spacing.m,
          paddingBottom:
            Platform.OS === "ios" ? theme.spacing.m : theme.spacing.s,
          paddingTop: theme.spacing.s,
        },
        submitButton: {
          width: "100%",
        },
      }),
    [theme],
  );

  const categories: { label: string; value: BugCategory; icon: string }[] =
    useMemo(
      () => [
        { label: "UI/UX", value: "UI/UX", icon: "palette-outline" },
        { label: "Math", value: "Calculation", icon: "calculator" },
        { label: "Sync", value: "Sync", icon: "sync" },
        { label: "Other", value: "Other", icon: "dots-horizontal" },
      ],
      [],
    );

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert(
        "Incomplete Report",
        "Please provide a summary and description of the issue.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const metadata = `
--- User Profile ---
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Account Type: ${accountType}

--- System Metadata ---
OS: ${Platform.OS} ${Platform.Version}
Model: ${Device.modelName}
Brand: ${Device.brand}
App Version: ${Constants.expoConfig?.version}
Bundle ID: ${Constants.expoConfig?.ios?.bundleIdentifier || Constants.expoConfig?.android?.package}
Timestamp: ${new Date().toISOString()}
------------------------
      `;

      await submitBugReport({
        app_id: "milcalc",
        email: email || "anonymous@milcalc.app",
        severity: isPremium ? "high" : "medium",
        description: `[${category}] ${title}\n\n${description}\n\n${metadata}`,
        first_name: firstName,
        last_name: lastName,
        status: "new",
      });

      setIsSubmitting(false);
      Alert.alert(
        "Report Received",
        isPremium
          ? "Priority report received. Our team will review this immediately!"
          : "Thank you for helping us improve MilCalc. Our engineers are on it!",
        [{ text: "Dismiss", onPress: closeOverlay }],
      );
    } catch (error) {
      console.error("Submission failed:", error);
      setIsSubmitting(false);
      Alert.alert(
        "Transmission Error",
        "We couldn't send your report. Please check your connection and try again.",
      );
    }
  }, [
    title,
    description,
    firstName,
    lastName,
    email,
    phone,
    category,
    closeOverlay,
    isPremium,
    accountType,
  ]);

  // Memoize the footer content to ensure object identity stability
  const footerContent = useMemo(
    () => (
      <View style={styles.stickyFooter}>
        <PillButton
          title={isSubmitting ? "TRANSMITTING..." : "SUBMIT REPORT"}
          onPress={handleSubmit}
          disabled={isSubmitting}
          icon={ICONS.SEND}
          colorKey="primary"
          style={styles.submitButton}
        />
      </View>
    ),
    [isSubmitting, handleSubmit, styles.stickyFooter, styles.submitButton],
  );

  // Use a targeted effect to update the footer only when content changes
  useEffect(() => {
    setOverlayFooter(footerContent);
  }, [footerContent, setOverlayFooter]);

  // Cleanup effect: Ensure footer is cleared ONLY when component unmounts
  useEffect(() => {
    return () => setOverlayFooter(null);
  }, [setOverlayFooter]);

  return (
    <KeyboardAwareScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableAutomaticScroll={true}
    >
      <DismissKeyboardView>
        {/* Header Card */}
        <Card containerStyle={styles.headerCard}>
          <View style={styles.headerCardContent}>
            <View style={styles.headerIconContainer}>
              <NeumorphicInset
                containerStyle={[styles.headerIconBg, styles.headerInset]}
              >
                <Icon
                  name={ICONS.BUG}
                  size={36}
                  color={theme.colors.error}
                  iconSet={ICON_SETS.MATERIAL_COMMUNITY}
                />
              </NeumorphicInset>
            </View>
            <Text style={[theme.typography.title, styles.headerTitle]}>
              SUBMIT FEEDBACK
            </Text>

            {isPremium ? (
              <View style={styles.priorityBadge}>
                <Icon
                  name="shield-star"
                  size={16}
                  color={theme.colors.primary}
                  iconSet={ICON_SETS.MATERIAL_COMMUNITY}
                />
                <Text style={[theme.typography.caption, styles.priorityText]}>
                  PRIORITY SUPPORT ACTIVE
                </Text>
              </View>
            ) : (
              <Text style={[theme.typography.body, styles.helpText]}>
                Found a calculation error or a glitch? Let us know and
                we&apos;ll fix it.
              </Text>
            )}
          </View>
        </Card>

        {/* Form Sections */}
        <View style={styles.formContainer}>
          {/* Summary Input */}
          <FormField
            label="SUMMARY"
            icon="text-short"
            iconOnLabel
            placeholder="Briefly describe the issue"
            value={title}
            onChangeText={setTitle}
            maxLength={50}
            labelStyle={{ paddingTop: theme.spacing.m }}
          />

          {/* Category Selector */}
          <View style={styles.formSection}>
            <View style={styles.labelRow}>
              <Icon
                name="tag-outline"
                size={18}
                color={theme.colors.primary}
                iconSet={ICON_SETS.MATERIAL_COMMUNITY}
              />
              <Text
                style={[
                  theme.typography.bodybold,
                  { color: theme.colors.text, marginLeft: theme.spacing.s },
                ]}
              >
                CATEGORY
              </Text>
            </View>
            <SegmentedSelector
              options={categories}
              selectedValues={[category]}
              onValueChange={(val) => setCategory(val as BugCategory)}
              style={styles.selector}
            />
          </View>

          {/* Description Input */}
          <FormField
            label="DETAILS"
            icon="message-text-outline"
            iconOnLabel
            placeholder="Steps to reproduce or calculation details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            inputStyle={styles.textArea}
            insetStyle={styles.textAreaWrapper}
            containerStyle={{ marginBottom: theme.spacing.l }}
          />
        </View>
      </DismissKeyboardView>
    </KeyboardAwareScrollView>
  );
};
