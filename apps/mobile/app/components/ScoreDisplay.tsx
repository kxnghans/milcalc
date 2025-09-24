import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@repo/ui';

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
        marginBottom: theme.spacing.s,
        padding: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    scoreBreakdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: theme.spacing.s,
    },
    scoreText: {
        ...theme.typography.header,
    },
    scoreBreakdownText: {
        ...theme.typography.subtitle,
        color: theme.colors.text,
        marginTop: theme.spacing.s,
    },
  });

  return (
    <View style={styles.scoreContainer}>
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
    </View>
  );
};