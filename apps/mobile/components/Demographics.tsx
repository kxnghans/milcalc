/**
 * @file Demographics.tsx
 * @description This file defines a component that groups the age, gender, waist, and height input fields
 * for the demographics section of the calculator.
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, StyleProp, TextStyle, TextInput } from 'react-native';
import { useTheme, SlideToggle } from '@repo/ui';
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
    /** Optional Waist input for WHtR calculation */
    waist?: string;
    /** Optional function to set the Waist value */
    setWaist?: (waist: string) => void;
    /** Optional Height (Feet) input */
    heightFeet?: string;
    /** Optional function to set the Height (Feet) value */
    setHeightFeet?: (feet: string) => void;
    /** Optional Height (Inches) input */
    heightInches?: string;
    /** Optional function to set the Height (Inches) value */
    setHeightInches?: (inches: string) => void;
    /** Optional flag to toggle between Feet/Inches vs Inches Only */
    isHeightInInches?: boolean;
    /** Optional function to toggle Height input mode */
    setIsHeightInInches?: (val: boolean) => void;
}

/**
 * A component that renders the user demographics input section, including age, gender, and WHtR fields.
 * @param {DemographicsProps} props - The component props.
 * @returns {JSX.Element} The rendered demographics section.
 */
export default function Demographics({ 
    age, setAge, gender, setGender, inputStyle,
    waist, setWaist, heightFeet, setHeightFeet, heightInches, setHeightInches, isHeightInInches, setIsHeightInInches
}: DemographicsProps) {
    const { theme } = useTheme();
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const waistRef = useRef<TextInput>(null);
    const heightFeetRef = useRef<TextInput>(null);
    const heightInchesRef = useRef<TextInput>(null);
    const heightTotalRef = useRef<TextInput>(null);

    const isInchesOnly = !!isHeightInInches;
    const waistFlex = 1;
    const heightFlex = isInchesOnly ? 1 : 2;
    const toggleFlex = 0.5;

    const styles = StyleSheet.create({
        cardTitle: {
            ...theme.typography.bodybold,
            color: theme.colors.text,
            marginBottom: theme.spacing.s,
            textAlign: 'center',
        },
        inlineInputContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.m,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.m,
        },
        ageHeaderContainer: {
            flex: 1,
        },
        genderHeaderContainer: {
            flex: 3,
        },
        waistHeaderContainer: {
            flex: waistFlex,
        },
        heightHeaderContainer: {
            flex: heightFlex,
        },
        toggleHeaderContainer: {
            flex: toggleFlex,
        },
        ageInputContainer: {
            flex: 1,
        },
        genderSelectorContainer: {
            flex: 3,
        },
        numberInput: {
            paddingVertical: 0, 
            textAlign: 'center',
        },
        ageInputStyle: {
            marginVertical: 0,
            width: '100%',
        },
        waistInputContainer: {
            flex: waistFlex,
        },
        heightColumnContainer: {
            flex: heightFlex,
        },
        toggleInputContainer: {
            flex: toggleFlex,
            alignItems: 'center',
        },
        heightInputContainer: {
            flexDirection: 'row',
            gap: theme.spacing.xs,
            flex: 1,
        },
        whtrContainer: {
            marginTop: theme.spacing.m,
        },
        toggleLabel: {
            ...theme.typography.bodybold,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: theme.spacing.s,
        }
    });

    const formatFeet = (val: string | undefined) => {
        if (!val) return '';
        return val + "'";
    };

    const formatInches = (val: string | undefined, pad: boolean = false) => {
        if (!val) return '';
        let display = val;
        if (pad && val.length === 1) {
            display = '0' + val;
        }
        return display + '"';
    };

    const handleWaistChange = (val: string) => {
        if (setWaist) {
            setWaist(val);
            if (val.length === 2) {
                if (isInchesOnly) {
                    heightTotalRef.current?.focus();
                } else {
                    heightFeetRef.current?.focus();
                }
            }
        }
    };

    const handleHeightFeetChange = (val: string) => {
        if (setHeightFeet) {
            setHeightFeet(val);
            if (val.length === 1) {
                heightInchesRef.current?.focus();
            }
        }
    };

    const showWhtr = setWaist && setHeightFeet && setHeightInches && setIsHeightInInches;

    return (
        <View>
            {/* Row 1: Age and Gender Labels */}
            <View style={styles.headerRow}>
                <View style={styles.ageHeaderContainer}>
                    <Text style={styles.cardTitle}>Age</Text>
                </View>
                <View style={styles.genderHeaderContainer}>
                    <Text style={styles.cardTitle}>Gender</Text>
                </View>
            </View>

            {/* Row 1: Age and Gender Inputs */}
            <View style={styles.inlineInputContainer}>
                <View style={styles.ageInputContainer}>
                    <NumberInput
                        value={age}
                        onChangeText={setAge}
                        placeholder="--"
                        inputStyle={[styles.numberInput, inputStyle]}
                        style={styles.ageInputStyle}
                        selectTextOnFocus={true}
                    />
                </View>
                <View style={styles.genderSelectorContainer}>
                    <GenderSelector gender={gender} setGender={setGender} />
                </View>
            </View>

            {/* Row 2: WHtR Labels and Inputs (Optional) */}
            {showWhtr && (
                <View style={styles.whtrContainer}>
                    <View style={styles.headerRow}>
                        <View style={styles.waistHeaderContainer}>
                            <Text style={styles.cardTitle}>Waist</Text>
                        </View>
                        <View style={styles.heightHeaderContainer}>
                            <Text style={styles.cardTitle}>Height</Text>
                        </View>
                        <View style={styles.toggleHeaderContainer}>
                            <Text style={styles.toggleLabel}>
                                {isHeightInInches ? "In" : "Ft/In"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.inlineInputContainer}>
                        <View style={styles.waistInputContainer}>
                            <NumberInput
                                ref={waistRef}
                                value={focusedField === 'waist' ? (waist || '') : formatInches(waist)}
                                onChangeText={handleWaistChange}
                                onFocus={() => setFocusedField('waist')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="inches"
                                inputStyle={[styles.numberInput, inputStyle]}
                                style={styles.ageInputStyle}
                                selectTextOnFocus={true}
                            />
                        </View>
                        <View style={styles.heightColumnContainer}>
                            {isHeightInInches ? (
                                <NumberInput
                                    ref={heightTotalRef}
                                    value={focusedField === 'heightTotal' ? (heightInches || '') : formatInches(heightInches)}
                                    onChangeText={setHeightInches}
                                    onFocus={() => setFocusedField('heightTotal')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="inches"
                                    inputStyle={[styles.numberInput, inputStyle]}
                                    style={styles.ageInputStyle}
                                    selectTextOnFocus={true}
                                />
                            ) : (
                                <View style={styles.heightInputContainer}>
                                    <View style={{ flex: 1 }}>
                                        <NumberInput
                                            ref={heightFeetRef}
                                            value={focusedField === 'heightFeet' ? (heightFeet || '') : formatFeet(heightFeet)}
                                            onChangeText={handleHeightFeetChange}
                                            onFocus={() => setFocusedField('heightFeet')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="feet"
                                            inputStyle={[styles.numberInput, inputStyle]}
                                            style={styles.ageInputStyle}
                                            selectTextOnFocus={true}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <NumberInput
                                            ref={heightInchesRef}
                                            value={focusedField === 'heightInches' ? (heightInches || '') : formatInches(heightInches, true)}
                                            onChangeText={setHeightInches}
                                            onFocus={() => setFocusedField('heightInches')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="inches"
                                            inputStyle={[styles.numberInput, inputStyle]}
                                            style={styles.ageInputStyle}
                                            selectTextOnFocus={true}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                        <View style={styles.toggleInputContainer}>
                            <SlideToggle 
                                value={isHeightInInches || false} 
                                onValueChange={setIsHeightInInches} 
                                label="" 
                            />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

