/**
 * @file This file contains the main component for the Air Force PT Calculator mobile app.
 * @summary The PTCalculator component allows users to input their PT test data and see their calculated score.
 * @description This component includes state management for all PT components, real-time score calculation,
 * and a dynamic UI that updates based on user input. It also features a theme switcher, a modal for
 * accessing official PT documents, and navigation to a "Best Score" page.
 */
import * as React from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Card, IconRow, NeumorphicInset } from "@repo/ui";
import { calculatePtScore, getMinMaxValues, getCardioMinMaxValues } from "@repo/utils";
import { useTheme } from "@repo/ui";
import { ICONS } from "@repo/ui/icons";
import ScoreDisplay from "../components/ScoreDisplay";
import GenderSelector from "../components/GenderSelector";
import PdfModal from "../components/PdfModal";
import StrengthComponent from "../components/StrengthComponent";
import CoreComponent from "../components/CoreComponent";
import CardioComponent from "../components/CardioComponent";
import NumberInput from "../components/NumberInput";
import Demographics from "../components/Demographics";
import AltitudeAdjustmentComponent from "../components/AltitudeAdjustmentComponent";
import Divider from "../components/Divider";

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
  const [altitudeGroup, setAltitudeGroup] = React.useState("normal");

  // State for calculated scores and UI elements
  const [score, setScore] = React.useState({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false, walkPassed: 'n/a' });
  const [minMax, setMinMax] = React.useState({ pushups: {min: 0, max: 0}, core: {min: 0, max: 0}});
  const [cardioMinMax, setCardioMinMax] = React.useState({ min: 0, max: 0 });
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [segmentedHeights, setSegmentedHeights] = React.useState({ strength: 0, core: 0, cardio: 0 });

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
   * @returns {string} The name of the icon to display.s
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
            altitudeGroup,
        });
        setScore(result);
    };
    calculateScore();
  }, [age, gender, cardioComponent, runMinutes, runSeconds, shuttles, walkMinutes, walkSeconds, pushupComponent, pushups, coreComponent, situps, reverseCrunches, plankMinutes, plankSeconds]);

  const showProgressBars = age && gender;

  const maxSegmentedHeight = Math.max(...Object.values(segmentedHeights));
  const segmentedStyle = {
      height: maxSegmentedHeight > 0 ? maxSegmentedHeight : 'auto',
      
  }

  

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.s,
    },
    cardTitle: {
        ...theme.typography.title,
        color: theme.colors.text,
    },
    inlineInputContainer: {
        flexDirection: "row",
        alignItems: "center",

    },
  });

  return (
    <View style={styles.container}>
        <PdfModal isModalVisible={isModalVisible} setModalVisible={setModalVisible} />
        <View style={{flex: 1}}>
            <View>
                <ScoreDisplay score={score} cardioComponent={cardioComponent} containerStyle={{ marginBottom: theme.spacing.s }} />
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
                <View style={{ flex: 1 }}>
                    <Card style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{paddingBottom: 0}} showsVerticalScrollIndicator={false}>
                            <Demographics age={age} setAge={setAge} gender={gender} setGender={setGender} />
                            <Divider style={{ marginTop: theme.spacing.s, marginBottom: 0 }} />
                            <StrengthComponent 
                                showProgressBars={showProgressBars}
                                minMax={minMax}
                                pushups={pushups}
                                setPushups={setPushups}
                                pushupComponent={pushupComponent}
                                setPushupComponent={setPushupComponent}
                                handleSegmentedLayout={handleSegmentedLayout}
                                segmentedStyle={segmentedStyle}
                            />
                            <Divider style={{ marginTop: theme.spacing.s, marginBottom: 0 }} />
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
                                handleSegmentedLayout={handleSegmentedLayout}
                                segmentedStyle={segmentedStyle}
                            />
                            <Divider style={{ marginTop: theme.spacing.s, marginBottom: 0 }} />
                            <CardioComponent
                                showProgressBars={showProgressBars}
                                cardioMinMax={cardioMinMax}
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
                                segmentedStyle={segmentedStyle}
                                altitudeGroup={altitudeGroup}
                                age={age}
                                gender={gender}
                            />
                            <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                            <AltitudeAdjustmentComponent selectedValue={altitudeGroup} onValueChange={setAltitudeGroup} />
                        </ScrollView>
                    </Card>
                </View>
            </KeyboardAvoidingView>
        </View>
    </View>
  );
}