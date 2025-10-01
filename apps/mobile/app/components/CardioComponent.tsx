import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Card, NeumorphicOutset, ProgressBar, SegmentedSelector, useTheme, Icon, ICONS } from '@repo/ui';
import NumberInput from './NumberInput';
import TimeInput from './TimeInput';

import altitudeAdjustments from '../../../../packages/ui/src/pt_data/altitude-adjustments.json';

export default function CardioComponent({
    showProgressBars,
    cardioComponent,
    setCardioComponent,
    runMinutes,
    setRunMinutes,
    runSeconds,
    setRunSeconds,
    walkMinutes,
    setWalkMinutes,
    walkSeconds,
    setWalkSeconds,
    shuttles,
    setShuttles,
    cardioMinMax,
    altitudeGroup,
    age,
    gender,
    ninetyPercentileThreshold,
}) {
    const { theme, isDarkMode } = useTheme();
    const [adjustment, setAdjustment] = React.useState(null);
    const [adjustedWalkMaxTime, setAdjustedWalkMaxTime] = React.useState(null);

    React.useEffect(() => {
        // Always reset adjustments when dependencies change
        setAdjustment(null);
        setAdjustedWalkMaxTime(null);

        if (altitudeGroup && altitudeGroup !== 'normal') {
            if (cardioComponent === 'run' && (runMinutes && runSeconds)) {
                const runTimeInSeconds = (parseInt(runMinutes) || 0) * 60 + (parseInt(runSeconds) || 0);
                const correctionGroup = altitudeAdjustments.run.groups[altitudeGroup];
                if (correctionGroup) {
                    const correction = correctionGroup.corrections.find(c => runTimeInSeconds >= c.time_range[0] && runTimeInSeconds <= c.time_range[1]);
                    if (correction) {
                        setAdjustment(`- ${correction.correction}s`);
                    }
                }
            } else if (cardioComponent === 'walk' && (walkMinutes && walkSeconds)) {
                const ageIndex = getAgeGroupIndex(age);

                // Defensive checks to prevent the TypeError
                if (ageIndex !== -1 && gender &&
                    altitudeAdjustments.walk &&
                    altitudeAdjustments.walk[gender] &&
                    altitudeAdjustments.walk[gender][altitudeGroup] &&
                    altitudeAdjustments.walk[gender][altitudeGroup].max_times &&
                    altitudeAdjustments.walk[gender][altitudeGroup].max_times[ageIndex]
                ) {
                    const maxTime = altitudeAdjustments.walk[gender][altitudeGroup].max_times[ageIndex].max_time;
                    if (maxTime) {
                        const minutes = Math.floor(maxTime / 60);
                        const seconds = maxTime % 60;
                        setAdjustment(`Max time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
                        setAdjustedWalkMaxTime(maxTime);
                    }
                }
            } else if (cardioComponent === 'shuttles') {
                if (altitudeAdjustments.hamr &&
                    altitudeAdjustments.hamr.groups &&
                    altitudeAdjustments.hamr.groups[altitudeGroup]
                ) {
                    const shuttlesToAdd = altitudeAdjustments.hamr.groups[altitudeGroup].shuttles_to_add;
                    if (shuttlesToAdd) {
                        setAdjustment(`+ ${shuttlesToAdd}`);
                    }
                }
            }
        }
    }, [runMinutes, runSeconds, walkMinutes, walkSeconds, shuttles, cardioComponent, altitudeGroup, age, gender]);

    const getAgeGroupIndex = (age: number) => {
        if (age < 30) return 0;
        if (age >= 30 && age <= 39) return 1;
        if (age >= 40 && age <= 49) return 2;
        if (age >= 50 && age <= 59) return 3;
        if (age >= 60) return 4;
        return -1;
    }

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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View>
                    <View style={styles.exerciseBlock}>
                        <View style={styles.componentHeader}>
                            <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} style={{ margin: theme.spacing.s }} />
                            <Text style={[styles.cardTitle, { marginLeft: theme.spacing.s, marginVertical: theme.spacing.s, marginRight: theme.spacing.m }]}>Cardio</Text>
                            {showProgressBars && (() => {
                                if (cardioComponent === 'run') {
                                    const timeInSeconds = (parseInt(runMinutes) || 0) * 60 + (parseInt(runSeconds) || 0);
                                    return (
                                        <View style={{ flex: 1 }}>
                                            <NeumorphicOutset>
                                                <ProgressBar
                                                    invertScale={true}
                                                    value={timeInSeconds}
                                                    passThreshold={cardioMinMax.min}
                                                    maxPointsThreshold={cardioMinMax.max}
                                                    ninetyPercentileThreshold={ninetyPercentileThreshold}
                                                    valueIsTime={true}
                                                />
                                            </NeumorphicOutset>
                                        </View>
                                    );
                                } else if (cardioComponent === 'walk') {
                                    const timeInSeconds = (parseInt(walkMinutes) || 0) * 60 + (parseInt(walkSeconds) || 0);
                                    const passThreshold = adjustedWalkMaxTime !== null ? adjustedWalkMaxTime : cardioMinMax.min;
                                    return (
                                        <View style={{ flex: 1 }}>
                                            <NeumorphicOutset>
                                                <ProgressBar
                                                    invertScale={true}
                                                    value={timeInSeconds}
                                                    passThreshold={passThreshold}
                                                    valueIsTime={true}
                                                    isPassFail={true}
                                                />
                                            </NeumorphicOutset>
                                        </View>
                                    );
                                } else { // shuttles
                                    return (
                                        <View style={{ flex: 1 }}>
                                            <NeumorphicOutset>
                                                <ProgressBar
                                                    value={parseInt(shuttles) || 0}
                                                    passThreshold={cardioMinMax.min}
                                                    maxPointsThreshold={cardioMinMax.max}
                                                    ninetyPercentileThreshold={ninetyPercentileThreshold}
                                                />
                                            </NeumorphicOutset>
                                        </View>
                                    );
                                }
                            })()}
                        </View>
                        <SegmentedSelector
                            options={[{ label: "1.5-Mile Run", value: "run" }, { label: "20m HAMR", value: "shuttles" }, { label: "2-km Walk", value: "walk" }]}
                            selectedValues={[cardioComponent]}
                            onValueChange={setCardioComponent}
                        />
                        {cardioComponent === "run" && (
                            <TimeInput
                                minutes={runMinutes}
                                setMinutes={setRunMinutes}
                                seconds={runSeconds}
                                setSeconds={setRunSeconds}
                                adjustment={adjustment}
                                minutesPlaceholder="Minutes"
                                secondsPlaceholder="Seconds"
                                style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xs }}
                            />
                        )}
                        {cardioComponent === "shuttles" && (
                            <NumberInput value={shuttles} onChangeText={setShuttles} placeholder="Enter shuttle count" adjustment={adjustment} style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xs }} />
                        )}
                        {cardioComponent === "walk" && (
                            <TimeInput
                                minutes={walkMinutes}
                                setMinutes={setWalkMinutes}
                                seconds={walkSeconds}
                                setSeconds={setWalkSeconds}
                                adjustment={adjustment}
                                minutesPlaceholder="Minutes"
                                secondsPlaceholder="Seconds"
                                style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xs }}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};