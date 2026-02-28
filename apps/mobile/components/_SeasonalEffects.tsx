import React, { useMemo, useEffect, useState } from 'react';
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
  containerWidth: number;
  containerHeight: number;
}

// Individual Particle Component
const Particle = ({
  emoji,
  style,
  config,
  containerWidth,
  containerHeight,
}: ParticleProps) => {
  // Calculate X position based on percentage and current width
  const initialX = config.initialXPercent * containerWidth;

  // Shared Values
  const translateY = useSharedValue(-0.1 * containerHeight);
  const rotate = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    // Reset initial position
    translateY.value = -0.1 * containerHeight;
    
    const startAnimation = () => {
        // Fall Animation
        translateY.value = withDelay(
          config.fallDelay,
          withRepeat(
            withTiming(containerHeight * 1.1, {
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
    };

    // Immediate start since parent ensures we are ready
    startAnimation();

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(rotate);
      cancelAnimation(translateX);
    };
  }, [containerHeight, containerWidth, config]);

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
const SummerParticle = ({ i, config, containerWidth, containerHeight }: { i: number; config: ParticleConfig; containerWidth: number; containerHeight: number }) => {
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
      containerWidth={containerWidth}
      containerHeight={containerHeight}
    />
  );
};

const SeasonalEffects = React.memo(({ season }: SeasonalEffectsProps) => {
  const { width, height } = useWindowDimensions();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (width > 0 && height > 0) {
        const timer = setTimeout(() => {
            setIsReady(true);
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [width, height]);

  const particles = useMemo(() => {
    if (!isReady) return null;

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

      const props = {
          config,
          containerWidth: width,
          containerHeight: height,
      };

      if (season === 'winter') {
        return (
          <Particle 
            key={`winter-${i}`} 
            emoji="❄️" 
            style={styles.snowflake} 
            {...props}
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
            {...props}
          />
        );
      }
      if (season === 'spring') {
        return (
          <Particle 
            key={`spring-${i}`} 
            emoji="🌸" 
            style={styles.flower} 
            {...props}
          />
        );
      }
      if (season === 'summer') {
        return <SummerParticle key={`summer-${i}`} i={i} {...props} />;
      }
      return null;
    });
  }, [season, isReady, width, height]);

  return <View style={[StyleSheet.absoluteFill]} pointerEvents="none">{particles}</View>;
});

SeasonalEffects.displayName = 'SeasonalEffects';

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
