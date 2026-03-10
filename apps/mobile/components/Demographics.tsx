/**
 * @file Demographics.tsx
 * @description This file defines a component that groups the age and gender input fields
 * for the demographics section of the calculator.
 */

import React from 'react';
import { View, Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
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
    /** Optional custom styles for the input field. */
    inputStyle?: StyleProp<TextStyle>;
}

/**
 * A component that renders the user demographics input section, including age and gender.
 * @param {DemographicsProps} props - The component props.
 * @returns {JSX.Element} The rendered demographics section.
 */
export default function Demographics({ age, setAge, gender, setGender, inputStyle }: DemographicsProps) {
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        cardTitle: {
            ...theme.typography.bodybold,
            color: theme.colors.text,
        },
        centeredTitle: {
            textAlign: 'center',
        },
        inlineInputContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.s,
        },
        ageHeaderContainer: {
            flex: 1,
            marginRight: theme.spacing.m,
        },
        genderHeaderContainer: {
            flex: 3,
        },
        ageInputContainer: {
            flex: 1,
            marginRight: theme.spacing.m,
        },
        genderSelectorContainer: {
            flex: 3,
        },
        numberInput: {
            paddingVertical: 0, // Reset to allow container to control height
        },
        ageInputStyle: {
            marginVertical: theme.spacing.s, // Match NeumorphicOutset default margins of StyledButton
        }
    });

    return (
        <>
            {/* Section Headers */}
            <View style={styles.headerRow}>
                <View style={styles.ageHeaderContainer}>
                    <Text style={styles.cardTitle}>Age</Text>
                </View>
                <View style={styles.genderHeaderContainer}>
                    <Text style={[styles.cardTitle, styles.centeredTitle]}>Gender</Text>
                </View>
            </View>
            {/* Input Fields */}
            <View style={styles.inlineInputContainer}>
                <View style={styles.ageInputContainer}>
                    <NumberInput
                        value={age}
                        onChangeText={setAge}
                        placeholder="--"
                        inputStyle={[styles.numberInput, inputStyle]}
                        style={styles.ageInputStyle}
                    />
                </View>
                <View style={styles.genderSelectorContainer}>
                    <GenderSelector gender={gender} setGender={setGender} />
                </View>
            </View>
        </>
    );
}
