import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, NeumorphicOutset, ProgressBar, SegmentedSelector, useTheme, Icon, ICONS } from '@repo/ui';
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
    ninetyPercentileThreshold,
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
                    {showProgressBars && (() => {

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
                        { label: "1-min Sit-ups", value: "sit_ups_1min" },
                        { label: "2-min Cross-Leg Crunch", value: "cross_leg_reverse_crunch_2min" },
                        { label: "Forearm Plank", value: "forearm_plank_time" },
                    ]}
                    selectedValue={coreComponent}
                    onValueChange={setCoreComponent}
                />
                {coreComponent === "sit_ups_1min" && (
                    <NumberInput value={situps} onChangeText={setSitups} placeholder="Enter sit-up count" style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xs }} />
                )}
                {coreComponent === "cross_leg_reverse_crunch_2min" && (
                    <NumberInput value={reverseCrunches} onChangeText={setReverseCrunches} placeholder="Enter crunch count" style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xs }} />
                )}
                {coreComponent === "forearm_plank_time" && (
                    <TimeInput
                        minutes={plankMinutes}
                        setMinutes={setPlankMinutes}
                        seconds={plankSeconds}
                        setSeconds={setPlankSeconds}
                        style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xs }}
                    />
                )}
            </View>
        </View>
    );
};