/**
 * @file usePtCalculatorState.ts
 * @description This file defines the primary custom hook for the main PT Calculator screen.
 * It acts as a central state aggregator, composing several smaller state management hooks
 * (for demographics, strength, core, and cardio). It debounces all inputs and triggers
 * score calculations and updates when the inputs have stabilized.
 */

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  calculatePtScore,
  getMinMaxValues,
  getCardioMinMaxValues,
  getPerformanceForScore,
  getAgeGroupString,
  getPtStandards,
  getWalkStandards,
  getAltitudeAdjustments,
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
  
  // Debounce all state values that are used in calculations.
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

  const ageNum = parseInt(debouncedAge);
  const ageGroup = getAgeGroupString(ageNum);
  const capitalizedGender = debouncedGender.charAt(0).toUpperCase() + debouncedGender.slice(1);

  const { data: standards, isLoading: isLoadingStandards } = useQuery({
    queryKey: ['ptStandards', capitalizedGender, ageGroup],
    queryFn: () => getPtStandards(capitalizedGender, ageGroup),
    enabled: !!capitalizedGender && !!ageGroup,
  });

  const { data: walkStandards, isLoading: isLoadingWalkStandards } = useQuery({
    queryKey: ['walkStandards', debouncedGender],
    queryFn: () => getWalkStandards(debouncedGender),
    enabled: !!debouncedGender,
  });

  const { data: walkAltitudeAdjustments, isLoading: isLoadingWalkAltitude } = useQuery({
    queryKey: ['altitudeAdjustments', 'walk'],
    queryFn: () => getAltitudeAdjustments('walk'),
    staleTime: Infinity,
  });

  const { data: runAltitudeAdjustments, isLoading: isLoadingRunAltitude } = useQuery({
    queryKey: ['altitudeAdjustments', 'run'],
    queryFn: () => getAltitudeAdjustments('run'),
    staleTime: Infinity,
  });

  const { data: hamrAltitudeAdjustments, isLoading: isLoadingHamrAltitude } = useQuery({
    queryKey: ['altitudeAdjustments', 'hamr'],
    queryFn: () => getAltitudeAdjustments('hamr'),
    staleTime: Infinity,
  });

  const isLoading = isLoadingStandards || isLoadingWalkStandards || isLoadingWalkAltitude || isLoadingRunAltitude || isLoadingHamrAltitude;

  const altitudeData = useMemo(() => ({
    walk: walkAltitudeAdjustments || [],
    run: runAltitudeAdjustments || [],
    hamr: hamrAltitudeAdjustments || [],
  }), [walkAltitudeAdjustments, runAltitudeAdjustments, hamrAltitudeAdjustments]);

  const { minMax, cardioMinMax } = useMemo(() => {
    if (!standards || !walkStandards) {
        return { 
            minMax: { pushups: {min: 0, max: 0}, core: {min: 0, max: 0}}, 
            cardioMinMax: { min: 0, max: 0 } 
        };
    }
    const pushupValues = getMinMaxValues(standards, debouncedPushupComponent);
    const coreValues = getMinMaxValues(standards, debouncedCoreComponent);
    const cardioValues = getCardioMinMaxValues(standards, walkStandards, debouncedCardioComponent);
    return { 
        minMax: {pushups: pushupValues, core: coreValues}, 
        cardioMinMax: cardioValues 
    };
  }, [standards, walkStandards, debouncedPushupComponent, debouncedCoreComponent, debouncedCardioComponent]);

  const ninetyPercentileThresholds = useMemo(() => {
      if (!standards) {
          return { pushups: 0, core: 0, cardio: 0 };
      }
      const pushupThreshold = getPerformanceForScore(standards, debouncedPushupComponent, 18); // 90% of 20
      const coreThreshold = getPerformanceForScore(standards, debouncedCoreComponent, 18); // 90% of 20
      const cardioThreshold = getPerformanceForScore(standards, debouncedCardioComponent, 54); // 90% of 60
      return {
          pushups: pushupThreshold,
          core: coreThreshold,
          cardio: cardioThreshold,
      };
  }, [standards, debouncedPushupComponent, debouncedCoreComponent, debouncedCardioComponent]);

  // The main effect hook that runs all calculations whenever a debounced input changes.
    useEffect(() => {
        const runCalculations = () => {
            if (ageNum && debouncedGender && standards && walkStandards && altitudeData) {
                try {
                    // calculatePtScore handles altitude adjustments internally, so we pass raw input here.
                    const rawShuttles = parseInt(debouncedShuttles) || 0;

                    // Now synchronous
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
                        shuttles: rawShuttles,
                        walkMinutes: parseInt(debouncedWalkMinutes) || 0,
                        walkSeconds: parseInt(debouncedWalkSeconds) || 0,
                        isCardioExempt: debouncedCardioExempt,
                    }, standards, walkStandards, altitudeData);
                    setScore(result);
                } catch (e) {
                    // console.error("Error during calculation: ", e);
                }
            } else {
                setScore({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false, walkPassed: 'n/a' });
            }
        }

        runCalculations();

    }, [
    // This dependency array ensures the effect only re-runs when a debounced value changes, or when the data from queries is updated.
    debouncedAge, debouncedGender, debouncedAltitudeGroup,
    debouncedPushupComponent, debouncedPushups, debouncedStrengthExempt,
    debouncedCoreComponent, debouncedSitups, debouncedReverseCrunches, debouncedPlankMinutes, debouncedPlankSeconds, debouncedCoreExempt,
    debouncedCardioComponent, debouncedRunMinutes, debouncedRunSeconds, debouncedShuttles, debouncedWalkMinutes, debouncedWalkSeconds, debouncedCardioExempt,
    standards, walkStandards, altitudeData
  ]);

  // Expose all the state and derived data to the consuming component.
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
    altitudeData,
  };
}