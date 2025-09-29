import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Card, NeumorphicOutset, ProgressBar, SegmentedSelector, useTheme } from '@repo/ui';
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
}) {
    const { theme, isDarkMode } = useTheme();
    const [adjustment, setAdjustment] = React.useState(null);

    React.useEffect(() => {
        if (altitudeGroup && altitudeGroup !== 'normal') {
            if (cardioComponent === 'run') {
                const runTimeInSeconds = parseInt(runMinutes) * 60 + parseInt(runSeconds);
                const correction = altitudeAdjustments.run.groups[altitudeGroup].corrections.find(c => runTimeInSeconds >= c.time_range[0] && runTimeInSeconds <= c.time_range[1]);
                if (correction) {
                    setAdjustment(`- ${correction.correction}s`);
                } else {
                    setAdjustment(null);
                }
            } else if (cardioComponent === 'walk') {
                const ageIndex = getAgeGroupIndex(age);
                if (ageIndex !== -1 && gender) {
                    const maxTime = altitudeAdjustments.walk[gender].groups[altitudeGroup].max_times[ageIndex].max_time;
                    const minutes = Math.floor(maxTime / 60);
                    const seconds = maxTime % 60;
                    setAdjustment(`Max time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
                } else {
                    setAdjustment(null);
                }
            } else if (cardioComponent === 'shuttles') {
                const shuttlesToAdd = altitudeAdjustments.hamr.groups[altitudeGroup].shuttles_to_add;
                setAdjustment(`+ ${shuttlesToAdd}`);
            } else {
                setAdjustment(null);
            }
        } else {
            setAdjustment(null);
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
        neumorphicOutsetContainer: {
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
                            <Text style={[styles.cardTitle, { marginRight: theme.spacing.m, marginVertical: theme.spacing.s }]}>Cardio</Text>
                            {showProgressBars && (() => {
                                if (cardioComponent === 'run') {
                                    const timeInSeconds = (parseInt(runMinutes) || 0) * 60 + (parseInt(runSeconds) || 0);
                                    const ninetyPercentileThreshold = cardioMinMax.max + (cardioMinMax.min - cardioMinMax.max) * 0.1;
                                    return (
                                        <View style={{ flex: 1 }}>
                                            <NeumorphicOutset containerStyle={styles.neumorphicOutsetContainer}>
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
                                    return (
                                        <View style={{ flex: 1 }}>
                                            <NeumorphicOutset containerStyle={styles.neumorphicOutsetContainer}>
                                                <ProgressBar
                                                    invertScale={true}
                                                    value={timeInSeconds}
                                                    passThreshold={cardioMinMax.min} // This will be the max time for passing
                                                    valueIsTime={true}
                                                    isPassFail={true}
                                                />
                                            </NeumorphicOutset>
                                        </View>
                                    );
                                } else { // shuttles
                                    const ninetyPercentileThreshold = cardioMinMax.max * 0.9;
                                    return (
                                        <View style={{ flex: 1 }}>
                                            <NeumorphicOutset containerStyle={styles.neumorphicOutsetContainer}>
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
                            options={[{ label: "1.5-Mile Run", value: "run" }, { label: "20m HAMR Shuttles", value: "shuttles" }, { label: "2-km Walk", value: "walk" }]}
                            selectedValue={cardioComponent}
                            onValueChange={setCardioComponent}
                        />
                        {cardioComponent === "run" && (
                            <TimeInput
                                minutes={runMinutes}
                                setMinutes={setRunMinutes}
                                seconds={runSeconds}
                                setSeconds={setRunSeconds}
                                adjustment={adjustment}
                            />
                        )}
                        {cardioComponent === "shuttles" && (
                            <NumberInput value={shuttles} onChangeText={setShuttles} placeholder="Enter shuttle count" adjustment={adjustment} />
                        )}
                        {cardioComponent === "walk" && (
                            <TimeInput
                                minutes={walkMinutes}
                                setMinutes={setWalkMinutes}
                                seconds={walkSeconds}
                                setSeconds={setWalkSeconds}
                                adjustment={adjustment}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};