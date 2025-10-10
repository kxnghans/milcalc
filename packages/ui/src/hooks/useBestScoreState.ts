/**
 * @file useBestScoreState.ts
 * @description This file defines a custom React hook for managing the state and logic
 * of the "Best Score" calculator screen. It handles user inputs for all PT components,
 * debounces them, and calculates the scores for each, as well as the best possible combined score.
 */

import { useState, useEffect } from 'react';
import { getScoreForExercise, calculateBestScore, checkWalkPass, getPtStandards, getAgeGroupString } from '@repo/utils';
import { useDebounce } from './useDebounce';

/**
 * A custom hook to manage the state for the Best Score calculator.
 * @param {string} age - The user's age.
 * @param {string} gender - The user's gender.
 * @param {string} altitudeGroup - The selected altitude group.
 * @returns An object containing the state values and setters (`inputs`), the calculated results (`outputs`),
 * and the exemption state and toggles (`exemptions`).
 */
export function useBestScoreState(age: string, gender: string, altitudeGroup: string) {
  // State for raw user inputs for each exercise component.
  const [pushUps, setPushUps] = useState("");
  const [hrPushUps, setHrPushUps] = useState("");
  const [sitUps, setSitUps] = useState("");
  const [crunches, setCrunches] = useState("");
  const [plankMinutes, setPlankMinutes] = useState("");
  const [plankSeconds, setPlankSeconds] = useState("");
  const [runMinutes, setRunMinutes] = useState("");
  const [runSeconds, setRunSeconds] = useState("");
  const [shuttles, setShuttles] = useState("");
  const [walkMinutes, setWalkMinutes] = useState("");
  const [walkSeconds, setWalkSeconds] = useState("");

  // State for exemption status of each component category.
  const [isStrengthExempt, setIsStrengthExempt] = useState(false);
  const [isCoreExempt, setIsCoreExempt] = useState(false);
  const [isCardioExempt, setIsCardioExempt] = useState(false);

  // State to store the calculated scores for each component and the final best score.
  const [scores, setScores] = useState({});
  const [bestScore, setBestScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [standards, setStandards] = useState([]);

  // Debounce all user inputs to prevent recalculating scores on every keystroke.
  const debouncedAge = useDebounce(age, 500);
  const debouncedGender = useDebounce(gender, 500);
  const debouncedAltitudeGroup = useDebounce(altitudeGroup, 500);
  const debouncedPushUps = useDebounce(pushUps, 500);
  const debouncedHrPushUps = useDebounce(hrPushUps, 500);
  const debouncedSitUps = useDebounce(sitUps, 500);
  const debouncedCrunches = useDebounce(crunches, 500);
  const debouncedPlankMinutes = useDebounce(plankMinutes, 500);
  const debouncedPlankSeconds = useDebounce(plankSeconds, 500);
  const debouncedRunMinutes = useDebounce(runMinutes, 500);
  const debouncedRunSeconds = useDebounce(runSeconds, 500);
  const debouncedShuttles = useDebounce(shuttles, 500);
  const debouncedWalkMinutes = useDebounce(walkMinutes, 500);
  const debouncedWalkSeconds = useDebounce(walkSeconds, 500);

  const toggleStrengthExempt = () => {
    setIsStrengthExempt(current => {
      const next = !current;
      if (next) {
        setPushUps('');
        setHrPushUps('');
      }
      return next;
    });
  };

  const toggleCoreExempt = () => {
    setIsCoreExempt(current => {
      const next = !current;
      if (next) {
        setSitUps('');
        setCrunches('');
        setPlankMinutes('');
        setPlankSeconds('');
      }
      return next;
    });
  };

  const toggleCardioExempt = () => {
    setIsCardioExempt(current => {
      const next = !current;
      if (next) {
        setRunMinutes('');
        setRunSeconds('');
        setShuttles('');
        setWalkMinutes('');
        setWalkSeconds('');
      }
      return next;
    });
  };

  // This effect runs whenever a debounced input value changes.
  useEffect(() => {
    const fetchStandards = async () => {
      setIsLoading(true);
      try {
        if (!debouncedAge || !debouncedGender) {
            setScores({});
            setBestScore(0);
            return;
        }

        const ageNum = Number(debouncedAge);
        const ageGroupString = getAgeGroupString(ageNum);
        if (!ageGroupString) return;

        const capitalizedGender = debouncedGender.charAt(0).toUpperCase() + debouncedGender.slice(1);
        const fetchedStandards = await getPtStandards(capitalizedGender, ageGroupString);
        if (!fetchedStandards) return;
        setStandards(fetchedStandards);

        const newScores = {
            push_ups_1min: isStrengthExempt ? 'Exempt' : getScoreForExercise(fetchedStandards, 'push_ups_1min', { reps: Number(debouncedPushUps) }),
            hand_release_pushups_2min: isStrengthExempt ? 'Exempt' : getScoreForExercise(fetchedStandards, 'hand_release_pushups_2min', { reps: Number(debouncedHrPushUps) }),
            sit_ups_1min: isCoreExempt ? 'Exempt' : getScoreForExercise(fetchedStandards, 'sit_ups_1min', { reps: Number(debouncedSitUps) }),
            cross_leg_reverse_crunch_2min: isCoreExempt ? 'Exempt' : getScoreForExercise(fetchedStandards, 'cross_leg_reverse_crunch_2min', { reps: Number(debouncedCrunches) }),
            forearm_plank_time: isCoreExempt ? 'Exempt' : getScoreForExercise(fetchedStandards, 'forearm_plank_time', { minutes: Number(debouncedPlankMinutes), seconds: Number(debouncedPlankSeconds) }),
            run: isCardioExempt ? 'Exempt' : getScoreForExercise(fetchedStandards, 'run', { minutes: Number(debouncedRunMinutes), seconds: Number(debouncedRunSeconds) }, debouncedAltitudeGroup),
            shuttles: isCardioExempt ? 'Exempt' : getScoreForExercise(fetchedStandards, 'shuttles', { shuttles: Number(debouncedShuttles) }, debouncedAltitudeGroup),
            walk: isCardioExempt ? 'Exempt' : await checkWalkPass(Number(debouncedAge), debouncedGender, Number(debouncedWalkMinutes), Number(debouncedWalkSeconds), debouncedAltitudeGroup),
        };
        setScores(newScores);
        setBestScore(calculateBestScore(newScores));
      } finally {
        setIsLoading(false);
      }
    }

    fetchStandards();
  }, [
    debouncedAge, debouncedGender, debouncedAltitudeGroup,
    debouncedPushUps, debouncedHrPushUps, debouncedSitUps, debouncedCrunches,
    debouncedPlankMinutes, debouncedPlankSeconds, debouncedRunMinutes, debouncedRunSeconds,
    debouncedShuttles, debouncedWalkMinutes, debouncedWalkSeconds,
    isStrengthExempt, isCoreExempt, isCardioExempt
  ]);

  return {
    inputs: {
        pushUps, setPushUps,
        hrPushUps, setHrPushUps,
        sitUps, setSitUps,
        crunches, setCrunches,
        plankMinutes, setPlankMinutes,
        plankSeconds, setPlankSeconds,
        runMinutes, setRunMinutes,
        runSeconds, setRunSeconds,
        shuttles, setShuttles,
        walkMinutes, setWalkMinutes,
        walkSeconds, setWalkSeconds,
    },
    outputs: {
        scores,
        bestScore,
        isLoading,
    },
    exemptions: {
        isStrengthExempt,
        toggleStrengthExempt,
        isCoreExempt,
        toggleCoreExempt,
        isCardioExempt,
        toggleCardioExempt,
    }
  };
}