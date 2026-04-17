/**
 * @file useDemographicsState.ts
 * @description This file defines a custom React hook for managing the state related to user
 * demographics, including age, gender, and altitude group selection.
 */

import { useEffect, useRef } from "react";
import { Alert } from "react-native";

import { useCalculatorState } from "../contexts/CalculatorStateContext";

/**
 * A custom hook to manage the state for the user demographics section.
 * @param {string} [initialAge=''] - The initial value for the age input.
 * @param {string} [initialGender='male'] - The initial selected gender.
 * @param {string} [initialAltitudeGroup='normal'] - The initial selected altitude group.
 * @param {Function} [onSaveToProfile] - Optional callback to save demographic changes to the user's permanent profile.
 * @returns An object containing the state variables and their respective setters.
 */
export function useDemographicsState(
  initialAge: string = "",
  initialGender: string = "male",
  initialAltitudeGroup: string = "normal",
  onSaveToProfile?: (data: { age?: string; gender?: string }) => void,
) {
  const { ptDemographics, setPtDemographics } = useCalculatorState();

  // Track if the user has manually modified the fields to prevent profile hydration from overwriting their manual input.
  const hasModifiedAge = useRef(false);
  const hasModifiedGender = useRef(false);

  // Hydrate state when initial values change (e.g., after profile loads from SQLite),
  // but only if the user hasn't already manually overridden them and the current value is empty or different from default.
  useEffect(() => {
    if (initialAge && !hasModifiedAge.current && ptDemographics.age === "") {
      setPtDemographics({ age: initialAge });
    }
  }, [initialAge, ptDemographics.age, setPtDemographics]);

  useEffect(() => {
    if (
      initialGender &&
      !hasModifiedGender.current &&
      ptDemographics.gender !== initialGender
    ) {
      setPtDemographics({ gender: initialGender });
    }
  }, [initialGender, ptDemographics.gender, setPtDemographics]);

  useEffect(() => {
    if (
      initialAltitudeGroup &&
      initialAltitudeGroup !== "normal" &&
      ptDemographics.altitudeGroup === "normal"
    ) {
      setPtDemographics({ altitudeGroup: initialAltitudeGroup });
    }
  }, [initialAltitudeGroup, ptDemographics.altitudeGroup, setPtDemographics]);

  /**
   * Triggers a native alert asking if the user wants to save the demographic change to their profile.
   */
  const promptSaveToProfile = (type: "age" | "gender", value: string) => {
    if (!onSaveToProfile) return;

    // Check if the corresponding profile field is currently empty
    // We only prompt if the profile is empty, to respect the "leave profile as is" unless assigned mandate.
    const isProfileEmpty = type === "age" ? !initialAge : false; // gender defaults to 'male', so it's technically never empty.

    if (isProfileEmpty) {
      Alert.alert(
        "Save to Profile?",
        `Would you like to save this ${type} to your permanent profile?`,
        [
          { text: "Not Now", style: "cancel" },
          {
            text: "Save",
            onPress: () => onSaveToProfile({ [type]: value }),
          },
        ],
      );
    }
  };

  const handleSetAge = (newAge: string) => {
    hasModifiedAge.current = true;
    setPtDemographics({ age: newAge });

    // If a valid age is entered and profile is empty, prompt to save
    if (newAge.length >= 2 && !initialAge) {
      promptSaveToProfile("age", newAge);
    }
  };

  const handleSetGender = (newGender: string) => {
    hasModifiedGender.current = true;
    setPtDemographics({ gender: newGender });

    // Gender usually has a default, but if we haven't modified it yet and it's different from profile, we might prompt
    // However, the user said "unless it is empty then use the native alert", so for gender we might skip prompt
    // unless we add a 'none' state to profile gender, which we shouldn't do now.
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
      const totalInches = feet * 12 + inches;
      setPtDemographics({
        isHeightInInches: true,
        heightInches: totalInches > 0 ? totalInches.toString() : "",
        heightFeet: "",
      });
    } else {
      // Converting Inches Only -> Ft/In
      const totalInches = parseInt(ptDemographics.heightInches) || 0;
      const feet = Math.floor(totalInches / 12);
      const remainderInches = totalInches % 12;
      setPtDemographics({
        isHeightInInches: false,
        heightFeet: feet > 0 ? feet.toString() : "",
        heightInches: remainderInches > 0 ? remainderInches.toString() : "",
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
      heightNum = feet * 12 + inches;
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
