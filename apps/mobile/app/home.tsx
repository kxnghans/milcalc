
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme, SegmentedSelector } from '@repo/ui';
import { BlurView } from 'expo-blur';
import { PillButton } from '@repo/ui';
import { SeasonalEffects } from './components/_SeasonalEffects';

const splashImage = require('../assets/3d_splash.png');

const getSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
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
  });

  return (
    <View style={styles.container}>
      {/* Background Layer */}
      <View style={[styles.backgroundLayer, { backgroundColor: theme.colors.background }]}>
        <Image source={splashImage} style={styles.image} resizeMode="contain" />
        <SeasonalEffects season={season as any} />
      </View>

      {/* Blur Layer */}
      <BlurView intensity={8} style={StyleSheet.absoluteFill} />

      {/* Foreground Layer */}
      <View style={styles.foregroundLayer}>
        <View style={styles.bottomContainer}>
          <View style={styles.disclaimerContainer}>
              <Text style={[styles.disclaimer, { color: theme.colors.text }]}>
                  Not an official USAF or US military product.
              </Text>
              <Text style={[theme.typography.body, { color: theme.colors.text, textAlign: 'center', marginTop: 4 }]}>
                  Not financial advise.
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
