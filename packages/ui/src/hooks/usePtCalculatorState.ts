/**
 * @file usePtCalculatorState.ts
 * @description This file defines the primary custom hook for the main PT Calculator screen.
 * It acts as a central state aggregator, composing several smaller state management hooks.
 */

import {
  calculatePtScore,
  getAgeGroupString,
  getCardioMinMaxValues,
  getMinMaxValues,
  getPerformanceForScore,
  getPtStandardsBundle,
} from "@repo/utils";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useCardioState } from "./useCardioState";
import { useCoreState } from "./useCoreState";
import { useDebounce } from "./useDebounce";
import { useDemographicsState } from "./useDemographicsState";
import { useStrengthState } from "./useStrengthState";

export function usePtCalculatorState(
  initialAge: string = "",
  initialGender: string = "male",
  initialAltitudeGroup: string = "normal",
  onSaveToProfile?: (data: { age?: string; gender?: string }) => void,
) {
  const demographics = useDemographicsState(
    initialAge,
    initialGender,
    initialAltitudeGroup,
    onSaveToProfile,
  );
  const strength = useStrengthState();
  const core = useCoreState();
  const cardio = useCardioState();

  const debouncedAge = useDebounce(demographics.age, 300);
  const debouncedGender = useDebounce(demographics.gender, 300);
  const debouncedAltitudeGroup = useDebounce(demographics.altitudeGroup, 300);
  const debouncedWaist = useDebounce(demographics.waist, 500);
  const debouncedHeightFeet = useDebounce(demographics.heightFeet, 500);
  const debouncedHeightInches = useDebounce(demographics.heightInches, 500);
  const debouncedIsHeightInInches = useDebounce(
    demographics.isHeightInInches,
    500,
  );

  const debouncedPushupComponent = useDebounce(strength.pushupComponent, 300);
  const debouncedPushups = useDebounce(strength.pushups, 500);
  const debouncedStrengthExempt = useDebounce(strength.isExempt, 300);

  const debouncedCoreComponent = useDebounce(core.coreComponent, 300);
  const debouncedSitups = useDebounce(core.situps, 500);
  const debouncedReverseCrunches = useDebounce(core.reverseCrunches, 500);
  const debouncedPlankMinutes = useDebounce(core.plankMinutes, 500);
  const debouncedPlankSeconds = useDebounce(core.plankSeconds, 500);
  const debouncedCoreExempt = useDebounce(core.isExempt, 300);

  const debouncedCardioComponent = useDebounce(cardio.cardioComponent, 300);
  const debouncedRunMinutes = useDebounce(cardio.runMinutes, 500);
  const debouncedRunSeconds = useDebounce(cardio.runSeconds, 500);
  const debouncedShuttles = useDebounce(cardio.shuttles, 500);
  const debouncedWalkMinutes = useDebounce(cardio.walkMinutes, 500);
  const debouncedWalkSeconds = useDebounce(cardio.walkSeconds, 500);
  const debouncedCardioExempt = useDebounce(cardio.isExempt, 300);

  const ageNum = parseInt(debouncedAge);
  const ageGroup = getAgeGroupString(ageNum);
  const capitalizedGender =
    debouncedGender.charAt(0).toUpperCase() + debouncedGender.slice(1);

  // Consolidate data fetching into a single bundled RPC call
  const { data: bundle, isFetching: isFetchingBundle } = useQuery({
    queryKey: ["ptStandardsBundle", capitalizedGender, ageGroup],
    queryFn: () => getPtStandardsBundle(capitalizedGender, ageGroup || ""),
    enabled: !!capitalizedGender && !!ageGroup,
    staleTime: 1000 * 60 * 5,
  });

  const standards = bundle?.standards;
  const passFailStandards = bundle?.passFail;
  const altitudeCorrections = bundle?.corrections;
  const walkAltThresholds = bundle?.walkThresholds;

  const isLoading = isFetchingBundle && !bundle;

  const { minMax, cardioMinMax } = useMemo(() => {
    if (!standards || !passFailStandards) {
      return {
        minMax: {
          pushups: { min: 0, max: 0 },
          core: { min: 0, max: 0 },
          whtr: { min: 0, max: 0 },
        },
        cardioMinMax: { min: 0, max: 0 },
      };
    }
    const pushupValues = getMinMaxValues(standards, debouncedPushupComponent);
    const coreValues = getMinMaxValues(standards, debouncedCoreComponent);
    const whtrValues = getMinMaxValues(standards, "whtr");
    const cardioValues = getCardioMinMaxValues(
      standards,
      passFailStandards,
      debouncedCardioComponent,
    );
    return {
      minMax: { pushups: pushupValues, core: coreValues, whtr: whtrValues },
      cardioMinMax: cardioValues,
    };
  }, [
    standards,
    passFailStandards,
    debouncedPushupComponent,
    debouncedCoreComponent,
    debouncedCardioComponent,
  ]);

  const ninetyPercentileThresholds = useMemo(() => {
    if (!standards) {
      return { pushups: 0, core: 0, cardio: 0 };
    }
    const pushupThreshold = getPerformanceForScore(
      standards,
      debouncedPushupComponent,
      13.5,
    ); // 90% of 15
    const coreThreshold = getPerformanceForScore(
      standards,
      debouncedCoreComponent,
      13.5,
    ); // 90% of 15
    const cardioThreshold = getPerformanceForScore(
      standards,
      debouncedCardioComponent,
      45,
    ); // 90% of 50
    return {
      pushups: pushupThreshold,
      core: coreThreshold,
      cardio: cardioThreshold,
    };
  }, [
    standards,
    debouncedPushupComponent,
    debouncedCoreComponent,
    debouncedCardioComponent,
  ]);

  const calculatedWhtr = useMemo(() => {
    const waistNum = parseFloat(debouncedWaist) || 0;
    let heightNum = 0;

    if (debouncedIsHeightInInches) {
      heightNum = parseFloat(debouncedHeightInches) || 0;
    } else {
      const feet = parseFloat(debouncedHeightFeet) || 0;
      const inches = parseFloat(debouncedHeightInches) || 0;
      heightNum = feet * 12 + inches;
    }

    if (waistNum > 0 && heightNum > 0) {
      // Round to 2 decimal places to match standards exactly
      return Math.round((waistNum / heightNum) * 100) / 100;
    }
    return 0;
  }, [
    debouncedWaist,
    debouncedHeightFeet,
    debouncedHeightInches,
    debouncedIsHeightInInches,
  ]);

  const payload = useMemo(() => {
    if (!ageNum || !debouncedGender) return null;
    return {
      age: ageNum,
      gender: debouncedGender,
      altitudeGroup: debouncedAltitudeGroup,
      pushupComponent: debouncedPushupComponent,
      pushups: parseInt(debouncedPushups) || 0,
      isStrengthExempt: debouncedStrengthExempt,
      coreComponent: debouncedCoreComponent,
      situps: parseInt(debouncedSitups) || 0,
      reverseCrunches: parseInt(debouncedReverseCrunches) || 0,
      plankMinutes: parseInt(debouncedPlankMinutes) || 0,
      plankSeconds: parseInt(debouncedPlankSeconds) || 0,
      isCoreExempt: debouncedCoreExempt,
      cardioComponent: debouncedCardioComponent,
      runMinutes: parseInt(debouncedRunMinutes) || 0,
      runSeconds: parseInt(debouncedRunSeconds) || 0,
      shuttles: parseInt(debouncedShuttles) || 0,
      walkMinutes: parseInt(debouncedWalkMinutes) || 0,
      walkSeconds: parseInt(debouncedWalkSeconds) || 0,
      isCardioExempt: debouncedCardioExempt,
      whtr: calculatedWhtr,
      isWhtrExempt: false,
    };
  }, [
    ageNum,
    debouncedGender,
    debouncedAltitudeGroup,
    debouncedPushupComponent,
    debouncedPushups,
    debouncedStrengthExempt,
    debouncedCoreComponent,
    debouncedSitups,
    debouncedReverseCrunches,
    debouncedPlankMinutes,
    debouncedPlankSeconds,
    debouncedCoreExempt,
    debouncedCardioComponent,
    debouncedRunMinutes,
    debouncedRunSeconds,
    debouncedShuttles,
    debouncedWalkMinutes,
    debouncedWalkSeconds,
    debouncedCardioExempt,
    calculatedWhtr,
  ]);

  const score = useMemo(() => {
    if (
      payload &&
      standards &&
      passFailStandards &&
      altitudeCorrections &&
      walkAltThresholds
    ) {
      try {
        return calculatePtScore(
          payload,
          standards,
          passFailStandards,
          altitudeCorrections,
          walkAltThresholds,
        );
      } catch (e) {
        console.error("Error during calculation: ", e);
      }
    }

    if (isLoading && !standards) {
      // If we ARE loading and have no standards yet for this age group, return loading indicators
      return {
        totalScore: 0,
        cardioScore: "...",
        pushupScore: "...",
        coreScore: "...",
        whtrScore: "...",
        isPass: false,
        walkPassed: "n/a",
        cardioRiskCategory: null,
        whtrRiskCategory: null,
      };
    }

    // Default return if conditions aren't met or if demographics are missing
    return {
      totalScore: 0,
      cardioScore: 0,
      pushupScore: 0,
      coreScore: 0,
      whtrScore: 0,
      isPass: false,
      walkPassed: "n/a",
      cardioRiskCategory: null,
      whtrRiskCategory: null,
    };
  }, [
    payload,
    standards,
    passFailStandards,
    altitudeCorrections,
    walkAltThresholds,
    isLoading,
  ]);

  return {
    demographics,
    strength,
    core,
    cardio,
    score,
    isLoading,
    minMax,
    cardioMinMax,
    ninetyPercentileThresholds,
    altitudeData: {
      run: altitudeCorrections || [],
      walk: walkAltThresholds || [],
      hamr: altitudeCorrections || [],
    },
  };
}
