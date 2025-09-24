
import * as React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Card, StyledTextInput, StyledButton, ProgressBar, SegmentedSelector, IconRow } from "@repo/ui";
import { calculatePtScore, getMinMaxValues, getCardioMinMaxValues } from "@repo/utils";
import { useTheme } from "@repo/ui/src/contexts/ThemeContext";
import * as Haptics from "expo-haptics";
import { ICONS, ICON_SETS } from "@repo/ui/src/icons";

const getScoreColor = (score, maxScore) => {
    const { theme } = useTheme();
    if (score === 0) return theme.colors.error;
    if (score >= maxScore * 0.9) {
        return theme.colors.ninetyPlus;
    }
    return theme.colors.success;
};

const getProgressBarColor = (percentage, minPercentage) => {
    const { theme } = useTheme();
    if (percentage < minPercentage) {
        return theme.colors.error;
    }
    if (percentage >= 0.9) {
        return theme.colors.ninetyPlus;
    }
    return theme.colors.success;
};

const secondsToTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function RootIndex() {
  const { theme, themeMode, toggleTheme } = useTheme();
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("male");

  const [cardioComponent, setCardioComponent] = React.useState("run");
  const [runMinutes, setRunMinutes] = React.useState("");
  const [runSeconds, setRunSeconds] = React.useState("");
  const [shuttles, setShuttles] = React.useState("");
  const [walkMinutes, setWalkMinutes] = React.useState("");
  const [walkSeconds, setWalkSeconds] = React.useState("");

  const [pushupComponent, setPushupComponent] = React.useState("push_ups_1min");
  const [pushups, setPushups] = React.useState("");

  const [coreComponent, setCoreComponent] = React.useState("sit_ups_1min");
  const [situps, setSitups] = React.useState("");
  const [reverseCrunches, setReverseCrunches] = React.useState("");
  const [plankMinutes, setPlankMinutes] = React.useState("");
  const [plankSeconds, setPlankSeconds] = React.useState("");

  const [score, setScore] = React.useState({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false });
  const [minMax, setMinMax] = React.useState({ pushups: {min: 0, max: 0}, core: {min: 0, max: 0}});
  const [cardioMinMax, setCardioMinMax] = React.useState({ min: 0, max: 0 });
  const [isModalVisible, setModalVisible] = React.useState(false);

  const runSecondsInput = React.useRef(null);
  const plankSecondsInput = React.useRef(null);
  const walkSecondsInput = React.useRef(null);

  const handleMinutesChange = (value, setter, nextInputRef) => {
    setter(value);
    if (value.length === 2 || parseInt(value) >= 6) {
      nextInputRef.current?.focus();
    }
  };

  const getThemeIcon = () => {
    if (themeMode === 'light') {
        return ICONS.THEME_LIGHT;
    } else if (themeMode === 'dark') {
        return ICONS.THEME_DARK;
    }
    return ICONS.THEME_AUTO;
  };

  React.useEffect(() => {
    const ageNum = parseInt(age);
    if (ageNum && gender) {
        const pushupValues = getMinMaxValues(ageNum, gender, pushupComponent);
        let coreValues = {min: 0, max: 0};
        if (coreComponent !== 'forearm_plank_time') {
            coreValues = getMinMaxValues(ageNum, gender, coreComponent);
        }
        const cardioValues = getCardioMinMaxValues(ageNum, gender, cardioComponent);
        setMinMax({pushups: pushupValues, core: coreValues});
        setCardioMinMax(cardioValues);
    }

    const calculateScore = () => {
        const result = calculatePtScore({
            age: ageNum || 0,
            gender,
            cardioComponent,
            runMinutes: parseInt(runMinutes) || 0,
            runSeconds: parseInt(runSeconds) || 0,
            shuttles: parseInt(shuttles) || 0,
            walkMinutes: parseInt(walkMinutes) || 0,
            walkSeconds: parseInt(walkSeconds) || 0,
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
  }, [age, gender, cardioComponent, runMinutes, runSeconds, shuttles, walkMinutes, walkSeconds, pushupComponent, pushups, coreComponent, situps, reverseCrunches, plankMinutes, plankSeconds]);

  const showProgressBars = age && gender;

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        paddingTop: theme.spacing.s,
        paddingHorizontal: theme.spacing.m,
        paddingBottom: theme.spacing.m,
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
        marginVertical: theme.spacing.s,
    },
    inlineInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.m,
    },
    scoreContainer: {
        marginBottom: theme.spacing.s,
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
    scoreBreakdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: theme.spacing.s,
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
        marginBottom: theme.spacing.m,
    },
    timeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.m,
        paddingVertical: theme.spacing.m,
        backgroundColor: theme.colors.surface,
    },
    timeInput: {
        flex: 1,
        borderWidth: 0,
        padding: 0,
        margin: 0,
        ...theme.typography.label,
        color: theme.colors.text,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
    timeInputSeparator: {
        ...theme.typography.body,
        marginHorizontal: theme.spacing.s,
        color: theme.colors.text,
    },
    subtitle: {
        ...theme.typography.subtitle,
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: theme.spacing.m,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 10,
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: theme.colors.text,
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: theme.colors.text
    },
    exerciseBlock: {
        minHeight: 120,
        justifyContent: 'center',
    },
    iconBlock: {
        backgroundColor: theme.colors.secondary,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.s,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
    },
});

