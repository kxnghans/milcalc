import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "@repo/ui/src/card";
import { SegmentedSelector } from "@repo/ui/src/SegmentedSelector";
import { StyledTextInput } from "@repo/ui/src/StyledTextInput";
import { StyledButton } from "@repo/ui/src/StyledButton";
import { useState } from "react";
import { calculatePtScore } from "@repo/utils/pt-calculator";

export default function App() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [strengthComponent, setStrengthComponent] = useState("1-min Push-ups");
  const [coreComponent, setCoreComponent] = useState("1-min Sit-ups");
  const [cardioComponent, setCardioComponent] = useState("1.5-Mile Run");

  const [pushups, setPushups] = useState("");
  const [handReleasePushups, setHandReleasePushups] = useState("");
  const [situps, setSitups] = useState("");
  const [crossLegCrunches, setCrossLegCrunches] = useState("");
  const [plankMinutes, setPlankMinutes] = useState("");
  const [plankSeconds, setPlankSeconds] = useState("");
  const [runMinutes, setRunMinutes] = useState("");
  const [runSeconds, setRunSeconds] = useState("");
  const [hamrShuttles, setHamrShuttles] = useState("");

  const [score, setScore] = useState({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false });

  const handleCalculate = () => {
    const inputs = {
      age: parseInt(age),
      gender: gender.toLowerCase(),
      cardioComponent: cardioComponent === "1.5-Mile Run" ? "run" : "hamr",
      runMinutes: parseInt(runMinutes) || 0,
      runSeconds: parseInt(runSeconds) || 0,
      hamrShuttles: parseInt(hamrShuttles) || 0,
      pushupComponent: strengthComponent === "1-min Push-ups" ? "push_ups_1min" : "hand_release_pushups_1min",
      pushups: parseInt(pushups) || 0,
      handReleasePushups: parseInt(handReleasePushups) || 0,
      coreComponent: coreComponent === "1-min Sit-ups" ? "sit_ups_1min" : (coreComponent === "2-min Cross-Leg Reverse Crunch" ? "cross_leg_reverse_crunch_2min" : "forearm_plank_time"),
      situps: parseInt(situps) || 0,
      reverseCrunches: parseInt(crossLegCrunches) || 0,
      plankMinutes: parseInt(plankMinutes) || 0,
      plankSeconds: parseInt(plankSeconds) || 0,
    };

    const result = calculatePtScore(inputs);
    setScore(result);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Air Force PT Calculator</Text>
        <Card style={{ width: '100%', alignItems: 'center' }}>
          <Text style={styles.score}>{score.totalScore.toFixed(2)}</Text>
          <Text style={styles.scoreBreakdown}>
            Cardio: {score.cardioScore} | Push-ups: {score.pushupScore} | Core: {score.coreScore}
          </Text>
        </Card>

        <Card style={{ width: '100%' }}>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <StyledTextInput label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" />
            </View>
            <View style={{ flex: 2 }}>
              <SegmentedSelector
                label="Gender"
                options={["Male", "Female"]}
                value={gender}
                onChange={setGender}
              />
            </View>
          </View>
        </Card>

        <Card style={{ width: '100%' }}>
          <SegmentedSelector
            label="Strength"
            options={["1-min Push-ups", "2-min Hand-Release Push-ups"]}
            value={strengthComponent}
            onChange={setStrengthComponent}
          />
          {strengthComponent === "1-min Push-ups" ? (
            <StyledTextInput label="Enter push-up count" value={pushups} onChangeText={setPushups} keyboardType="number-pad" />
          ) : (
            <StyledTextInput label="Enter push-up count" value={handReleasePushups} onChangeText={setHandReleasePushups} keyboardType="number-pad" />
          )}
        </Card>

        <Card style={{ width: '100%' }}>
          <SegmentedSelector
            label="Core"
            options={["1-min Sit-ups", "2-min Cross-Leg Reverse Crunch", "Forearm Plank"]}
            value={coreComponent}
            onChange={setCoreComponent}
          />
          {coreComponent === "1-min Sit-ups" && <StyledTextInput label="Enter sit-up count" value={situps} onChangeText={setSitups} keyboardType="number-pad" />}
          {coreComponent === "2-min Cross-Leg Reverse Crunch" && <StyledTextInput label="Enter crunch count" value={crossLegCrunches} onChangeText={setCrossLegCrunches} keyboardType="number-pad" />}
          {coreComponent === "Forearm Plank" && (
            <View style={styles.row}>
              <StyledTextInput containerStyle={{flex:1, marginRight: 8}} label="Minutes" value={plankMinutes} onChangeText={setPlankMinutes} keyboardType="number-pad" />
              <StyledTextInput containerStyle={{flex:1}} label="Seconds" value={plankSeconds} onChangeText={setPlankSeconds} keyboardType="number-pad" />
            </View>
          )}
        </Card>

        <Card style={{ width: '100%' }}>
          <SegmentedSelector
            label="Cardio"
            options={["1.5-Mile Run", "20m HAMR Shuttles"]}
            value={cardioComponent}
            onChange={setCardioComponent}
          />
          {cardioComponent === "1.5-Mile Run" ? (
            <View style={styles.row}>
              <StyledTextInput containerStyle={{flex:1, marginRight: 8}} label="Minutes" value={runMinutes} onChangeText={setRunMinutes} keyboardType="number-pad" />
              <StyledTextInput containerStyle={{flex:1}} label="Seconds" value={runSeconds} onChangeText={setRunSeconds} keyboardType="number-pad" />
            </View>
          ) : (
            <StyledTextInput label="Enter shuttle count" value={hamrShuttles} onChangeText={setHamrShuttles} keyboardType="number-pad" />
          )}
        </Card>

        <StyledButton title="Calculate" onPress={handleCalculate} />

        <StatusBar style="auto" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
    color: "red",
  },
  scoreBreakdown: {
    fontSize: 16,
    color: "gray",
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  }
});