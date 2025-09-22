
import * as React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Card, theme, StyledTextInput, StyledButton, StyledPicker } from "@repo/ui";
import { calculatePtScore } from "@repo/utils";

export default function RootIndex() {
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("male");

  const [cardioComponent, setCardioComponent] = React.useState("run");
  const [runMinutes, setRunMinutes] = React.useState("");
  const [runSeconds, setRunSeconds] = React.useState("");
  const [shuttles, setShuttles] = React.useState("");

  const [pushupComponent, setPushupComponent] = React.useState("pushups_1min");
  const [pushups, setPushups] = React.useState("");

  const [coreComponent, setCoreComponent] = React.useState("situps_1min");
  const [situps, setSitups] = React.useState("");
  const [reverseCrunches, setReverseCrunches] = React.useState("");
  const [plankMinutes, setPlankMinutes] = React.useState("");
  const [plankSeconds, setPlankSeconds] = React.useState("");

  const [score, setScore] = React.useState({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false });

  React.useEffect(() => {
    const calculateScore = () => {
        const result = calculatePtScore({
            age: parseInt(age) || 0,
            gender,
            cardioComponent,
            runMinutes: parseInt(runMinutes) || 0,
            runSeconds: parseInt(runSeconds) || 0,
            shuttles: parseInt(shuttles) || 0,
            pushupComponent,
            pushups: parseInt(pushups) || 0,
            coreComponent,
            situps: parseInt(situps) || 0,
            reverseCrunches: parseInt(reverseCrunches) || 0,
            plankMinutes: parseInt(plankMinutes) || 0,
            plankSeconds: parseInt(plankSeconds) || 0,
        });
        setScore(result);
    };
    calculateScore();
  }, [age, gender, cardioComponent, runMinutes, runSeconds, shuttles, pushupComponent, pushups, coreComponent, situps, reverseCrunches, plankMinutes, plankSeconds]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Air Force PT Calculator</Text>
      <Card>
        <Text style={styles.cardTitle}>Enter Your Information</Text>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <StyledTextInput value={age} onChangeText={setAge} placeholder="Enter your age" keyboardType="numeric" />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <StyledPicker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                items={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]}
            />
        </View>

        <View style={styles.separator} />

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Cardio Component</Text>
            <StyledPicker
                selectedValue={cardioComponent}
                onValueChange={(itemValue) => setCardioComponent(itemValue)}
                items={[{ label: "1.5-Mile Run", value: "run" }, { label: "20m HAMR Shuttles", value: "shuttles" }]}
            />
        </View>

        {cardioComponent === "run" && (
            <View style={styles.inputGroup}>
                <Text style={styles.label}>1.5-Mile Run Time</Text>
                <View style={styles.inlineInputContainer}>
                    <StyledTextInput value={runMinutes} onChangeText={setRunMinutes} placeholder="Minutes" keyboardType="numeric" style={{flex: 1}} />
                    <Text style={styles.inlineInputSeparator}>:</Text>
                    <StyledTextInput value={runSeconds} onChangeText={setRunSeconds} placeholder="Seconds" keyboardType="numeric" style={{flex: 1}} />
                </View>
            </View>
        )}
        {cardioComponent === "shuttles" && (
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Shuttles</Text>
                <StyledTextInput value={shuttles} onChangeText={setShuttles} placeholder="Enter shuttle count" keyboardType="numeric" />
            </View>
        )}

        <View style={styles.separator} />

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Push-up Component</Text>
            <StyledPicker
                selectedValue={pushupComponent}
                onValueChange={(itemValue) => setPushupComponent(itemValue)}
                items={[{ label: "1-min Push-ups", value: "pushups_1min" }, { label: "2-min Hand-Release Push-ups", value: "hand_release_pushups_2min" }]}
            />
        </View>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Push-up Repetitions</Text>
            <StyledTextInput value={pushups} onChangeText={setPushups} placeholder="Enter push-up count" keyboardType="numeric" />
        </View>

        <View style={styles.separator} />

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Core Component</Text>
            <StyledPicker
                selectedValue={coreComponent}
                onValueChange={(itemValue) => setCoreComponent(itemValue)}
                items={[
                    { label: "1-min Sit-ups", value: "situps_1min" },
                    { label: "2-min Cross-Leg Reverse Crunch", value: "cross_leg_reverse_crunch_2min" },
                    { label: "Forearm Plank", value: "forearm_plank_time" },
                ]}
            />
        </View>

        {coreComponent === "situps_1min" && (
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Sit-up Repetitions</Text>
                <StyledTextInput value={situps} onChangeText={setSitups} placeholder="Enter sit-up count" keyboardType="numeric" />
            </View>
        )}
        {coreComponent === "cross_leg_reverse_crunch_2min" && (
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Reverse Crunches</Text>
                <StyledTextInput value={reverseCrunches} onChangeText={setReverseCrunches} placeholder="Enter crunch count" keyboardType="numeric" />
            </View>
        )}
        {coreComponent === "forearm_plank_time" && (
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Plank Time</Text>
                <View style={styles.inlineInputContainer}>
                    <StyledTextInput value={plankMinutes} onChangeText={setPlankMinutes} placeholder="Minutes" keyboardType="numeric" style={{flex: 1}} />
                    <Text style={styles.inlineInputSeparator}>:</Text>
                    <StyledTextInput value={plankSeconds} onChangeText={setPlankSeconds} placeholder="Seconds" keyboardType="numeric" style={{flex: 1}} />
                </View>
            </View>
        )}

        <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Your Score: {score.totalScore}</Text>
            <Text style={styles.scoreBreakdownText}>Cardio: {score.cardioScore}</Text>
            <Text style={styles.scoreBreakdownText}>Push-ups: {score.pushupScore}</Text>
            <Text style={styles.scoreBreakdownText}>Core: {score.coreScore}</Text>
            <Text style={score.isPass ? styles.passText : styles.failText}>
              {score.isPass ? "Pass" : "Fail"}
            </Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        padding: theme.spacing.m,
    },
    title: {
        ...theme.typography.h1,
        color: theme.colors.text,
        marginBottom: theme.spacing.l,
        textAlign: "center",
    },
    cardTitle: {
        ...theme.typography.h2,
        color: theme.colors.text,
        marginBottom: theme.spacing.l,
    },
    inputGroup: {
        marginBottom: theme.spacing.m,
    },
    label: {
        ...theme.typography.label,
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.l,
    },
    inlineInputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    inlineInputSeparator: {
        ...theme.typography.h1,
        color: theme.colors.border,
        marginHorizontal: theme.spacing.s,
    },
    scoreContainer: {
        marginTop: theme.spacing.l,
        padding: theme.spacing.m,
        backgroundColor: theme.colors.secondary,
        borderRadius: theme.borderRadius.m,
        alignItems: "center",
    },
    scoreText: {
        ...theme.typography.h2,
        color: theme.colors.primary,
    },
    scoreBreakdownText: {
        ...theme.typography.body,
        color: theme.colors.text,
        marginTop: theme.spacing.s,
    },
    passText: {
        ...theme.typography.h2,
        color: 'green',
        marginTop: theme.spacing.m,
    },
    failText: {
        ...theme.typography.h2,
        color: theme.colors.error,
        marginTop: theme.spacing.m,
    },
});
