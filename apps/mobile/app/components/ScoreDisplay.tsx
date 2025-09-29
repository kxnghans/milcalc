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

export default function ScoreDisplay({ score, cardioComponent, showBreakdown = true }) {
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
        textShadowColor: theme.colors.neumorphic.outset.shadow,
        textShadowRadius: 0.25,
        textShadowOffset: { width: 0, height: 0 },
    },
    scoreBreakdownText: {
        ...theme.typography.subtitle,
        color: theme.colors.text,
        textShadowColor: theme.colors.neumorphic.outset.shadow,
        textShadowRadius: 0.1,
        textShadowOffset: { width: 0, height: 0 },
    },
  });

  const renderCardioScore = () => {
    if (cardioComponent === 'walk') {
        if (score.walkPassed === 'n/a') {
            return <Text style={[styles.scoreBreakdownText, { color: theme.colors.disabled }]}>N/A</Text>;
        }
        const color = score.walkPassed === 'pass' ? theme.colors.success : theme.colors.error;
        const text = score.walkPassed === 'pass' ? 'Pass' : 'Fail';
        return <Text style={[styles.scoreBreakdownText, { color }]}>{text}</Text>;
    }
    return <Text style={[styles.scoreBreakdownText, { color: getScoreColor(score.cardioScore, 60, theme) }]}>{score.cardioScore}</Text>;
  };

  return (
    <NeumorphicOutset containerStyle={styles.scoreContainer} contentStyle={styles.scoreContent}>
        <Text style={[styles.scoreText, { color: scoreColor }, showBreakdown && { marginBottom: theme.spacing.s }]}>{score.totalScore.toFixed(2)}</Text>
        {showBreakdown && (
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
                    {renderCardioScore()}
                </View>
            </View>
        )}
    </NeumorphicOutset>
  );
};