
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTheme, SegmentedSelector, PillButton, getAlphaColor } from '@repo/ui';
import { BlurView } from 'expo-blur';
import SeasonalEffects from '../components/_SeasonalEffects';
import splashImage from '../assets/3d_splash.png';

type Season = 'spring' | 'summer' | 'fall' | 'winter';

const getSeason = (): Season => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

export default function SplashScreen() {
  const router = useRouter();
  const { theme, isDarkMode } = useTheme();
  const [season, setSeason] = useState<Season>(getSeason());
  const { height: screenHeight } = useWindowDimensions();

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
      paddingBottom: 40,
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingTop: 40, // Give some space at the top
    },
    image: {
      width: '85%',
      height: '100%',
      maxHeight: screenHeight * 0.4,
    },
    bottomContainer: {
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
    centeredView: {
      justifyContent: 'center',
    },
    fullWidth: {
      width: '100%',
    },
  });

  const seasonValueChange = (val: string) => {
    setSeason(val as Season);
  };

  return (
    <View style={styles.container}>
      {/* Background Layer */}
      <View style={[styles.backgroundLayer, { backgroundColor: theme.colors.background }]}>
        <SeasonalEffects season={season} />
      </View>

      {/* Blur Layer */}
      <BlurView intensity={isDarkMode ? 5 : 3.25} style={StyleSheet.absoluteFill} />

      {/* Foreground Layer */}
      <View style={styles.foregroundLayer}>
        <View style={styles.imageContainer}>
          <Image source={splashImage} style={styles.image} resizeMode="contain" />
        </View>
        
        <View style={styles.bottomContainer}>
          <View style={styles.centeredView}>
            <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimer}>
                    Not an official USAF or US military product.
                </Text>
            </View>
          </View>
          <View style={styles.fullWidth}>
            <SegmentedSelector
              options={[{label: 'Spring', value: 'spring'}, {label: 'Summer', value: 'summer'}, {label: 'Fall', value: 'fall'}, {label: 'Winter', value: 'winter'}]}
              selectedValues={[season]}
              onValueChange={seasonValueChange}
              selectedBackgroundColor={theme.colors.mascotBlue}
              selectedTextStyle={theme.typography.subtitle}
            />
          </View>
          <View style={styles.centeredView}>
            <PillButton
              title="Continue"
              onPress={handleContinue}
              backgroundColor={getAlphaColor('#FFFFFF', 0.8)}
              textColor="black"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
