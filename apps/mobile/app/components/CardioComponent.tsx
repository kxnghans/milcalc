import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Card, NeumorphicOutset, ProgressBar, SegmentedSelector, useTheme } from '@repo/ui';
import NumberInput from './NumberInput';
import TimeInput from './TimeInput';

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
}) {
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
            marginBottom: theme.spacing.m,
        },
        exerciseBlock: {
            justifyContent: 'center',
        },
        neumorphicOutsetContainer: {
            margin: theme.spacing.s,
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
                            <Text style={[styles.cardTitle, { marginRight: theme.spacing.m }]}>Cardio</Text>
                            {showProgressBars && (() => {
                                if (cardioComponent === 'run' || cardioComponent === 'walk') {
                                    const timeInSeconds = (cardioComponent === 'run' ? (parseInt(runMinutes) || 0) * 60 + (parseInt(runSeconds) || 0) : (parseInt(walkMinutes) || 0) * 60 + (parseInt(walkSeconds) || 0));
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
                        <NeumorphicOutset containerStyle={styles.neumorphicOutsetContainer}>
                            <SegmentedSelector
                                options={[{ label: "1.5-Mile Run", value: "run" }, { label: "20m HAMR Shuttles", value: "shuttles" }, { label: "2-km Walk", value: "walk" }]}
                                selectedValue={cardioComponent}
                                onValueChange={setCardioComponent}
                            />
                        </NeumorphicOutset>
                        {cardioComponent === "run" && (
                            <TimeInput
                                minutes={runMinutes}
                                setMinutes={setRunMinutes}
                                seconds={runSeconds}
                                setSeconds={setRunSeconds}
                            />
                        )}
                        {cardioComponent === "shuttles" && (
                            <NumberInput value={shuttles} onChangeText={setShuttles} placeholder="Enter shuttle count" />
                        )}
                        {cardioComponent === "walk" && (
                            <TimeInput
                                minutes={walkMinutes}
                                setMinutes={setWalkMinutes}
                                seconds={walkSeconds}
                                setSeconds={setWalkSeconds}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};