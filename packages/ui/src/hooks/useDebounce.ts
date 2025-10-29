/**
 * @file useDebounce.ts
 * @description This file defines a generic custom React hook for debouncing a value.
 * Debouncing is a technique to limit the rate at which a function gets called.
 * In this app, it's used to prevent expensive calculations from running on every keystroke.
 */

import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces a value. It will only update the returned value after a specified delay
 * has passed without the original value changing.
 * @template T The type of the value to be debounced.
 * @param {T} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value.
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer that will update the debounced value after the specified delay.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // This cleanup function will be called if the `value` or `delay` changes before the timer fires.
    // It clears the previous timer, effectively resetting the debounce period.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if the value or delay changes.

  return debouncedValue;
}