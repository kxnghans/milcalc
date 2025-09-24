/**
 * @file This file contains the main component for the Air Force PT Calculator mobile app.
 * @summary The PTCalculator component allows users to input their PT test data and see their calculated score.
 * @description This component includes state management for all PT components, real-time score calculation,
 * and a dynamic UI that updates based on user input. It also features a theme switcher, a modal for
 * accessing official PT documents, and navigation to a "Best Score" page.
 */
import * as React from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Card, StyledTextInput, IconRow } from "@repo/ui";
import { calculatePtScore, getMinMaxValues, getCardioMinMaxValues } from "@repo/utils";
import { useTheme } from "@repo/ui";
import { ICONS } from "@repo/ui/icons";
import ScoreDisplay from "../components/ScoreDisplay";
import GenderSelector from "../components/GenderSelector";
import PdfModal from "../components/PdfModal";
import StrengthComponent from "../components/StrengthComponent";
import CoreComponent from "../components/CoreComponent";
import CardioComponent from "../components/CardioComponent";

/**
 * The main component for the PT Calculator screen.
 * It manages all user inputs, calculates the PT score in real-time, and displays the results.
 */
export default function PTCalculator() {
  const { theme, themeMode, toggleTheme } = useTheme();
  
  // State variables for user inputs
  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("male");

  // State for cardio components
  const [cardioComponent, setCardioComponent] = React.useState("run");
  const [runMinutes, setRunMinutes] = React.useState("");
  const [runSeconds, setRunSeconds] = React.useState("");
  const [shuttles, setShuttles] = React.useState("");
  const [walkMinutes, setWalkMinutes] = React.useState("");
  const [walkSeconds, setWalkSeconds] = React.useState("");

  // State for strength components
  const [pushupComponent, setPushupComponent] = React.useState("push_ups_1min");
  const [pushups, setPushups] = React.useState("");

  // State for core components
  const [coreComponent, setCoreComponent] = React.useState("sit_ups_1min");
  const [situps, setSitups] = React.useState("");
  const [reverseCrunches, setReverseCrunches] = React.useState("");
  const [plankMinutes, setPlankMinutes] = React.useState("");
  const [plankSeconds, setPlankSeconds] = React.useState("");

  // State for calculated scores and UI elements
  const [score, setScore] = React.useState({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false });
  const [minMax, setMinMax] = React.useState({ pushups: {min: 0, max: 0}, core: {min: 0, max: 0}});
  const [cardioMinMax, setCardioMinMax] = React.useState({ min: 0, max: 0 });
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [blockHeights, setBlockHeights] = React.useState({ strength: 0, core: 0, cardio: 0 });
  const [segmentedHeights, setSegmentedHeights] = React.useState({ strength: 0, core: 0, cardio: 0 });

  // Refs for auto-focusing time inputs
  const runSecondsInput = React.useRef(null);
  const plankSecondsInput = React.useRef(null);
  const walkSecondsInput = React.useRef(null);

  /**
   * Handles changes in the minutes input field and auto-focuses the seconds input.
   * @param {string} value - The input value.
   * @param {function} setter - The state setter function for the minutes value.
   * @param {React.RefObject} nextInputRef - The ref for the seconds input field.
   */
  const handleMinutesChange = (value, setter, nextInputRef) => {
    setter(value);
    if (value.length === 2 || parseInt(value) >= 6) {
      nextInputRef.current?.focus();
    }
  };

  const handleLayout = (block, event) => {
    const { height } = event.nativeEvent.layout;
    setBlockHeights(heights => {
        if (heights[block] !== height) {
            return { ...heights, [block]: height };
        }
        return heights;
    });
  };

  const handleSegmentedLayout = (block, event) => {
    const { height } = event.nativeEvent.layout;
    setSegmentedHeights(heights => {
        if (heights[block] !== height) {
            return { ...heights, [block]: height };
        }
        return heights;
    });
  };

  /**
   * Gets the appropriate theme icon based on the current theme mode.
   * @returns {string} The name of the icon to display.
   */
  const getThemeIcon = () => {
    if (themeMode === 'light') {
        return ICONS.THEME_LIGHT;
    } else if (themeMode === 'dark') {
        return ICONS.THEME_DARK;
    }
    return ICONS.THEME_AUTO;
  };

  /**
   * Effect hook that recalculates the PT score and min/max values whenever a user input changes.
   */
  React.useEffect(() => {
    const ageNum = parseInt(age);
    if (ageNum && gender) {
        const pushupValues = getMinMaxValues(ageNum, gender, pushupComponent);
        const coreValues = getMinMaxValues(ageNum, gender, coreComponent);
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
  const maxHeight = Math.max(...Object.values(blockHeights));
  const exerciseBlockStyle = {
      height: maxHeight > 0 ? maxHeight : 'auto',
  }

  const maxSegmentedHeight = Math.max(...Object.values(segmentedHeights));
  const segmentedStyle = {
      height: maxSegmentedHeight > 0 ? maxSegmentedHeight : 'auto',
      marginBottom: theme.spacing.m,
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
    },
    cardTitle: {
        ...theme.typography.title,
        color: theme.colors.text,
    },
    inlineInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.m,
    },
    ageInput: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.m,
        paddingVertical: theme.spacing.s + 4,
        paddingHorizontal: theme.spacing.m,
        backgroundColor: theme.colors.surface,
        ...theme.typography.label,
        textAlign: "center",
        color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
        <PdfModal isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
        <View style={{flex: 1}}>
            <View>
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
            </View>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={{ marginTop: theme.spacing.s, flex: 1 }}>
                    <Card style={{ flex: 1, padding: 0 }}>
                        <ScrollView style={{ padding: theme.spacing.m }} contentContainerStyle={{paddingBottom: 0}} showsVerticalScrollIndicator={false}>
                            <View style={styles.inlineInputContainer}>
                                <View style={{width: 80, marginRight: theme.spacing.m}}>
                                    <Text style={[styles.cardTitle, {marginBottom: theme.spacing.s}]}>Age</Text>
                                    <StyledTextInput value={age} onChangeText={setAge} placeholder="" keyboardType="numeric" style={styles.ageInput} />
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={[styles.cardTitle, {textAlign: 'center', marginBottom: theme.spacing.s}]}>Gender</Text>
                                    <GenderSelector gender={gender} setGender={setGender} />
                                </View>
                            </View>
                            <StrengthComponent 
                                showProgressBars={showProgressBars}
                                minMax={minMax}
                                pushups={pushups}
                                setPushups={setPushups}
                                pushupComponent={pushupComponent}
                                setPushupComponent={setPushupComponent}
                                handleLayout={handleLayout}
                                handleSegmentedLayout={handleSegmentedLayout}
                                exerciseBlockStyle={exerciseBlockStyle}
                                segmentedStyle={segmentedStyle}
                            />
                            <CoreComponent
                                showProgressBars={showProgressBars}
                                minMax={minMax}
                                coreComponent={coreComponent}
                                setCoreComponent={setCoreComponent}
                                situps={situps}
                                setSitups={setSitups}
                                reverseCrunches={reverseCrunches}
                                setReverseCrunches={setReverseCrunches}
                                plankMinutes={plankMinutes}
                                setPlankMinutes={setPlankMinutes}
                                plankSeconds={plankSeconds}
                                setPlankSeconds={setPlankSeconds}
                                handleLayout={handleLayout}
                                handleSegmentedLayout={handleSegmentedLayout}
                                exerciseBlockStyle={exerciseBlockStyle}
                                segmentedStyle={segmentedStyle}
                                handleMinutesChange={handleMinutesChange}
                                plankSecondsInput={plankSecondsInput}
                            />
                            <CardioComponent
                                showProgressBars={showProgressBars}
                                cardioComponent={cardioComponent}
                                setCardioComponent={setCardioComponent}
                                runMinutes={runMinutes}
                                setRunMinutes={setRunMinutes}
                                runSeconds={runSeconds}
                                setRunSeconds={setRunSeconds}
                                walkMinutes={walkMinutes}
                                setWalkMinutes={setWalkMinutes}
                                walkSeconds={walkSeconds}
                                setWalkSeconds={setWalkSeconds}
                                shuttles={shuttles}
                                setShuttles={setShuttles}
                                cardioMinMax={cardioMinMax}
                                handleLayout={handleLayout}
                                handleSegmentedLayout={handleSegmentedLayout}
                                exerciseBlockStyle={exerciseBlockStyle}
                                segmentedStyle={segmentedStyle}
                                handleMinutesChange={handleMinutesChange}
                                runSecondsInput={runSecondsInput}
                                walkSecondsInput={walkSecondsInput}
                            />
                        </ScrollView>
                    </Card>
                </View>
            </KeyboardAvoidingView>
        </View>
    </View>
  );
}