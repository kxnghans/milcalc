import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../contexts/ThemeContext";
import { ICON_SETS, ICONS } from "../icons";
import { getAlphaColor } from "../theme";
import { BouncingChevron } from "./BouncingChevron";
import { Icon } from "./Icon";
import NeumorphicOutset from "./NeumorphicOutset";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SPRING_CONFIG = {
  damping: 50,
  stiffness: 120,
  mass: 1.0,
  overshootClamping: false,
};

interface BottomSheetProps {
  children: React.ReactNode;
  isVisible?: boolean;
  snapPoints?: number[];
  snapToIndex?: number;
  onSnap?: (index: number) => void;
  backgroundColor?: string;
  mode?: "default" | "standard";
  headerHeight?: number;
  peekHeight?: number;
  midpointRatio?: number;
  keyboardMidpointRatio?: number;
  onBackdropPress?: () => void;
  onClose?: () => void;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
  showCloseButton?: boolean;
  isScrollable?: boolean;
  footer?: React.ReactNode;
}

export function BottomSheet({
  children,
  isVisible = true,
  snapPoints: providedSnapPoints,
  snapToIndex = 0,
  onSnap,
  backgroundColor,
  mode = "default",
  headerHeight = 0,
  peekHeight = 0,
  midpointRatio = 0.45,
  keyboardMidpointRatio = 0.6,
  onBackdropPress,
  onClose,
  title,
  titleStyle,
  showCloseButton = true,
  isScrollable = true,
  footer,
}: BottomSheetProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const sheetBackgroundColor = backgroundColor ?? theme.colors.surface;

  const [activeMidpointRatio, setActiveMidpointRatio] = useState(midpointRatio);
  const [contentHeight, setContentHeight] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  const isActuallyScrollable = isScrollable && contentHeight > layoutHeight;
  const isAtBottom = layoutHeight + scrollOffset >= contentHeight - 20;
  const isAtTop = scrollOffset <= 10;

  useEffect(() => {
    setActiveMidpointRatio(midpointRatio);
  }, [midpointRatio]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setActiveMidpointRatio(keyboardMidpointRatio);
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setActiveMidpointRatio(midpointRatio);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [midpointRatio, keyboardMidpointRatio]);

  const snapPoints = useMemo(() => {
    // Respect the ScreenHeader height (44 minHeight + 8 spacing.s)
    const HEADER_CONTENT_HEIGHT = 44;
    const effectiveHeaderHeight =
      headerHeight > 0 ? headerHeight : insets.top + HEADER_CONTENT_HEIGHT;

    const maxSnap = SCREEN_HEIGHT - effectiveHeaderHeight;
    const peekSnap = peekHeight > 0 ? peekHeight : 0;

    if (mode === "standard") {
      return [peekSnap, SCREEN_HEIGHT * activeMidpointRatio, maxSnap];
    }

    return (
      providedSnapPoints ?? [40 + insets.bottom, SCREEN_HEIGHT * 0.4, maxSnap]
    );
  }, [
    providedSnapPoints,
    mode,
    headerHeight,
    activeMidpointRatio,
    peekHeight,
    insets.bottom,
    insets.top,
  ]);

  const height = useSharedValue(snapPoints[snapToIndex] ?? 0);
  const context = useSharedValue(0);
  const lastHapticIndex = useSharedValue(snapToIndex);

  const isGesturingRef = useRef(false);
  const snapPointsRef = useRef(snapPoints);

  useEffect(() => {
    snapPointsRef.current = snapPoints;
  }, [snapPoints]);

  const triggerHaptic = (
    style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
  ) => {
    void Haptics.impactAsync(style);
  };

  const setGesturing = React.useCallback((v: boolean) => {
    isGesturingRef.current = v;
  }, []);

  useEffect(() => {
    if (isGesturingRef.current) return;
    const targetHeight = snapPointsRef.current[snapToIndex] ?? 0;

    if (Math.abs(height.value - targetHeight) > 0.1) {
      height.value = withSpring(targetHeight, SPRING_CONFIG);
    }
  }, [snapToIndex, height, snapPoints]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = height.value;
      runOnJS(setGesturing)(true);
      runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Medium);
    })
    .onUpdate((event) => {
      const newHeight = context.value - event.translationY;
      const minHeight = snapPoints[0] ?? 0;
      const maxHeight = snapPoints[snapPoints.length - 1] ?? SCREEN_HEIGHT;

      // Add a small buffer for smoother transition from ScrollView to Sheet drag
      if (isScrollable && scrollOffset > 0 && height.value >= maxHeight - 1) {
        return;
      }

      if (newHeight < minHeight) {
        const overflow = minHeight - newHeight;
        height.value = minHeight - Math.log(overflow + 1) * 10;
      } else if (newHeight > maxHeight) {
        const overflow = newHeight - maxHeight;
        height.value = maxHeight + Math.log(overflow + 1) * 10;
      } else {
        height.value = newHeight;
      }

      snapPoints.forEach((point, index) => {
        if (
          Math.abs(height.value - point) < 12 &&
          lastHapticIndex.value !== index
        ) {
          lastHapticIndex.value = index;
          runOnJS(triggerHaptic)(Haptics.ImpactFeedbackStyle.Light);
        }
      });
    })
    .onEnd((event) => {
      const projectedHeight = height.value - event.velocityY * 0.15; // Increased projection

      let closestIndex = 0;
      let minDistance = Math.abs(projectedHeight - (snapPoints[0] ?? 0));

      for (let i = 1; i < snapPoints.length; i++) {
        const point = snapPoints[i] ?? 0;
        const distance = Math.abs(projectedHeight - point);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      // Handle flick gestures more aggressively
      if (Math.abs(event.velocityY) > 500) {
        if (event.velocityY > 0) {
          closestIndex = Math.max(0, lastHapticIndex.value - 1);
        } else {
          closestIndex = Math.min(
            snapPoints.length - 1,
            lastHapticIndex.value + 1,
          );
        }
      }

      const targetHeight = snapPoints[closestIndex] ?? 0;
      height.value = withSpring(targetHeight, {
        ...SPRING_CONFIG,
        velocity: -event.velocityY,
      });

      runOnJS(setGesturing)(false);

      if (closestIndex === 0 && onClose) {
        runOnJS(onClose)();
      }
      if (onSnap) {
        runOnJS(onSnap)(closestIndex);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const backdropStyle = useAnimatedStyle(() => {
    const closed = snapPoints[0] ?? 0;
    const midpoint = snapPoints[1] ?? 0;
    const maxHeight = snapPoints[snapPoints.length - 1] ?? SCREEN_HEIGHT;

    const opacity = interpolate(
      height.value,
      [closed, midpoint, maxHeight],
      [0, 0.2, 0.4],
      Extrapolation.CLAMP,
    );

    return { opacity };
  }, [snapPoints]);

  const handleBackdropPress = () => {
    Keyboard.dismiss();
    if (onClose) {
      onClose();
    } else if (onBackdropPress) {
      onBackdropPress();
    }
  };

  if (!isVisible) return null;

  const styles = StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: getAlphaColor("#000000", 1),
      zIndex: 9999,
    },
    container: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: sheetBackgroundColor,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      shadowColor: theme.colors.neumorphic.outset.shadow,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 10,
      zIndex: 10000,
      overflow: "hidden",
    },
    handleContainer: {
      height: 32,
      alignItems: "center",
      justifyContent: "center",
    },
    handle: {
      width: 40,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: theme.colors.text,
      opacity: 0.2,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing.m,
      paddingBottom: theme.spacing.m,
    },
    headerSpacer: { width: 34 },
    title: {
      textAlign: "center",
      flex: 1,
      ...theme.typography.header,
      color: theme.colors.text,
    },
    closeButtonContainer: { borderRadius: 17, width: 34, height: 34 },
    closeButtonContent: {
      borderRadius: 17,
      width: 34,
      height: 34,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
    },
    closeButtonTouch: { padding: 8 },
    scrollIndicatorWrapper: {
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    body: { flex: 1 },
  });

  return (
    <>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <Animated.View
          style={[styles.backdrop, backdropStyle]}
          pointerEvents={snapToIndex > 0 ? "auto" : "none"}
        />
      </TouchableWithoutFeedback>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.container, animatedStyle]}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {(!!title || showCloseButton) && (
            <View style={styles.header}>
              <View style={styles.headerSpacer} />
              {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
              {showCloseButton ? (
                <NeumorphicOutset
                  containerStyle={styles.closeButtonContainer}
                  contentStyle={styles.closeButtonContent}
                >
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButtonTouch}
                  >
                    <Icon
                      name={ICONS.CHEVRON_DOWN}
                      size={18}
                      color={theme.colors.text}
                      iconSet={ICON_SETS.MATERIAL_COMMUNITY}
                    />
                  </TouchableOpacity>
                </NeumorphicOutset>
              ) : (
                <View style={styles.headerSpacer} />
              )}
            </View>
          )}

          {isActuallyScrollable && !isAtTop && (
            <View style={styles.scrollIndicatorWrapper}>
              <BouncingChevron direction="up" />
            </View>
          )}

          <View style={styles.body}>
            {isScrollable ? (
              <ScrollView
                onContentSizeChange={(_, h) => {
                  setContentHeight(h);
                }}
                onLayout={(e) => {
                  setLayoutHeight(e.nativeEvent.layout.height);
                }}
                onScroll={(e) => {
                  setScrollOffset(e.nativeEvent.contentOffset.y);
                }}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: footer
                    ? theme.spacing.xl
                    : insets.bottom + theme.spacing.xl,
                }}
              >
                {children}
              </ScrollView>
            ) : (
              <View
                style={styles.body}
                onLayout={(e) => {
                  setLayoutHeight(e.nativeEvent.layout.height);
                }}
              >
                {children}
              </View>
            )}
          </View>

          {isActuallyScrollable && !isAtBottom && (
            <View style={styles.scrollIndicatorWrapper}>
              <BouncingChevron direction="down" />
            </View>
          )}

          {!footer && insets.bottom > 0 && (
            <View style={{ height: insets.bottom }} />
          )}

          {footer && (
            <View
              style={{
                paddingBottom: insets.bottom,
                backgroundColor: sheetBackgroundColor,
              }}
            >
              {footer}
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </>
  );
}
