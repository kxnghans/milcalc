import {
  getAlphaColor,
  Icon,
  ICON_SETS,
  ICONS,
  NeumorphicInset,
  NeumorphicOutset,
  PillButton,
  useTheme,
} from "@repo/ui";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useProfile } from "../contexts/ProfileContext";
import { DonationSection } from "./DonationSection";

interface FullScreenPaywallProps {
  onComplete: () => void;
}

export const FullScreenPaywall: React.FC<FullScreenPaywallProps> = ({
  onComplete,
}) => {
  const { theme, isDarkMode } = useTheme();
  const { setProfileData } = useProfile();

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(30)).current;
  const featureAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: theme.colors.background,
          zIndex: 10000,
        },
        glowCircle: {
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: 200,
          opacity: 0.6,
        },
        scrollContent: {
          padding: theme.spacing.l,
          paddingTop: 80,
          paddingBottom: 60,
        },
        header: {
          alignItems: "center",
          marginBottom: 30,
        },
        heroIconContainer: {
          width: 120,
          height: 120,
          borderRadius: 60,
        },
        heroIconContent: {
          width: 120,
          height: 120,
          borderRadius: 60,
          justifyContent: "center",
          alignItems: "center",
        },
        brandText: {
          ...theme.typography.hero,
          fontSize: 42,
          color: theme.colors.text,
          marginTop: theme.spacing.l,
          textAlign: "center",
        },
        proText: {
          color: theme.colors.primary,
          fontWeight: "900",
        },
        tagline: {
          ...theme.typography.title,
          color: theme.colors.text,
          opacity: 0.6,
          marginTop: 4,
          textAlign: "center",
        },
        featuresContainer: {
          marginBottom: 40,
          gap: theme.spacing.m,
        },
        featureCard: {
          borderRadius: 20,
          padding: theme.spacing.m,
          flexDirection: "row",
          alignItems: "center",
        },
        featureIconBox: {
          width: 54,
          height: 54,
        },
        featureIconInner: {
          width: 54,
          height: 54,
          justifyContent: "center",
          alignItems: "center",
        },
        footer: {
          alignItems: "center",
        },
        glassPriceCard: {
          width: "100%",
          borderRadius: 24,
          padding: 24,
          marginBottom: 24,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: getAlphaColor("#FFFFFF", 0.1),
          alignItems: "center",
        },
        priceText: {
          ...theme.typography.hero,
          fontSize: 48,
          color: theme.colors.text,
        },
        priceSub: {
          ...theme.typography.body,
          opacity: 0.5,
          fontSize: 18,
        },
        upgradeButton: {
          width: "100%",
          height: 64,
          borderRadius: 32,
        },
        skipText: {
          ...theme.typography.label,
          color: theme.colors.text,
          opacity: 0.5,
          marginTop: 20,
        },
        featureCardOutset: {
          borderRadius: 20,
        },
        featureIconBoxInset: {
          borderRadius: 18,
          marginRight: theme.spacing.m,
        },
        flexItem: {
          flex: 1,
        },
        featureTitleText: {
          color: theme.colors.text,
        },
        featureDescText: {
          color: theme.colors.text,
          opacity: 0.6,
          marginTop: 2,
        },
        glowCirclePrimary: {
          top: -100,
          left: -100,
        },
        glowCircleSecondary: {
          bottom: -100,
          right: -100,
        },
        priceRow: {
          flexDirection: "row" as const,
          alignItems: "baseline" as const,
        },
        supportVeteranText: {
          color: theme.colors.text,
          opacity: 0.4,
          marginTop: 8,
        },
        upgradeButtonText: {
          fontSize: 18,
          letterSpacing: 1,
        },
        skipButtonContainer: {
          marginTop: 40,
          alignSelf: "center" as const,
        },
      }),
    [theme],
  );

  useEffect(() => {
    // Entrance Sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
    ]).start();

    // Staggered features
    Animated.stagger(
      150,
      featureAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [contentTranslateY, fadeAnim, featureAnims, glowAnim]);

  const handleUpgrade = () => {
    setProfileData({ accountType: "premium" });
    onComplete();
  };

  const FeatureItem = ({
    icon,
    title,
    description,
    index,
  }: {
    icon: string;
    title: string;
    description: string;
    index: number;
  }) => (
    <Animated.View
      style={{
        opacity: featureAnims[index],
        transform: [
          {
            translateX: featureAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
      }}
    >
      <NeumorphicOutset
        containerStyle={styles.featureCardOutset}
        contentStyle={styles.featureCard}
      >
        <NeumorphicInset
          containerStyle={[styles.featureIconBox, styles.featureIconBoxInset]}
          contentStyle={styles.featureIconInner}
        >
          <Icon
            name={icon}
            size={24}
            color={theme.colors.primary}
            iconSet={ICON_SETS.MATERIAL_COMMUNITY}
          />
        </NeumorphicInset>
        <View style={styles.flexItem}>
          <Text style={[theme.typography.bodybold, styles.featureTitleText]}>
            {title}
          </Text>
          <Text style={[theme.typography.caption, styles.featureDescText]}>
            {description}
          </Text>
        </View>
      </NeumorphicOutset>
    </Animated.View>
  );

  const glowTranslateX = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 50],
  });
  const glowTranslateY = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 30],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Dynamic Background Glows */}
      <Animated.View
        style={[
          styles.glowCircle,
          styles.glowCirclePrimary,
          {
            backgroundColor: getAlphaColor(theme.colors.primary, 0.12),
            transform: [
              { translateX: glowTranslateX },
              { translateY: glowTranslateY },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.glowCircle,
          styles.glowCircleSecondary,
          {
            backgroundColor: getAlphaColor(theme.colors.secondary, 0.08),
            transform: [
              { translateX: Animated.multiply(glowTranslateX, -1) },
              { translateY: Animated.multiply(glowTranslateY, -1) },
            ],
          },
        ]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{ transform: [{ translateY: contentTranslateY }] }}
        >
          <View style={styles.header}>
            <NeumorphicOutset
              containerStyle={styles.heroIconContainer}
              contentStyle={styles.heroIconContent}
              highlightColor={getAlphaColor(theme.colors.primary, 0.4)}
            >
              <Icon
                name={ICONS.CROWN}
                size={54}
                color={theme.colors.primary}
                iconSet={ICON_SETS.MATERIAL_COMMUNITY}
              />
            </NeumorphicOutset>

            <Text style={styles.brandText}>
              MilCalc <Text style={styles.proText}>PRO</Text>
            </Text>
            <Text style={styles.tagline}>
              The standard for military excellence.
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <FeatureItem
              index={0}
              icon="shield-star"
              title="Ad-Free Experience"
              description="Focus on your mission, no distractions."
            />
            <FeatureItem
              index={1}
              icon="headset"
              title="Priority Support"
              description="Fast-lane response for all your questions."
            />
          </View>

          <View style={styles.footer}>
            <BlurView
              intensity={isDarkMode ? 20 : 40}
              style={styles.glassPriceCard}
              tint={isDarkMode ? "dark" : "light"}
            >
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>$0.99</Text>
                <Text style={styles.priceSub}> / month</Text>
              </View>
              <Text
                style={[theme.typography.caption, styles.supportVeteranText]}
              >
                Support our veteran-led initiative
              </Text>
            </BlurView>

            <PillButton
              title="UPGRADE TO PRO"
              onPress={handleUpgrade}
              containerStyle={styles.upgradeButton}
              textStyle={[theme.typography.header, styles.upgradeButtonText]}
              colorKey="primary"
            />
          </View>

          {/* Reusable Donation Section */}
          <DonationSection onDonationComplete={onComplete} />

          <TouchableOpacity
            onPress={onComplete}
            activeOpacity={0.7}
            style={styles.skipButtonContainer}
          >
            <Text style={styles.skipText}>Not right now</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
};
