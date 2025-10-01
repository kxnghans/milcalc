import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, IconRow, useTheme, SegmentedSelector, NeumorphicOutset, Icon, useScoreColors } from '@repo/ui';
import { ICONS } from '@repo/ui/icons';
import { getScoreForExercise, calculateBestScore, checkWalkPass, getScoreCategory } from '@repo/utils';
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

  const [pushUps, setPushUps] = React.useState("");
  const [hrPushUps, setHrPushUps] = React.useState("");
  const [sitUps, setSitUps] = React.useState("");
  const [crunches, setCrunches] = React.useState("");
  const [plankMinutes, setPlankMinutes] = React.useState("");
  const [plankSeconds, setPlankSeconds] = React.useState("");
  const [runMinutes, setRunMinutes] = React.useState("");
  const [runSeconds, setRunSeconds] = React.useState("");
  const [shuttles, setShuttles] = React.useState("");
  const [walkMinutes, setWalkMinutes] = React.useState("");
  const [walkSeconds, setWalkSeconds] = React.useState("");

  const [scores, setScores] = React.useState({});
  const [bestScore, setBestScore] = React.useState(0);

  React.useEffect(() => {
    const newScores = {
        push_ups_1min: getScoreForExercise(Number(age), gender, 'push_ups_1min', { reps: Number(pushUps) }),
        hand_release_pushups_2min: getScoreForExercise(Number(age), gender, 'hand_release_pushups_2min', { reps: Number(hrPushUps) }),
        sit_ups_1min: getScoreForExercise(Number(age), gender, 'sit_ups_1min', { reps: Number(sitUps) }),
        cross_leg_reverse_crunch_2min: getScoreForExercise(Number(age), gender, 'cross_leg_reverse_crunch_2min', { reps: Number(crunches) }),
        forearm_plank_time: getScoreForExercise(Number(age), gender, 'forearm_plank_time', { minutes: Number(plankMinutes), seconds: Number(plankSeconds) }),
        run: getScoreForExercise(Number(age), gender, 'run', { minutes: Number(runMinutes), seconds: Number(runSeconds) }, altitudeGroup),
        shuttles: getScoreForExercise(Number(age), gender, 'shuttles', { shuttles: Number(shuttles) }, altitudeGroup),
    };
    setScores(newScores);
    setBestScore(calculateBestScore(newScores));
  }, [age, gender, pushUps, hrPushUps, sitUps, crunches, plankMinutes, plankSeconds, runMinutes, runSeconds, shuttles, walkMinutes, walkSeconds, altitudeGroup]);

  const strengthExercises = [
    { label: '1-Min Push-ups', value: 'push_ups_1min', type: 'number', onValueChange: setPushUps },
    { label: '2-Min HR Push-ups', value: 'hand_release_pushups_2min', type: 'number', onValueChange: setHrPushUps },
  ];
  const strengthScores = [scores.push_ups_1min || 0, scores.hand_release_pushups_2min || 0];
  const strengthBestValues = { push_ups_1min: pushUps, hand_release_pushups_2min: hrPushUps };

  const coreExercises = [
    { label: '1-Min Sit-ups', value: 'sit_ups_1min', type: 'number', onValueChange: setSitUps },
    { label: '2-Min CL Crunch', value: 'cross_leg_reverse_crunch_2min', type: 'number', onValueChange: setCrunches },
    { label: 'Forearm Planks', value: 'forearm_plank_time', type: 'time', onValueChange: (value) => { setPlankMinutes(value.minutes); setPlankSeconds(value.seconds); } },
  ];
  const coreScores = [scores.sit_ups_1min || 0, scores.cross_leg_reverse_crunch_2min || 0, scores.forearm_plank_time || 0];
  const coreBestValues = { sit_ups_1min: sitUps, cross_leg_reverse_crunch_2min: crunches, forearm_plank_time: { minutes: plankMinutes, seconds: plankSeconds } };

  const cardioExercises = [
    { label: '1.5-Mile Run', value: 'run', type: 'time', onValueChange: (value) => { setRunMinutes(value.minutes); setRunSeconds(value.seconds); } },
    { label: '20m HAMR', value: 'shuttles', type: 'number', onValueChange: setShuttles },
    { label: '2-km Walk', value: 'walk', type: 'time', onValueChange: (value) => { setWalkMinutes(value.minutes); setWalkSeconds(value.seconds); } },
  ];
  const cardioScores = [scores.run || 0, scores.shuttles || 0, checkWalkPass(Number(age), gender, Number(walkMinutes), Number(walkSeconds), altitudeGroup)];
  const cardioBestValues = { run: { minutes: runMinutes, seconds: runSeconds }, shuttles: shuttles, walk: { minutes: walkMinutes, seconds: walkSeconds } };


  return (
    <View style={styles.container}>
        <ScoreDisplay score={{ totalScore: bestScore, isPass: bestScore >= 75 }} showBreakdown={false} />
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