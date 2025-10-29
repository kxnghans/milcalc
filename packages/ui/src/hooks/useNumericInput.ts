/**
 * @file useNumericInput.ts
 * @description This file defines a custom React hook for managing the state of an input field
 * that should only accept numeric characters.
 */

import { useState } from 'react';

/**
 * A custom hook to manage state for a numeric input field.
 * It provides a sanitized value and a change handler.
 * @param {string} [initialValue=''] - The initial value for the input.
 * @returns An object containing the current `value`, the `onChangeText` handler, and the raw `setValue` function.
 */
export function useNumericInput(initialValue: string = '') {
  const [value, setValue] = useState(initialValue);

  /**
   * A change handler for a text input that sanitizes the input to allow only numeric characters.
   * @param {string} text - The raw text from the input field.
   */
  const handleChangeText = (text: string) => {
    // Use a regular expression to remove any characters that are not digits (0-9).
    const numericValue = text.replace(/[^0-9]/g, '');
    setValue(numericValue);
  };

  return {
    value,
    onChangeText: handleChangeText,
    setValue, // Also expose the raw setValue for direct manipulation if needed (e.g., for resetting the field).
  };
}