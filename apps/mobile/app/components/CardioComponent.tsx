import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar, SegmentedSelector, StyledTextInput, useTheme } from '@repo/ui';

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
    handleLayout,
    handleSegmentedLayout,
    exerciseBlockStyle,
    segmentedStyle,
    handleMinutesChange,
    runSecondsInput,
    walkSecondsInput
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
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: theme.spacing.m,
        },
        exerciseBlock: {
            justifyContent: 'center',
        },
        numericInput: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.m,
            paddingVertical: theme.spacing.s,
            paddingHorizontal: theme.spacing.m,
            backgroundColor: theme.colors.surface,
            marginBottom: theme.spacing.s,
            ...theme.typography.label,
            textAlign: "center",
            color: theme.colors.text,
        },
        timeInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.m,
            paddingVertical: theme.spacing.s,
            paddingHorizontal: theme.spacing.m,
            backgroundColor: theme.colors.surface,
            marginBottom: theme.spacing.s,
        },
        timeInput: {
            flex: 1,
            borderWidth: 0,
            padding: 0,
            margin: 0,
            ...theme.typography.label,
            color: theme.colors.text,
            backgroundColor: 'transparent',
            textAlign: 'center',
        },
        timeInputSeparator: {
            ...theme.typography.body,
            marginHorizontal: theme.spacing.s,
            color: theme.colors.text,
        },
    });

    return (
        <View>
            <View style={styles.separator} />
            <View style={[styles.exerciseBlock, exerciseBlockStyle]} onLayout={(e) => handleLayout('cardio', e)}>
                <View style={styles.componentHeader}>
                    <Text style={styles.cardTitle}>Cardio</Text>
                    {showProgressBars && (() => {
                        if (cardioComponent === 'run' || cardioComponent === 'walk') {
                            const timeInSeconds = (cardioComponent === 'run' ? (parseInt(runMinutes) || 0) * 60 + (parseInt(runSeconds) || 0) : (parseInt(walkMinutes) || 0) * 60 + (parseInt(walkSeconds) || 0));
                            return (
                                <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
                                    <ProgressBar
                                        mode="descending"
                                        value={timeInSeconds}
                                        passThreshold={cardioMinMax.min}
                                        maxPointsThreshold={cardioMinMax.max}
                                    />
                                </View>
                            );
                        } else { // shuttles
                            return (
                                <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
                                    <ProgressBar
                                        mode="ascending"
                                        value={parseInt(shuttles) || 0}
                                        passThreshold={cardioMinMax.min}
                                        maxPointsThreshold={cardioMinMax.max}
                                    />
                                </View>
                            );
                        }
                    })()}
                </View>
                <SegmentedSelector
                    style={segmentedStyle}
                    options={[{ label: "1.5-Mile Run", value: "run" }, { label: "20m HAMR Shuttles", value: "shuttles" }, { label: "2-km Walk", value: "walk" }]}
                    selectedValue={cardioComponent}
                    onValueChange={setCardioComponent}
                    onLayout={(e) => handleSegmentedLayout('cardio', e)}
                />
                {cardioComponent === "run" && (
                    <View style={styles.timeInputContainer}>
                        <StyledTextInput value={runMinutes} onChangeText={(value) => handleMinutesChange(value, setRunMinutes, runSecondsInput)} placeholder="Minutes" keyboardType="numeric" style={styles.timeInput} />
                        <Text style={styles.timeInputSeparator}>:</Text>
                        <StyledTextInput ref={runSecondsInput} value={runSeconds} onChangeText={setRunSeconds} placeholder="Seconds" keyboardType="numeric" style={styles.timeInput} />
                    </View>
                )}
                {cardioComponent === "shuttles" && (
                    <StyledTextInput value={shuttles} onChangeText={setShuttles} placeholder="Enter shuttle count" keyboardType="numeric" style={styles.numericInput} />
                )}
                {cardioComponent === "walk" && (
                    <View style={styles.timeInputContainer}>
                        <StyledTextInput value={walkMinutes} onChangeText={(value) => handleMinutesChange(value, setWalkMinutes, walkSecondsInput)} placeholder="Minutes" keyboardType="numeric" style={styles.timeInput} />
                        <Text style={styles.timeInputSeparator}>:</Text>
                        <StyledTextInput ref={walkSecondsInput} value={walkSeconds} onChangeText={setWalkSeconds} placeholder="Seconds" keyboardType="numeric" style={styles.timeInput} />
                    </View>
                )}
            </View>
        </View>
    );
};