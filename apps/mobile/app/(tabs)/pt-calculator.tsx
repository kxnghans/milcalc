/**
 * @file This file contains the main component for the Air Force PT Calculator mobile app.
 * @summary The PTCalculator component allows users to input their PT test data and see their calculated score.
 * @description This component has been refactored to use the `usePtCalculatorState` hook, which centralizes
 * all state management and calculation logic. This makes the component much cleaner and easier to maintain.
 */
import * as React from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Modal } from "react-native";
import { Card, IconRow, useTheme, usePtCalculatorState } from "@repo/ui";
import { ICONS } from "@repo/ui/icons";
import ScoreDisplay from "../components/ScoreDisplay";
import DocumentModal from "../components/DocumentModal";
import StrengthComponent from "../components/StrengthComponent";
import CoreComponent from "../components/CoreComponent";
import CardioComponent from "../components/CardioComponent";
import Demographics from "../components/Demographics";
import AltitudeAdjustmentComponent from "../components/AltitudeAdjustmentComponent";
import Divider from "../components/Divider";

import { useNavigation } from "expo-router";

import DetailModal from "../components/DetailModal";

/**
 * The main component for the PT Calculator screen.
 * It renders the UI and delegates all logic and state management to the `usePtCalculatorState` hook.
 */
export default function PTCalculator() {
  const navigation = useNavigation();
  const { theme, themeMode, isDarkMode, toggleTheme } = useTheme();
  const [isPdfModalVisible, setPdfModalVisible] = React.useState(false);
  const [detailModalContentKey, setDetailModalContentKey] = React.useState<string | null>(null);
  const [modalPerformance, setModalPerformance] = React.useState<any>(null);

  const openDetailModal = (key: string, performance?: any) => {
    setDetailModalContentKey(key);
    if (performance) {
      setModalPerformance(performance);
    }
  };

  const closeDetailModal = () => {
    setDetailModalContentKey(null);
    setModalPerformance(null);
  };

  // State to store the heights of the segmented controls in each component.
  const [segmentedHeights, setSegmentedHeights] = React.useState({ strength: 0, core: 0, cardio: 0 });

  // The main state hook that provides all the necessary values and setters.
  const {
    demographics,
    strength,
    core,
    cardio,
    score,
    isLoading,
    minMax,
    cardioMinMax,
    ninetyPercentileThresholds,
    altitudeData,
  } = usePtCalculatorState();

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        isLoading ? <ActivityIndicator size="small" color={isDarkMode ? theme.colors.text : theme.colors.primary} style={{ marginRight: theme.spacing.s }} /> : null
      ),
    });
  }, [isLoading, navigation, theme]);

  /**
   * A layout handler to measure the height of the segmented controls.
   * This is used to synchronize the heights of all segmented controls across the different components.
   * @param {string} block - The component block ('strength', 'core', 'cardio').
   * @param {object} event - The layout event.
   */
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
   * Gets the appropriate icon for the current theme setting (light, dark, or auto).
   * @returns {string} The name of the icon to display.
   */
  const getThemeIcon = () => {
    if (themeMode === 'light') return ICONS.THEME_LIGHT;
    if (themeMode === 'dark') return ICONS.THEME_DARK;
    return ICONS.THEME_AUTO;
  };

  // Progress bars are only shown once age and gender have been entered.
  const showProgressBars = demographics.age && demographics.gender;
  // Calculate the maximum height among all segmented controls to ensure they are all the same size.
  const maxSegmentedHeight = Math.max(...Object.values(segmentedHeights));
  const segmentedStyle = {
      height: maxSegmentedHeight > 0 ? maxSegmentedHeight : 'auto',
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.s,
        paddingVertical: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
        <DocumentModal category="PT" isModalVisible={isPdfModalVisible} setModalVisible={setPdfModalVisible} />
        <DetailModal 
            isVisible={!!detailModalContentKey} 
            onClose={closeDetailModal} 
            contentKey={detailModalContentKey} 
            source="pt"
            age={demographics.age}
            gender={demographics.gender}
            performance={modalPerformance}
        />
        <View style={{flex: 1}}>

            {/* Top section with score display and main action icons. */}
            <View>
                <ScoreDisplay score={score} cardioComponent={cardio.cardioComponent} containerStyle={{ marginBottom: theme.spacing.s }} />
                <IconRow icons={[
                    {
                        name: ICONS.WEIGHT_LIFTER,
                        href: "/best-score",
                    },
                    {
                        name: ICONS.DOCUMENT,
                        onPress: () => setPdfModalVisible(true),
                    },
                    {
                        name: getThemeIcon(),
                        onPress: toggleTheme,
                    },
                ]} />
            </View>
            {/* The main input area, wrapped in a KeyboardAvoidingView and ScrollView. */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={{ flex: 1 }}>
                    <Card style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{paddingBottom: 0}} showsVerticalScrollIndicator={false}>
                            {/* Each section of the calculator is rendered as a separate component. */}
                            <Demographics
                                age={demographics.age}
                                setAge={demographics.setAge}
                                gender={demographics.gender}
                                setGender={demographics.setGender}
                            />
                            <Divider style={{ marginTop: theme.spacing.s, marginBottom: 0 }} />
                            <StrengthComponent 
                                showProgressBars={showProgressBars}
                                minMax={minMax}
                                pushups={strength.pushups}
                                setPushups={strength.setPushups}
                                pushupComponent={strength.pushupComponent}
                                setPushupComponent={strength.setPushupComponent}
                                ninetyPercentileThreshold={ninetyPercentileThresholds.pushups}
                                handleSegmentedLayout={handleSegmentedLayout}
                                segmentedStyle={segmentedStyle}
                                isExempt={strength.isExempt}
                                toggleExempt={strength.toggleExempt}
                                openDetailModal={openDetailModal}
                                score={score}
                            />
                            <Divider style={{ marginTop: theme.spacing.s, marginBottom: 0 }} />
                            <CoreComponent
                                showProgressBars={showProgressBars}
                                minMax={minMax}
                                coreComponent={core.coreComponent}
                                setCoreComponent={core.setCoreComponent}
                                situps={core.situps}
                                setSitups={core.setSitups}
                                reverseCrunches={core.reverseCrunches}
                                setReverseCrunches={core.setReverseCrunches}
                                plankMinutes={core.plankMinutes}
                                setPlankMinutes={core.setPlankMinutes}
                                plankSeconds={core.plankSeconds}
                                setPlankSeconds={core.setPlankSeconds}
                                ninetyPercentileThreshold={ninetyPercentileThresholds.core}
                                handleSegmentedLayout={handleSegmentedLayout}
                                segmentedStyle={segmentedStyle}
                                isExempt={core.isExempt}
                                toggleExempt={core.toggleExempt}
                                openDetailModal={openDetailModal}
                                score={score}
                            />
                            <Divider style={{ marginTop: theme.spacing.s, marginBottom: 0 }} />
                            <CardioComponent
                                showProgressBars={showProgressBars}
                                cardioMinMax={cardioMinMax}
                                cardioComponent={cardio.cardioComponent}
                                setCardioComponent={cardio.setCardioComponent}
                                runMinutes={cardio.runMinutes}
                                setRunMinutes={cardio.setRunMinutes}
                                runSeconds={cardio.runSeconds}
                                setRunSeconds={cardio.setRunSeconds}
                                shuttles={cardio.shuttles}
                                setShuttles={cardio.setShuttles}
                                walkMinutes={cardio.walkMinutes}
                                setWalkMinutes={cardio.setWalkMinutes}
                                walkSeconds={cardio.walkSeconds}
                                setWalkSeconds={cardio.setWalkSeconds}
                                ninetyPercentileThreshold={ninetyPercentileThresholds.cardio}
                                segmentedStyle={segmentedStyle}
                                altitudeGroup={demographics.altitudeGroup}
                                age={demographics.age}
                                gender={demographics.gender}
                                isExempt={cardio.isExempt}
                                toggleExempt={cardio.toggleExempt}
                                score={score}
                                altitudeData={altitudeData}
                                openDetailModal={openDetailModal}
                            />
                            <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                            <AltitudeAdjustmentComponent selectedValue={demographics.altitudeGroup} onValueChange={demographics.setAltitudeGroup} openDetailModal={openDetailModal} />
                        </ScrollView>
                    </Card>
                </View>
            </KeyboardAvoidingView>
        </View>

    </View>
  );
}