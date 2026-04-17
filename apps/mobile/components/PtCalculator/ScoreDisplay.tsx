/**
 * @file ScoreDisplay.tsx
 * @description This component is responsible for rendering the total PT score and a breakdown of individual component scores.
 * It uses neumorphic styling and color-codes the scores based on performance categories.
 */

import { useScoreColors, useTheme } from "@repo/ui";
import { getScoreCategory } from "@repo/utils";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ScoreDisplayProps {
  score: {
    totalScore: number;
    pushupScore?: number | string;
    coreScore?: number | string;
    cardioScore?: number | string;
    whtrScore?: number | string;
    isPass: boolean;
    walkPassed?: string;
    cardioRiskCategory?: string | null;
    whtrRiskCategory?: string | null;
  };
  cardioComponent?: string;
  showBreakdown?: boolean;
}

/**
 * Displays the total PT score and a breakdown of component scores.
 * @param {ScoreDisplayProps} props - The component props.
 * @returns {JSX.Element} The rendered score display component.
 */
const ScoreDisplay = ({
  score,
  cardioComponent,
  showBreakdown = true,
}: ScoreDisplayProps) => {
  const { theme } = useTheme();
  const excellentColors = useScoreColors("excellent");
  const passColors = useScoreColors("pass");
  const failColors = useScoreColors("fail");

  /**
   * Determines the color for a score based on its category (excellent, pass, fail).
   * @param {number | string} score - The score to evaluate.
   * @param {number} maxScore - The maximum possible score for the component.
   * @returns {string} The color code for the score.
   */
  const getScoreColor = (score: number | string, maxScore: number) => {
    const numericScore =
      typeof score === "number" ? score : parseFloat(String(score)) || 0;
    const category = getScoreCategory(numericScore, maxScore, true);
    if (category === "excellent") return excellentColors.progressColor;
    if (category === "pass") return passColors.progressColor;
    if (category === "fail") return failColors.progressColor;
    return theme.colors.text;
  };

  // The total score is colored red if the test is a fail, otherwise it's colored based on the score category.
  const scoreColor = score.isPass
    ? getScoreColor(score.totalScore, 100)
    : failColors.progressColor;

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        scoreContainer: {
          borderRadius: theme.borderRadius.m,
          backgroundColor: theme.colors.background,
        },
        scoreContent: {
          paddingVertical: 0,
          paddingHorizontal: 0,
          alignItems: "center",
          borderRadius: theme.borderRadius.m,
          backgroundColor: theme.colors.background,
          overflow: "hidden",
        },
        scoreBreakdownContainer: {
          flexDirection: "row",
          justifyContent: "center",
          gap: theme.spacing.s,
          width: "100%",
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
        row: {
          flexDirection: "row",
        },
        riskCategoryContainer: {
          alignItems: "center",
        },
        riskCategoryLabel: {
          marginTop: -4,
        },
      }),
    [theme],
  );

  /**
   * Renders a component score, handling numeric values and the "Exempt" status.
   * @param {number | string} componentScore - The score to render.
   * @param {number} maxScore - The maximum possible score for the component.
   * @returns {JSX.Element} The rendered score text.
   */
  const renderComponentScore = (
    componentScore: number | string | undefined,
    maxScore: number,
    riskCategory?: string | null,
    isWhtr?: boolean,
  ) => {
    if (componentScore === "Exempt") {
      return (
        <Text
          style={[styles.scoreBreakdownText, { color: theme.colors.disabled }]}
        >
          Exempt
        </Text>
      );
    }
    if (componentScore === undefined) {
      return (
        <Text
          style={[styles.scoreBreakdownText, { color: theme.colors.disabled }]}
        >
          N/A
        </Text>
      );
    }

    let color = getScoreColor(componentScore, maxScore);
    if (isWhtr && riskCategory) {
      const normalizedRisk = riskCategory.toLowerCase();
      if (normalizedRisk.includes("low")) color = excellentColors.progressColor;
      else if (normalizedRisk.includes("moderate")) color = theme.colors.warning || "#FFD600";
      else if (normalizedRisk.includes("high")) color = theme.colors.error;
    }

    const scoreDisplay = (
      <Text style={[styles.scoreBreakdownText, { color }]}>
        {componentScore}
      </Text>
    );

    // Only display the risk category label if it's not WHR (which is implied by color/score)
    // or if specifically requested by the design to show the semantic label.
    if (!isWhtr) {
      return (
        <View style={styles.riskCategoryContainer}>
          {scoreDisplay}
          <Text
            style={[
              theme.typography.caption,
              styles.riskCategoryLabel,
              { color: theme.colors.disabled },
            ]}
          >
            {riskCategory || "No Category"}
          </Text>
        </View>
      );
    }

    return scoreDisplay;
  };

  /**
   * Renders the cardio score, with special handling for the walk component and exemptions.
   * @returns {JSX.Element} The rendered cardio score text.
   */
  const renderCardioScore = () => {
    if (score.cardioScore === "Exempt") {
      return (
        <Text
          style={[styles.scoreBreakdownText, { color: theme.colors.disabled }]}
        >
          Exempt
        </Text>
      );
    }
    if (cardioComponent === "walk") {
      if (!score.walkPassed || score.walkPassed === "n/a") {
        return (
          <Text
            style={[
              styles.scoreBreakdownText,
              { color: theme.colors.disabled },
            ]}
          >
            N/A
          </Text>
        );
      }
      const color =
        score.walkPassed === "pass"
          ? passColors.progressColor
          : failColors.progressColor;
      const text = score.walkPassed === "pass" ? "Pass" : "Fail";
      return <Text style={[styles.scoreBreakdownText, { color }]}>{text}</Text>;
    }
    return renderComponentScore(
      score.cardioScore || 0,
      50,
      score.cardioRiskCategory,
    );
  };

  return (
    <View style={[styles.scoreContainer, styles.scoreContent]}>
      {/* Display the total score */}
      <Text
        testID="total-score"
        style={[
          styles.scoreText,
          { color: scoreColor },
          showBreakdown && { marginBottom: theme.spacing.s },
        ]}
      >
        {score.totalScore.toFixed(2)}
      </Text>
      {/* Optionally, display the breakdown of component scores */}
      {showBreakdown && (
        <View style={styles.scoreBreakdownContainer}>
          <View style={styles.row}>
            <Text style={styles.scoreBreakdownText}>WHR: </Text>
            <View testID="score-whr">
              {renderComponentScore(
                score.whtrScore,
                20,
                score.whtrRiskCategory,
                true,
              )}
            </View>
          </View>
          <Text style={styles.scoreBreakdownText}>|</Text>
          <View style={styles.row}>
            <Text style={styles.scoreBreakdownText}>Strength: </Text>
            <View testID="score-strength">
              {renderComponentScore(score.pushupScore, 15)}
            </View>
          </View>
          <Text style={styles.scoreBreakdownText}>|</Text>
          <View style={styles.row}>
            <Text style={styles.scoreBreakdownText}>Core: </Text>
            <View testID="score-core">
              {renderComponentScore(score.coreScore, 15)}
            </View>
          </View>
          <Text style={styles.scoreBreakdownText}>|</Text>
          <View style={styles.row}>
            <Text style={styles.scoreBreakdownText}>Cardio: </Text>
            <View testID="score-cardio">{renderCardioScore()}</View>
          </View>
        </View>
      )}
    </View>
  );
};

export default React.memo(ScoreDisplay);
