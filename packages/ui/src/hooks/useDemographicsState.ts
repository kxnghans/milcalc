/**
 * @file useDemographicsState.ts
 * @description This file defines a custom React hook for managing the state related to user
 * demographics, including age, gender, and altitude group selection.
 */

import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook to manage the state for the user demographics section.
 * @param {string} [initialAge=''] - The initial value for the age input.
 * @param {string} [initialGender='male'] - The initial selected gender.
 * @param {string} [initialAltitudeGroup='normal'] - The initial selected altitude group.
 * @returns An object containing the state variables (`age`, `gender`, `altitudeGroup`) and their respective setters.
 */
export function useDemographicsState(
  initialAge: string = '', 
  initialGender: string = 'male', 
  initialAltitudeGroup: string = 'normal'
) {
  // State for the user's age.
  const [age, setAge] = useState(initialAge);
  // State for the user's gender.
  const [gender, setGender] = useState(initialGender);
  // State for the selected altitude adjustment group.
  const [altitudeGroup, setAltitudeGroup] = useState(initialAltitudeGroup);
  // State for Waist-to-Height Ratio (WHtR) inputs.
  const [waist, setWaist] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [isHeightInInches, _setIsHeightInInches] = useState(false);

  // Track if the user has manually modified the fields to prevent profile hydration from overwriting their manual input.
  const hasModifiedAge = useRef(false);
  const hasModifiedGender = useRef(false);

  // Hydrate state when initial values change (e.g., after profile loads from SQLite),
  // but only if the user hasn't already manually overridden them.
  useEffect(() => {
    if (initialAge && !hasModifiedAge.current) {
      setAge(initialAge);
    }
  }, [initialAge]);

  useEffect(() => {
    if (initialGender && !hasModifiedGender.current) {
      setGender(initialGender);
    }
  }, [initialGender]);

  const handleSetAge = (newAge: string) => {
    hasModifiedAge.current = true;
    setAge(newAge);
  };

  const handleSetGender = (newGender: string) => {
    hasModifiedGender.current = true;
    setGender(newGender);
  };

  /**
   * Toggles the height input mode and converts existing values.
   */
  const setIsHeightInInches = (toInches: boolean) => {
    if (toInches === isHeightInInches) return;

    if (toInches) {
      // Converting Ft/In -> Inches Only
      const feet = parseInt(heightFeet) || 0;
      const inches = parseInt(heightInches) || 0;
      const totalInches = (feet * 12) + inches;
      setHeightInches(totalInches > 0 ? totalInches.toString() : '');
      setHeightFeet('');
    } else {
      // Converting Inches Only -> Ft/In
      const totalInches = parseInt(heightInches) || 0;
      const feet = Math.floor(totalInches / 12);
      const remainderInches = totalInches % 12;
      setHeightFeet(feet > 0 ? feet.toString() : '');
      setHeightInches(remainderInches > 0 ? remainderInches.toString() : '');
    }
    _setIsHeightInInches(toInches);
  };

  return {
    age,
    setAge: handleSetAge,
    gender,
    setGender: handleSetGender,
    altitudeGroup,
    setAltitudeGroup,
    waist,
    setWaist,
    heightFeet,
    setHeightFeet,
    heightInches,
    setHeightInches,
    isHeightInInches,
    setIsHeightInInches,
  };
}
