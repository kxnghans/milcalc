import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { Icon } from "./Icon";
import { ICONS, ICON_SETS } from "../icons";
import { useTheme } from "../contexts/ThemeContext";

interface BouncingChevronProps {
  direction?: "up" | "down";
}

export const BouncingChevron = ({
  direction = "down",
}: BouncingChevronProps) => {
  const { theme } = useTheme();
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(direction === "up" ? -4 : 4, { duration: 600 }),
        withTiming(0, { duration: 600 }),
      ),
      -1,
      true,
    );
  }, [direction, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        styles.chevronContainer,
        direction === "down" ? styles.chevronDown : styles.chevronUp,
      ]}
    >
      <Icon
        name={direction === "up" ? ICONS.CHEVRON_UP : ICONS.CHEVRON_DOWN}
        size={24}
        color={theme.colors.text}
        iconSet={ICON_SETS.MATERIAL_COMMUNITY}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  chevronContainer: {
    alignItems: "center",
  },
  chevronDown: {
    marginBottom: 4,
  },
  chevronUp: {
    marginTop: 4,
  },
});
