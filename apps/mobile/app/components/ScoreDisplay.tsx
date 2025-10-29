/**
 * @file ScoreDisplay.tsx
 * @description This component is responsible for rendering the total PT score and a breakdown of individual component scores.
 * It uses neumorphic styling and color-codes the scores based on performance categories.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, NeumorphicOutset, useScoreColors } from '@repo/ui';
import { getScoreCategory } from '@repo/utils';

/**
 * Displays the total PT score and a breakdown of component scores.
 * @param {object} props - The component props.
 * @param {object} props.score - An object containing the score details (totalScore, pushupScore, coreScore, cardioScore, isPass, walkPassed).
 * @param {string} [props.cardioComponent] - The selected cardio component ('run', 'shuttles', or 'walk').
 * @param {boolean} [props.showBreakdown=true] - Whether to show the breakdown of individual component scores.
 * @returns {JSX.Element} The rendered score display component.
 */
export default function ScoreDisplay({ score, cardioComponent, showBreakdown = true }) {
  const { theme } = useTheme();
  const excellentColors = useScoreColors('excellent');
  const passColors = useScoreColors('pass');
  const failColors = useScoreColors('fail');

  /**
   * Determines the color for a score based on its category (excellent, pass, fail).
   * @param {number} score - The score to evaluate.
   * @param {number} maxScore - The maximum possible score for the component.
   * @returns {string} The color code for the score.
   */
  const getScoreColor = (score, maxScore) => {
    const category = getScoreCategory(score, maxScore, true);
    if (category === 'excellent') return excellentColors.progressColor;
    if (category === 'pass') return passColors.progressColor;
    if (category === 'fail') return failColors.progressColor;
    return theme.colors.text;
  }

  // The total score is colored red if the test is a fail, otherwise it's colored based on the score category.
  const scoreColor = score.isPass ? getScoreColor(score.totalScore, 100) : failColors.progressColor;

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

  /**
   * Renders a component score, handling numeric values and the "Exempt" status.
   * @param {number | string} componentScore - The score to render.
   * @param {number} maxScore - The maximum possible score for the component.
   * @returns {JSX.Element} The rendered score text.
   */
  const renderComponentScore = (componentScore, maxScore) => {
    if (componentScore === 'Exempt') {
        return <Text style={[styles.scoreBreakdownText, { color: theme.colors.disabled }]}>Exempt</Text>;
    }
    return <Text style={[styles.scoreBreakdownText, { color: getScoreColor(componentScore, maxScore) }]}>{componentScore}</Text>;
  };

  /**
   * Renders the cardio score, with special handling for the walk component and exemptions.
   * @returns {JSX.Element} The rendered cardio score text.
   */
  const renderCardioScore = () => {
    if (score.cardioScore === 'Exempt') {
        return <Text style={[styles.scoreBreakdownText, { color: theme.colors.disabled }]}>Exempt</Text>;
    }
    if (cardioComponent === 'walk') {
        if (score.walkPassed === 'n/a') {
            return <Text style={[styles.scoreBreakdownText, { color: theme.colors.disabled }]}>N/A</Text>;
        }
        const color = score.walkPassed === 'pass' ? passColors.progressColor : failColors.progressColor;
        const text = score.walkPassed === 'pass' ? 'Pass' : 'Fail';
        return <Text style={[styles.scoreBreakdownText, { color }]}>{text}</Text>;
    }
    return renderComponentScore(score.cardioScore, 60);
  };

  return (
    <NeumorphicOutset containerStyle={styles.scoreContainer} contentStyle={styles.scoreContent}>
        {/* Display the total score */}
        <Text style={[styles.scoreText, { color: scoreColor }, showBreakdown && { marginBottom: theme.spacing.s }]}>{score.totalScore.toFixed(2)}</Text>
        {/* Optionally, display the breakdown of component scores */}
        {showBreakdown && (
            <View style={styles.scoreBreakdownContainer}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.scoreBreakdownText}>Strength: </Text>
                    {renderComponentScore(score.pushupScore, 20)}
                </View>
                <Text style={styles.scoreBreakdownText}>|</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.scoreBreakdownText}>Core: </Text>
                    {renderComponentScore(score.coreScore, 20)}
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