/**
 * @file useTimeInput.ts
 * @description This file defines a custom React hook for managing the state of a time input,
 * specifically for minutes and seconds. It provides state variables and handlers that
 * sanitize the input to ensure only numeric characters are accepted.
 */

import { useState } from 'react';

/**
 * A custom hook to manage state for a time input with minutes and seconds fields.
 * @param {string} [initialMinutes=''] - The initial value for the minutes input.
 * @param {string} [initialSeconds=''] - The initial value for the seconds input.
 * @returns An object containing the `minutes` and `seconds` state, and `setMinutes` and `setSeconds` handlers.
 */
export function useTimeInput(initialMinutes: string = '', initialSeconds: string = '') {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  /**
   * Handles changes to the minutes input field.
   * It removes any non-numeric characters from the input.
   * @param {string} text - The raw text from the input field.
   */
  const handleMinutesChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setMinutes(numericValue);
  };

  /**
   * Handles changes to the seconds input field.
   * It removes any non-numeric characters from the input.
   * @param {string} text - The raw text from the input field.
   */
  const handleSecondsChange = (text: string) => {
    // Sanitize the input to allow only numeric characters.
    const numericValue = text.replace(/[^0-9]/g, '');
    setSeconds(numericValue);
  };

  return {
    minutes,
    seconds,
    setMinutes: handleMinutesChange,
    setSeconds: handleSecondsChange,
  };
}