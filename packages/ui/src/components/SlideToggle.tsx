import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Easing 
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { NeumorphicInset } from './NeumorphicInset';

interface SlideToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
}

export const SlideToggle: React.FC<SlideToggleProps> = ({ value, onValueChange, label }) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 250,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Track width 44, padding 2, thumb 20 -> 2 to (44-2-20)=22
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surface, theme.colors.primary],
  });

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={() => onValueChange(!value)}
      >
        <NeumorphicInset 
            style={styles.track} 
            depth={2}
            containerStyle={{ borderRadius: 15 }}
        >
          <Animated.View style={[styles.trackFill, { backgroundColor }]} />
          <Animated.View 
            style={[
              styles.thumb, 
              { 
                transform: [{ translateX }],
                backgroundColor: theme.colors.secondaryText,
              }
            ]} 
          />
        </NeumorphicInset>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  track: {
    width: 44,
    height: 24,
    borderRadius: 15,
    justifyContent: 'center',
    overflow: 'hidden',
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
});
