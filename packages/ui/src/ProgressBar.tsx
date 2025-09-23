import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from './theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  markers: { value: number; label: string }[];
}

export const ProgressBar = ({ progress, markers }: ProgressBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={[styles.progress, { width: `${progress * 100}%` }]} />
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
    backgroundColor: theme.colors.primary,
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
