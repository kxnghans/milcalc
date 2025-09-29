import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";
import NeumorphicOutset from './NeumorphicOutset';

interface ProgressBarProps {
  value: number;
  passThreshold: number;
  maxPointsThreshold?: number;
  ninetyPercentileThreshold?: number;
  invertScale?: boolean;
  valueIsTime?: boolean;
  isPassFail?: boolean;
}

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

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds === null || isNaN(totalSeconds) || totalSeconds < 0) return '--:--';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateProgressAndColor = () => {
    let progress = 0;
    let color = theme.colors.error;

    if (isPassFail) {
      let passed = invertScale ? value > 0 && value <= passThreshold : value >= passThreshold;
      if (passed) {
        color = theme.colors.success;
      }
      if (passThreshold > 0) {
        progress = value / passThreshold;
      }
    } else {
      if (invertScale) {
        if (value <= passThreshold) {
          color = value <= ninetyPercentileThreshold! ? theme.colors.ninetyPlus : theme.colors.success;
        }
        if (passThreshold > 0) {
          progress = value / passThreshold;
        }
      } else {
        if (value >= passThreshold) {
          color = value >= ninetyPercentileThreshold! ? theme.colors.ninetyPlus : theme.colors.success;
        }
        if (maxPointsThreshold && maxPointsThreshold > 0) {
          progress = value / maxPointsThreshold;
        }
      }
    }

    return { progress: Math.max(0, progress), color };
  };

  const { progress, color } = calculateProgressAndColor();

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
    whiteMarkerLabel: {
        color: 'white',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowRadius: 2,
        textShadowOffset: { width: 0, height: 1 },
    },
  });

  const visualProgress = Math.min(progress, 1);

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
    >
      <View style={[styles.progress, { backgroundColor: color }]} />
    </NeumorphicOutset>
  );

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