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

export function usePtCalculatorState() {
  const demographics = useDemographicsState();
  const strength = useStrengthState();
  const core = useCoreState();
  const cardio = useCardioState();

  const [score, setScore] = useState({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false, walkPassed: 'n/a' });
  const [minMax, setMinMax] = useState({ pushups: {min: 0, max: 0}, core: {min: 0, max: 0}});
  const [cardioMinMax, setCardioMinMax] = useState({ min: 0, max: 0 });
  const [ninetyPercentileThresholds, setNinetyPercentileThresholds] = useState({ pushups: 0, core: 0, cardio: 0 });

  // Debounce all the state values that will be used in the calculation
  const debouncedAge = useDebounce(demographics.age, 500);
  const debouncedGender = useDebounce(demographics.gender, 500);
  const debouncedAltitudeGroup = useDebounce(demographics.altitudeGroup, 500);
  
  const debouncedPushupComponent = useDebounce(strength.pushupComponent, 500);
  const debouncedPushups = useDebounce(strength.pushups, 500);

  const debouncedCoreComponent = useDebounce(core.coreComponent, 500);
  const debouncedSitups = useDebounce(core.situps, 500);
  const debouncedReverseCrunches = useDebounce(core.reverseCrunches, 500);
  const debouncedPlankMinutes = useDebounce(core.plankMinutes, 500);
  const debouncedPlankSeconds = useDebounce(core.plankSeconds, 500);

  const debouncedCardioComponent = useDebounce(cardio.cardioComponent, 500);
  const debouncedRunMinutes = useDebounce(cardio.runMinutes, 500);
  const debouncedRunSeconds = useDebounce(cardio.runSeconds, 500);
  const debouncedShuttles = useDebounce(cardio.shuttles, 500);
  const debouncedWalkMinutes = useDebounce(cardio.walkMinutes, 500);
  const debouncedWalkSeconds = useDebounce(cardio.walkSeconds, 500);

  useEffect(() => {
    const ageNum = parseInt(debouncedAge);
    if (ageNum && debouncedGender) {
        const pushupValues = getMinMaxValues(ageNum, debouncedGender, debouncedPushupComponent);
        const coreValues = getMinMaxValues(ageNum, debouncedGender, debouncedCoreComponent);
        const cardioValues = getCardioMinMaxValues(ageNum, debouncedGender, debouncedCardioComponent);
        setMinMax({pushups: pushupValues, core: coreValues});
        setCardioMinMax(cardioValues);

        const pushupThreshold = getPerformanceForScore(ageNum, debouncedGender, debouncedPushupComponent, 18); // 90% of 20
        const coreThreshold = getPerformanceForScore(ageNum, debouncedGender, debouncedCoreComponent, 18); // 90% of 20
        const cardioThreshold = getPerformanceForScore(ageNum, debouncedGender, debouncedCardioComponent, 54); // 90% of 60

        setNinetyPercentileThresholds({
            pushups: pushupThreshold,
            core: coreThreshold,
            cardio: cardioThreshold,
        });

        const result = calculatePtScore({
            age: ageNum || 0,
            gender: debouncedGender,
            cardioComponent: debouncedCardioComponent,
            runMinutes: parseInt(debouncedRunMinutes) || 0,
            runSeconds: parseInt(debouncedRunSeconds) || 0,
            shuttles: parseInt(debouncedShuttles) || 0,
            walkMinutes: parseInt(debouncedWalkMinutes) || 0,
            walkSeconds: parseInt(debouncedWalkSeconds) || 0,
            pushupComponent: debouncedPushupComponent,
            pushups: parseInt(debouncedPushups) || 0,
            coreComponent: debouncedCoreComponent,
            situps: parseInt(debouncedSitups) || 0,
            reverseCrunches: parseInt(debouncedReverseCrunches) || 0,
            plankMinutes: parseInt(debouncedPlankMinutes) || 0,
            plankSeconds: parseInt(debouncedPlankSeconds) || 0,
            altitudeGroup: debouncedAltitudeGroup,
        });
        setScore(result);
    } else {
        setScore({ totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false, walkPassed: 'n/a' });
        setMinMax({ pushups: {min: 0, max: 0}, core: {min: 0, max: 0}});
        setCardioMinMax({ min: 0, max: 0 });
        setNinetyPercentileThresholds({ pushups: 0, core: 0, cardio: 0 });
    }
  }, [
    debouncedAge, debouncedGender, debouncedAltitudeGroup,
    debouncedPushupComponent, debouncedPushups,
    debouncedCoreComponent, debouncedSitups, debouncedReverseCrunches, debouncedPlankMinutes, debouncedPlankSeconds,
    debouncedCardioComponent, debouncedRunMinutes, debouncedRunSeconds, debouncedShuttles, debouncedWalkMinutes, debouncedWalkSeconds
  ]);

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
