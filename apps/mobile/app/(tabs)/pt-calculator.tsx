import * as React from "react";
import { StyleSheet, ImageSourcePropType } from "react-native";
import { usePtCalculatorState, useTheme, useCalculatorState } from "@repo/ui";
import ScoreDisplay from "../../components/ScoreDisplay";
import StrengthComponent from "../../components/StrengthComponent";
import CoreComponent from "../../components/CoreComponent";
import CardioComponent from "../../components/CardioComponent";
import Demographics from "../../components/Demographics";
import AltitudeAdjustmentComponent from "../../components/AltitudeAdjustmentComponent";
import Divider from "../../components/Divider";
import MainCalculatorLayout from "../../components/MainCalculatorLayout";
import { useOverlay } from "../../contexts/OverlayContext";
import { useProfile } from "../../contexts/ProfileContext";

export default function PTCalculator() {
  const { theme } = useTheme();
  const { openHelp, openDocuments } = useOverlay();
  const { age, gender } = useProfile();
  const { resetPtDemographics } = useCalculatorState();

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
    } = usePtCalculatorState(age, gender, 'normal');

    const handleOpenHelp = React.useCallback((key: string, mascot?: ImageSourcePropType) => {
      openHelp(key, 'pt', mascot);
    }, [openHelp]);

    const showProgressBars = !!(demographics.age && demographics.gender);

  const styles = React.useMemo(() => StyleSheet.create({
    dividerMargin: {
        marginTop: theme.spacing.s,
        marginBottom: 0,
    },
    lastDividerMargin: {
        marginTop: theme.spacing.s,
        marginBottom: theme.spacing.s,
    }
  }), [theme]);

  return (
    <MainCalculatorLayout
      title="Air Force PT Calculator"
      isLoading={isLoading}
      actions={['best_score', 'document', 'theme']}
      onReset={() => resetPtDemographics(age, gender)}
      onDocument={() => openDocuments('PT')}
      summaryContent={
        <ScoreDisplay 
          score={score} 
          cardioComponent={cardio.cardioComponent} 
        />
      }
      inputContent={
        <>
            <Demographics
                age={demographics.age}
                setAge={demographics.setAge}
                gender={demographics.gender}
                setGender={demographics.setGender}
                waist={demographics.waist}
                setWaist={demographics.setWaist}
                heightFeet={demographics.heightFeet}
                setHeightFeet={demographics.setHeightFeet}
                heightInches={demographics.heightInches}
                setHeightInches={demographics.setHeightInches}
                isHeightInInches={demographics.isHeightInInches}
                setIsHeightInInches={demographics.setIsHeightInInches}
                showProgressBars={false}
                minMax={minMax}
                score={score}
                calculatedWhtr={demographics.calculatedWhtr}
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
                openDetailModal={handleOpenHelp}
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
                openDetailModal={handleOpenHelp}
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
                openDetailModal={handleOpenHelp}
            />
            <Divider style={styles.lastDividerMargin} />
            <AltitudeAdjustmentComponent 
              selectedValue={demographics.altitudeGroup} 
              onValueChange={demographics.setAltitudeGroup} 
              openDetailModal={handleOpenHelp} 
            />
        </>
      }
    />
  );
}
