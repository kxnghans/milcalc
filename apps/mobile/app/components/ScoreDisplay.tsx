import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, NeumorphicOutset } from '@repo/ui';

const getScoreColor = (score, maxScore, theme) => {
    if (score === 0) return theme.colors.error;
    if (score >= maxScore * 0.9) {
        return theme.colors.ninetyPlus;
    }
    return theme.colors.success;
};

export default function ScoreDisplay({ score }) {
  const { theme } = useTheme();
  const scoreColor = score.isPass ? (score.totalScore >= 90 ? theme.colors.ninetyPlus : theme.colors.success) : theme.colors.error;

  const styles = StyleSheet.create({
    scoreContainer: {
        margin: theme.spacing.s,
    },
    scoreContent: {
        padding: theme.spacing.m,
        alignItems: "center",
        borderRadius: theme.borderRadius.m,
        backgroundColor: theme.colors.background,
        overflow: 'hidden',
    },
    scoreBreakdownContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: theme.spacing.m,
        width: '100%',
    },
    scoreText: {
        ...theme.typography.header,
        marginBottom: theme.spacing.s,
    },
    scoreBreakdownText: {
        ...theme.typography.subtitle,
        color: theme.colors.text,
        
    },
  });

  return (
    <NeumorphicOutset containerStyle={styles.scoreContainer} contentStyle={styles.scoreContent}>
        <Text style={[styles.scoreText, { color: scoreColor }]}>{score.totalScore.toFixed(2)}</Text>
        <View style={styles.scoreBreakdownContainer}>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.scoreBreakdownText}>Strength: </Text>
                <Text style={[styles.scoreBreakdownText, { color: getScoreColor(score.pushupScore, 20, theme) }]}>{score.pushupScore}</Text>
            </View>
            <Text style={styles.scoreBreakdownText}>|</Text>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.scoreBreakdownText}>Core: </Text>
                <Text style={[styles.scoreBreakdownText, { color: getScoreColor(score.coreScore, 20, theme) }]}>{score.coreScore}</Text>
            </View>
            <Text style={styles.scoreBreakdownText}>|</Text>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.scoreBreakdownText}>Cardio: </Text>
                <Text style={[styles.scoreBreakdownText, { color: getScoreColor(score.cardioScore, 60, theme) }]}>{score.cardioScore}</Text>
            </View>
        </View>
    </NeumorphicOutset>
  );
};