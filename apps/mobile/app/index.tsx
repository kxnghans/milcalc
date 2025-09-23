
import * as React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Card, theme, StyledTextInput, StyledButton, ProgressBar, SegmentedSelector } from "@repo/ui";
import { calculatePtScore, getMinMaxValues, getDisplayComponent } from "@repo/utils";

const GenderSelector = ({ gender, setGender }) => (
    <View style={styles.genderSelectorContainer}>
        <StyledButton
            title="Male"
            onPress={() => setGender("male")}
            variant={gender === 'male' ? 'primary' : 'secondary'}
            style={{ flex: 1 }}
        />
        <StyledButton
            title="Female"
            onPress={() => setGender("female")}
            variant={gender === 'female' ? 'primary' : 'secondary'}
            style={{ flex: 1, marginLeft: theme.spacing.s }}
        />
    </View>
);

const ScoreDisplay = ({ score }) => {
    const scoreColor = score.isPass ? (score.totalScore >= 90 ? theme.colors.ninetyPlus : theme.colors.success) : theme.colors.error;
    return (
        <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>{score.totalScore.toFixed(2)}</Text>
            <Text style={styles.scoreBreakdownText}>Cardio: {score.cardioScore} | Push-ups: {score.pushupScore} | Core: {score.coreScore}</Text>
        </View>
    );
};

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
  const [minMax, setMinMax] = React.useState({ pushups: {min: 0, max: 0}, core: {min: 0, max: 0}});

  React.useEffect(() => {
    const ageNum = parseInt(age);
    if (ageNum && gender) {
        const pushupValues = getMinMaxValues(ageNum, gender, pushupComponent);
        const coreValues = getMinMaxValues(ageNum, gender, coreComponent === 'situps_1min' ? 'sit_ups_1min' : 'cross_leg_reverse_crunch_2min');
        setMinMax({pushups: pushupValues, core: coreValues});
    }

    const calculateScore = () => {
        const result = calculatePtScore({
            age: ageNum || 0,
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

  const showProgressBars = age && gender;

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Air Force PT Calculator</Text>
            <ScoreDisplay score={score} />
            <Card>
                <View style={styles.inlineInputContainer}>
                    <View style={{width: 80, marginRight: theme.spacing.m}}>
                        <Text style={styles.subtitle}>Age</Text>
                        <StyledTextInput value={age} onChangeText={setAge} placeholder="" keyboardType="numeric" />
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={styles.subtitle}>Gender</Text>
                        <GenderSelector gender={gender} setGender={setGender} />
                    </View>
                </View>

                <View style={styles.separator} />
                
                <View style={styles.componentHeader}>
                    <Text style={styles.cardTitle}>Strength</Text>
                    {showProgressBars && <ProgressBar progress={(parseInt(pushups) || 0) / minMax.pushups.max} markers={[{value: minMax.pushups.min/minMax.pushups.max, label: `${minMax.pushups.min}`}, {value: 1, label: `${minMax.pushups.max}`}]} />}
                </View>
                <SegmentedSelector
                    options={[{ label: "1-min Push-ups", value: "pushups_1min" }, { label: "2-min Hand-Release Push-ups", value: "hand_release_pushups_2min" }]}
                    selectedValue={pushupComponent}
                    onValueChange={setPushupComponent}
                />
                <StyledTextInput value={pushups} onChangeText={setPushups} placeholder="Enter push-up count" keyboardType="numeric" />

                <View style={styles.separator} />

                <View style={styles.componentHeader}>
                    <Text style={styles.cardTitle}>Core</Text>
                    {showProgressBars && (coreComponent === "situps_1min" || coreComponent === "cross_leg_reverse_crunch_2min") && (
                        <ProgressBar progress={(parseInt(coreComponent === "situps_1min" ? situps : reverseCrunches) || 0) / minMax.core.max} markers={[{value: minMax.core.min/minMax.core.max, label: `${minMax.core.min}`}, {value: 1, label: `${minMax.core.max}`}]} />
                    )}
                </View>
                <SegmentedSelector
                    options={[
                        { label: "1-min Sit-ups", value: "situps_1min" },
                        { label: "2-min Cross-Leg Reverse Crunch", value: "cross_leg_reverse_crunch_2min" },
                        { label: "Forearm Plank", value: "forearm_plank_time" },
                    ]}
                    selectedValue={coreComponent}
                    onValueChange={setCoreComponent}
                />
                {coreComponent === "situps_1min" && (
                    <StyledTextInput value={situps} onChangeText={setSitups} placeholder="Enter sit-up count" keyboardType="numeric" />
                )}
                {coreComponent === "cross_leg_reverse_crunch_2min" && (
                    <StyledTextInput value={reverseCrunches} onChangeText={setReverseCrunches} placeholder="Enter crunch count" keyboardType="numeric" />
                )}
                {coreComponent === "forearm_plank_time" && (
                    <View style={styles.timeInputContainer}>
                        <StyledTextInput value={plankMinutes} onChangeText={setPlankMinutes} placeholder="Minutes" keyboardType="numeric" style={styles.timeInput} />
                        <Text style={styles.timeInputSeparator}>:</Text>
                        <StyledTextInput value={plankSeconds} onChangeText={setPlankSeconds} placeholder="Seconds" keyboardType="numeric" style={styles.timeInput} />
                    </View>
                )}

                <View style={styles.separator} />

                <View style={styles.componentHeader}>
                    <Text style={styles.cardTitle}>Cardio</Text>
                </View>
                <SegmentedSelector
                    options={[{ label: "1.5-Mile Run", value: "run" }, { label: "20m HAMR Shuttles", value: "shuttles" }]}
                    selectedValue={cardioComponent}
                    onValueChange={setCardioComponent}
                />
                {cardioComponent === "run" && (
                    <View style={styles.timeInputContainer}>
                        <StyledTextInput value={runMinutes} onChangeText={setRunMinutes} placeholder="Minutes" keyboardType="numeric" style={styles.timeInput} />
                        <Text style={styles.timeInputSeparator}>:</Text>
                        <StyledTextInput value={runSeconds} onChangeText={setRunSeconds} placeholder="Seconds" keyboardType="numeric" style={styles.timeInput} />
                    </View>
                )}
                {cardioComponent === "shuttles" && (
                    <StyledTextInput value={shuttles} onChangeText={setShuttles} placeholder="Enter shuttle count" keyboardType="numeric" />
                )}

            </Card>
        </ScrollView>
    </SafeAreaView>
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
        ...theme.typography.header,
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
        textAlign: "center",
    },
    cardTitle: {
        ...theme.typography.title,
        color: theme.colors.text,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginVertical: theme.spacing.m,
    },
    inlineInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.s,
    },
    scoreContainer: {
        marginBottom: theme.spacing.m,
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
    scoreText: {
        ...theme.typography.header,
    },
    scoreBreakdownText: {
        ...theme.typography.subtitle,
        color: theme.colors.text,
        marginTop: theme.spacing.s,
    },
    genderSelectorContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    componentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.s,
    },
    timeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.s,
    },
    timeInput: {
        flex: 1,
        borderWidth: 0,
    },
    timeInputSeparator: {
        ...theme.typography.body,
        marginHorizontal: theme.spacing.s,
    },
    subtitle: {
        ...theme.typography.subtitle,
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
    }
});
