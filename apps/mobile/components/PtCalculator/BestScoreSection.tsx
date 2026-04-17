import {
  ExemptButton,
  Icon,
  IconRow,
  MASCOT_URLS,
  SegmentedSelector,
  useScoreColors,
  useTheme,
} from "@repo/ui";
import { ICONS } from "@repo/ui/icons";
import { getScoreCategory } from "@repo/utils";
import React from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import NumberInput from "../NumberInput";
import TimeInput from "../TimeInput";

export type BestScoreExercise =
  | {
      label: string;
      value: string;
      type: "number";
      onValueChange: (val: string) => void;
    }
  | {
      label: string;
      value: string;
      type: "time";
      onValueChange: (val: { minutes: string; seconds: string }) => void;
    };

export interface BestScoreSectionProps {
  title: string;
  exercises: BestScoreExercise[];
  scores: (number | string)[];
  bestValues: Record<string, string | { minutes: string; seconds: string }>;
  maxScore: number;
  isExempt: boolean;
  onToggleExempt: () => void;
  openHelp: (key: string, mascot?: ImageSourcePropType) => void;
}

export const getMascot = (sectionTitle: string): ImageSourcePropType => {
  switch (sectionTitle) {
    case "Strength":
      return { uri: MASCOT_URLS.PUSHUP };
    case "Core":
      return { uri: MASCOT_URLS.CRUNCH };
    case "Cardio":
      return { uri: MASCOT_URLS.RUN };
    default:
      return { uri: MASCOT_URLS.SPLASH };
  }
};

export const BestScoreSection = ({
  title,
  exercises,
  scores,
  bestValues,
  maxScore,
  isExempt,
  onToggleExempt,
  openHelp,
}: BestScoreSectionProps) => {
  const { theme } = useTheme();

  const excellentColors = useScoreColors("excellent");
  const passColors = useScoreColors("pass");
  const failColors = useScoreColors("fail");

  const getScoreColor = React.useCallback(
    (score: number | string, maxScore: number) => {
      const numericScore =
        typeof score === "number" ? score : parseFloat(String(score)) || 0;
      const category = getScoreCategory(numericScore, maxScore);
      if (category === "excellent") return excellentColors.progressColor;
      if (category === "pass") return passColors.progressColor;
      if (category === "fail") return failColors.progressColor;
      return theme.colors.text;
    },
    [
      excellentColors.progressColor,
      passColors.progressColor,
      failColors.progressColor,
      theme.colors.text,
    ],
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        sectionHeader: {
          flexDirection: "row",
          alignItems: "center",
        },
        cardTitle: {
          ...theme.typography.title,
          color: theme.colors.text,
          marginLeft: theme.spacing.s,
          marginRight: "auto",
        },
        gridContainer: {
          flexDirection: "row",
          justifyContent: "space-around",
        },
        gridColumn: {
          flex: 1,
          alignItems: "center",
          gap: theme.spacing.s,
          marginHorizontal: theme.spacing.s,
          marginVertical: theme.spacing.xs,
        },
        scoreRow: {
          width: "100%",
        },
        scoreBreakdownText: {
          ...theme.typography.subtitle,
          textShadowColor: theme.colors.neumorphic.outset.shadow,
          textShadowRadius: 0.1,
          textShadowOffset: { width: 0, height: 0 },
        },
        helpIcon: {
          margin: theme.spacing.s,
        },
        fullWidth: {
          width: "100%",
        },
      }),
    [theme],
  );

  const maxNumericScore = Math.max(
    0,
    ...scores.filter((s): s is number => typeof s === "number"),
  );
  let selectedExerciseValues: string[] = [];

  if (maxNumericScore > 0 && !isExempt) {
    selectedExerciseValues = scores.reduce((acc: string[], score, index) => {
      if (score === maxNumericScore) {
        acc.push(exercises[index].value);
      }
      return acc;
    }, []);
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <TouchableOpacity
          onPress={() =>
            openHelp(`best_score_${title.toLowerCase()}`, getMascot(title))
          }
        >
          <Icon
            name={ICONS.HELP}
            size={16}
            color={theme.colors.disabled}
            style={styles.helpIcon}
          />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>{title}</Text>
        <ExemptButton onPress={onToggleExempt} isActive={isExempt} />
      </View>
      <SegmentedSelector
        options={exercises.map((e) => ({ label: e.label, value: e.value }))}
        selectedValues={selectedExerciseValues}
        onValueChange={() => {}}
        isTouchable={false}
      />
      <View style={styles.gridContainer}>
        {exercises.map((exercise, index) => {
          const exerciseValue = bestValues[exercise.value];
          const isTimeType =
            exercise.type === "time" && typeof exerciseValue === "object";
          return (
            <View key={index} style={styles.gridColumn}>
              {exercise.type === "number" ? (
                <NumberInput
                  value={exerciseValue as string}
                  onChangeText={
                    exercise.onValueChange as (text: string) => void
                  }
                  placeholder="--"
                  style={styles.fullWidth}
                  isExempt={isExempt}
                />
              ) : (
                <TimeInput
                  minutes={isTimeType ? exerciseValue.minutes : ""}
                  seconds={isTimeType ? exerciseValue.seconds : ""}
                  setMinutes={(minutes) =>
                    exercise.onValueChange({
                      minutes,
                      seconds: isTimeType ? exerciseValue.seconds : "",
                    })
                  }
                  setSeconds={(seconds) =>
                    exercise.onValueChange({
                      minutes: isTimeType ? exerciseValue.minutes : "",
                      seconds,
                    })
                  }
                  style={styles.fullWidth}
                  isExempt={isExempt}
                />
              )}
            </View>
          );
        })}
      </View>
      <View style={styles.scoreRow}>
        <IconRow
          icons={scores.map((s, index) => {
            const isWalk = exercises[index]?.value === "walk";
            let text = s ? String(s) : "--";
            let color = theme.colors.text;

            if (isExempt) {
              text = "Exempt";
              color = theme.colors.disabled;
            } else if (isWalk) {
              if (s === "pass") {
                color = passColors.progressColor;
                text = "Pass";
              } else if (s === "fail") {
                color = failColors.progressColor;
                text = "Fail";
              } else {
                text = "N/A";
                color = theme.colors.disabled;
              }
            } else {
              const isBestNumeric =
                typeof s === "number" && s === maxNumericScore;
              if (isBestNumeric) {
                if (s === 0) {
                  color = failColors.progressColor;
                } else {
                  color = getScoreColor(s, maxScore);
                }
              }
            }

            return {
              text,
              textStyle: styles.scoreBreakdownText,
              color,
            };
          })}
          borderRadius={theme.borderRadius.m}
        />
      </View>
    </View>
  );
};
