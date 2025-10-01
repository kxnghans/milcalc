/**
 * @file useCardioState.ts
 * @description This file defines a custom React hook for managing the state related to the
 * cardio component of the PT calculator. This includes the selected exercise type and the
 * performance values for the run, shuttle run (HAMR), and walk events.
 */

import { useState } from 'react';

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
  initialComponent: string = 'run',
  initialRunMinutes: string = '',
  initialRunSeconds: string = '',
  initialShuttles: string = '',
  initialWalkMinutes: string = '',
  initialWalkSeconds: string = ''
) {
  // State for the selected cardio exercise component (e.g., 'run', 'shuttles', 'walk').
  const [cardioComponent, setCardioComponent] = useState(initialComponent);
  // State for the minutes part of the run time.
  const [runMinutes, setRunMinutes] = useState(initialRunMinutes);
  // State for the seconds part of the run time.
  const [runSeconds, setRunSeconds] = useState(initialRunSeconds);
  // State for the number of shuttles completed.
  const [shuttles, setShuttles] = useState(initialShuttles);
  // State for the minutes part of the walk time.
  const [walkMinutes, setWalkMinutes] = useState(initialWalkMinutes);
  // State for the seconds part of the walk time.
  const [walkSeconds, setWalkSeconds] = useState(initialWalkSeconds);

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
  };
}