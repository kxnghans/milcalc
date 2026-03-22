/**
 * @file useDemographicsState.ts
 * @description This file defines a custom React hook for managing the state related to user
 * demographics, including age, gender, and altitude group selection.
 */

import { useEffect, useRef } from 'react';
import { useCalculatorState } from '../contexts/CalculatorStateContext';

/**
 * A custom hook to manage the state for the user demographics section.
 * @param {string} [initialAge=''] - The initial value for the age input.
 * @param {string} [initialGender='male'] - The initial selected gender.
 * @param {string} [initialAltitudeGroup='normal'] - The initial selected altitude group.
 * @returns An object containing the state variables and their respective setters.
 */
export function useDemographicsState(
  initialAge: string = '', 
  initialGender: string = 'male', 
  initialAltitudeGroup: string = 'normal'
) {
  const { ptDemographics, setPtDemographics } = useCalculatorState();

  // Track if the user has manually modified the fields to prevent profile hydration from overwriting their manual input.
  const hasModifiedAge = useRef(false);
  const hasModifiedGender = useRef(false);

  // Hydrate state when initial values change (e.g., after profile loads from SQLite),
  // but only if the user hasn't already manually overridden them and the current value is empty or different from default.
  useEffect(() => {
    if (initialAge && !hasModifiedAge.current && ptDemographics.age === '') {
      setPtDemographics({ age: initialAge });
    }
  }, [initialAge, ptDemographics.age, setPtDemographics]);

  useEffect(() => {
    if (initialGender && !hasModifiedGender.current && ptDemographics.gender !== initialGender) {
      setPtDemographics({ gender: initialGender });
    }
  }, [initialGender, ptDemographics.gender, setPtDemographics]);

  useEffect(() => {
    if (initialAltitudeGroup && initialAltitudeGroup !== 'normal' && ptDemographics.altitudeGroup === 'normal') {
      setPtDemographics({ altitudeGroup: initialAltitudeGroup });
    }
  }, [initialAltitudeGroup, ptDemographics.altitudeGroup, setPtDemographics]);

  const handleSetAge = (newAge: string) => {
    hasModifiedAge.current = true;
    setPtDemographics({ age: newAge });
  };

  const handleSetGender = (newGender: string) => {
    hasModifiedGender.current = true;
    setPtDemographics({ gender: newGender });
  };

  const setAltitudeGroup = (newGroup: string) => {
    setPtDemographics({ altitudeGroup: newGroup });
  };

  const setWaist = (newWaist: string) => {
    setPtDemographics({ waist: newWaist });
  };

  const setHeightFeet = (newFeet: string) => {
    setPtDemographics({ heightFeet: newFeet });
  };

  const setHeightInches = (newInches: string) => {
    setPtDemographics({ heightInches: newInches });
  };

  /**
   * Toggles the height input mode and converts existing values.
   */
  const setIsHeightInInches = (toInches: boolean) => {
    if (toInches === ptDemographics.isHeightInInches) return;

    if (toInches) {
      // Converting Ft/In -> Inches Only
      const feet = parseInt(ptDemographics.heightFeet) || 0;
      const inches = parseInt(ptDemographics.heightInches) || 0;
      const totalInches = (feet * 12) + inches;
      setPtDemographics({
        isHeightInInches: true,
        heightInches: totalInches > 0 ? totalInches.toString() : '',
        heightFeet: '',
      });
    } else {
      // Converting Inches Only -> Ft/In
      const totalInches = parseInt(ptDemographics.heightInches) || 0;
      const feet = Math.floor(totalInches / 12);
      const remainderInches = totalInches % 12;
      setPtDemographics({
        isHeightInInches: false,
        heightFeet: feet > 0 ? feet.toString() : '',
        heightInches: remainderInches > 0 ? remainderInches.toString() : '',
      });
    }
  };

  const calculatedWhtr = (() => {
    const waistNum = parseFloat(ptDemographics.waist) || 0;
    let heightNum = 0;
    
    if (ptDemographics.isHeightInInches) {
        heightNum = parseFloat(ptDemographics.heightInches) || 0;
    } else {
        const feet = parseFloat(ptDemographics.heightFeet) || 0;
        const inches = parseFloat(ptDemographics.heightInches) || 0;
        heightNum = (feet * 12) + inches;
    }
    
    if (waistNum > 0 && heightNum > 0) {
        return Math.round((waistNum / heightNum) * 100) / 100;
    }
    return 0;
  })();

  return {
    age: ptDemographics.age,
    setAge: handleSetAge,
    gender: ptDemographics.gender,
    setGender: handleSetGender,
    altitudeGroup: ptDemographics.altitudeGroup,
    setAltitudeGroup,
    waist: ptDemographics.waist,
    setWaist,
    heightFeet: ptDemographics.heightFeet,
    setHeightFeet,
    heightInches: ptDemographics.heightInches,
    setHeightInches,
    isHeightInInches: ptDemographics.isHeightInInches,
    setIsHeightInInches,
    calculatedWhtr,
  };
}
