
import { useRouter } from 'expo-router';
import React, { useMemo, useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { useTheme, SegmentedSelector } from '@repo/ui';
import { BlurView } from 'expo-blur';
import { PillButton } from '@repo/ui';

const splashImage = require('../assets/3d_splash.png');

const getSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

const Particle = ({ children }) => {
  const { height, width } = useWindowDimensions();
  const fallAnim = useMemo(() => new Animated.Value(0), []);
  const spinAnim = useMemo(() => new Animated.Value(0), []);
  const horizontalAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const fallDuration = Math.random() * 8000 + 5000;
    const fallDelay = Math.random() * 10000;
    const spinDuration = Math.random() * 3000 + 2000;
    const spinDelay = Math.random() * 5000;
    const horizontalDuration = Math.random() * 3000 + 2000;
    const horizontalDelay = Math.random() * 5000;

    fallAnim.setValue(0);
    spinAnim.setValue(0);
    horizontalAnim.setValue(0);

    Animated.loop(
      Animated.timing(fallAnim, {
        toValue: 1,
        duration: fallDuration,
        delay: fallDelay,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: spinDuration,
        delay: spinDelay,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(horizontalAnim, {
          toValue: 1,
          duration: horizontalDuration,
          delay: horizontalDelay,
          useNativeDriver: true,
        }),
        Animated.timing(horizontalAnim, {
          toValue: -1,
          duration: horizontalDuration,
          delay: horizontalDelay,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const top = fallAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-0.1 * height, height * 1.1],
  });
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '180deg'],
  });
  const horizontal = horizontalAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-20, 20],
  });
  const left = useMemo(() => Math.random() * width, []);
  const fontSize = Math.random() * 10 + 14;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left,
        transform: [{ translateY: top }, { rotate: spin }, { translateX: horizontal }],
      }}
    >
      {React.cloneElement(children, { style: { fontSize } })}
    </Animated.View>
  );
};

const SeasonalEffects = ({ season, styles }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => {
        if (season === 'winter') {
          return (
            <Particle key={i}>
              <Text style={styles.snowflake}>❄️</Text>
            </Particle>
          );
        }
        if (season === 'fall') {
          const leafColor = ['#ff8c00', '#d2691e', '#a0522d'][Math.floor(Math.random() * 3)];
          return (
            <Particle key={i}>
              <Text style={[styles.leaf, { color: leafColor }]}>🍂</Text>
            </Particle>
          );
        }
        if (season === 'spring') {
          return (
            <Particle key={i}>
              <Text style={styles.flower}>🌸</Text>
            </Particle>
          );
        }
        if (season === 'summer') {
          const shimmerDuration = 1500;
          const shimmerAnim = new Animated.Value(0);
          Animated.loop(
            Animated.sequence([
              Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: shimmerDuration,
                useNativeDriver: true,
              }),
              Animated.timing(shimmerAnim, {
                toValue: 0,
                duration: shimmerDuration,
                useNativeDriver: true,
              }),
            ])
          ).start();
          const opacity = shimmerAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          });
          return (
            <Particle key={i}>
              <Animated.Text style={[styles.sun, { opacity }]}>☀️</Animated.Text>
            </Particle>
          );
        }
        return null;
      }),
    [season, styles]
  );

  return <View style={StyleSheet.absoluteFill}>{particles}</View>;
};

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const [season, setSeason] = useState(getSeason());

  const handleContinue = () => {
    router.replace('/pt-calculator');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundLayer: {
      ...StyleSheet.absoluteFillObject,
    },
    foregroundLayer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 40,
      width: '100%',
      paddingHorizontal: theme.spacing.m,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    disclaimerContainer: {
      borderRadius: 10,
    },
    disclaimer: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
    },
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

  return (
    <View style={styles.container}>
      {/* Background Layer */}
      <View style={[styles.backgroundLayer, { backgroundColor: theme.colors.background }]}>
        <SeasonalEffects season={season} styles={styles} />
      </View>

      {/* Blur Layer */}
      <BlurView intensity={8} style={StyleSheet.absoluteFill} />

      {/* Foreground Layer */}
      <View style={styles.foregroundLayer}>
        <Image source={splashImage} style={styles.image} resizeMode="contain" />
        <View style={styles.bottomContainer}>
          <View style={styles.disclaimerContainer}>
              <Text style={[styles.disclaimer, { color: theme.colors.text }]}>
                  Not an official USAF or US military product.
              </Text>
          </View>
          <SegmentedSelector
            options={[{label: 'Spring', value: 'spring'}, {label: 'Summer', value: 'summer'}, {label: 'Fall', value: 'fall'}, {label: 'Winter', value: 'winter'}]}
            selectedValues={[season]}
            onValueChange={setSeason}
          />
          <PillButton
            title="Continue"
            onPress={handleContinue}
            backgroundColor="rgba(255, 255, 255, 0.8)"
            textColor="black"
          />
        </View>
      </View>
    </View>
  );
}
