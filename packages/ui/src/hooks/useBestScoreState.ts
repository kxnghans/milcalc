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
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

import { useDebounce } from "./useDebounce";

type BestScoreState = {
  pushUps: string;
  hrPushUps: string;
  sitUps: string;
  crunches: string;
  plankMinutes: string;
  plankSeconds: string;
  runMinutes: string;
  runSeconds: string;
  shuttles: string;
  walkMinutes: string;
  walkSeconds: string;
  isStrengthExempt: boolean;
  isCoreExempt: boolean;
  isCardioExempt: boolean;
  isWhtrExempt: boolean;
};

type BestScoreAction =
  | { type: "SET_FIELD"; field: keyof BestScoreState; value: string }
  | { type: "SET_TIME_FIELD"; field: keyof BestScoreState; value: string }
  | {
      type: "TOGGLE_EXEMPTION";
      category: "strength" | "core" | "cardio" | "whtr";
    };

const initialBestScoreState: BestScoreState = {
  pushUps: "",
  hrPushUps: "",
  sitUps: "",
  crunches: "",
  plankMinutes: "",
  plankSeconds: "",
  runMinutes: "",
  runSeconds: "",
  shuttles: "",
  walkMinutes: "",
  walkSeconds: "",
  isStrengthExempt: false,
  isCoreExempt: false,
  isCardioExempt: false,
  isWhtrExempt: false,
};

