import * as React from "react";
import { View, StyleSheet, ImageSourcePropType } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Card, IconRow, useTheme, usePtCalculatorState } from "@repo/ui";
import { ICONS } from "@repo/ui/icons";
import ScoreDisplay from "../../components/ScoreDisplay";
import DocumentModal from "../../components/DocumentModal";
import StrengthComponent from "../../components/StrengthComponent";
import CoreComponent from "../../components/CoreComponent";
import CardioComponent from "../../components/CardioComponent";
import Demographics from "../../components/Demographics";
import AltitudeAdjustmentComponent from "../../components/AltitudeAdjustmentComponent";
import Divider from "../../components/Divider";

import DetailModal from "../../components/DetailModal";

import DismissKeyboardView from "../../components/DismissKeyboardView";
import ScreenHeader from "../../components/ScreenHeader";

import { useCallback } from "react";

/**
 * The main component for the PT Calculator screen.
 * It renders the UI and delegates all logic and state management to the `usePtCalculatorState` hook.
 */
export default function PTCalculator() {
  const { theme, themeMode, toggleTheme } = useTheme();
  const [isPdfModalVisible, setPdfModalVisible] = React.useState(false);
  const [detailModalContentKey, setDetailModalContentKey] = React.useState<string | null>(null);
  const [detailModalMascot, setDetailModalMascot] = React.useState<ImageSourcePropType | null>(null);

  const openDetailModal = useCallback((key: string, mascot: ImageSourcePropType) => {
    setDetailModalContentKey(key);
    setDetailModalMascot(mascot);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailModalContentKey(null);
    setDetailModalMascot(null);
  }, []);

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

    /**
     * Gets the appropriate icon for the current theme setting (light, dark, or auto).
     * @returns {string} The name of the icon to display.
     */
    const getThemeIcon = () => {
      if (themeMode === 'light') return ICONS.THEME_LIGHT;
      if (themeMode === 'dark') return ICONS.THEME_DARK;
      return ICONS.THEME_AUTO;
    };

    const onPdfIconPress = useCallback(() => setPdfModalVisible(true), []);

    // Progress bars are only shown once age and gender have been entered.
    const showProgressBars = !!(demographics.age && demographics.gender);

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.s,
        paddingVertical: theme.spacing.xs,
    },
    dismissKeyboard: {
        flex: 0,
        width: '100%',
    },
    inputCardContainer: {
        flex: 1,
        marginTop: theme.spacing.s,
    },
    flex1: {
        flex: 1,
    },
    scrollView: {
        paddingBottom: 0,
        flexGrow: 1,
    },
    dividerMargin: {
        marginTop: theme.spacing.s,
        marginBottom: 0,
    },
    lastDividerMargin: {
        marginTop: theme.spacing.s,
        marginBottom: theme.spacing.s,
    }
  });

  return (
    <View style={styles.container}>
        <ScreenHeader title="Air Force PT Calculator" isLoading={isLoading} />
        <DocumentModal category="PT" isModalVisible={isPdfModalVisible} setModalVisible={setPdfModalVisible} />
        <DetailModal 
            isVisible={!!detailModalContentKey} 
            onClose={closeDetailModal} 
            contentKey={detailModalContentKey} 
            source="pt"
            mascotAsset={detailModalMascot}
        />
        <View style={styles.content}>

            {/* Top section with score display and main action icons. */}
            <DismissKeyboardView style={styles.dismissKeyboard}>
                <ScoreDisplay score={score} cardioComponent={cardio.cardioComponent} />
                <IconRow icons={[
                    {
                        name: ICONS.WEIGHT_LIFTER,
                        href: "/best-score",
                    },
                    {
                        name: ICONS.DOCUMENT,
                        onPress: onPdfIconPress,
                    },
                    {
                        name: getThemeIcon(),
                        onPress: toggleTheme,
                    },
                ]} />
            </DismissKeyboardView>
            {/* The main input area, wrapped in a ScrollView. */}
            <View style={styles.inputCardContainer}>
                <Card style={styles.flex1}>
                    <KeyboardAwareScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <DismissKeyboardView>
                        {/* Each section of the calculator is rendered as a separate component. */}
                        <Demographics
                            age={demographics.age}
                            setAge={demographics.setAge}
                            gender={demographics.gender}
                            setGender={demographics.setGender}
                        />
                        <Divider style={styles.dividerMargin} />
                        <StrengthComponent 
                            showProgressBars={showProgressBars}
                            minMax={minMax}
                            pushups={strength.pushups}
                            setPushups={strength.setPushups}
                            pushupComponent={strength.pushupComponent}
                            setPushupComponent={strength.setPushupComponent}
                            ninetyPercentileThreshold={ninetyPercentileThresholds.pushups}
                            isExempt={strength.isExempt}
                            toggleExempt={strength.toggleExempt}
                            openDetailModal={openDetailModal}
                            score={score}
                        />
                        <Divider style={styles.dividerMargin} />
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
                            isExempt={core.isExempt}
                            toggleExempt={core.toggleExempt}
                            openDetailModal={openDetailModal}
                            score={score}
                        />
                        <Divider style={styles.dividerMargin} />
                        <CardioComponent
                            showProgressBars={showProgressBars}
                            cardioMinMax={cardioMinMax}
                            cardioComponent={cardio.cardioComponent}
                            setCardioComponent={cardio.setCardioComponent}
                            runMinutes={cardio.runMinutes}
                            setRunMinutes={cardio.setRunMinutes}
                            runSeconds={cardio.runSeconds}
                            setRunSeconds={cardio.setRunSeconds}
                            walkMinutes={cardio.walkMinutes}
                            setWalkMinutes={cardio.setWalkMinutes}
                            walkSeconds={cardio.walkSeconds}
                            setWalkSeconds={cardio.setWalkSeconds}
                            shuttles={cardio.shuttles}
                            setShuttles={cardio.setShuttles}
                            ninetyPercentileThreshold={ninetyPercentileThresholds.cardio}
                            altitudeGroup={demographics.altitudeGroup}
                            age={demographics.age}
                            gender={demographics.gender}
                            isExempt={cardio.isExempt}
                            toggleExempt={cardio.toggleExempt}
                            score={score}
                            altitudeData={altitudeData}
                            openDetailModal={openDetailModal}
                        />
                        <Divider style={styles.lastDividerMargin} />
                        <AltitudeAdjustmentComponent selectedValue={demographics.altitudeGroup} onValueChange={demographics.setAltitudeGroup} openDetailModal={openDetailModal} />
                        </DismissKeyboardView>
                    </KeyboardAwareScrollView>
                </Card>
            </View>
        </View>

    </View>
  );
}
