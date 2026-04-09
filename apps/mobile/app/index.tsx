import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
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

const SPLASH_HISTORY_KEY = '@milcalc_splash_show_history_v1';
const db = SQLite.openDatabaseSync("milcalc-cache.db");

// Initialize table if it doesn't exist
db.execSync("CREATE TABLE IF NOT EXISTS cache (key TEXT PRIMARY KEY, value TEXT)");

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
  const [isCheckingHistory, setIsCheckingHistory] = useState(true);

  useEffect(() => {
    const checkHistory = async () => {
      try {
        const result = db.getFirstSync<{ value: string }>(
          "SELECT value FROM cache WHERE key = ?",
          [SPLASH_HISTORY_KEY]
        );
        
        const history = result ? JSON.parse(result.value) : { launchedEver: false, lastShownSeason: '' };
        const currentSeason = getSeason();
        const today = new Date();
        
        // Season starts on the 1st of month 2 (March), 5 (June), 8 (September), 11 (December)
        const isFirstDayOfSeason = today.getDate() === 1 && [2, 5, 8, 11].includes(today.getMonth());
        
        let shouldShow = false;
        if (!history.launchedEver) {
          shouldShow = true;
        } else if (isFirstDayOfSeason && history.lastShownSeason !== currentSeason) {
          shouldShow = true;
        }
        
        if (shouldShow) {
          // Update history and allow the screen to render
          const updatedHistory = {
            launchedEver: true,
            lastShownSeason: currentSeason
          };
          db.runSync(
            "INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)",
            [SPLASH_HISTORY_KEY, JSON.stringify(updatedHistory)]
          );
          setIsCheckingHistory(false);
        } else {
          // Skip splash and redirect immediately
          router.replace('/(tabs)/pt-calculator');
        }
      } catch (e) {
        console.error('Splash history check failed:', e);
        setIsCheckingHistory(false); // Fallback: show splash if there's an error
      }
    };
    
    checkHistory();
  }, [router]);

  const handleContinue = () => {
    router.replace('/(tabs)/pt-calculator');
  };

  const styles = React.useMemo(() => StyleSheet.create({
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
  }), [theme, screenHeight]);

  const seasonValueChange = (val: string) => {
    setSeason(val as Season);
  };

  if (isCheckingHistory) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]} />
    );
  }

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
              options={[
                {label: '', value: 'spring', icon: 'flower'}, 
                {label: '', value: 'summer', icon: 'weather-sunny'}, 
                {label: '', value: 'fall', icon: 'leaf'}, 
                {label: '', value: 'winter', icon: 'snowflake'}
              ]}
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
