/**
 * @file App.tsx
 * @description This file appears to be the original root component for the mobile application,
 * likely from before the project was migrated to use Expo Router's file-based routing.
 * It contains a significant amount of state and logic that has since been refactored into
 * custom hooks and separate components.
 *
 * NOTE: This file is likely DEPRECATED and UNUSED. The current entry point for the app
 * is `apps/mobile/app/_layout.tsx`.
 */

import {
  Card,
  getAlphaColor,
  SegmentedSelector,
  StyledButton,
  StyledTextInput,
} from "@repo/ui";
import { calculatePtScore, PtInputs } from "@repo/utils";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * The original root component for the PT Calculator app.
 * This component manages all state locally and contains all UI elements in a single file.
 * It has been superseded by the new structure in the `app/(tabs)` directory.
 */
export default function App() {
  // All application state was originally managed here with numerous useState hooks.
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [strengthComponent, setStrengthComponent] = useState("1-min Push-ups");
  const [coreComponent, setCoreComponent] = useState("1-min Sit-ups");
  const [cardioComponent, setCardioComponent] = useState("2-Mile Run");

  const [pushups, setPushups] = useState("");
  const [handReleasePushups, setHandReleasePushups] = useState("");
  const [situps, setSitups] = useState("");
  const [crossLegCrunches, setCrossLegCrunches] = useState("");
  const [plankMinutes, setPlankMinutes] = useState("");
  const [plankSeconds, setPlankSeconds] = useState("");
  const [runMinutes, setRunMinutes] = useState("");
  const [runSeconds, setRunSeconds] = useState("");
  const [hamrShuttles, setHamrShuttles] = useState("");

  const [score, setScore] = useState<{
    totalScore: number;
    cardioScore: number | string;
    pushupScore: number | string;
    coreScore: number | string;
    isPass: boolean;
    walkPassed?: string;
  }>({
    totalScore: 0,
    cardioScore: 0,
    pushupScore: 0,
    coreScore: 0,
    isPass: false,
  });

  /**
   * Handles the calculation of the PT score by gathering all state variables,
   * formatting them, and calling the central `calculatePtScore` function.
   */
  const handleCalculate = () => {
    const inputs: PtInputs = {
      age: parseInt(age),
      gender: gender.toLowerCase(),
      cardioComponent: cardioComponent === "2-Mile Run" ? "run" : "hamr",
      runMinutes: parseInt(runMinutes) || 0,
      runSeconds: parseInt(runSeconds) || 0,
      pushupComponent:
        strengthComponent === "1-min Push-ups"
          ? "push_ups_1min"
          : "hand_release_pushups_1min",
      pushups: parseInt(pushups) || 0,
      coreComponent:
        coreComponent === "1-min Sit-ups"
          ? "sit_ups_1min"
          : coreComponent === "2-min Cross-Leg Reverse Crunch"
            ? "cross_leg_reverse_crunch_2min"
            : "forearm_plank_time",
      situps: parseInt(situps) || 0,
      reverseCrunches: parseInt(crossLegCrunches) || 0,
      plankMinutes: parseInt(plankMinutes) || 0,
      plankSeconds: parseInt(plankSeconds) || 0,
    };

    const result = calculatePtScore(inputs, [], [], [], []);
    setScore(result);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Air Force PT Calculator</Text>
        {/* Score Display Card */}
        <Card style={styles.scoreCard}>
          <Text style={styles.score}>{score.totalScore.toFixed(2)}</Text>
          <Text style={styles.scoreBreakdown}>
            Cardio: {score.cardioScore} | Push-ups: {score.pushupScore} | Core:{" "}
            {score.coreScore}
          </Text>
        </Card>

        {/* Demographics Card */}
        <Card style={styles.fullWidthCard}>
          <View style={styles.row}>
            <View style={styles.ageInputContainer}>
              <StyledTextInput
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                placeholder="Age"
              />
            </View>
            <View style={styles.genderSelectorContainer}>
              <SegmentedSelector
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
                selectedValues={[gender]}
                onValueChange={setGender}
              />
            </View>
          </View>
        </Card>

        {/* Strength Component Card */}
        <Card style={styles.fullWidthCard}>
          <SegmentedSelector
            options={[
              { label: "1-min Push-ups", value: "1-min Push-ups" },
              {
                label: "2-min Hand-Release Push-ups",
                value: "2-min Hand-Release Push-ups",
              },
            ]}
            selectedValues={[strengthComponent]}
            onValueChange={setStrengthComponent}
          />
          {strengthComponent === "1-min Push-ups" ? (
            <StyledTextInput
              value={pushups}
              onChangeText={setPushups}
              keyboardType="number-pad"
              placeholder="Enter push-up count"
            />
          ) : (
            <StyledTextInput
              value={handReleasePushups}
              onChangeText={setHandReleasePushups}
              keyboardType="number-pad"
              placeholder="Enter push-up count"
            />
          )}
        </Card>

        {/* Core Component Card */}
        <Card style={styles.fullWidthCard}>
          <SegmentedSelector
            options={[
              { label: "1-min Sit-ups", value: "1-min Sit-ups" },
              {
                label: "2-min Cross-Leg Reverse Crunch",
                value: "2-min Cross-Leg Reverse Crunch",
              },
              { label: "Forearm Plank", value: "Forearm Plank" },
            ]}
            selectedValues={[coreComponent]}
            onValueChange={setCoreComponent}
          />
          {coreComponent === "1-min Sit-ups" && (
            <StyledTextInput
              value={situps}
              onChangeText={setSitups}
              keyboardType="number-pad"
              placeholder="Enter sit-up count"
            />
          )}
          {coreComponent === "2-min Cross-Leg Reverse Crunch" && (
            <StyledTextInput
              value={crossLegCrunches}
              onChangeText={setCrossLegCrunches}
              keyboardType="number-pad"
              placeholder="Enter crunch count"
            />
          )}
          {coreComponent === "Forearm Plank" && (
            <View style={styles.row}>
              <StyledTextInput
                value={plankMinutes}
                onChangeText={setPlankMinutes}
                keyboardType="number-pad"
                placeholder="Minutes"
              />
              <StyledTextInput
                value={plankSeconds}
                onChangeText={setPlankSeconds}
                keyboardType="number-pad"
                placeholder="Seconds"
              />
            </View>
          )}
        </Card>

        {/* Cardio Component Card */}
        <Card style={styles.fullWidthCard}>
          <SegmentedSelector
            options={[
              { label: "2-Mile Run", value: "2-Mile Run" },
              { label: "20m HAMR Shuttles", value: "20m HAMR Shuttles" },
            ]}
            selectedValues={[cardioComponent]}
            onValueChange={setCardioComponent}
          />
          {cardioComponent === "2-Mile Run" ? (
            <View style={styles.row}>
              <StyledTextInput
                value={runMinutes}
                onChangeText={setRunMinutes}
                keyboardType="number-pad"
                placeholder="Minutes"
              />
              <StyledTextInput
                value={runSeconds}
                onChangeText={setRunSeconds}
                keyboardType="number-pad"
                placeholder="Seconds"
              />
            </View>
          ) : (
            <StyledTextInput
              value={hamrShuttles}
              onChangeText={setHamrShuttles}
              keyboardType="number-pad"
              placeholder="Enter shuttle count"
            />
          )}
        </Card>

        <StyledButton title="Calculate" onPress={handleCalculate} />

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles are defined locally and are not using the dynamic theme from the context.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getAlphaColor("#f0f0f0", 1),
  },
  scrollContainer: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  score: {
    fontSize: 48,
    fontWeight: "bold",
    color: getAlphaColor("#FF0000", 1),
  },
  scoreBreakdown: {
    fontSize: 16,
    color: getAlphaColor("#808080", 1),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  scoreCard: {
    width: "100%",
    alignItems: "center",
  },
  fullWidthCard: {
    width: "100%",
  },
  ageInputContainer: {
    flex: 1,
    marginRight: 8,
  },
  genderSelectorContainer: {
    flex: 2,
  },
});
