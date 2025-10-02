/**
 * @file usePtCalculatorState.ts
 * @description This file defines the primary custom hook for the main PT Calculator screen.
 * It acts as a central state aggregator, composing several smaller state management hooks
 * (for demographics, strength, core, and cardio). It debounces all inputs and triggers
 * score calculations and updates when the inputs have stabilized.
 */

import { useState, useEffect } from 'react';
import {
  calculatePtScore,
  getMinMaxValues,
  getCardioMinMaxValues,
  getPerformanceForScore,
} from '@repo/utils';
import { useDebounce } from './useDebounce';
import { useDemographicsState } from './useDemographicsState';
import { useStrengthState } from './useStrengthState';
import { useCoreState } from './useCoreState';
import { useCardioState } from './useCardioState';

/**
 * A comprehensive custom hook that manages the entire state for the PT Calculator screen.
 * It integrates state from demographics, strength, core, and cardio components,
 * debounces the inputs, and calculates the final score and associated data.
 * @returns An object containing all the state and derived data needed by the calculator screen.
 */
export function usePtCalculatorState() {
  // Compose smaller hooks to manage specific sections of the calculator.
  const demographics = useDemographicsState();
  const strength = useStrengthState();
  const core = useCoreState();
  const cardio = useCardioState();

  // State for the calculated results from the core utility functions.
  const [score, setScore] = useState({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false, walkPassed: 'n/a' });
  const [minMax, setMinMax] = useState({ pushups: {min: 0, max: 0}, core: {min: 0, max: 0}});
  const [cardioMinMax, setCardioMinMax] = useState({ min: 0, max: 0 });
  const [ninetyPercentileThresholds, setNinetyPercentileThresholds] = useState({ pushups: 0, core: 0, cardio: 0 });

  // Debounce all state values that are used in calculations.
  // This is critical for performance, as it prevents recalculating on every single input change (e.g., each keystroke).
  // The calculation will only run after the user has stopped typing for 500ms.
  const debouncedAge = useDebounce(demographics.age, 500);
  const debouncedGender = useDebounce(demographics.gender, 500);
  const debouncedAltitudeGroup = useDebounce(demographics.altitudeGroup, 500);
  
  const debouncedPushupComponent = useDebounce(strength.pushupComponent, 500);
  const debouncedPushups = useDebounce(strength.pushups, 500);
  const debouncedStrengthExempt = useDebounce(strength.isExempt, 500);

  const debouncedCoreComponent = useDebounce(core.coreComponent, 500);
  const debouncedSitups = useDebounce(core.situps, 500);
  const debouncedReverseCrunches = useDebounce(core.reverseCrunches, 500);
  const debouncedPlankMinutes = useDebounce(core.plankMinutes, 500);
  const debouncedPlankSeconds = useDebounce(core.plankSeconds, 500);
  const debouncedCoreExempt = useDebounce(core.isExempt, 500);

  const debouncedCardioComponent = useDebounce(cardio.cardioComponent, 500);
  const debouncedRunMinutes = useDebounce(cardio.runMinutes, 500);
  const debouncedRunSeconds = useDebounce(cardio.runSeconds, 500);
  const debouncedShuttles = useDebounce(cardio.shuttles, 500);
  const debouncedWalkMinutes = useDebounce(cardio.walkMinutes, 500);
  const debouncedWalkSeconds = useDebounce(cardio.walkSeconds, 500);
  const debouncedCardioExempt = useDebounce(cardio.isExempt, 500);

  // The main effect hook that runs all calculations whenever a debounced input changes.
  useEffect(() => {
    const ageNum = parseInt(debouncedAge);
    // Only perform calculations if the essential demographic information is present.
    if (ageNum && debouncedGender) {
        // Fetch the minimum and maximum possible performance values for the selected components.
        const pushupValues = getMinMaxValues(ageNum, debouncedGender, debouncedPushupComponent);
        const coreValues = getMinMaxValues(ageNum, debouncedGender, debouncedCoreComponent);
        const cardioValues = getCardioMinMaxValues(ageNum, debouncedGender, debouncedCardioComponent);
        setMinMax({pushups: pushupValues, core: coreValues});
        setCardioMinMax(cardioValues);

        // Fetch the performance required to get a 90% score for each component.
        // This is used for the "excellent" category threshold in the UI.
        const pushupThreshold = getPerformanceForScore(ageNum, debouncedGender, debouncedPushupComponent, 18); // 90% of 20
        const coreThreshold = getPerformanceForScore(ageNum, debouncedGender, debouncedCoreComponent, 18); // 90% of 20
        const cardioThreshold = getPerformanceForScore(ageNum, debouncedGender, debouncedCardioComponent, 54); // 90% of 60

        setNinetyPercentileThresholds({
            pushups: pushupThreshold,
            core: coreThreshold,
            cardio: cardioThreshold,
        });

        // Call the main calculation function with all the debounced and parsed inputs.
        const result = calculatePtScore({
            age: ageNum || 0,
            gender: debouncedGender,
            altitudeGroup: debouncedAltitudeGroup,
            // Strength
            pushupComponent: debouncedPushupComponent,
            pushups: parseInt(debouncedPushups) || 0,
            isStrengthExempt: debouncedStrengthExempt,
            // Core
            coreComponent: debouncedCoreComponent,
            situps: parseInt(debouncedSitups) || 0,
            reverseCrunches: parseInt(debouncedReverseCrunches) || 0,
            plankMinutes: parseInt(debouncedPlankMinutes) || 0,
            plankSeconds: parseInt(debouncedPlankSeconds) || 0,
            isCoreExempt: debouncedCoreExempt,
            // Cardio
            cardioComponent: debouncedCardioComponent,
            runMinutes: parseInt(debouncedRunMinutes) || 0,
            runSeconds: parseInt(debouncedRunSeconds) || 0,
            shuttles: parseInt(debouncedShuttles) || 0,
            walkMinutes: parseInt(debouncedWalkMinutes) || 0,
            walkSeconds: parseInt(debouncedWalkSeconds) || 0,
            isCardioExempt: debouncedCardioExempt,
        });
        setScore(result);
    } else {
        // If age or gender is missing, reset all calculated data to their initial states.
        setScore({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false, walkPassed: 'n/a' });
        setMinMax({ pushups: {min: 0, max: 0}, core: {min: 0, max: 0}});
        setCardioMinMax({ min: 0, max: 0 });
        setNinetyPercentileThresholds({ pushups: 0, core: 0, cardio: 0 });
    }
  }, [
    // This dependency array ensures the effect only re-runs when a debounced value changes.
    debouncedAge, debouncedGender, debouncedAltitudeGroup,
    debouncedPushupComponent, debouncedPushups, debouncedStrengthExempt,
    debouncedCoreComponent, debouncedSitups, debouncedReverseCrunches, debouncedPlankMinutes, debouncedPlankSeconds, debouncedCoreExempt,
    debouncedCardioComponent, debouncedRunMinutes, debouncedRunSeconds, debouncedShuttles, debouncedWalkMinutes, debouncedWalkSeconds, debouncedCardioExempt
  ]);

  // Expose all the state and derived data to the consuming component.
  return {
    demographics,
    strength,
    core,
    cardio,
    score,
    minMax,
    cardioMinMax,
    ninetyPercentileThresholds,
  };
}