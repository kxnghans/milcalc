/**
 * @file Demographics.tsx
 * @description This file defines a component that groups the age and gender input fields
 * for the demographics section of the calculator.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@repo/ui';
import NumberInput from './NumberInput';
import GenderSelector from './GenderSelector';

/**
 * Props for the Demographics component.
 */
interface DemographicsProps {
  /** The current age value. */
  age: string;
  /** A function to set the age value. */
  setAge: (age: string) => void;
  /** The current gender value ('male' or 'female'). */
  gender: string;
  /** A function to set the gender value. */
  setGender: (gender: string) => void;
}

/**
 * A component that renders the user demographics input section, including age and gender.
 * @param {DemographicsProps} props - The component props.
 * @returns {JSX.Element} The rendered demographics section.
 */
export default function Demographics({ age, setAge, gender, setGender }: DemographicsProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    cardTitle: {
        ...theme.typography.title,
        color: theme.colors.text,
    },
    inlineInputContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
  });

  return (
    <>
      {/* Section Headers */}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 96, marginRight: theme.spacing.m}}>
              <Text style={[styles.cardTitle]}>Age</Text>
          </View>
          <View style={{flex: 1}}>
              <Text style={[styles.cardTitle, {textAlign: 'center'}]}>Gender</Text>
          </View>
      </View>
      {/* Input Fields */}
      <View style={styles.inlineInputContainer}>
          <View style={{width: 96, marginRight: theme.spacing.m}}>
              <NumberInput
                  value={age}
                  onChangeText={setAge}
                  placeholder="--"
                  inputStyle={{paddingVertical: 6}}
              />
          </View>
          <View style={{flex: 1}}>
              <GenderSelector gender={gender} setGender={setGender} />
          </View>
      </View>
    </>
  );
}