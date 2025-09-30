import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, IconRow, useTheme, SegmentedSelector, NeumorphicOutset, Icon } from '@repo/ui';
import { ICONS } from '@repo/ui/icons';
import ScoreDisplay from '../components/ScoreDisplay';
import NumberInput from '../components/NumberInput';
import TimeInput from '../components/TimeInput';
import Demographics from '../components/Demographics';
import AltitudeAdjustmentComponent from "../components/AltitudeAdjustmentComponent";
import Divider from '../components/Divider';


const BestScoreSection = ({ title, exercises, scores, bestValues, onExerciseChange }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    sectionContainer: {
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardTitle: {
        ...theme.typography.title,
        color: theme.colors.text,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    gridColumn: {
        flex: 1,
        alignItems: 'center',
        gap: theme.spacing.s,
        marginHorizontal: theme.spacing.s,
        marginVertical: theme.spacing.xs,
    },
    scoreRow: {
        width: '100%',
    }
  });

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} style={{ margin: theme.spacing.s }} />
        <Text style={[styles.cardTitle, {marginLeft: theme.spacing.s, marginRight: theme.spacing.m}]}>{title}</Text>
      </View>
        <SegmentedSelector
            options={exercises.map(e => ({ label: e.label, value: e.value }))}
            selectedValue={exercises[0].value} // Placeholder
            onValueChange={onExerciseChange}
        />
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
        <IconRow icons={scores.map(s => ({ text: String(s) }))} borderRadius={theme.borderRadius.m} />
      </View>
    </View>
  );
};

export default function BestScoreScreen() {
  const { theme, themeMode, toggleTheme } = useTheme();
  const score = { totalScore: 100, isPass: true }; // Dummy score

  const [age, setAge] = React.useState("");
  const [gender, setGender] = React.useState("male");
  const [altitudeGroup, setAltitudeGroup] = React.useState("normal");

  const getThemeIcon = () => {
    if (themeMode === 'light') return ICONS.THEME_LIGHT;
    if (themeMode === 'dark') return ICONS.THEME_DARK;
    return ICONS.THEME_AUTO;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.s,
      paddingVertical: theme.spacing.xs,

    },
    card: {
        flex: 1,
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
                name: themeMode === 'auto' ? ICONS.HOME_FILLED : ICONS.HOME,
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
                <Demographics age={age} setAge={setAge} gender={gender} setGender={setGender} />
                <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                <BestScoreSection 
                    title="Strength" 
                    exercises={strengthExercises} 
                    scores={strengthScores} 
                    bestValues={strengthBestValues} 
                />
                <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                <BestScoreSection 
                    title="Core" 
                    exercises={coreExercises} 
                    scores={coreScores} 
                    bestValues={coreBestValues} 
                />
                <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                <BestScoreSection 
                    title="Cardio" 
                    exercises={cardioExercises} 
                    scores={cardioScores} 
                    bestValues={cardioBestValues} 
                />
                <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                <AltitudeAdjustmentComponent selectedValue={altitudeGroup} onValueChange={setAltitudeGroup} />
            </ScrollView>
        </Card>
    </View>
  );
}