import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useTheme } from "../contexts/ThemeContext";
import NeumorphicOutset from "./NeumorphicOutset";

interface SlideToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  labelPosition?: "right" | "bottom";
}

export const SlideToggle: React.FC<SlideToggleProps> = ({
  value,
  onValueChange,
  label,
  labelPosition = "right",
}) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 250,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  // Track background color: secondary when off, primary (or mascotBlue) when on
  const trackBackgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.secondary, theme.colors.primary],
  });

  // Actually user said: "when its off color the circle blue when active ilke how the bar is filled and the circle our normal bg color"
  // Let's use theme.colors.primary (which is teal/blue) for "blue".

  const thumbColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.primary, theme.colors.surface],
  });

  const isBottom = labelPosition === "bottom";

  return (
    <View style={[styles.container, isBottom && styles.containerVertical]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onValueChange(!value)}
      >
        <NeumorphicOutset
          containerStyle={styles.track}
          style={styles.neumorphicStyle}
        >
          <Animated.View
            style={[
              styles.trackFill,
              { backgroundColor: trackBackgroundColor },
            ]}
          />
          <Animated.View
            style={[
              styles.thumb,
              styles.thumbBorder,
              {
                transform: [{ translateX }],
                backgroundColor: thumbColor,
                borderColor: theme.colors.primary, // Always a distinct primary border
              },
            ]}
          />
        </NeumorphicOutset>
      </TouchableOpacity>
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.colors.text },
            isBottom && styles.labelBottom,
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  containerVertical: {
    flexDirection: "column",
    gap: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  labelBottom: {
    marginTop: 2,
  },
  track: {
    width: 44,
    height: 24,
    borderRadius: 15,
    justifyContent: "center",
    overflow: "hidden",
    padding: 2,
  },
  trackFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    zIndex: 1,
  },
  thumbBorder: {
    borderWidth: 1.5, // Distinct border
  },
  neumorphicStyle: {
    borderRadius: 15,
  },
});
