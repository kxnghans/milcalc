/**
 * @file CardioComponent.tsx
 * @description This file defines the UI component for the cardio section of the PT calculator.
 * It's a complex component that handles multiple cardio options (run, shuttle, walk),
 * conditionally renders different inputs, and calculates altitude adjustments in real-time.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { NeumorphicOutset, ProgressBar, SegmentedSelector, useTheme, Icon, ICONS, MASCOT_URLS } from '@repo/ui';
import NumberInput from './NumberInput';
import TimeInput from './TimeInput';
import { Tables, timeToSeconds } from '@repo/utils';

interface CardioComponentProps {
    showProgressBars: boolean;
    cardioComponent: string;
    setCardioComponent: (val: string) => void;
    runMinutes: string;
    setRunMinutes: (val: string) => void;
    runSeconds: string;
    setRunSeconds: (val: string) => void;
    walkMinutes: string;
    setWalkMinutes: (val: string) => void;
    walkSeconds: string;
    setWalkSeconds: (val: string) => void;
    shuttles: string;
    setShuttles: (val: string) => void;
    cardioMinMax: { min: number; max: number };
    altitudeGroup: string;
    age: string;
    gender: string;
    ninetyPercentileThreshold: number;
    isExempt: boolean;
    toggleExempt: () => void;
    openDetailModal: (key: string, mascot?: ImageSourcePropType) => void;
    score: { totalScore: number; cardioScore: number | string; isPass: boolean; walkPassed: string };
    altitudeData: {
        run: Tables<'pt_altitude_corrections'>[] | null | undefined;
        hamr: Tables<'pt_altitude_corrections'>[] | null | undefined;
        walk: Tables<'pt_altitude_walk_thresholds'>[] | null | undefined;
    };
}

/**
 * A component that renders the cardio section of the PT calculator.
 * It manages state for the run, shuttle run, and walk, and displays the correct
 * input fields and progress bars based on the user's selection.
 * @param {object} props - The component props.
 * @returns {JSX.Element} The rendered cardio component section.
 */
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
    isExempt,
    toggleExempt,
    openDetailModal,
    score,
    altitudeData,
}: CardioComponentProps) {
    const { theme } = useTheme();
    // State to hold the calculated altitude adjustment text to be displayed to the user.
    const [adjustment, setAdjustment] = React.useState<string | null>(null);
    // State to hold the adjusted max time for the walk when at altitude.
    const [adjustedWalkMaxTime, setAdjustedWalkMaxTime] = React.useState<number | null>(null);

    // This effect recalculates the altitude adjustment whenever a relevant input changes.
    React.useEffect(() => {
        // Always reset adjustments when dependencies change
        setAdjustment(null);
        setAdjustedWalkMaxTime(null);

        if (altitudeData && altitudeGroup && altitudeGroup !== 'normal' && age && gender && !isExempt) {
            const ageNum = parseInt(age);

            if (cardioComponent === 'run' && altitudeData.run) {
                const runTimeInSeconds = (parseInt(runMinutes) || 0) * 60 + (parseInt(runSeconds) || 0);
                const adjustmentRow = altitudeData.run.find((row) => 
                    row.exercise_type === 'run_2mile' &&
                    row.altitude_group === altitudeGroup && 
                    runTimeInSeconds >= timeToSeconds(row.perf_start) && 
                    runTimeInSeconds <= timeToSeconds(row.perf_end)
                );
                if (adjustmentRow) {
                    setAdjustment(`-${adjustmentRow.correction}s`);
                }

            } else if (cardioComponent === 'walk' && altitudeData.walk && (walkMinutes || walkSeconds)) {
                const capitalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
                const adjustmentRow = altitudeData.walk.find((row) => {
                    const [min, max] = row.age_range.split('-').map(Number);
                    return row.sex === capitalizedGender &&
                           row.altitude_group === altitudeGroup &&
                           ageNum >= min && ageNum <= max;
                });

                if (adjustmentRow) {
                    const maxTimeSeconds = timeToSeconds(adjustmentRow.max_time);
                    setAdjustedWalkMaxTime(maxTimeSeconds);
                }

            } else if (cardioComponent === 'shuttles' && altitudeData.hamr) {
                const adjustmentRow = altitudeData.hamr.find((row) => 
                    row.exercise_type === 'shuttles_20m' &&
                    row.altitude_group === altitudeGroup
                );
                if (adjustmentRow) {
                    setAdjustment(`+${adjustmentRow.correction}`);
                }
            }
        }
    }, [runMinutes, runSeconds, walkMinutes, walkSeconds, shuttles, cardioComponent, altitudeGroup, age, gender, altitudeData, isExempt]);

    const styles = React.useMemo(() => StyleSheet.create({
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
    }), [theme]);

    const getMascot = (): ImageSourcePropType => {
        if (cardioComponent === "run" || cardioComponent === "shuttles") {
            return { uri: MASCOT_URLS.RUN };
        } else if (cardioComponent === "walk") {
            return { uri: MASCOT_URLS.WALK };
        }
        return { uri: MASCOT_URLS.RUN }; // Default mascot
    };

    return (
        <View>
            <View style={styles.exerciseBlock}>
                <View style={styles.componentHeader}>
                    <TouchableOpacity onPress={() => openDetailModal(cardioComponent, getMascot())}>
                        <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} style={styles.helpIcon} />
                    </TouchableOpacity>
                    <Text style={styles.cardTitle}>Cardio</Text>
                    {/* Conditionally render the correct progress bar for the selected cardio type. */}
                    {showProgressBars && (() => {
                        if (cardioComponent === 'run') {
                            const timeInSeconds = (parseInt(runMinutes) || 0) * 60 + (parseInt(runSeconds) || 0);
                            return (
                                <View style={styles.progressBarContainer}>
                                    <NeumorphicOutset>
                                        <ProgressBar
                                            invertScale={true} // Lower time is better.
                                            value={timeInSeconds}
                                            passThreshold={cardioMinMax.min}
                                            maxPointsThreshold={cardioMinMax.max}
                                            ninetyPercentileThreshold={ninetyPercentileThreshold}
                                            valueIsTime={true}
                                            score={typeof score.cardioScore === 'number' ? score.cardioScore : 0}
                                            maxScore={50}
                                        />
                                    </NeumorphicOutset>
                                </View>
                            );
                        } else if (cardioComponent === 'walk') {
                            const timeInSeconds = (parseInt(walkMinutes) || 0) * 60 + (parseInt(walkSeconds) || 0);
                            const passThreshold = adjustedWalkMaxTime !== null ? adjustedWalkMaxTime : cardioMinMax.min;
                            return (
                                <View style={styles.progressBarContainer}>
                                    <NeumorphicOutset>
                                        <ProgressBar
                                            invertScale={true} // Lower time is better.
                                            value={timeInSeconds}
                                            passThreshold={passThreshold}
                                            valueIsTime={true}
                                            isPassFail={true} // Walk is a simple pass/fail event.
                                        />
                                    </NeumorphicOutset>
                                </View>
                            );
                        } else { // shuttles
                            const getAdjustedShuttleCount = () => {
                                const baseShuttles = parseInt(shuttles) || 0;
                                
                                if (cardioComponent === 'shuttles' && altitudeData && altitudeData.hamr && altitudeGroup && altitudeGroup !== 'normal') {
                                    const adjustmentRow = altitudeData.hamr.find((row) => 
                                        row.exercise_type === 'shuttles_20m' &&
                                        row.altitude_group === altitudeGroup
                                    );
                                    if (adjustmentRow && adjustmentRow.correction) {
                                        return baseShuttles + adjustmentRow.correction;
                                    }
                                }
                                
                                return baseShuttles;
                            };

                            return (
                                <View style={styles.progressBarContainer}>
                                    <NeumorphicOutset>
                                        <ProgressBar
                                            value={getAdjustedShuttleCount()}
                                            passThreshold={cardioMinMax.min}
                                            maxPointsThreshold={cardioMinMax.max}
                                            ninetyPercentileThreshold={ninetyPercentileThreshold}
                                            score={typeof score.cardioScore === 'number' ? score.cardioScore : 0}
                                            maxScore={50}
                                        />
                                    </NeumorphicOutset>
                                </View>
                            );
                        }
                    })()}
                </View>
                <SegmentedSelector
                    options={[{ label: "2-Mile Run", value: "run" }, { label: "20m HAMR", value: "shuttles" }, { label: "2-km Walk", value: "walk" }]} 
                    selectedValues={isExempt ? [] : [cardioComponent]}
                    onValueChange={setCardioComponent}
                />
                {/* Conditionally render the correct input field for the selected cardio type. */}
                {cardioComponent === "run" && (
                    <TimeInput
                        minutes={runMinutes}
                        setMinutes={setRunMinutes}
                        seconds={runSeconds}
                        setSeconds={setRunSeconds}
                        adjustment={adjustment || undefined}
                        minutesPlaceholder="Minutes"
                        secondsPlaceholder="Seconds"
                        style={styles.inputMargin}
                        onToggleExempt={toggleExempt}
                        isExempt={isExempt}
                        minutesTestID="cardio-run-min-input"
                        secondsTestID="cardio-run-sec-input"
                    />
                )}
                {cardioComponent === "shuttles" && (
                    <NumberInput
                        value={shuttles}
                        onChangeText={setShuttles}
                        placeholder="Enter shuttle count"
                        adjustment={adjustment || undefined}
                        style={styles.inputMargin}
                        onToggleExempt={toggleExempt}
                        isExempt={isExempt}
                        testID="cardio-shuttles-input"
                    />
                )}
                {cardioComponent === "walk" && (
                    <TimeInput
                        minutes={walkMinutes}
                        setMinutes={setWalkMinutes}
                        seconds={walkSeconds}
                        setSeconds={setWalkSeconds}
                        adjustment={adjustment || undefined}
                        minutesPlaceholder="Minutes"
                        secondsPlaceholder="Seconds"
                        style={styles.inputMargin}
                        onToggleExempt={toggleExempt}
                        isExempt={isExempt}
                        minutesTestID="cardio-walk-min-input"
                        secondsTestID="cardio-walk-sec-input"
                    />
                )}
            </View>
        </View>
    );
}
