import { useBestScoreState, useDemographicsState, useTheme } from "@repo/ui";
import React from "react";
import { ImageSourcePropType, StyleSheet } from "react-native";

import Divider from "../../components/Divider";
import MainCalculatorLayout from "../../components/MainCalculatorLayout";
import AltitudeAdjustmentComponent from "../../components/PtCalculator/AltitudeAdjustmentComponent";
import {
  BestScoreExercise,
  BestScoreSection,
} from "../../components/PtCalculator/BestScoreSection";
import Demographics from "../../components/PtCalculator/Demographics";
import ScoreDisplay from "../../components/PtCalculator/ScoreDisplay";
import { useOverlay } from "../../contexts/OverlayContext";

export default function BestScoreScreen() {
  const { theme } = useTheme();
  const { openHelp, openDocuments } = useOverlay();

  const handleOpenHelp = React.useCallback(
    (key: string, mascot?: ImageSourcePropType) => {
      openHelp(key, "best_score", mascot);
    },
    [openHelp],
  );

  const {
    age,
    setAge,
    gender,
    setGender,
    altitudeGroup,
    setAltitudeGroup,
    waist,
    setWaist,
    heightFeet,
    setHeightFeet,
    heightInches,
    setHeightInches,
    isHeightInInches,
    setIsHeightInInches,
    calculatedWhtr,
  } = useDemographicsState();
  const { inputs, outputs, exemptions } = useBestScoreState(
    age,
    gender,
    altitudeGroup,
    calculatedWhtr,
  );
  const { isLoading } = outputs;

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        divider: {
          marginTop: theme.spacing.s,
          marginBottom: theme.spacing.s,
        },
      }),
    [theme],
  );

  const strengthExercises: BestScoreExercise[] = React.useMemo(
    () => [
      {
        label: "1-Min Push-ups",
        value: "push_ups_1min",
        type: "number",
        onValueChange: inputs.setPushUps,
      },
      {
        label: "2-Min HR Push-ups",
        value: "hand_release_pushups_2min",
        type: "number",
        onValueChange: inputs.setHrPushUps,
      },
    ],
    [inputs],
  );

  const strengthScores = React.useMemo(
    () => [
      outputs.scores.push_ups_1min || 0,
      outputs.scores.hand_release_pushups_2min || 0,
    ],
    [outputs],
  );
  const strengthBestValues = React.useMemo(
    () => ({
      push_ups_1min: inputs.pushUps,
      hand_release_pushups_2min: inputs.hrPushUps,
    }),
    [inputs],
  );

  const coreExercises: BestScoreExercise[] = React.useMemo(
    () => [
      {
        label: "1-Min Sit-ups",
        value: "sit_ups_1min",
        type: "number",
        onValueChange: inputs.setSitUps,
      },
      {
        label: "2-Min CL Crunch",
        value: "cross_leg_reverse_crunch_2min",
        type: "number",
        onValueChange: inputs.setCrunches,
      },
      {
        label: "Forearm Planks",
        value: "forearm_plank_time",
        type: "time",
        onValueChange: (value: { minutes: string; seconds: string }) => {
          inputs.setPlankMinutes(value.minutes);
          inputs.setPlankSeconds(value.seconds);
        },
      },
    ],
    [inputs],
  );

  const coreScores = React.useMemo(
    () => [
      outputs.scores.sit_ups_1min || 0,
      outputs.scores.cross_leg_reverse_crunch_2min || 0,
      outputs.scores.forearm_plank_time || 0,
    ],
    [outputs],
  );
  const coreBestValues = React.useMemo(
    () => ({
      sit_ups_1min: inputs.sitUps,
      cross_leg_reverse_crunch_2min: inputs.crunches,
      forearm_plank_time: {
        minutes: inputs.plankMinutes,
        seconds: inputs.plankSeconds,
      },
    }),
    [inputs],
  );

  const cardioExercises: BestScoreExercise[] = React.useMemo(
    () => [
      {
        label: "2-Mile Run",
        value: "run",
        type: "time",
        onValueChange: (value: { minutes: string; seconds: string }) => {
          inputs.setRunMinutes(value.minutes);
          inputs.setRunSeconds(value.seconds);
        },
      },
      {
        label: "20m HAMR",
        value: "shuttles",
        type: "number",
        onValueChange: inputs.setShuttles,
      },
      {
        label: "2-km Walk",
        value: "walk",
        type: "time",
        onValueChange: (value: { minutes: string; seconds: string }) => {
          inputs.setWalkMinutes(value.minutes);
          inputs.setWalkSeconds(value.seconds);
        },
      },
    ],
    [inputs],
  );

  const cardioScores = React.useMemo(
    () => [
      outputs.scores.run || 0,
      outputs.scores.shuttles || 0,
      outputs.scores.walk || "N/A",
    ],
    [outputs],
  );
  const cardioBestValues = React.useMemo(
    () => ({
      run: { minutes: inputs.runMinutes, seconds: inputs.runSeconds },
      shuttles: inputs.shuttles,
      walk: { minutes: inputs.walkMinutes, seconds: inputs.walkSeconds },
    }),
    [inputs],
  );

  return (
    <MainCalculatorLayout
      title="Best PT Score Calculator"
      isLoading={isLoading}
      actions={["home", "document", "theme"]}
      onDocument={() => openDocuments("PT")}
      summaryContent={
        <ScoreDisplay
          score={{
            totalScore: outputs.bestScore,
            isPass: outputs.bestScore >= 75,
            ...outputs.componentScores,
          }}
          showBreakdown={true}
        />
      }
      inputContent={
        <>
          <Demographics
            age={age}
            setAge={setAge}
            gender={gender}
            setGender={setGender}
            waist={waist}
            setWaist={setWaist}
            heightFeet={heightFeet}
            setHeightFeet={setHeightFeet}
            heightInches={heightInches}
            setHeightInches={setHeightInches}
            isHeightInInches={isHeightInInches}
            setIsHeightInInches={setIsHeightInInches}
          />
          <Divider style={styles.divider} />
          <BestScoreSection
            title="Strength"
            exercises={strengthExercises}
            scores={strengthScores}
            bestValues={strengthBestValues}
            maxScore={15}
            isExempt={exemptions.isStrengthExempt}
            onToggleExempt={exemptions.toggleStrengthExempt}
            openHelp={handleOpenHelp}
          />
          <Divider style={styles.divider} />
          <BestScoreSection
            title="Core"
            exercises={coreExercises}
            scores={coreScores}
            bestValues={coreBestValues}
            maxScore={15}
            isExempt={exemptions.isCoreExempt}
            onToggleExempt={exemptions.toggleCoreExempt}
            openHelp={handleOpenHelp}
          />
          <Divider style={styles.divider} />
          <BestScoreSection
            title="Cardio"
            exercises={cardioExercises}
            scores={cardioScores}
            bestValues={cardioBestValues}
            maxScore={50}
            isExempt={exemptions.isCardioExempt}
            onToggleExempt={exemptions.toggleCardioExempt}
            openHelp={handleOpenHelp}
          />
          <Divider style={styles.divider} />
          <AltitudeAdjustmentComponent
            selectedValue={altitudeGroup}
            onValueChange={setAltitudeGroup}
            openDetailModal={handleOpenHelp}
          />
        </>
      }
    />
  );
}
