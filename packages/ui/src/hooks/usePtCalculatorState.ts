/**
 * @file usePtCalculatorState.ts
 * @description This file defines the primary custom hook for the main PT Calculator screen.
 * It acts as a central state aggregator, composing several smaller state management hooks.
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
  getPassFailStandards,
  getPtAltitudeCorrections,
  getPtAltitudeWalkThresholds,
} from '@repo/utils';
import { useDebounce } from './useDebounce';
import { useDemographicsState } from './useDemographicsState';
import { useStrengthState } from './useStrengthState';
import { useCoreState } from './useCoreState';
import { useCardioState } from './useCardioState';

export function usePtCalculatorState(
  initialAge: string = '', 
  initialGender: string = 'male', 
  initialAltitudeGroup: string = 'normal'
) {
  const demographics = useDemographicsState(initialAge, initialGender, initialAltitudeGroup);
  const strength = useStrengthState();
  const core = useCoreState();
  const cardio = useCardioState();

  const [score, setScore] = useState<{
    totalScore: number;
    cardioScore: number | string;
    pushupScore: number | string;
    coreScore: number | string;
    whtrScore: number | string;
    isPass: boolean;
    walkPassed: string;
  }>({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, whtrScore: 0, isPass: false, walkPassed: 'n/a' });
  
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

  // 1. Fetch Scoring Standards (Includes WHtR)
  const { data: standards, isLoading: isLoadingStandards } = useQuery({
    queryKey: ['ptStandards', capitalizedGender, ageGroup],
    queryFn: () => getPtStandards(capitalizedGender, ageGroup || ''),
    enabled: !!capitalizedGender && !!ageGroup,
  });

  // 2. Fetch Pass/Fail Standards
  const { data: passFailStandards, isLoading: isLoadingPassFail } = useQuery({
    queryKey: ['passFailStandards', capitalizedGender, ageGroup],
    queryFn: () => getPassFailStandards(capitalizedGender, ageGroup || ''),
    enabled: !!capitalizedGender && !!ageGroup,
  });

  // 3. Fetch Altitude Corrections (Run/HAMR)
  const { data: altitudeCorrections, isLoading: isLoadingCorrections } = useQuery({
    queryKey: ['altitudeCorrections'],
    queryFn: () => getPtAltitudeCorrections(),
  });

  // 4. Fetch Walk Altitude Thresholds
  const { data: walkAltThresholds, isLoading: isLoadingWalkAlt } = useQuery({
    queryKey: ['walkAltThresholds', capitalizedGender, ageGroup],
    queryFn: () => getPtAltitudeWalkThresholds(capitalizedGender, ageGroup || ''),
    enabled: !!capitalizedGender && !!ageGroup,
  });

  const isLoading = isLoadingStandards || isLoadingPassFail || isLoadingCorrections || isLoadingWalkAlt;

  const { minMax, cardioMinMax } = useMemo(() => {
    if (!standards || !passFailStandards) {
        return { 
            minMax: { pushups: {min: 0, max: 0}, core: {min: 0, max: 0}}, 
            cardioMinMax: { min: 0, max: 0 } 
        };
    }
    const pushupValues = getMinMaxValues(standards, debouncedPushupComponent);
    const coreValues = getMinMaxValues(standards, debouncedCoreComponent);
    const cardioValues = getCardioMinMaxValues(standards, passFailStandards, debouncedCardioComponent);
    return { 
        minMax: {pushups: pushupValues, core: coreValues}, 
        cardioMinMax: cardioValues 
    };
  }, [standards, passFailStandards, debouncedPushupComponent, debouncedCoreComponent, debouncedCardioComponent]);

  const ninetyPercentileThresholds = useMemo(() => {
      if (!standards) {
          return { pushups: 0, core: 0, cardio: 0 };
      }
      const pushupThreshold = getPerformanceForScore(standards, debouncedPushupComponent, 13.5); // 90% of 15
      const coreThreshold = getPerformanceForScore(standards, debouncedCoreComponent, 13.5); // 90% of 15
      const cardioThreshold = getPerformanceForScore(standards, debouncedCardioComponent, 45); // 90% of 50
      return {
          pushups: pushupThreshold,
          core: coreThreshold,
          cardio: cardioThreshold,
      };
  }, [standards, debouncedPushupComponent, debouncedCoreComponent, debouncedCardioComponent]);

    useEffect(() => {
        const runCalculations = () => {
            if (ageNum && debouncedGender && standards && passFailStandards && altitudeCorrections && walkAltThresholds) {
                try {
                    const result = calculatePtScore({
                        age: ageNum || 0,
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
                        whtr: 0, // Placeholder for now
                        isWhtrExempt: false,
                    }, standards, passFailStandards, altitudeCorrections, walkAltThresholds);
                    setScore(result);
                } catch (e) {
                    console.error("Error during calculation: ", e);
                }
            } else {
                setScore({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, whtrScore: 0, isPass: false, walkPassed: 'n/a' });
            }
        }
        runCalculations();
    }, [
    debouncedAge, debouncedGender, debouncedAltitudeGroup,
    debouncedPushupComponent, debouncedPushups, debouncedStrengthExempt,
    debouncedCoreComponent, debouncedSitups, debouncedReverseCrunches, debouncedPlankMinutes, debouncedPlankSeconds, debouncedCoreExempt,
    debouncedCardioComponent, debouncedRunMinutes, debouncedRunSeconds, debouncedShuttles, debouncedWalkMinutes, debouncedWalkSeconds, debouncedCardioExempt,
    standards, passFailStandards, altitudeCorrections, walkAltThresholds, ageNum
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
    altitudeData: { run: altitudeCorrections, walk: walkAltThresholds, hamr: altitudeCorrections },
  };
}
