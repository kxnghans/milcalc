/**
 * @file ProgressBar.tsx
 * @description This file defines a highly customizable progress bar component used to visualize
 * performance in physical fitness tests. It supports various modes, including pass/fail,
 * inverted scales (for time-based events), and multiple threshold markers.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";
import NeumorphicOutset from './NeumorphicOutset';
import { getPerformanceCategory } from '@repo/utils';
import { useScoreColors } from '../hooks/useScoreColors';

/**
 * Props for the ProgressBar component.
 */
interface ProgressBarProps {
  /** The current value (e.g., reps, seconds) to display on the progress bar. */
  value: number;
  /** The threshold value required to pass. */
  passThreshold: number;
  /** The threshold value to achieve maximum points. Used as the end of the bar. */
  maxPointsThreshold?: number;
  /** The threshold for an "excellent" score (90th percentile). */
  ninetyPercentileThreshold?: number;
  /** If true, a lower value is better (e.g., for run times). */
  invertScale?: boolean;
  /** If true, the value represents time in seconds and should be formatted as mm:ss. */
  valueIsTime?: boolean;
  /** If true, the bar only shows a pass or fail state based on the passThreshold. */
  isPassFail?: boolean;
}

/**
 * A visual progress bar to represent performance against fitness standards.
 * It dynamically changes color and progress based on the user's input value
 * and the defined thresholds for passing, excellence, and maximum points.
 */
export const ProgressBar = ({
  value,
  passThreshold,
  maxPointsThreshold,
  ninetyPercentileThreshold,
  invertScale = false,
  valueIsTime = false,
  isPassFail = false,
}: ProgressBarProps) => {
  const { theme, isDarkMode } = useTheme();

  // Hooks to get theme-based colors for different score categories.
  const excellentColors = useScoreColors('excellent');
  const passColors = useScoreColors('pass');
  const failColors = useScoreColors('fail');
  const noneColors = useScoreColors('none');

  /**
   * Returns the appropriate color set based on the performance category.
   * @param category The performance category ('excellent', 'pass', 'fail').
   * @returns The color set for that category.
   */
  const getColorForCategory = (category) => {
      switch(category) {
          case 'excellent': return excellentColors;
          case 'pass': return passColors;
          case 'fail': return failColors;
          default: return noneColors;
      }
  }

  /**
   * Formats a total number of seconds into a "mm:ss" string.
   * @param totalSeconds The number of seconds to format.
   * @returns A formatted time string.
   */
  const formatTime = (totalSeconds: number) => {
    if (totalSeconds === null || isNaN(totalSeconds) || totalSeconds < 0) return '--:--';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  /**
   * Calculates the progress percentage and determines the appropriate color for the bar
   * based on the user's performance and the component's configuration.
   * @returns An object with the progress percentage, progress color, and background color.
   */
  const calculateProgressAndColor = () => {
    let progress = 0;
    let category;

    if (isPassFail) {
      // Simple pass/fail mode
      const passed = invertScale ? value > 0 && value <= passThreshold : value >= passThreshold;
      category = passed ? 'pass' : 'fail';
      if (passThreshold > 0) {
        progress = value / passThreshold;
      }
    } else {
      // Standard mode with multiple categories
      category = getPerformanceCategory(value, passThreshold, ninetyPercentileThreshold!, invertScale);
      if (invertScale) {
        // For inverted scales (like run time), progress is calculated relative to the pass threshold.
        if (passThreshold > 0) {
          progress = value / passThreshold;
        }
      } else {
        // For standard scales (like push-ups), progress is calculated relative to the max points threshold.
        if (maxPointsThreshold && maxPointsThreshold > 0) {
          progress = value / maxPointsThreshold;
        }
      }
    }
    const colors = getColorForCategory(category);

    return { progress: Math.max(0, progress), ...colors };
  };

  const { progress, progressColor, backgroundColor } = calculateProgressAndColor();

  const styles = StyleSheet.create({
    bar: {
      height: 15,
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
      top: 0,
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
    // Special style for marker labels when the progress bar is behind them, to ensure readability.
    whiteMarkerLabel: {
        color: 'white',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowRadius: 2,
        textShadowOffset: { width: 0, height: 1 },
    },
  });

  // Ensure the visual progress doesn't exceed 100% of the bar's width.
  const visualProgress = Math.min(progress, 1);

  /**
   * Renders the filled portion of the progress bar with a neumorphic effect.
   */
  const renderProgressBar = () => (
    <NeumorphicOutset
      containerStyle={{
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: `${visualProgress * 100}%`,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
      }}
      contentStyle={{
        borderRadius: theme.borderRadius.m,
        overflow: 'hidden',
      }}
    >
      <View style={[styles.progress, { backgroundColor: progressColor }]} />
    </NeumorphicOutset>
  );

  // Render logic for pass/fail mode.
  if (isPassFail) {
    const passMarkerStyle = [
        styles.markerLabel,
        !isDarkMode && visualProgress * 100 >= 100 && styles.whiteMarkerLabel
    ];
    return (
        <View style={styles.bar}>
            {renderProgressBar()}
            <View style={styles.markersContainer}>
                <View style={[styles.marker, { right: '0%' }]}>
                    <Text style={passMarkerStyle}>{valueIsTime ? formatTime(passThreshold) : passThreshold}</Text>
                </View>
            </View>
        </View>
    );
  }

  // Render logic for inverted scale mode (e.g., run time).
  if (invertScale) {
    const maxPointsMarkerPosition = passThreshold > 0 ? (maxPointsThreshold! / passThreshold) * 100 : 0;
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
              <Text style={maxMarkerStyle}>{valueIsTime ? formatTime(maxPointsThreshold!) : maxPointsThreshold}</Text>
            </View>
            <View style={[styles.marker, { right: '0%' }]}>
              <Text style={passMarkerStyle}>{valueIsTime ? formatTime(passThreshold) : passThreshold}</Text>
            </View>
        </View>
      </View>
    );
  }

  // Default render logic for standard progress bar.
  let passMarkerPosition = 0;
  if (maxPointsThreshold && maxPointsThreshold > 0) {
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
            <Text style={maxMarkerStyle}>{valueIsTime ? formatTime(maxPointsThreshold!) : maxPointsThreshold}</Text>
          </View>
      </View>
    </View>
  );
};