const GenderSelector = ({ gender, setGender }) => (
    <View style={styles.genderSelectorContainer}>
        <StyledButton
            title="Male"
            onPress={() => setGender("male")}
            variant={gender === 'male' ? 'primary' : 'secondary'}
            style={{ flex: 1 }}
            iconSet={ICON_SETS.FONTISTO}
            icon={ICONS.GENDER_MALE}
            iconSize={16}
        />
        <StyledButton
            title="Female"
            onPress={() => setGender("female")}
            variant={gender === 'female' ? 'primary' : 'secondary'}
            style={{ flex: 1, marginLeft: theme.spacing.s }}
            iconSet={ICON_SETS.FONTISTO}
            icon={ICONS.GENDER_FEMALE}
            iconSize={16}
        />
    </View>
);

const ScoreDisplay = ({ score }) => {
    const scoreColor = score.isPass ? (score.totalScore >= 90 ? theme.colors.ninetyPlus : theme.colors.success) : theme.colors.error;

    return (
        <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>{score.totalScore.toFixed(2)}</Text>
            <View style={styles.scoreBreakdownContainer}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.scoreBreakdownText}>Strength: </Text>
                    <Text style={[styles.scoreBreakdownText, { color: getScoreColor(score.pushupScore, 20) }]}>{score.pushupScore}</Text>
                </View>
                <Text style={styles.scoreBreakdownText}>|</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.scoreBreakdownText}>Core: </Text>
                    <Text style={[styles.scoreBreakdownText, { color: getScoreColor(score.coreScore, 20) }]}>{score.coreScore}</Text>
                </View>
                <Text style={styles.scoreBreakdownText}>|</Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.scoreBreakdownText}>Cardio: </Text>
                    <Text style={[styles.scoreBreakdownText, { color: getScoreColor(score.cardioScore, 60) }]}>{score.cardioScore}</Text>
                </View>
            </View>
        </View>
    );
};

  return (
    <SafeAreaView style={styles.container}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                setModalVisible(!isModalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Select a PDF to open:</Text>
                    {[{
                        name: "5 Year Chart Scoring",
                        url: 'https://www.afpc.af.mil/Portals/7/documents/FITNESS/5%20Year%20Chart%20Scoring%20Including%20Optional%20Component%20Standards%20-%2020211111%200219.pdf'
                    }, {
                        name: "DAFMAN 36-2905",
                        url: 'https://www.afpc.af.mil/Portals/7/documents/FITNESS/DAFMAN36-2905.pdf'
                    }, {
                        name: "Altitude Adjustments",
                        url: 'https://www.afpc.af.mil/Portals/7/documents/FITNESS/DAFMAN36-2905.pdf#page=57'
                    }, {
                        name: "Walk Standards",
                        url: 'https://www.afpc.af.mil/Portals/7/documents/FITNESS/DAFMAN36-2905.pdf#page=23'
                    }].map((pdf, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.button}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                Linking.openURL(pdf.url);
                            }}
                        >
                            <Text style={styles.textStyle}>{pdf.name}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!isModalVisible)}
                    >
                        <Text style={styles.textStyle}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>Air Force PT Calculator</Text>
            <ScoreDisplay score={score} />
                        <IconRow icons={[
                            {
                                name: ICONS.BEST_SCORE,
                                href: "/best-score",
                            },
                            {
                                name: ICONS.PDF,
                                onPress: () => setModalVisible(true),
                            },
                            {
                                name: getThemeIcon(),
                                onPress: toggleTheme,
                            },
                        ]} />
                        <View style={{ marginTop: theme.spacing.s }}>
                            <Card>
                                <View style={styles.inlineInputContainer}>
                                    <View style={{width: 80, marginRight: theme.spacing.m}}>
                                        <Text style={[styles.cardTitle, {marginBottom: theme.spacing.s}]}>Age</Text>
                                        <StyledTextInput value={age} onChangeText={setAge} placeholder="" keyboardType="numeric" />
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={[styles.cardTitle, {textAlign: 'center', marginBottom: theme.spacing.s}]}>Gender</Text>
                                        <GenderSelector gender={gender} setGender={setGender} />
                                    </View>
                                </View>
            
                                <View style={styles.separator} />
                                <View style={styles.exerciseBlock}>
                                    <View style={styles.componentHeader}>
                                        <Text style={styles.cardTitle}>Strength</Text>
                                        {showProgressBars && (() => {
                                            const pushupProgress = minMax.pushups.max > 0 ? (parseInt(pushups) || 0) / minMax.pushups.max : 0;
                                            return (
                                                <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
                                                    <ProgressBar 
                                                        progress={pushupProgress} 
                                                        markers={[{value: minMax.pushups.min/minMax.pushups.max, label: `${minMax.pushups.min}`}, {value: 1, label: `${minMax.pushups.max}`}]} 
                                                        color={getProgressBarColor(pushupProgress, minMax.pushups.min / minMax.pushups.max)}
                                                    />
                                                </View>
                                            );
                                        })()}
                                    </View>
                                    <SegmentedSelector
                                        style={{marginBottom: theme.spacing.m}}
                                        options={[{ label: "1-min Push-ups", value: "push_ups_1min" }, { label: "2-min HR Push-ups", value: "hand_release_pushups_2min" }]} 
                                        selectedValue={pushupComponent}
                                        onValueChange={setPushupComponent}
                                    />
                                    <StyledTextInput value={pushups} onChangeText={setPushups} placeholder="Enter push-up count" keyboardType="numeric" />
                                </View>
            
                                <View style={styles.separator} />
                                <View style={styles.exerciseBlock}>
                                    <View style={styles.componentHeader}>
                                        <Text style={styles.cardTitle}>Core</Text>
                                        {showProgressBars && (coreComponent === "sit_ups_1min" || coreComponent === "cross_leg_reverse_crunch_2min") && (() => {
                                            const coreProgress = minMax.core.max > 0 ? (parseInt(coreComponent === "sit_ups_1min" ? situps : reverseCrunches) || 0) / minMax.core.max : 0;
                                            return (
                                                <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
                                                    <ProgressBar 
                                                        progress={coreProgress} 
                                                        markers={[{value: minMax.core.min/minMax.core.max, label: `${minMax.core.min}`}, {value: 1, label: `${minMax.core.max}`}]} 
                                                        color={getProgressBarColor(coreProgress, minMax.core.min / minMax.core.max)}
                                                    />
                                                </View>
                                            );
                                        })()}
                                    </View>
                                    <SegmentedSelector
                                        style={{marginBottom: theme.spacing.m}}
                                        options={[
                                            { label: "1-min Sit-ups", value: "sit_ups_1min" },
                                            { label: "2-min Cross-Leg Crunch", value: "cross_leg_reverse_crunch_2min" },
                                            { label: "Forearm Plank", value: "forearm_plank_time" },
                                        ]}
                                        selectedValue={coreComponent}
                                        onValueChange={setCoreComponent}
                                    />
                                    {coreComponent === "sit_ups_1min" && (
                                        <StyledTextInput value={situps} onChangeText={setSitups} placeholder="Enter sit-up count" keyboardType="numeric" />
                                    )}
                                    {coreComponent === "cross_leg_reverse_crunch_2min" && (
                                        <StyledTextInput value={reverseCrunches} onChangeText={setReverseCrunches} placeholder="Enter crunch count" keyboardType="numeric" />
                                    )}
                                    {coreComponent === "forearm_plank_time" && (
                                        <View style={styles.timeInputContainer}>
                                            <StyledTextInput value={plankMinutes} onChangeText={(value) => handleMinutesChange(value, setPlankMinutes, plankSecondsInput)} placeholder="Minutes" keyboardType="numeric" style={styles.timeInput} />
                                            <Text style={styles.timeInputSeparator}>:</Text>
                                            <StyledTextInput ref={plankSecondsInput} value={plankSeconds} onChangeText={setPlankSeconds} placeholder="Seconds" keyboardType="numeric" style={styles.timeInput} />
                                        </View>
                                    )}
                                </View>
            
                                <View style={styles.separator} />
                                <View style={styles.exerciseBlock}>
                                    <View style={styles.componentHeader}>
                                        <Text style={styles.cardTitle}>Cardio</Text>
                                        {showProgressBars && (() => {
                                            if (cardioComponent === 'run') {
                                                const runTimeInSeconds = (parseInt(runMinutes) || 0) * 60 + (parseInt(runSeconds) || 0);
                                                const progress = cardioMinMax.min > 0 && (cardioMinMax.min - cardioMinMax.max) > 0 ? (cardioMinMax.min - runTimeInSeconds) / (cardioMinMax.min - cardioMinMax.max) : 0;
            
                                                return (
                                                    <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
                                                        <ProgressBar
                                                            progress={progress}
                                                            markers={[{value: 0, label: secondsToTime(cardioMinMax.min)}, {value: 1, label: secondsToTime(cardioMinMax.max)}]}
                                                            color={getProgressBarColor(progress, 0)}
                                                        />
                                                    </View>
                                                );
                                            } else if (cardioComponent === 'walk') {
                                                const walkTimeInSeconds = (parseInt(walkMinutes) || 0) * 60 + (parseInt(walkSeconds) || 0);
                                                const progress = cardioMinMax.min > 0 && (cardioMinMax.min - cardioMinMax.max) > 0 ? (cardioMinMax.min - walkTimeInSeconds) / (cardioMinMax.min - cardioMinMax.max) : 0;
            
                                                return (
                                                    <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
                                                        <ProgressBar
                                                            progress={progress}
                                                            markers={[{value: 0, label: secondsToTime(cardioMinMax.min)}, {value: 1, label: secondsToTime(cardioMinMax.max)}]}
                                                            color={getProgressBarColor(progress, 0)}
                                                        />
                                                    </View>
                                                );
                                            } else {
                                                const shuttleProgress = cardioMinMax.max > 0 ? (parseInt(shuttles) || 0) / cardioMinMax.max : 0;
            
                                                return (
                                                    <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
                                                        <ProgressBar
                                                            progress={shuttleProgress}
                                                            markers={[{value: cardioMinMax.min/cardioMinMax.max, label: `${cardioMinMax.min}`}, {value: 1, label: `${cardioMinMax.max}`}]}
                                                            color={getProgressBarColor(shuttleProgress, cardioMinMax.min / cardioMinMax.max)}
                                                        />
                                                    </View>
                                                );
                                            }
                                        })()}
                                    </View>
                                    <SegmentedSelector
                                        style={{marginBottom: theme.spacing.m}}
                                        options={[{ label: "1.5-Mile Run", value: "run" }, { label: "20m HAMR Shuttles", value: "shuttles" }, { label: "2-km Walk", value: "walk" }]}                        selectedValue={cardioComponent}
                                        onValueChange={setCardioComponent}
                                    />
                                    {cardioComponent === "run" && (
                                        <View style={styles.timeInputContainer}>
                                            <StyledTextInput value={runMinutes} onChangeText={(value) => handleMinutesChange(value, setRunMinutes, runSecondsInput)} placeholder="Minutes" keyboardType="numeric" style={styles.timeInput} />
                                            <Text style={styles.timeInputSeparator}>:</Text>
                                            <StyledTextInput ref={runSecondsInput} value={runSeconds} onChangeText={setRunSeconds} placeholder="Seconds" keyboardType="numeric" style={styles.timeInput} />
                                        </View>
                                    )}
                                    {cardioComponent === "shuttles" && (
                                        <StyledTextInput value={shuttles} onChangeText={setShuttles} placeholder="Enter shuttle count" keyboardType="numeric" />
                                    )}
                                    {cardioComponent === "walk" && (
                                        <View style={styles.timeInputContainer}>
                                            <StyledTextInput value={walkMinutes} onChangeText={(value) => handleMinutesChange(value, setWalkMinutes, walkSecondsInput)} placeholder="Minutes" keyboardType="numeric" style={styles.timeInput} />
                                            <Text style={styles.timeInputSeparator}>:</Text>
                                            <StyledTextInput ref={walkSecondsInput} value={walkSeconds} onChangeText={setWalkSeconds} placeholder="Seconds" keyboardType="numeric" style={styles.timeInput} />
                                        </View>
                                    )}
                                </View>
                            </Card>
                        </View>        </ScrollView>
    </SafeAreaView>
  );
}
