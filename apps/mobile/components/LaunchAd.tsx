import {
  getAlphaColor,
  Icon,
  ICON_SETS,
  NeumorphicOutset,
  useTheme,
} from "@repo/ui";
import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import splashImage from "../assets/3d_splash.png";

const { width, height } = Dimensions.get("window");

interface LaunchAdProps {
  onSkip: () => void;
}

export const LaunchAd: React.FC<LaunchAdProps> = ({ onSkip }) => {
  const { theme, isDarkMode } = useTheme();
  const [canSkip, setCanSkip] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5);

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1.15)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: theme.colors.background,
          zIndex: 9999,
        },
        backgroundWrapper: {
          ...StyleSheet.absoluteFillObject,
          overflow: "hidden",
        },
        backgroundImage: {
          ...StyleSheet.absoluteFillObject,
          width,
          height,
        },
        overlay: {
          ...StyleSheet.absoluteFillObject,
          backgroundColor: getAlphaColor(theme.colors.background, 0.4),
        },
        content: {
          flex: 1,
          padding: theme.spacing.l,
          justifyContent: "space-between",
          paddingTop: 80,
          paddingBottom: 40,
        },
        topSection: {
          alignItems: "flex-start",
        },
        badgeContainer: {
          borderRadius: 12,
          marginBottom: theme.spacing.xl,
        },
        badgeContent: {
          backgroundColor: getAlphaColor(theme.colors.warning, 0.9),
          paddingHorizontal: theme.spacing.m,
          paddingVertical: 6,
          borderRadius: 12,
        },
        mainTitle: {
          ...theme.typography.hero,
          color: theme.colors.primary,
          fontSize: 48,
          lineHeight: 52,
          letterSpacing: -1,
          textAlign: "left",
          textShadowColor: getAlphaColor(theme.colors.primary, 0.3),
          textShadowOffset: { width: 0, height: 8 },
          textShadowRadius: 15,
        },
        subtitle: {
          ...theme.typography.header,
          color: theme.colors.text,
          fontSize: 24,
          marginTop: theme.spacing.s,
          opacity: 0.9,
        },
        description: {
          ...theme.typography.body,
          color: theme.colors.text,
          marginTop: theme.spacing.l,
          opacity: 0.7,
          lineHeight: 22,
          maxWidth: "85%",
        },
        footer: {
          width: "100%",
          alignItems: "center",
        },
        skipButtonWrapper: {
          width: "100%",
          maxWidth: 200,
          borderRadius: 20,
          overflow: "hidden",
        },
        skipButtonContent: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: theme.spacing.m,
          borderRadius: 20,
          overflow: "hidden",
        },
        progressIndicator: {
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          backgroundColor: getAlphaColor(theme.colors.primary, 0.15),
        },
        badgeText: {
          color: getAlphaColor("#000000", 1),
          fontWeight: "800" as const,
          letterSpacing: 1,
        },
        skipButtonTouch: {
          width: "100%",
          alignItems: "center",
        },
        skipIcon: {
          marginLeft: theme.spacing.s,
        },
        skipOutsetContainer: {
          borderRadius: 20,
        },
        skipButtonText: {
          color: theme.colors.text,
          fontWeight: "600" as const,
        },
        skipButtonTextActive: {
          opacity: 1,
        },
        skipButtonTextDisabled: {
          opacity: 0.6,
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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(contentFadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(contentTranslateY, {
            toValue: 0,
            duration: 1000,
            easing: Easing.out(Easing.back(1)),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    // Progress bar for skip
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) setCanSkip(true);
    });

    // Countdown logic
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [contentFadeAnim, contentTranslateY, fadeAnim, progressAnim, scaleAnim]);

  const handleSkip = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => onSkip());
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.backgroundWrapper}>
        <Animated.Image
          source={splashImage}
          style={[
            styles.backgroundImage,
            { transform: [{ scale: scaleAnim }] },
          ]}
          resizeMode="cover"
        />
        <BlurView
          intensity={isDarkMode ? 30 : 50}
          style={StyleSheet.absoluteFill}
          tint={isDarkMode ? "dark" : "light"}
        />
        <View style={styles.overlay} />
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.topSection,
            {
              opacity: contentFadeAnim,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <NeumorphicOutset
            containerStyle={styles.badgeContainer}
            contentStyle={styles.badgeContent}
          >
            <Text style={[theme.typography.caption, styles.badgeText]}>
              PRO FEATURE
            </Text>
          </NeumorphicOutset>

          <Text style={styles.mainTitle}>MILITARY{"\n"}PRECISION</Text>
          <Text style={styles.subtitle}>Unlock your full potential.</Text>
          <Text style={styles.description}>
            Experience MilCalc at its peak with an ad-free environment and
            priority support from our veteran-led engineering team.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity: contentFadeAnim }]}>
          <TouchableOpacity
            disabled={!canSkip}
            onPress={handleSkip}
            activeOpacity={0.8}
            style={styles.skipButtonTouch}
          >
            <View style={styles.skipButtonWrapper}>
              <NeumorphicOutset
                containerStyle={styles.skipOutsetContainer}
                contentStyle={styles.skipButtonContent}
              >
                {!canSkip && (
                  <Animated.View
                    style={[styles.progressIndicator, { width: progressWidth }]}
                  />
                )}

                <Text
                  style={[
                    theme.typography.label,
                    styles.skipButtonText,
                    canSkip
                      ? styles.skipButtonTextActive
                      : styles.skipButtonTextDisabled,
                  ]}
                >
                  {canSkip
                    ? "CONTINUE TO APP"
                    : `READY IN ${secondsRemaining}S...`}
                </Text>

                {canSkip && (
                  <Icon
                    name="arrow-right"
                    size={18}
                    color={theme.colors.text}
                    iconSet={ICON_SETS.MATERIAL_COMMUNITY}
                    style={styles.skipIcon}
                  />
                )}
              </NeumorphicOutset>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};
