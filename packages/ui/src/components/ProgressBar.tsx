import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";
import NeumorphicOutset from './NeumorphicOutset';

interface ProgressBarProps {
  value: number; // The user's current value
  passThreshold: number; // The boundary between fail and pass
  maxPointsThreshold: number; // The value for a perfect score
  ninetyPercentileThreshold: number; // The value for the 90th percentile score
  invertScale?: boolean; // True for scales where lower is better (e.g., run time)
  valueIsTime?: boolean;
}

export const ProgressBar = ({
  value,
  passThreshold,
  maxPointsThreshold,
  ninetyPercentileThreshold,
  invertScale = false,
  valueIsTime = false
}: ProgressBarProps) => {
  const { theme, isDarkMode } = useTheme();

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds === null || isNaN(totalSeconds) || totalSeconds < 0) return '--:--';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateProgressAndColor = () => {
    let progress = 0;
    let color = theme.colors.error; // Default to red/error

    if (invertScale) {
      // Lower is better (e.g., Run), but progress bar fills left-to-right with time
      if (value <= passThreshold) { // Pass
        color = value <= ninetyPercentileThreshold ? theme.colors.ninetyPlus : theme.colors.success;
      }
      // Progress is direct: value against passThreshold (which is the max time)
      if (passThreshold > 0) {
        progress = value / passThreshold;
      }
    } else {
      // Higher is better (e.g., Reps, Plank)
      if (value >= passThreshold) { // Pass
        color = value >= ninetyPercentileThreshold ? theme.colors.ninetyPlus : theme.colors.success;
      }
      if (maxPointsThreshold > 0) {
        progress = value / maxPointsThreshold;
      }
    }

    return { progress: Math.max(0, Math.min(1, progress)), color }; // Cap progress at 1
  };

  const { progress, color } = calculateProgressAndColor();

  const styles = StyleSheet.create({
    bar: {
      height: 15, // Increased height to accommodate markers within
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.m,
      position: 'relative',
    },
    progress: {
      height: '100%',
      borderRadius: theme.borderRadius.m,
    },
    markersContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0, // Position markers at the top of the bar
      flexDirection: 'row',
      alignItems: 'center',
    },
    marker: {
      position: 'absolute',
      alignItems: 'center',
      transform: [{ translateX: -8 }],
    },
    markerLabel: {
      ...theme.typography.caption,
      color: theme.colors.text,
      textShadowColor: theme.colors.background,
      textShadowRadius: 3,
      textShadowOffset: { width: 0, height: 0 },
    },
    whiteMarkerLabel: {
        color: 'white',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowRadius: 2,
        textShadowOffset: { width: 0, height: 1 },
    },
  });

  // Allow the bar to extend beyond 100% but cap it visually for sanity
  const visualProgress = Math.min(progress, 1.5);

  const renderProgressBar = () => (
    <NeumorphicOutset
      containerStyle={{
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: `${visualProgress * 100}%`,
      }}
      contentStyle={{
        borderRadius: theme.borderRadius.m,
        overflow: 'hidden',
      }}
      highlightOpacity={isDarkMode ? 0.5 : 1}
      shadowOpacity={isDarkMode ? 0.1 : 0.35}
      shadowRadius={theme.spacing.xs / 1.5}
    >
      <View style={[styles.progress, { backgroundColor: color }]} />
    </NeumorphicOutset>
  );

  if (invertScale) {
    // Inverted scale: bar from 0 to passThreshold (slowest time)
    // maxPointsThreshold is a point on that bar
    const maxPointsMarkerPosition = passThreshold > 0 ? (maxPointsThreshold / passThreshold) * 100 : 0;
    const maxMarkerStyle = [
        styles.markerLabel,
        !isDarkMode && visualProgress * 100 >= maxPointsMarkerPosition && styles.whiteMarkerLabel
    ];
    const passMarkerStyle = [
        styles.markerLabel,
        !isDarkMode && visualProgress * 100 >= 100 && styles.whiteMarkerLabel
    ];

    return (
      <View style={styles.bar}>
        {renderProgressBar()}
        <View style={styles.markersContainer}>
            <View style={[styles.marker, { left: `${maxPointsMarkerPosition}%` }]}>
              <Text style={maxMarkerStyle}>{valueIsTime ? formatTime(maxPointsThreshold) : maxPointsThreshold}</Text>
            </View>
            <View style={[styles.marker, { right: '0%' }]}>
              <Text style={passMarkerStyle}>{valueIsTime ? formatTime(passThreshold) : passThreshold}</Text>
            </View>
        </View>
      </View>
    );
  }

  // Original logic for non-inverted scale
  let passMarkerPosition = 0;
  if (maxPointsThreshold > 0) {
    passMarkerPosition = (passThreshold / maxPointsThreshold) * 100;
  }

  const passMarkerStyle = [
    styles.markerLabel,
    !isDarkMode && visualProgress * 100 >= passMarkerPosition && styles.whiteMarkerLabel
  ];

  const maxMarkerStyle = [
    styles.markerLabel,
    !isDarkMode && visualProgress * 100 >= 100 && styles.whiteMarkerLabel
  ];

  return (
    <View style={styles.bar}>
      {renderProgressBar()}
      <View style={styles.markersContainer}>
          <View style={[styles.marker, { left: `${passMarkerPosition}%` }]}>
            <Text style={passMarkerStyle}>{valueIsTime ? formatTime(passThreshold) : passThreshold}</Text>
          </View>
          <View style={[styles.marker, { right: '0%' }]}>
            <Text style={maxMarkerStyle}>{valueIsTime ? formatTime(maxPointsThreshold) : maxPointsThreshold}</Text>
          </View>
      </View>
    </View>
  );
};