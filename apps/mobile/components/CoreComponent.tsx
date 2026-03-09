/**
 * @file CoreComponent.tsx
 * @description This file defines the UI component for the core section of the PT calculator.
 * It allows users to select from different core exercises (sit-ups, crunches, plank)
 * and input their performance.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { NeumorphicOutset, ProgressBar, SegmentedSelector, useTheme, Icon, ICONS, MASCOT_URLS } from '@repo/ui';
import NumberInput from './NumberInput';
import TimeInput from './TimeInput';

interface CoreComponentProps {
    showProgressBars: boolean;
    minMax: { core: { min: number; max: number } };
    coreComponent: string;
    setCoreComponent: (val: string) => void;
    situps: string;
    setSitups: (val: string) => void;
    reverseCrunches: string;
    setReverseCrunches: (val: string) => void;
    plankMinutes: string;
    setPlankMinutes: (val: string) => void;
    plankSeconds: string;
    setPlankSeconds: (val: string) => void;
    ninetyPercentileThreshold: number;
    isExempt: boolean;
    toggleExempt: () => void;
    openDetailModal: (key: string, mascot?: ImageSourcePropType) => void;
    score: { totalScore: number; coreScore: number | string; isPass: boolean };
}

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
    openDetailModal,
    score,
}: CoreComponentProps) {
    const { theme } = useTheme();
    const styles = StyleSheet.create({
        cardTitle: {
            ...theme.typography.title,
            color: theme.colors.text,
            marginLeft: theme.spacing.s,
            marginVertical: theme.spacing.s,
            marginRight: theme.spacing.m,
        },
        componentHeader: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        exerciseBlock: {
            justifyContent: 'center',
        },
        helpIcon: {
            margin: theme.spacing.s,
        },
        progressBarContainer: {
            flex: 1,
        },
        inputMargin: {
            marginHorizontal: theme.spacing.s,
            marginTop: theme.spacing.xs,
        }
    });

    const getMascot = (): ImageSourcePropType => {
        if (coreComponent === "sit_ups_1min" || coreComponent === "cross_leg_reverse_crunch_2min") {
            return { uri: MASCOT_URLS.CRUNCH };
        } else if (coreComponent === "forearm_plank_time") {
            return { uri: MASCOT_URLS.PLANK };
        }
        return { uri: MASCOT_URLS.CRUNCH }; // Default mascot
    };

    return (
        <View>
            
            <View style={styles.exerciseBlock}>
                <View style={styles.componentHeader}>
                    <TouchableOpacity onPress={() => openDetailModal(coreComponent, getMascot())}>
                        <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} style={styles.helpIcon} />
                    </TouchableOpacity>
                    <Text style={styles.cardTitle}>Core</Text>
                    {/* Conditionally render the progress bar based on the showProgressBars prop. */}
                    {showProgressBars && (() => {

                        // Special handling for the forearm plank, which is time-based.
                        if (coreComponent === "forearm_plank_time") {
                            const plankTimeInSeconds = (parseInt(plankMinutes) || 0) * 60 + (parseInt(plankSeconds) || 0);
                            return (
                                <View style={styles.progressBarContainer}>
                                    <NeumorphicOutset>
                                        <ProgressBar
                                            value={plankTimeInSeconds}
                                            passThreshold={minMax.core.min}
                                            maxPointsThreshold={minMax.core.max}
                                            ninetyPercentileThreshold={ninetyPercentileThreshold}
                                            valueIsTime={true}
                                            score={typeof score.coreScore === 'number' ? score.coreScore : 0}
                                            maxScore={20}
                                        />
                                    </NeumorphicOutset>
                                </View>
                            );
                        }
                        // Default progress bar for rep-based exercises.
                        return (
                            <View style={styles.progressBarContainer}>
                                <NeumorphicOutset>
                                    <ProgressBar
                                        value={parseInt(coreComponent === "sit_ups_1min" ? situps : reverseCrunches) || 0}
                                        passThreshold={minMax.core.min}
                                        maxPointsThreshold={minMax.core.max}
                                        ninetyPercentileThreshold={ninetyPercentileThreshold}
                                        score={typeof score.coreScore === 'number' ? score.coreScore : 0}
                                        maxScore={20}
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
                        style={styles.inputMargin}
                        onToggleExempt={toggleExempt}
                        isExempt={isExempt}
                    />
                )}
                {coreComponent === "cross_leg_reverse_crunch_2min" && (
                    <NumberInput
                        value={reverseCrunches}
                        onChangeText={setReverseCrunches}
                        placeholder="Enter crunch count"
                        style={styles.inputMargin}
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
                        style={styles.inputMargin}
                        onToggleExempt={toggleExempt}
                        isExempt={isExempt}
                    />
                )}
            </View>
        </View>
    );
}
