/**
 * @file CoreComponent.tsx
 * @description This file defines the UI component for the core section of the PT calculator.
 * It allows users to select from different core exercises (sit-ups, crunches, plank)
 * and input their performance.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, NeumorphicOutset, ProgressBar, SegmentedSelector, useTheme, Icon, ICONS } from '@repo/ui';
import NumberInput from './NumberInput';
import TimeInput from './TimeInput';

/**
 * A component that renders the core section of the PT calculator.
 * It handles multiple exercise types (rep-based and time-based) and conditionally
 * renders the appropriate input fields and progress bar.
 * @param {object} props - The component props.
 * @returns {JSX.Element} The rendered core component section.
 */
export default function CoreComponent({ 
    showProgressBars,
    minMax,
    coreComponent,
    setCoreComponent,
    situps,
    setSitups,
    reverseCrunches,
    setReverseCrunches,
    plankMinutes,
    setPlankMinutes,
    plankSeconds,
    setPlankSeconds,
    ninetyPercentileThreshold,
    isExempt,
    toggleExempt,
}) {
    const { theme, isDarkMode } = useTheme();
    const styles = StyleSheet.create({
        cardTitle: {
            ...theme.typography.title,
            color: theme.colors.text,
        },
        separator: {
            height: 1,
            backgroundColor: theme.colors.border,
            marginVertical: theme.spacing.s,
        },
        componentHeader: {
            flexDirection: 'row',
            alignItems: 'center',
        },

        exerciseBlock: {
            justifyContent: 'center',
        },
    });

    return (
        <View>
            
            <View style={styles.exerciseBlock}>
                <View style={styles.componentHeader}>
                    <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} style={{ margin: theme.spacing.s }} />
                    <Text style={[styles.cardTitle, {marginLeft: theme.spacing.s, marginVertical: theme.spacing.s, marginRight: theme.spacing.m}]}>Core</Text>
                    {/* Conditionally render the progress bar based on the showProgressBars prop. */}
                    {showProgressBars && (() => {

                        // Special handling for the forearm plank, which is time-based.
                        if (coreComponent === "forearm_plank_time") {
                            const plankTimeInSeconds = (parseInt(plankMinutes) || 0) * 60 + (parseInt(plankSeconds) || 0);
                            return (
                                <View style={{ flex: 1 }}>
                                    <NeumorphicOutset>
                                        <ProgressBar
                                            value={plankTimeInSeconds}
                                            passThreshold={minMax.core.min}
                                            maxPointsThreshold={minMax.core.max}
                                            ninetyPercentileThreshold={ninetyPercentileThreshold}
                                            valueIsTime={true}
                                        />
                                    </NeumorphicOutset>
                                </View>
                            );
                        }
                        // Default progress bar for rep-based exercises.
                        return (
                            <View style={{ flex: 1 }}>
                                <NeumorphicOutset>
                                    <ProgressBar
                                        value={parseInt(coreComponent === "sit_ups_1min" ? situps : reverseCrunches) || 0}
                                        passThreshold={minMax.core.min}
                                        maxPointsThreshold={minMax.core.max}
                                        ninetyPercentileThreshold={ninetyPercentileThreshold}
                                    />
                                </NeumorphicOutset>
                            </View>
                        );
                    })()}
                </View>
                <SegmentedSelector
                    options={[
                        { label: "1-Min Sit-ups", value: "sit_ups_1min" },
                        { label: "2-Min CL Crunch", value: "cross_leg_reverse_crunch_2min" },
                        { label: "Forearm Planks", value: "forearm_plank_time" },
                    ]}
                    selectedValues={isExempt ? [] : [coreComponent]}
                    onValueChange={setCoreComponent}
                />
                {/* Conditionally render the correct input based on the selected core component. */}
                {coreComponent === "sit_ups_1min" && (
                    <NumberInput
                        value={situps}
                        onChangeText={setSitups}
                        placeholder="Enter sit-up count"
                        style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xs }}
                        disabled={isExempt}
                        onToggleExempt={toggleExempt}
                        isExempt={isExempt}
                    />
                )}
                {coreComponent === "cross_leg_reverse_crunch_2min" && (
                    <NumberInput
                        value={reverseCrunches}
                        onChangeText={setReverseCrunches}
                        placeholder="Enter crunch count"
                        style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xs }}
                        disabled={isExempt}
                        onToggleExempt={toggleExempt}
                        isExempt={isExempt}
                    />
                )}
                {coreComponent === "forearm_plank_time" && (
                    <TimeInput
                        minutes={plankMinutes}
                        setMinutes={setPlankMinutes}
                        seconds={plankSeconds}
                        setSeconds={setPlankSeconds}
                        minutesPlaceholder="Minutes"
                        secondsPlaceholder="Seconds"
                        style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xs }}
                        disabled={isExempt}
                        onToggleExempt={toggleExempt}
                        isExempt={isExempt}
                    />
                )}
            </View>
        </View>
    );
};