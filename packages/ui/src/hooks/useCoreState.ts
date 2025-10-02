/**
 * @file useCoreState.ts
 * @description This file defines a custom React hook for managing the state related to the
 * core component of the PT calculator. This includes the selected exercise type, performance
 * values, and the exemption status.
 */

import { useState } from 'react';

/**
 * A custom hook to manage the state for the core component section.
 * @param {string} [initialComponent='sit_ups_1min'] - The initial core exercise component to be selected.
 * @param {string} [initialSitups=''] - The initial value for the sit-ups input.
 * @param {string} [initialCrunches=''] - The initial value for the reverse crunches input.
 * @param {string} [initialPlankMinutes=''] - The initial value for the plank minutes input.
 * @param {string} [initialPlankSeconds=''] - The initial value for the plank seconds input.
 * @returns An object containing all the state variables and their respective setters.
 */
export function useCoreState(
  initialComponent: string = 'sit_ups_1min',
  initialSitups: string = '',
  initialCrunches: string = '',
  initialPlankMinutes: string = '',
  initialPlankSeconds: string = ''
) {
  // State for the selected core exercise component (e.g., 'sit_ups_1min').
  const [coreComponent, setCoreComponent] = useState(initialComponent);
  // State for the number of sit-ups.
  const [situps, setSitups] = useState(initialSitups);
  // State for the number of reverse crunches.
  const [reverseCrunches, setReverseCrunches] = useState(initialCrunches);
  // State for the minutes part of the plank time.
  const [plankMinutes, setPlankMinutes] = useState(initialPlankMinutes);
  // State for the seconds part of the plank time.
  const [plankSeconds, setPlankSeconds] = useState(initialPlankSeconds);
  // State for the exemption status of the component.
  const [isExempt, setIsExempt] = useState(false);

  /**
   * Toggles the exemption status for the core component.
   * When exempted, it clears all core input values.
   */
  const toggleExempt = () => {
    setIsExempt(current => {
      const nextIsExempt = !current;
      if (nextIsExempt) {
        setSitups('');
        setReverseCrunches('');
        setPlankMinutes('');
        setPlankSeconds('');
      }
      return nextIsExempt;
    });
  };

  return {
    coreComponent,
    setCoreComponent,
    situps,
    setSitups,
    reverseCrunches,
    setReverseCrunches,
    plankMinutes,
    setPlankMinutes,
    plankSeconds,
    setPlankSeconds,
    isExempt,
    toggleExempt,
  };
}