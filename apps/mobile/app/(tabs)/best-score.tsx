import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  Card,
  IconRow,
  useTheme,
  SegmentedSelector,
  Icon,
  useScoreColors,
  useDemographicsState,
  useBestScoreState
} from '@repo/ui';
import { ICONS } from '@repo/ui/icons';
import { getScoreCategory } from '@repo/utils';
import ScoreDisplay from '../components/ScoreDisplay';
import NumberInput from '../components/NumberInput';
import TimeInput from '../components/TimeInput';
import Demographics from '../components/Demographics';
import AltitudeAdjustmentComponent from "../components/AltitudeAdjustmentComponent";
import Divider from '../components/Divider';

const BestScoreSection = ({ title, exercises, scores, bestValues, maxScore }) => {
  const { theme } = useTheme();

  const excellentColors = useScoreColors('excellent');
  const passColors = useScoreColors('pass');
  const failColors = useScoreColors('fail');

  const getColorForScore = (score) => {
    const category = getScoreCategory(score, maxScore);
    switch(category) {
        case 'excellent': return excellentColors;
        case 'pass': return passColors;
        case 'fail': return failColors;
        default: return {};
    }
  }

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
    },
    scoreBreakdownText: {
        ...theme.typography.subtitle,
        textShadowColor: theme.colors.neumorphic.outset.shadow,
        textShadowRadius: 0.1,
        textShadowOffset: { width: 0, height: 0 },
    },
  });

  const maxNumericScore = Math.max(0, ...scores.filter(s => typeof s === 'number'));
  let selectedExerciseValues = [];

  if (maxNumericScore > 0) {
      selectedExerciseValues = scores.reduce((acc, score, index) => {
          if (score === maxNumericScore) {
              acc.push(exercises[index].value);
          }
          return acc;
      }, []);
  }

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} style={{ margin: theme.spacing.s }} />
        <Text style={[styles.cardTitle, {marginLeft: theme.spacing.s, marginRight: theme.spacing.m}]}>{title}</Text>
      </View>
        <SegmentedSelector
            options={exercises.map(e => ({ label: e.label, value: e.value }))}
            selectedValues={selectedExerciseValues}
            onValueChange={() => {}}
        />
      <View style={styles.gridContainer}>
        {exercises.map((exercise, index) => (
            <View key={index} style={styles.gridColumn}>
                {exercise.type === 'number' ? 
                    <NumberInput value={bestValues[exercise.value]} onChangeText={exercise.onValueChange} placeholder='--' style={{width: '100%'}} /> : 
                    <TimeInput minutes={bestValues[exercise.value]?.minutes} seconds={bestValues[exercise.value]?.seconds} setMinutes={(minutes) => exercise.onValueChange({ minutes, seconds: bestValues[exercise.value]?.seconds })} setSeconds={(seconds) => exercise.onValueChange({ minutes: bestValues[exercise.value]?.minutes, seconds })} style={{width: '100%'}} />
                }
            </View>
        ))}
      </View>
      <View style={styles.scoreRow}>
        <IconRow 
            icons={scores.map((s, index) => {
                const isWalk = exercises[index]?.value === 'walk';
                const isBestNumeric = s === maxNumericScore && typeof s === 'number' && maxNumericScore > 0;

                let colors = {};
                let text = String(s);

                if (isWalk) {
                    colors = getColorForScore(s);
                    if (s === 'pass') text = 'Pass';
                    else if (s === 'fail') text = 'Fail';
                    else text = 'N/A';
                } else if (isBestNumeric) {
                    colors = getColorForScore(s);
                }

                return { 
                    text,
                    textStyle: styles.scoreBreakdownText,
                    ...colors 
                };
            })} 
            borderRadius={theme.borderRadius.m} 
        />
      </View>
    </View>
  );
};

export default function BestScoreScreen() {
  const { theme, themeMode, toggleTheme } = useTheme();
  
  const { age, setAge, gender, setGender, altitudeGroup, setAltitudeGroup } = useDemographicsState();
  const { inputs, outputs } = useBestScoreState(age, gender, altitudeGroup);

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

  const strengthExercises = [
    { label: '1-Min Push-ups', value: 'push_ups_1min', type: 'number', onValueChange: inputs.setPushUps },
    { label: '2-Min HR Push-ups', value: 'hand_release_pushups_2min', type: 'number', onValueChange: inputs.setHrPushUps },
  ];
  const strengthScores = [outputs.scores.push_ups_1min || 0, outputs.scores.hand_release_pushups_2min || 0];
  const strengthBestValues = { push_ups_1min: inputs.pushUps, hand_release_pushups_2min: inputs.hrPushUps };

  const coreExercises = [
    { label: '1-Min Sit-ups', value: 'sit_ups_1min', type: 'number', onValueChange: inputs.setSitUps },
    { label: '2-Min CL Crunch', value: 'cross_leg_reverse_crunch_2min', type: 'number', onValueChange: inputs.setCrunches },
    { label: 'Forearm Planks', value: 'forearm_plank_time', type: 'time', onValueChange: (value) => { inputs.setPlankMinutes(value.minutes); inputs.setPlankSeconds(value.seconds); } },
  ];
  const coreScores = [outputs.scores.sit_ups_1min || 0, outputs.scores.cross_leg_reverse_crunch_2min || 0, outputs.scores.forearm_plank_time || 0];
  const coreBestValues = { sit_ups_1min: inputs.sitUps, cross_leg_reverse_crunch_2min: inputs.crunches, forearm_plank_time: { minutes: inputs.plankMinutes, seconds: inputs.plankSeconds } };

  const cardioExercises = [
    { label: '1.5-Mile Run', value: 'run', type: 'time', onValueChange: (value) => { inputs.setRunMinutes(value.minutes); inputs.setRunSeconds(value.seconds); } },
    { label: '20m HAMR', value: 'shuttles', type: 'number', onValueChange: inputs.setShuttles },
    { label: '2-km Walk', value: 'walk', type: 'time', onValueChange: (value) => { inputs.setWalkMinutes(value.minutes); inputs.setWalkSeconds(value.seconds); } },
  ];
  const cardioScores = [outputs.scores.run || 0, outputs.scores.shuttles || 0, outputs.scores.walk || 'N/A'];
  const cardioBestValues = { run: { minutes: inputs.runMinutes, seconds: inputs.runSeconds }, shuttles: inputs.shuttles, walk: { minutes: inputs.walkMinutes, seconds: inputs.walkSeconds } };


  return (
    <View style={styles.container}>
        <ScoreDisplay score={{ totalScore: outputs.bestScore, isPass: outputs.bestScore >= 75 }} showBreakdown={false} />
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
                    maxScore={20}
                />
                <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                <BestScoreSection 
                    title="Core" 
                    exercises={coreExercises} 
                    scores={coreScores} 
                    bestValues={coreBestValues} 
                    maxScore={20}
                />
                <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                <BestScoreSection 
                    title="Cardio" 
                    exercises={cardioExercises} 
                    scores={cardioScores} 
                    bestValues={cardioBestValues} 
                    maxScore={60}
                />
                <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                <AltitudeAdjustmentComponent selectedValue={altitudeGroup} onValueChange={setAltitudeGroup} />
            </ScrollView>
        </Card>
    </View>
  );
}