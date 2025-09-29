import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, NeumorphicOutset, ProgressBar, SegmentedSelector, useTheme } from '@repo/ui';
import NumberInput from './NumberInput';
import TimeInput from './TimeInput';

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
        neumorphicOutsetContainer: {
        },
    });

    return (
        <View>
            
            <View style={styles.exerciseBlock}>
                <View style={styles.componentHeader}>
                    <Text style={[styles.cardTitle, {marginRight: theme.spacing.m, marginVertical: theme.spacing.s}]}>Core</Text>
                    {showProgressBars && (() => {
                        const ninetyPercentileThreshold = minMax.core.max * 0.9;
                        if (coreComponent === "forearm_plank_time") {
                            const plankTimeInSeconds = (parseInt(plankMinutes) || 0) * 60 + (parseInt(plankSeconds) || 0);
                            return (
                                <View style={{ flex: 1 }}>
                                    <NeumorphicOutset containerStyle={styles.neumorphicOutsetContainer} highlightOpacity={isDarkMode ? 0.4 : undefined}>
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
                        return (
                            <View style={{ flex: 1 }}>
                                <NeumorphicOutset containerStyle={styles.neumorphicOutsetContainer} highlightOpacity={isDarkMode ? 0.4 : undefined}>
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
                <NeumorphicOutset containerStyle={styles.neumorphicOutsetContainer}>
                    <SegmentedSelector
                        options={[
                            { label: "1-min Sit-ups", value: "sit_ups_1min" },
                            { label: "2-min Cross-Leg Crunch", value: "cross_leg_reverse_crunch_2min" },
                            { label: "Forearm Plank", value: "forearm_plank_time" },
                        ]}
                        selectedValue={coreComponent}
                        onValueChange={setCoreComponent}
                    />
                </NeumorphicOutset>
                {coreComponent === "sit_ups_1min" && (
                    <NumberInput value={situps} onChangeText={setSitups} placeholder="Enter sit-up count" />
                )}
                {coreComponent === "cross_leg_reverse_crunch_2min" && (
                    <NumberInput value={reverseCrunches} onChangeText={setReverseCrunches} placeholder="Enter crunch count" />
                )}
                {coreComponent === "forearm_plank_time" && (
                    <TimeInput
                        minutes={plankMinutes}
                        setMinutes={setPlankMinutes}
                        seconds={plankSeconds}
                        setSeconds={setPlankSeconds}
                    />
                )}
            </View>
        </View>
    );
};