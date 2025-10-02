/**
 * @file useStrengthState.ts
 * @description This file defines a custom React hook for managing the state related to the
 * strength component of the PT calculator. This includes the selected exercise type,
 * the number of repetitions, and the exemption status.
 */

import { useState } from 'react';

/**
 * A custom hook to manage the state for the strength component section.
 * @param {string} [initialComponent='push_ups_1min'] - The initial strength exercise component to be selected.
 * @param {string} [initialPushups=''] - The initial value for the push-up repetitions input.
 * @returns An object containing the state variables and their setters.
 */
export function useStrengthState(initialComponent: string = 'push_ups_1min', initialPushups: string = '') {
  // State for the selected strength exercise component (e.g., 'push_ups_1min').
  const [pushupComponent, setPushupComponent] = useState(initialComponent);
  // State for the number of push-ups/reps performed.
  const [pushups, setPushups] = useState(initialPushups);
  // State for the exemption status of the component.
  const [isExempt, setIsExempt] = useState(false);

  /**
   * Toggles the exemption status for the strength component.
   * When exempted, it clears the input value.
   */
  const toggleExempt = () => {
    setIsExempt(current => {
      const nextIsExempt = !current;
      if (nextIsExempt) {
        setPushups('');
      }
      return nextIsExempt;
    });
  };

  return {
    pushupComponent,
    setPushupComponent,
    pushups,
    setPushups,
    isExempt,
    toggleExempt,
  };
}