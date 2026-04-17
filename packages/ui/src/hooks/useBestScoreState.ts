/**
 * @file useBestScoreState.ts
 * @description This file defines a custom React hook for managing the state and logic
 * of the "Best Score" calculator screen. It handles user inputs for all PT components,
 * debounces them, and calculates the scores for each, as well as the best possible combined score.
 */

import {
  calculateBestScore,
  checkWalkPass,
  getAgeGroupString,
  getPassFailStandards,
  getPtAltitudeCorrections,
  getPtAltitudeWalkThresholds,
  getPtStandards,
  getScoreForExercise,
  getWhtrScore,
} from "@repo/utils";
import React, { useEffect, useState } from "react";

import { useDebounce } from "./useDebounce";
import { useTimeInput } from "./useTimeInput";

export interface BestScores {
  push_ups_1min?: number | string;
  hand_release_pushups_2min?: number | string;
  sit_ups_1min?: number | string;
  cross_leg_reverse_crunch_2min?: number | string;
  forearm_plank_time?: number | string;
  run?: number | string;
  shuttles?: number | string;
  walk?: string;
  whtr?: number | string;
}

/**
 * A custom hook to manage the state for the Best Score calculator.
 * @param {string} age - The user's age.
 * @param {string} gender - The user's gender.
 * @param {string} altitudeGroup - The selected altitude group.
 * @param {number} calculatedWhtr - The calculated waist-to-height ratio from demographics.
 * @returns An object containing the state values and setters (`inputs`), the calculated results (`outputs`),
 * and the exemption state and toggles (`exemptions`).
 */
