/**
 * @file useDemographicsState.ts
 * @description This file defines a custom React hook for managing the state related to user
 * demographics, including age, gender, and altitude group selection.
 */

import { useState } from 'react';

/**
 * A custom hook to manage the state for the user demographics section.
 * @param {string} [initialAge=''] - The initial value for the age input.
 * @param {string} [initialGender='male'] - The initial selected gender.
 * @param {string} [initialAltitudeGroup='normal'] - The initial selected altitude group.
 * @returns An object containing the state variables (`age`, `gender`, `altitudeGroup`) and their respective setters.
 */
export function useDemographicsState(initialAge: string = '', initialGender: string = 'male', initialAltitudeGroup: string = 'normal') {
  // State for the user's age.
  const [age, setAge] = useState(initialAge);
  // State for the user's gender.
  const [gender, setGender] = useState(initialGender);
  // State for the selected altitude adjustment group.
  const [altitudeGroup, setAltitudeGroup] = useState(initialAltitudeGroup);

  return {
    age,
    setAge,
    gender,
    setGender,
    altitudeGroup,
    setAltitudeGroup,
  };
}