/**
 * @file useNumericInput.ts
 * @description This file defines a custom React hook for managing the state of an input field
 * that should only accept numeric characters.
 */

import * as Haptics from "expo-haptics";
import { useState } from "react";

/**
 * Options for numeric input validation.
 */
interface NumericInputOptions {
  max?: number;
  allowDecimal?: boolean;
  useHaptics?: boolean;
}

/**
 * A custom hook to manage state for a numeric input field.
 * It provides a sanitized value and a change handler with optional validation.
 * @param {string} initialValue - The initial value for the input.
 * @param {NumericInputOptions} options - Validation options (max, allowDecimal, useHaptics).
 * @returns An object containing the current `value`, the `onChangeText` handler, and the raw `setValue` function.
 */
export function useNumericInput(
  initialValue: string = "",
  options: NumericInputOptions = {},
) {
  const [value, setValue] = useState(initialValue);
  const { max, allowDecimal = false, useHaptics = true } = options;

  const triggerHaptic = () => {
    if (useHaptics) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  /**
   * A change handler for a text input that sanitizes and validates the input.
   * @param {string} text - The raw text from the input field.
   */
  const handleChangeText = (text: string) => {
    // Sanitize input: allow digits, and optionally a single decimal point if allowed.
    let sanitized = allowDecimal
      ? text.replace(/[^0-9.]/g, "")
      : text.replace(/[^0-9]/g, "");

    // If decimal is allowed, ensure only one exists.
    if (allowDecimal && sanitized.split(".").length > 2) {
      const parts = sanitized.split(".");
      sanitized = parts[0] + "." + parts.slice(1).join("");
    }

    if (sanitized === "") {
      setValue("");
      return;
    }

    // Double check the value against max if provided.
    const numericVal = parseFloat(sanitized);
    if (max !== undefined && !isNaN(numericVal) && numericVal > max) {
      triggerHaptic();
      return;
    }

    setValue(sanitized);
  };

  return {
    value,
    onChangeText: handleChangeText,
    setValue,
  };
}
