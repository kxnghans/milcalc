import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar, SegmentedSelector, StyledTextInput, useTheme } from '@repo/ui';

export default function StrengthComponent({ 
    showProgressBars,
    minMax,
    pushups,
    setPushups,
    pushupComponent,
    setPushupComponent,
    handleLayout,
    handleSegmentedLayout,
    exerciseBlockStyle,
    segmentedStyle
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
    });

    return (
        <View>
            <View style={styles.separator} />
            <View style={[styles.exerciseBlock, exerciseBlockStyle]} onLayout={(e) => handleLayout('strength', e)}>
                <View style={styles.componentHeader}>
                    <Text style={styles.cardTitle}>Strength</Text>
                    {showProgressBars && (
                        <View style={{ flex: 1, marginLeft: theme.spacing.m }}>
                            <ProgressBar
                                mode="ascending"
                                value={parseInt(pushups) || 0}
                                passThreshold={minMax.pushups.min}
                                maxPointsThreshold={minMax.pushups.max}
                            />
                        </View>
                    )}
                </View>
                <SegmentedSelector
                    style={segmentedStyle}
                    options={[{ label: "1-min Push-ups", value: "push_ups_1min" }, { label: "2-min HR Push-ups", value: "hand_release_pushups_2min" }]} 
                    selectedValue={pushupComponent}
                    onValueChange={setPushupComponent}
                    onLayout={(e) => handleSegmentedLayout('strength', e)}
                />
                <StyledTextInput value={pushups} onChangeText={setPushups} placeholder="Enter push-up count" keyboardType="numeric" style={styles.numericInput} />
            </View>
        </View>
    );
};