import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions, StyleProp, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

// Types for the component props
interface SeasonalEffectsProps {
  season: 'spring' | 'summer' | 'fall' | 'winter';
}

interface ParticleConfig {
  initialXPercent: number;
  size: number;
  fallDuration: number;
  fallDelay: number;
  spinDuration: number;
  spinDelay: number;
  horizontalDuration: number;
  horizontalDelay: number;
  swayAmplitude: number;
  initialSwayDirection: number;
}

interface ParticleProps {
  emoji: string;
  style?: StyleProp<TextStyle> | any; // Allow Reanimated styles
  config: ParticleConfig;
}

// Individual Particle Component
const Particle = ({
  emoji,
  style,
  config,
}: ParticleProps) => {
  const { height, width } = useWindowDimensions();
  
  if (height === 0 || width === 0) return null;

  // Calculate X position based on percentage and current width
  const initialX = config.initialXPercent * width;

  // Shared Values
  const translateY = useSharedValue(-0.1 * height);
  const rotate = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Reset initial position when height changes (e.g. from 0 to value)
    translateY.value = -0.1 * height;
    
    // Fall Animation
    translateY.value = withDelay(
      config.fallDelay,
      withRepeat(
        withTiming(height * 1.1, {
          duration: config.fallDuration,
          easing: Easing.linear,
        }),
        -1, // Infinite
        false // Do not reverse
      )
    );

    // Spin Animation
    rotate.value = withDelay(
      config.spinDelay,
      withRepeat(
        withTiming(360, {
          duration: config.spinDuration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // Sway Animation (Horizontal)
    translateX.value = withDelay(
        config.horizontalDelay,
        withRepeat(
            withSequence(
                withTiming(config.swayAmplitude * config.initialSwayDirection, {
                    duration: config.horizontalDuration,
                    easing: Easing.inOut(Easing.sin),
                }),
                withTiming(-config.swayAmplitude * config.initialSwayDirection, {
                    duration: config.horizontalDuration * 2, // Double duration for full swing across
                    easing: Easing.inOut(Easing.sin),
                }),
                withTiming(0, {
                    duration: config.horizontalDuration,
                    easing: Easing.inOut(Easing.sin),
                })
            ),
            -1,
            false // Do not reverse the sequence itself
        )
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(rotate);
      cancelAnimation(translateX);
    };
  }, [height, config]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
      ],
      position: 'absolute',
    };
  });
  
  return (
    <Animated.View style={[animatedContainerStyle, { left: initialX }]}>
      <Animated.Text style={[style, { fontSize: config.size }]}>
        {emoji}
      </Animated.Text>
    </Animated.View>
  );
};

// Summer Particle Component with specific opacity animation
const SummerParticle = ({ i, config }: { i: number; config: ParticleConfig }) => {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  return (
    <Particle
      key={`summer-${i}`}
      emoji="☀️"
      style={[styles.sun, animatedOpacityStyle]}
      config={config}
    />
  );
};

const SeasonalEffects = React.memo(({ season }: SeasonalEffectsProps) => {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      // Generate random configuration for this particle instance
      // Using a deterministic approach per season-switch to ensure variety
      
      const minSize = season === 'fall' || season === 'spring' ? 10 : 10;
      const maxSize = season === 'fall' || season === 'spring' ? 26 : 18;

      const config: ParticleConfig = {
        initialXPercent: Math.random(), // 0 to 1
        size: Math.random() * (maxSize - minSize) + minSize,
        fallDuration: Math.random() * 8000 + 5000,
        fallDelay: Math.random() * 5000, // Reduced max delay for better visibility
        spinDuration: Math.random() * 3000 + 2000,
        spinDelay: Math.random() * 5000,
        horizontalDuration: Math.random() * 3000 + 2000,
        horizontalDelay: Math.random() * 5000,
        swayAmplitude: Math.random() * 70 + 30,
        initialSwayDirection: Math.random() > 0.5 ? 1 : -1,
      };

      if (season === 'winter') {
        return (
          <Particle 
            key={`winter-${i}`} 
            emoji="❄️" 
            style={styles.snowflake} 
            config={config}
          />
        );
      }
      if (season === 'fall') {
        const leafColor = ['#ff8c00', '#d2691e', '#a0522d'][Math.floor(Math.random() * 3)];
        return (
          <Particle 
            key={`fall-${i}`} 
            emoji="🍂" 
            style={[styles.leaf, { color: leafColor }]} 
            config={config}
          />
        );
      }
      if (season === 'spring') {
        return (
          <Particle 
            key={`spring-${i}`} 
            emoji="🌸" 
            style={styles.flower} 
            config={config}
          />
        );
      }
      if (season === 'summer') {
        return <SummerParticle key={`summer-${i}`} i={i} config={config} />;
      }
      return null;
    });
  }, [season]);

  return <View style={[StyleSheet.absoluteFill]} pointerEvents="none">{particles}</View>;
});

const styles = StyleSheet.create({
  snowflake: {
    color: 'white',
  },
  leaf: {},
  flower: {
    color: '#ffc0cb',
  },
  sun: {
    color: '#ffd700',
  },
});

export default SeasonalEffects;