function bestScoreReducer(
  state: BestScoreState,
  action: BestScoreAction,
): BestScoreState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_TIME_FIELD": {
      const numericValue = action.value.replace(/[^0-9]/g, "");
      if (numericValue === "" || parseInt(numericValue, 10) < 60) {
        return { ...state, [action.field]: numericValue };
      }
      return state;
    }
    case "TOGGLE_EXEMPTION": {
      if (action.category === "strength") {
        const next = !state.isStrengthExempt;
        return {
          ...state,
          isStrengthExempt: next,
          ...(next ? { pushUps: "", hrPushUps: "" } : {}),
        };
      }
      if (action.category === "core") {
        const next = !state.isCoreExempt;
        return {
          ...state,
          isCoreExempt: next,
          ...(next
            ? { sitUps: "", crunches: "", plankMinutes: "", plankSeconds: "" }
            : {}),
        };
      }
      if (action.category === "cardio") {
        const next = !state.isCardioExempt;
        return {
          ...state,
          isCardioExempt: next,
          ...(next
            ? {
                runMinutes: "",
                runSeconds: "",
                shuttles: "",
                walkMinutes: "",
                walkSeconds: "",
              }
            : {}),
        };
      }
      if (action.category === "whtr") {
        return { ...state, isWhtrExempt: !state.isWhtrExempt };
      }
      return state;
    }
    default:
      return state;
  }
}

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
  const [localState, dispatch] = React.useReducer(
    bestScoreReducer,
    initialBestScoreState,
  );
  const {
    pushUps,
    hrPushUps,
    sitUps,
    crunches,
    plankMinutes,
    plankSeconds,
    runMinutes,
    runSeconds,
    shuttles,
    walkMinutes,
    walkSeconds,
    isStrengthExempt,
    isCoreExempt,
    isCardioExempt,
    isWhtrExempt,
  } = localState;

  const setPushUps = React.useCallback(
    (val: string) =>
      dispatch({ type: "SET_FIELD", field: "pushUps", value: val }),
    [],
  );
  const setHrPushUps = React.useCallback(
    (val: string) =>
      dispatch({ type: "SET_FIELD", field: "hrPushUps", value: val }),
    [],
  );
  const setSitUps = React.useCallback(
    (val: string) =>
      dispatch({ type: "SET_FIELD", field: "sitUps", value: val }),
    [],
  );
  const setCrunches = React.useCallback(
    (val: string) =>
      dispatch({ type: "SET_FIELD", field: "crunches", value: val }),
    [],
  );
  const setShuttles = React.useCallback(
    (val: string) =>
      dispatch({ type: "SET_FIELD", field: "shuttles", value: val }),
    [],
  );

  const setPlankMinutes = React.useCallback(
    (val: string) =>
      dispatch({ type: "SET_TIME_FIELD", field: "plankMinutes", value: val }),
    [],
  );
  const setPlankSeconds = React.useCallback(
    (val: string) =>
      dispatch({ type: "SET_TIME_FIELD", field: "plankSeconds", value: val }),
    [],
  );
  const setRunMinutes = React.useCallback(
    (val: string) =>
      dispatch({ type: "SET_TIME_FIELD", field: "runMinutes", value: val }),
    [],
  );
  const setRunSeconds = React.useCallback(
    (val: string) =>
      dispatch({ type: "SET_TIME_FIELD", field: "runSeconds", value: val }),
    [],
  );
  const setWalkMinutes = React.useCallback(
    (val: string) =>
      dispatch({ type: "SET_TIME_FIELD", field: "walkMinutes", value: val }),
    [],
  );
  const setWalkSeconds = React.useCallback(
    (val: string) =>
      dispatch({ type: "SET_TIME_FIELD", field: "walkSeconds", value: val }),
    [],
  );

  const toggleStrengthExempt = React.useCallback(
    () => dispatch({ type: "TOGGLE_EXEMPTION", category: "strength" }),
    [],
  );
  const toggleCoreExempt = React.useCallback(
    () => dispatch({ type: "TOGGLE_EXEMPTION", category: "core" }),
    [],
  );
  const toggleCardioExempt = React.useCallback(
    () => dispatch({ type: "TOGGLE_EXEMPTION", category: "cardio" }),
    [],
  );
  const toggleWhtrExempt = React.useCallback(
    () => dispatch({ type: "TOGGLE_EXEMPTION", category: "whtr" }),
    [],
  );

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

  // Derive static strings for data fetching
  const ageGroupString = useMemo(
    () => (debouncedAge ? getAgeGroupString(Number(debouncedAge)) : null),
    [debouncedAge],
  );
  const capitalizedGender = useMemo(
    () =>
      debouncedGender
        ? debouncedGender.charAt(0).toUpperCase() + debouncedGender.slice(1)
        : "",
    [debouncedGender],
  );

  const { data: ptData, isLoading } = useQuery({
    queryKey: ["ptStandards", ageGroupString, capitalizedGender],
    queryFn: async () => {
      const [
        fetchedStandards,
        passFailStandards,
        walkAltThresholds,
        altitudeCorrections,
      ] = await Promise.all([
        getPtStandards(capitalizedGender, ageGroupString as string),
        getPassFailStandards(capitalizedGender, ageGroupString as string),
        getPtAltitudeWalkThresholds(capitalizedGender),
        getPtAltitudeCorrections(),
      ]);
      return {
        fetchedStandards,
        passFailStandards,
        walkAltThresholds,
        altitudeCorrections,
      };
    },
    enabled: !!ageGroupString && !!capitalizedGender,
    staleTime: Infinity,
  });

  const { scores, bestScore } = useMemo(() => {
    if (!ptData?.fetchedStandards || !debouncedAge || !debouncedGender) {
      return { scores: {}, bestScore: 0 };
    }

    const {
      fetchedStandards,
      passFailStandards,
      walkAltThresholds,
      altitudeCorrections,
    } = ptData;

    const newScores: BestScores = {
      push_ups_1min: isStrengthExempt
        ? "Exempt"
        : getScoreForExercise(fetchedStandards, "push_ups_1min", {
            reps: Number(debouncedPushUps),
          }).points,
      hand_release_pushups_2min: isStrengthExempt
        ? "Exempt"
        : getScoreForExercise(fetchedStandards, "hand_release_pushups_2min", {
            reps: Number(debouncedHrPushUps),
          }).points,
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

    return {
      scores: newScores,
      bestScore: calculateBestScore(
        newScores as Record<string, number | string>,
      ),
    };
  }, [
    ptData,
    ageGroupString,
    capitalizedGender,
    debouncedAge,
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