export function useBestScoreState(
  age: string,
  gender: string,
  altitudeGroup: string,
  calculatedWhtr: number,
) {
  // State for raw user inputs for each exercise component.
  const [pushUps, setPushUps] = useState("");
  const [hrPushUps, setHrPushUps] = useState("");
  const [sitUps, setSitUps] = useState("");
  const [crunches, setCrunches] = useState("");
  const {
    minutes: plankMinutes,
    setMinutes: setPlankMinutes,
    seconds: plankSeconds,
    setSeconds: setPlankSeconds,
  } = useTimeInput();
  const {
    minutes: runMinutes,
    setMinutes: setRunMinutes,
    seconds: runSeconds,
    setSeconds: setRunSeconds,
  } = useTimeInput();
  const [shuttles, setShuttles] = useState("");
  const {
    minutes: walkMinutes,
    setMinutes: setWalkMinutes,
    seconds: walkSeconds,
    setSeconds: setWalkSeconds,
  } = useTimeInput();

  // State for exemption status of each component category.
  const [isStrengthExempt, setIsStrengthExempt] = useState(false);
  const [isCoreExempt, setIsCoreExempt] = useState(false);
  const [isCardioExempt, setIsCardioExempt] = useState(false);
  const [isWhtrExempt, setIsWhtrExempt] = useState(false);

  // State to store the calculated scores for each component and the final best score.
  const [scores, setScores] = useState<BestScores>({});
  const [bestScore, setBestScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  const toggleStrengthExempt = React.useCallback(() => {
    setIsStrengthExempt((current) => {
      const next = !current;
      if (next) {
        setPushUps("");
        setHrPushUps("");
      }
      return next;
    });
  }, []);

  const toggleCoreExempt = React.useCallback(() => {
    setIsCoreExempt((current) => {
      const next = !current;
      if (next) {
        setSitUps("");
        setCrunches("");
        setPlankMinutes("");
        setPlankSeconds("");
      }
      return next;
    });
  }, [setPlankMinutes, setPlankSeconds]);

  const toggleCardioExempt = React.useCallback(() => {
    setIsCardioExempt((current) => {
      const next = !current;
      if (next) {
        setRunMinutes("");
        setRunSeconds("");
        setShuttles("");
        setWalkMinutes("");
        setWalkSeconds("");
      }
      return next;
    });
  }, [setRunMinutes, setRunSeconds, setWalkMinutes, setWalkSeconds]);

  const toggleWhtrExempt = React.useCallback(() => {
    setIsWhtrExempt((current) => !current);
  }, []);

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

        const capitalizedGender =
          debouncedGender.charAt(0).toUpperCase() + debouncedGender.slice(1);

        // Fetch all data concurrently
        const [
          fetchedStandards,
          passFailStandards,
          walkAltThresholds,
          altitudeCorrections,
        ] = await Promise.all([
          getPtStandards(capitalizedGender, ageGroupString), // Logic for 2025/Legacy should be handled here
          getPassFailStandards(capitalizedGender, ageGroupString),
          getPtAltitudeWalkThresholds(capitalizedGender),
          getPtAltitudeCorrections(),
        ]);

        if (!fetchedStandards) return;

        const newScores: BestScores = {
          push_ups_1min: isStrengthExempt
            ? "Exempt"
            : getScoreForExercise(fetchedStandards, "push_ups_1min", {
                reps: Number(debouncedPushUps),
              }).points,
          hand_release_pushups_2min: isStrengthExempt
            ? "Exempt"
            : getScoreForExercise(
                fetchedStandards,
                "hand_release_pushups_2min",
                { reps: Number(debouncedHrPushUps) },
              ).points,
          sit_ups_1min: isCoreExempt
            ? "Exempt"
            : getScoreForExercise(fetchedStandards, "sit_ups_1min", {
                reps: Number(debouncedSitUps),
              }).points,
          cross_leg_reverse_crunch_2min: isCoreExempt
            ? "Exempt"
            : getScoreForExercise(
                fetchedStandards,
                "cross_leg_reverse_crunch_2min",
                { reps: Number(debouncedCrunches) },
              ).points,
          forearm_plank_time: isCoreExempt
            ? "Exempt"
            : getScoreForExercise(fetchedStandards, "forearm_plank_time", {
                minutes: Number(debouncedPlankMinutes),
                seconds: Number(debouncedPlankSeconds),
              }).points,
          run: isCardioExempt
            ? "Exempt"
            : getScoreForExercise(
                fetchedStandards,
                "run_2mile",
                {
                  minutes: Number(debouncedRunMinutes),
                  seconds: Number(debouncedRunSeconds),
                },
                debouncedAltitudeGroup,
                altitudeCorrections || [],
              ).points,
          shuttles: isCardioExempt
            ? "Exempt"
            : getScoreForExercise(
                fetchedStandards,
                "shuttles_20m",
                { shuttles: Number(debouncedShuttles) },
                debouncedAltitudeGroup,
                altitudeCorrections || [],
              ).points,
          walk: isCardioExempt
            ? "Exempt"
            : checkWalkPass(
                Number(debouncedAge),
                capitalizedGender,
                Number(debouncedWalkMinutes),
                Number(debouncedWalkSeconds),
                passFailStandards || [],
                walkAltThresholds || [],
                debouncedAltitudeGroup,
              ),
          whtr: isWhtrExempt
            ? "Exempt"
            : getWhtrScore(fetchedStandards, calculatedWhtr).points,
        };
        setScores(newScores);
        setBestScore(
          calculateBestScore(newScores as Record<string, number | string>),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStandards();
  }, [
    debouncedAge,
    debouncedGender,
    debouncedAltitudeGroup,
    debouncedPushUps,
    debouncedHrPushUps,
    debouncedSitUps,
    debouncedCrunches,
    debouncedPlankMinutes,
    debouncedPlankSeconds,
    debouncedRunMinutes,
    debouncedRunSeconds,
    debouncedShuttles,
    debouncedWalkMinutes,
    debouncedWalkSeconds,
    isStrengthExempt,
    isCoreExempt,
    isCardioExempt,
    isWhtrExempt,
    calculatedWhtr,
  ]);

  const inputs = React.useMemo(
    () => ({
      pushUps,
      setPushUps,
      hrPushUps,
      setHrPushUps,
      sitUps,
      setSitUps,
      crunches,
      setCrunches,
      plankMinutes,
      setPlankMinutes,
      plankSeconds,
      setPlankSeconds,
      runMinutes,
      setRunMinutes,
      runSeconds,
      setRunSeconds,
      shuttles,
      setShuttles,
      walkMinutes,
      setWalkMinutes,
      walkSeconds,
      setWalkSeconds,
    }),
    [
      pushUps,
      setPushUps,
      hrPushUps,
      setHrPushUps,
      sitUps,
      setSitUps,
      crunches,
      setCrunches,
      plankMinutes,
      setPlankMinutes,
      plankSeconds,
      setPlankSeconds,
      runMinutes,
      setRunMinutes,
      runSeconds,
      setRunSeconds,
      shuttles,
      setShuttles,
      walkMinutes,
      setWalkMinutes,
      walkSeconds,
      setWalkSeconds,
    ],
  );

  const outputs = React.useMemo(() => {
    const sBest = Math.max(
      typeof scores.push_ups_1min === "number" ? scores.push_ups_1min : 0,
      typeof scores.hand_release_pushups_2min === "number"
        ? scores.hand_release_pushups_2min
        : 0,
    );
    const coreBest = Math.max(
      typeof scores.sit_ups_1min === "number" ? scores.sit_ups_1min : 0,
      typeof scores.cross_leg_reverse_crunch_2min === "number"
        ? scores.cross_leg_reverse_crunch_2min
        : 0,
      typeof scores.forearm_plank_time === "number"
        ? scores.forearm_plank_time
        : 0,
    );
    const cardioBest = Math.max(
      typeof scores.run === "number" ? scores.run : 0,
      typeof scores.shuttles === "number" ? scores.shuttles : 0,
    );

    return {
      scores,
      bestScore,
      isLoading,
      componentScores: {
        pushupScore: isStrengthExempt ? "Exempt" : sBest,
        coreScore: isCoreExempt ? "Exempt" : coreBest,
        cardioScore: isCardioExempt
          ? "Exempt"
          : scores.walk === "pass" || scores.walk === "fail"
            ? scores.walk
            : cardioBest,
        whtrScore: isWhtrExempt
          ? "Exempt"
          : typeof scores.whtr === "number"
            ? scores.whtr
            : 0,
      },
    };
  }, [
    scores,
    bestScore,
    isLoading,
    isStrengthExempt,
    isCoreExempt,
    isCardioExempt,
    isWhtrExempt,
  ]);

  const exemptions = React.useMemo(
    () => ({
      isStrengthExempt,
      toggleStrengthExempt,
      isCoreExempt,
      toggleCoreExempt,
      isCardioExempt,
      toggleCardioExempt,
      isWhtrExempt,
      toggleWhtrExempt,
    }),
    [
      isStrengthExempt,
      toggleStrengthExempt,
      isCoreExempt,
      toggleCoreExempt,
      isCardioExempt,
      toggleCardioExempt,
      isWhtrExempt,
      toggleWhtrExempt,
    ],
  );

  return { inputs, outputs, exemptions };
}
