import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, NeumorphicOutset, ProgressBar, SegmentedSelector, useTheme, Icon, ICONS } from '@repo/ui';
import NumberInput from './NumberInput';

export default function StrengthComponent({ 
    showProgressBars,
    minMax,
    pushups,
    setPushups,
    pushupComponent,
    setPushupComponent,
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
                    <Text style={[styles.cardTitle, {marginLeft: theme.spacing.s, marginVertical: theme.spacing.s, marginRight: theme.spacing.m}]}>Strength</Text>
                    {showProgressBars && (
                        <View style={{ flex: 1 }}>
                            <NeumorphicOutset>
                                <ProgressBar
                                    value={parseInt(pushups) || 0}
                                    passThreshold={minMax.pushups.min}
                                    maxPointsThreshold={minMax.pushups.max}
                                    ninetyPercentileThreshold={ninetyPercentileThreshold}
                                />
                            </NeumorphicOutset>
                        </View>
                    )}
                </View>
                <SegmentedSelector
                    options={[{ label: "1-min Push-ups", value: "push_ups_1min" }, { label: "2-min HR Push-ups", value: "hand_release_pushups_2min" }]} 
                    selectedValue={pushupComponent}
                    onValueChange={setPushupComponent}
                />
                <NumberInput value={pushups} onChangeText={setPushups} placeholder="Enter push-up count" style={{ marginHorizontal: theme.spacing.s, marginTop: theme.spacing.xs }} />
            </View>
        </View>
    );
};