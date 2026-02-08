
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme, SegmentedSelector, PillButton } from '@repo/ui';
import { BlurView } from 'expo-blur';
import SeasonalEffects from './components/_SeasonalEffects';
import splashImage from '../assets/3d_splash.png';

const getSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

export default function SplashScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const [season, setSeason] = useState(getSeason());

  const handleContinue = () => {
    router.replace('/(tabs)/pt-calculator');
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
      gap: theme.spacing.m,
    },
    disclaimerContainer: {
      borderRadius: 10,
    },
    disclaimer: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      {/* Background Layer */}
      <View style={[styles.backgroundLayer, { backgroundColor: theme.colors.background }]}>
        <SeasonalEffects season={season as any} />
      </View>

      {/* Blur Layer */}
      <BlurView intensity={isDarkMode ? 5 : 3.25} style={StyleSheet.absoluteFill} />

      {/* Foreground Layer */}
      <View style={styles.foregroundLayer}>
        <Image source={splashImage} style={styles.image} resizeMode="contain" />
        <View style={styles.bottomContainer}>
          <View style={{ justifyContent: 'center' }}>
            <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimer}>
                    Not an official USAF or US military product.
                </Text>
            </View>
          </View>
          <View style={{ width: '100%' }}>
            <SegmentedSelector
              options={[{label: 'Spring', value: 'spring'}, {label: 'Summer', value: 'summer'}, {label: 'Fall', value: 'fall'}, {label: 'Winter', value: 'winter'}]}
              selectedValues={[season]}
              onValueChange={setSeason}
              selectedBackgroundColor={theme.colors.mascotBlue}
              selectedTextStyle={theme.typography.subtitle}
            />
          </View>
          <View style={{ justifyContent: 'center' }}>
            <PillButton
              title="Continue"
              onPress={handleContinue}
              backgroundColor="rgba(255, 255, 255, 0.8)"
              textColor="black"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
