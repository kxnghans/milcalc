import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, IconRow, useTheme, SegmentedSelector, NeumorphicOutset, Icon } from '@repo/ui';
import { ICONS } from '@repo/ui/icons';
import ScoreDisplay from '../components/ScoreDisplay';
import NumberInput from '../components/NumberInput';
import TimeInput from '../components/TimeInput';
import Divider from '../components/Divider';


const BestScoreSection = ({ title, exercises, scores, bestValues, onExerciseChange }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    sectionContainer: {
      marginBottom: theme.spacing.m,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.s,
    },
    cardTitle: {
        ...theme.typography.title,
        color: theme.colors.text,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: theme.spacing.s,
        marginTop: theme.spacing.s,
    },
    gridColumn: {
        flex: 1,
        alignItems: 'center',
        gap: theme.spacing.s,
    },
    scoreRow: {
        width: '100%',
        marginTop: theme.spacing.s,
    }
  });

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Icon name={ICONS.HELP} size={24} color={theme.colors.text} />
      </View>
      <NeumorphicOutset>
        <SegmentedSelector
            options={exercises.map(e => ({ label: e.label, value: e.value }))}
            selectedValue={exercises[0].value} // Placeholder
            onValueChange={onExerciseChange}
        />
      </NeumorphicOutset>
      <View style={styles.gridContainer}>
        {exercises.map((exercise, index) => (
            <View key={index} style={styles.gridColumn}>
                {exercise.type === 'number' ? 
                    <NumberInput value={bestValues[exercise.value]} placeholder='--' style={{width: '100%'}} /> : 
                    <TimeInput minutes={bestValues[exercise.value]?.minutes} seconds={bestValues[exercise.value]?.seconds} style={{width: '100%'}} />
                }
            </View>
        ))}
      </View>
      <View style={styles.scoreRow}>
        <IconRow icons={scores.map(s => ({ text: String(s) }))} />
      </View>
    </View>
  );
};

export default function BestScoreScreen() {
  const { theme, themeMode, toggleTheme } = useTheme();
  const score = { totalScore: 100, isPass: true }; // Dummy score

  const getThemeIcon = () => {
    if (themeMode === 'light') return ICONS.THEME_LIGHT;
    if (themeMode === 'dark') return ICONS.THEME_DARK;
    return ICONS.THEME_AUTO;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: theme.spacing.m,
    },
    card: {
        flex: 1,
        marginTop: theme.spacing.m,
    }
  });

  // Dummy data
  const strengthExercises = [
    { label: '1-Min Push-ups', value: 'push_ups_1min', type: 'number' },
    { label: '2-Min HR Push-ups', value: 'hr_push_ups_2min', type: 'number' },
  ];
  const strengthScores = [20, 20];
  const strengthBestValues = { push_ups_1min: '60', hr_push_ups_2min: '30' };

  const coreExercises = [
    { label: '1-Min Sit-ups', value: 'sit_ups_1min', type: 'number' },
    { label: '2-Min Crunches', value: 'cross_leg_reverse_crunch_2min', type: 'number' },
    { label: 'Plank', value: 'forearm_plank_time', type: 'time' },
  ];
  const coreScores = [20, 20, 20];
  const coreBestValues = { sit_ups_1min: '60', cross_leg_reverse_crunch_2min: '30', forearm_plank_time: { minutes: '3', seconds: '45' } };

  const cardioExercises = [
    { label: '1.5-Mile Run', value: 'run', type: 'time' },
    { label: '20m HAMR', value: 'shuttles', type: 'number' },
    { label: '2-km Walk', value: 'walk', type: 'time' },
  ];
  const cardioScores = [60, 60, 'Pass'];
  const cardioBestValues = { run: { minutes: '9', seconds: '12' }, shuttles: '60', walk: { minutes: '15', seconds: '30' } };


  return (
    <View style={styles.container}>
        <ScoreDisplay score={score} showBreakdown={false} />
        <IconRow
            icons={[
            {
                name: ICONS.HOME,
                href: '(tabs)/pt-calculator',
            },
            {
                name: ICONS.PDF,
                onPress: () => {},
            },
            {
                name: getThemeIcon(),
                onPress: toggleTheme,
            },
            ]}
        />
        <Card style={styles.card}>
            <ScrollView>
                <BestScoreSection 
                    title="Strength" 
                    exercises={strengthExercises} 
                    scores={strengthScores} 
                    bestValues={strengthBestValues} 
                />
                <Divider />
                <BestScoreSection 
                    title="Core" 
                    exercises={coreExercises} 
                    scores={coreScores} 
                    bestValues={coreBestValues} 
                />
                <Divider />
                <BestScoreSection 
                    title="Cardio" 
                    exercises={cardioExercises} 
                    scores={cardioScores} 
                    bestValues={cardioBestValues} 
                />
            </ScrollView>
        </Card>
    </View>
  );
}