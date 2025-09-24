import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar, SegmentedSelector, StyledTextInput, useTheme } from '@repo/ui';

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
    handleLayout,
    handleSegmentedLayout,
    exerciseBlockStyle,
    segmentedStyle,
    handleMinutesChange,
    plankSecondsInput
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
            <View style={[styles.exerciseBlock, exerciseBlockStyle]} onLayout={(e) => handleLayout('core', e)}>
                <View style={styles.componentHeader}>
                    <Text style={styles.cardTitle}>Core</Text>
                    {showProgressBars && (() => {
                        if (coreComponent === "forearm_plank_time") {
                            const plankTimeInSeconds = (parseInt(plankMinutes) || 0) * 60 + (parseInt(plankSeconds) || 0);
                            return (
                                <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
                                    <ProgressBar
                                        mode="ascending"
                                        value={plankTimeInSeconds}
                                        passThreshold={minMax.core.min}
                                        maxPointsThreshold={minMax.core.max}
                                    />
                                </View>
                            );
                        }
                        return (
                            <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
                                <ProgressBar
                                    mode="ascending"
                                    value={parseInt(coreComponent === "sit_ups_1min" ? situps : reverseCrunches) || 0}
                                    passThreshold={minMax.core.min}
                                    maxPointsThreshold={minMax.core.max}
                                />
                            </View>
                        );
                    })()}
                </View>
                <SegmentedSelector
                    style={segmentedStyle}
                    options={[
                        { label: "1-min Sit-ups", value: "sit_ups_1min" },
                        { label: "2-min Cross-Leg Crunch", value: "cross_leg_reverse_crunch_2min" },
                        { label: "Forearm Plank", value: "forearm_plank_time" },
                    ]}
                    selectedValue={coreComponent}
                    onValueChange={setCoreComponent}
                    onLayout={(e) => handleSegmentedLayout('core', e)}
                />
                {coreComponent === "sit_ups_1min" && (
                    <StyledTextInput value={situps} onChangeText={setSitups} placeholder="Enter sit-up count" keyboardType="numeric" style={styles.numericInput} />
                )}
                {coreComponent === "cross_leg_reverse_crunch_2min" && (
                    <StyledTextInput value={reverseCrunches} onChangeText={setReverseCrunches} placeholder="Enter crunch count" keyboardType="numeric" style={styles.numericInput} />
                )}
                {coreComponent === "forearm_plank_time" && (
                    <View style={styles.timeInputContainer}>
                        <StyledTextInput value={plankMinutes} onChangeText={(value) => handleMinutesChange(value, setPlankMinutes, plankSecondsInput)} placeholder="Minutes" keyboardType="numeric" style={styles.timeInput} />
                        <Text style={styles.timeInputSeparator}>:</Text>
                        <StyledTextInput ref={plankSecondsInput} value={plankSeconds} onChangeText={setPlankSeconds} placeholder="Seconds" keyboardType="numeric" style={styles.timeInput} />
                    </View>
                )}
            </View>
        </View>
    );
};