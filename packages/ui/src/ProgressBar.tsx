import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from './contexts/ThemeContext';

interface ProgressBarProps {
  mode: 'ascending' | 'descending';
  value: number; // The user's current value
  passThreshold: number; // The minimum value to pass
  maxPointsThreshold: number; // The value for a perfect score
}

export const ProgressBar = ({ mode, value, passThreshold, maxPointsThreshold }: ProgressBarProps) => {
  const { theme } = useTheme();

  const calculateProgressAndColor = () => {
    let progress = 0;
    let color = theme.colors.error; // Default to red/error

    if (mode === 'ascending') {
      // Higher is better (e.g., Plank)
      if (maxPointsThreshold > 0) {
        progress = value / maxPointsThreshold;
      }

      if (value >= passThreshold) {
        // 90th percentile rule for blue
        if (value >= maxPointsThreshold * 0.9) {
          color = theme.colors.ninetyPlus; // Blue
        } else {
          color = theme.colors.success; // Green
        }
      }
    } else {
      // Descending mode: lower is better (e.g., Run)
      const range = passThreshold - maxPointsThreshold;
      if (range > 0) {
        progress = (passThreshold - value) / range;
      }

      if (value <= passThreshold) {
        // 20% rule for blue
        const blueThreshold = maxPointsThreshold + range * 0.2;
        if (value <= blueThreshold) {
          color = theme.colors.ninetyPlus; // Blue
        } else {
          color = theme.colors.success; // Green
        }
      }
    }

    return { progress: Math.max(0, progress), color };
  };

  const { progress, color } = calculateProgressAndColor();

  const styles = StyleSheet.create({
    container: {
      marginVertical: theme.spacing.m,
      height: 30, // Increased height to accommodate markers within
    },
    bar: {
      height: 10,
      backgroundColor: theme.colors.secondary,
      borderRadius: 5,
      overflow: 'hidden',
      position: 'relative',
    },
    progress: {
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
    },
    markersContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 15, // Position markers below the bar
    },
    marker: {
      position: 'absolute',
      alignItems: 'center',
    },
    markerLabel: {
      ...theme.typography.caption,
      color: theme.colors.text,
    },
  });

  // Clamp the visual progress width to a max of, for example, 150% to prevent extreme overflow
  const visualProgress = Math.min(progress, 1.5);

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={[styles.progress, { width: `${visualProgress * 100}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.markersContainer}>
          <View style={[styles.marker, { left: '0%' }]}>
            <Text style={styles.markerLabel}>{mode === 'ascending' ? '0' : passThreshold}</Text>
          </View>
          <View style={[styles.marker, { right: '0%' }]}>
            <Text style={styles.markerLabel}>{maxPointsThreshold}</Text>
          </View>
      </View>
    </View>
  );
};