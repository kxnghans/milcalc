/**
 * @file useCardioState.ts
 * @description This file defines a custom React hook for managing the state related to the
 * cardio component of the PT calculator. This includes the selected exercise type, performance
 * values, and the exemption status.
 */

import { useState } from "react";

import { useNumericInput } from "./useNumericInput";
import { useTimeInput } from "./useTimeInput";

/**
 * A custom hook to manage the state for the cardio component section.
 * @param {string} [initialComponent='run'] - The initial cardio exercise component to be selected.
 * @param {string} [initialRunMinutes=''] - The initial value for the run minutes input.
 * @param {string} [initialRunSeconds=''] - The initial value for the run seconds input.
 * @param {string} [initialShuttles=''] - The initial value for the shuttle run input.
 * @param {string} [initialWalkMinutes=''] - The initial value for the walk minutes input.
 * @param {string} [initialWalkSeconds=''] - The initial value for the walk seconds input.
 * @returns An object containing all the state variables and their respective setters.
 */
export function useCardioState(
  initialComponent: string = "run",
  initialRunMinutes: string = "",
  initialRunSeconds: string = "",
  initialShuttles: string = "",
  initialWalkMinutes: string = "",
  initialWalkSeconds: string = "",
) {
  // State for the selected cardio exercise component (e.g., 'run', 'shuttles', 'walk').
  const [cardioComponent, setCardioComponent] = useState(initialComponent);
  // State for the minutes part of the run time.
  const {
    minutes: runMinutes,
    setMinutes: setRunMinutes,
    seconds: runSeconds,
    setSeconds: setRunSeconds,
  } = useTimeInput(initialRunMinutes, initialRunSeconds);
  // State for the number of shuttles completed.
  const {
    value: shuttles,
    onChangeText: setShuttles,
    setValue: setShuttlesValue,
  } = useNumericInput(initialShuttles, { max: 100 });
  // State for the minutes part of the walk time.
  const {
    minutes: walkMinutes,
    setMinutes: setWalkMinutes,
    seconds: walkSeconds,
    setSeconds: setWalkSeconds,
  } = useTimeInput(initialWalkMinutes, initialWalkSeconds);
  // State for the exemption status of the component.
  const [isExempt, setIsExempt] = useState(false);

  /**
   * Toggles the exemption status for the cardio component.
   * When exempted, it clears all cardio input values.
   */
  const toggleExempt = () => {
    setIsExempt((current) => {
      const nextIsExempt = !current;
      if (nextIsExempt) {
        setRunMinutes("");
        setRunSeconds("");
        setShuttlesValue("");
        setWalkMinutes("");
        setWalkSeconds("");
      }
      return nextIsExempt;
    });
  };

  return {
    cardioComponent,
    setCardioComponent,
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
    isExempt,
    toggleExempt,
  };
}
