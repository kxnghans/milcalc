import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ProgressBar, SegmentedSelector, useTheme } from '@repo/ui';
import NumberInput from './NumberInput';

export default function StrengthComponent({ 
    showProgressBars,
    minMax,
    pushups,
    setPushups,
    pushupComponent,
    setPushupComponent,
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
    });

    return (
        <View>
            <View style={styles.separator} />
            <View style={styles.exerciseBlock}>
                <View style={styles.componentHeader}>
                    <Text style={[styles.cardTitle, {marginRight: theme.spacing.m}]}>Strength</Text>
                    {showProgressBars && (
                        <View style={{ flex: 1 }}>
                            <ProgressBar
                                value={parseInt(pushups) || 0}
                                passThreshold={minMax.pushups.min}
                                maxPointsThreshold={minMax.pushups.max}
                                ninetyPercentileThreshold={minMax.pushups.max * 0.9}
                            />
                        </View>
                    )}
                </View>
                <SegmentedSelector
                    options={[{ label: "1-min Push-ups", value: "push_ups_1min" }, { label: "2-min HR Push-ups", value: "hand_release_pushups_2min" }]} 
                    selectedValue={pushupComponent}
                    onValueChange={setPushupComponent}
                />
                <NumberInput value={pushups} onChangeText={setPushups} placeholder="Enter push-up count" />
            </View>
        </View>
    );
};