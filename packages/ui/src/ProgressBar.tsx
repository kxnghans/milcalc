import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from './contexts/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0 to 1
  markers: { value: number; label: string }[];
  color?: string;
}

export const ProgressBar = ({ progress, markers, color }: ProgressBarProps) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginVertical: theme.spacing.m,
    },
    bar: {
      height: 10,
      backgroundColor: theme.colors.secondary,
      borderRadius: 5,
      overflow: 'hidden',
    },
    progress: {
      height: '100%',
    },
    markersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.s,
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

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={[styles.progress, { width: `${progress * 100}%`, backgroundColor: color || theme.colors.primary }]} />
      </View>
      <View style={styles.markersContainer}>
        {markers.map((marker, index) => (
          <View key={index} style={[styles.marker, { left: `${marker.value * 100}%` }]}>
            <Text style={styles.markerLabel}>{marker.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
