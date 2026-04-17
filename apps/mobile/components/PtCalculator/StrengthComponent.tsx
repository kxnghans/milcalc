/**
 * @file StrengthComponent.tsx
 * @description This file defines the UI component for the strength section of the PT calculator.
 * It includes options for different strength exercises and an input for the number of repetitions.
 */

import {
  Icon,
  ICONS,
  MASCOT_URLS,
  NeumorphicOutset,
  ProgressBar,
  SegmentedSelector,
  useTheme,
} from "@repo/ui";
import React from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import NumberInput from "../NumberInput";

interface StrengthComponentProps {
  showProgressBars: boolean;
  minMax: { pushups: { min: number; max: number } };
  pushups: string;
  setPushups: (val: string) => void;
  pushupComponent: string;
  setPushupComponent: (val: string) => void;
  ninetyPercentileThreshold: number;
  isExempt: boolean;
  toggleExempt: () => void;
  openDetailModal: (key: string, mascot?: ImageSourcePropType) => void;
  score: { totalScore: number; pushupScore: number | string; isPass: boolean };
  onFocus?: () => void;
}

/**
 * A component that renders the strength section of the PT calculator.
 * This includes a selector for the type of push-up and an input for the number of reps.
 * It can also display a progress bar showing performance against standards.
 * @param {object} props - The component props.
 * @returns {JSX.Element} The rendered strength component section.
 */
export default function StrengthComponent({
  showProgressBars,
  minMax,
  pushups,
  setPushups,
  pushupComponent,
  setPushupComponent,
  ninetyPercentileThreshold,
  isExempt,
  toggleExempt,
  openDetailModal,
  score,
  onFocus,
}: StrengthComponentProps) {
  const { theme } = useTheme();
  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        cardTitle: {
          ...theme.typography.title,
          color: theme.colors.text,
          marginLeft: theme.spacing.s,
          marginVertical: theme.spacing.s,
          marginRight: theme.spacing.m,
        },
        componentHeader: {
          flexDirection: "row",
          alignItems: "center",
        },
        exerciseBlock: {
          justifyContent: "center",
        },
        helpIcon: {
          margin: theme.spacing.s,
        },
        progressBarContainer: {
          flex: 1,
        },
        inputMargin: {
          marginHorizontal: theme.spacing.s,
          marginTop: theme.spacing.xs,
        },
      }),
    [theme],
  );

  const getMascot = (): ImageSourcePropType => {
    if (
      pushupComponent === "push_ups_1min" ||
      pushupComponent === "hand_release_pushups_2min"
    ) {
      return { uri: MASCOT_URLS.PUSHUP };
    } else if (pushupComponent === "crunches") {
      return { uri: MASCOT_URLS.CRUNCH };
    }
    return { uri: MASCOT_URLS.PUSHUP }; // Default mascot
  };

  return (
    <View>
      <View style={styles.exerciseBlock}>
        <View style={styles.componentHeader}>
          <TouchableOpacity
            onPress={() => openDetailModal(pushupComponent, getMascot())}
          >
            <Icon
              name={ICONS.HELP}
              size={16}
              color={theme.colors.disabled}
              style={styles.helpIcon}
            />
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Strength</Text>
          {/* Conditionally render the progress bar based on the showProgressBars prop. */}
          {showProgressBars && (
            <View style={styles.progressBarContainer}>
              <NeumorphicOutset>
                <ProgressBar
                  value={parseInt(pushups) || 0}
                  passThreshold={minMax.pushups.min}
                  maxPointsThreshold={minMax.pushups.max}
                  ninetyPercentileThreshold={ninetyPercentileThreshold}
                  score={
                    typeof score.pushupScore === "number"
                      ? score.pushupScore
                      : 0
                  }
                  maxScore={15}
                />
              </NeumorphicOutset>
            </View>
          )}
        </View>
        <SegmentedSelector
          options={[
            { label: "1-Min Push-ups", value: "push_ups_1min" },
            { label: "2-Min HR Push-ups", value: "hand_release_pushups_2min" },
          ]}
          selectedValues={isExempt ? [] : [pushupComponent]}
          onValueChange={setPushupComponent}
        />
        <NumberInput
          value={pushups}
          onChangeText={setPushups}
          onFocus={onFocus}
          placeholder="Enter push-up count"
          style={styles.inputMargin}
          onToggleExempt={toggleExempt}
          isExempt={isExempt}
          testID="strength-input"
        />
      </View>
    </View>
  );
}
