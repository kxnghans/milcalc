/**
 * @file StrengthComponent.tsx
 * @description This file defines the UI component for the strength section of the PT calculator.
 * It includes options for different strength exercises and an input for the number of repetitions.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { NeumorphicOutset, ProgressBar, SegmentedSelector, useTheme, Icon, ICONS, MASCOT_URLS } from '@repo/ui';
import NumberInput from './NumberInput';

interface StrengthComponentProps {
    showProgressBars: boolean;
    minMax: any;
    pushups: string;
    setPushups: (val: string) => void;
    pushupComponent: string;
    setPushupComponent: (val: string) => void;
    ninetyPercentileThreshold: number;
    isExempt: boolean;
    toggleExempt: () => void;
    openDetailModal: any;
    score: any;
}

/**
 * A component that renders the strength section of the PT calculator.
 * This includes a selector for the type of push-up and an input for the number of reps.
 * It can also display a progress bar showing performance against standards.
 * @param {object} props - The component props.
 * @returns {JSX.Element} The rendered strength component section.
 */
export default function StrengthComponent({ 
    showProgressBars,
    minMax,
    pushups,
    setPushups,
    pushupComponent,
    setPushupComponent,
    ninetyPercentileThreshold,
    isExempt,
    toggleExempt,
    openDetailModal,
    score,
}: StrengthComponentProps) {
    const { theme } = useTheme();
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

    const getMascot = (): ImageSourcePropType => {
        if (pushupComponent === "push_ups_1min" || pushupComponent === "hand_release_pushups_2min") {
            return { uri: MASCOT_URLS.PUSHUP };
        } else if (pushupComponent === "crunches") {
            return { uri: MASCOT_URLS.CRUNCH };
        }
        return { uri: MASCOT_URLS.PUSHUP }; // Default mascot
    };

    return (
        <View>
            <View style={styles.exerciseBlock}>
                <View style={styles.componentHeader}>
                    <TouchableOpacity onPress={() => openDetailModal(pushupComponent, getMascot(), { reps: pushups })}>
                        <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} style={{ margin: theme.spacing.s }} />
                    </TouchableOpacity>
                    <Text style={[styles.cardTitle, {marginLeft: theme.spacing.s, marginVertical: theme.spacing.s, marginRight: theme.spacing.m}]}>Strength</Text>
                    {/* Conditionally render the progress bar based on the showProgressBars prop. */}
                    {showProgressBars && (
                        <View style={{ flex: 1 }}>
                            <NeumorphicOutset>
                                <ProgressBar
                                    value={parseInt(pushups) || 0}
                                    passThreshold={minMax.pushups.min}
                                    maxPointsThreshold={minMax.pushups.max}
                                    ninetyPercentileThreshold={ninetyPercentileThreshold}
                                    score={score.pushupScore}
                                    maxScore={20}
                                />
                            </NeumorphicOutset>
                        </View>
                    )}
                </View>
                <SegmentedSelector
                    options={[{ label: "1-Min Push-ups", value: "push_ups_1min" }, { label: "2-Min HR Push-ups", value: "hand_release_pushups_2min" }]} 
                    selectedValues={isExempt ? [] : [pushupComponent]}
                    onValueChange={setPushupComponent}
                />
                <NumberInput
                    value={pushups}
                    onChangeText={setPushups}
                    placeholder="Enter push-up count"
                    style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xs }}
                    onToggleExempt={toggleExempt}
                    isExempt={isExempt}
                />
            </View>
        </View>
    );
}
