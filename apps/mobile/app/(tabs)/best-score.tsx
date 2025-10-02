/**
 * @file best-score.tsx
 * @description This file defines the "Best Score" screen of the mobile application.
 * It allows users to input their personal bests for each PT exercise component
 * and calculates their best possible overall score based on these individual achievements.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Card,
  IconRow,
  useTheme,
  SegmentedSelector,
  Icon,
  useScoreColors,
  useDemographicsState,
  useBestScoreState,
  ExemptButton
} from '@repo/ui';
import { ICONS } from '@repo/ui/icons';
import { getScoreCategory } from '@repo/utils';
import ScoreDisplay from '../components/ScoreDisplay';
import NumberInput from '../components/NumberInput';
import TimeInput from '../components/TimeInput';
import Demographics from '../components/Demographics';
import AltitudeAdjustmentComponent from "../components/AltitudeAdjustmentComponent";
import Divider from '../components/Divider';
import PdfModal from '../components/PdfModal';
import DetailModal from '../components/DetailModal';

/**
 * A component that renders a section for a specific PT category (Strength, Core, Cardio).
 * It displays the exercises within that category, inputs for the user's best performance,
 * and the corresponding scores.
 * @param {object} props - The component props.
 * @returns {JSX.Element} The rendered section.
 */
const BestScoreSection = ({ title, exercises, scores, bestValues, maxScore, isExempt, onToggleExempt, openDetailModal }) => {
  const { theme } = useTheme();

  const excellentColors = useScoreColors('excellent');
  const passColors = useScoreColors('pass');
  const failColors = useScoreColors('fail');

  /**
   * Determines the color for a score based on its category (excellent, pass, fail).
   * @param {number} score - The score to evaluate.
   * @param {number} maxScore - The maximum possible score for the component.
   * @returns {string} The color code for the score.
   */
  const getScoreColor = (score, maxScore) => {
    const category = getScoreCategory(score, maxScore);
    if (category === 'excellent') return excellentColors.progressColor;
    if (category === 'pass') return passColors.progressColor;
    if (category === 'fail') return failColors.progressColor;
    return theme.colors.text;
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

  // Find the highest score among the numeric scores in the category
  const maxNumericScore = Math.max(0, ...scores.filter(s => typeof s === 'number'));
  let selectedExerciseValues = [];

  // Identify which exercise(s) achieved the highest score to highlight them in the UI
  if (maxNumericScore > 0 && !isExempt) {
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
        <TouchableOpacity onPress={() => openDetailModal(`best_score_${title.toLowerCase()}`)}>
            <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} style={{ margin: theme.spacing.s }} />
        </TouchableOpacity>
        <Text style={[styles.cardTitle, {marginLeft: theme.spacing.s, marginRight: 'auto'}]}>{title}</Text>
        <ExemptButton onPress={onToggleExempt} isActive={isExempt} />
      </View>
        <SegmentedSelector
            options={exercises.map(e => ({ label: e.label, value: e.value }))}
            selectedValues={selectedExerciseValues}
            onValueChange={() => {}}
            isTouchable={false} // Non-interactive, for display only
        />
      <View style={styles.gridContainer}>
        {exercises.map((exercise, index) => (
            <View key={index} style={styles.gridColumn}>
                {/* Render either a number or time input based on exercise type */}
                {exercise.type === 'number' ? 
                    <NumberInput value={bestValues[exercise.value]} onChangeText={exercise.onValueChange} placeholder='--' style={{width: '100%'}} isExempt={isExempt} /> : 
                    <TimeInput minutes={bestValues[exercise.value]?.minutes} seconds={bestValues[exercise.value]?.seconds} setMinutes={(minutes) => exercise.onValueChange({ minutes, seconds: bestValues[exercise.value]?.seconds })} setSeconds={(seconds) => exercise.onValueChange({ minutes: bestValues[exercise.value]?.minutes, seconds })} style={{width: '100%'}} isExempt={isExempt} />
                }
            </View>
        ))}
      </View>
      <View style={styles.scoreRow}>
        <IconRow 
            icons={scores.map((s, index) => {
                const isWalk = exercises[index]?.value === 'walk';
                let text = s ? String(s) : '0';
                let color = theme.colors.text; // Default color

                if (isExempt) {
                    text = 'Exempt';
                    color = theme.colors.disabled;
                } else if (isWalk) {
                    // Special handling for walk component pass/fail status
                    if (s === 'pass') {
                        color = passColors.progressColor;
                        text = 'Pass';
                    } else if (s === 'fail') {
                        color = failColors.progressColor;
                        text = 'Fail';
                    } else {
                        text = 'N/A';
                        color = theme.colors.disabled;
                    }
                } else {
                    // Highlight the best score in the category
                    const isBestNumeric = typeof s === 'number' && s === maxNumericScore;
                    if (isBestNumeric) {
                        if (s === 0) {
                            color = failColors.progressColor;
                        } else {
                            color = getScoreColor(s, maxScore);
                        }
                    }
                }

                return {
                    text,
                    textStyle: styles.scoreBreakdownText,
                    color,
                };
            })} 
            borderRadius={theme.borderRadius.m} 
        />
      </View>
    </View>
  );
};

/**
 * The main screen component for the "Best Score" calculator.
 * It integrates demographics, exercise inputs, and score displays.
 */
export default function BestScoreScreen() {
  const { theme, themeMode, toggleTheme } = useTheme();
  const [isPdfModalVisible, setPdfModalVisible] = React.useState(false);
  const [detailModalContentKey, setDetailModalContentKey] = React.useState<string | null>(null);

  const openDetailModal = (key: string) => setDetailModalContentKey(key);
  const closeDetailModal = () => setDetailModalContentKey(null);
  
  // State for user demographics (age, gender, altitude)
  const { age, setAge, gender, setGender, altitudeGroup, setAltitudeGroup } = useDemographicsState();
  // Custom hook to manage the state and logic for the best score calculation
  const { inputs, outputs, exemptions } = useBestScoreState(age, gender, altitudeGroup);

  /**
   * Gets the appropriate icon for the current theme setting (light, dark, or auto).
   * @returns {string} The name of the icon to display.
   */
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

  // Data definitions for each exercise category
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
        <PdfModal isModalVisible={isPdfModalVisible} setModalVisible={setPdfModalVisible} />
        <DetailModal isVisible={!!detailModalContentKey} onClose={closeDetailModal} contentKey={detailModalContentKey} />
        <ScoreDisplay score={{ totalScore: outputs.bestScore, isPass: outputs.bestScore >= 75 }} showBreakdown={false} />
        <IconRow
            icons={[
            {
                name: themeMode === 'auto' ? ICONS.HOME_FILLED : ICONS.HOME,
                href: '(tabs)/pt-calculator',
            },
            {
                name: ICONS.PDF,
                onPress: () => setPdfModalVisible(true),
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
                    isExempt={exemptions.isStrengthExempt}
                    onToggleExempt={exemptions.toggleStrengthExempt}
                    openDetailModal={openDetailModal}
                />
                <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                <BestScoreSection 
                    title="Core" 
                    exercises={coreExercises} 
                    scores={coreScores} 
                    bestValues={coreBestValues} 
                    maxScore={20}
                    isExempt={exemptions.isCoreExempt}
                    onToggleExempt={exemptions.toggleCoreExempt}
                    openDetailModal={openDetailModal}
                />
                <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                <BestScoreSection 
                    title="Cardio" 
                    exercises={cardioExercises} 
                    scores={cardioScores} 
                    bestValues={cardioBestValues} 
                    maxScore={60}
                    isExempt={exemptions.isCardioExempt}
                    onToggleExempt={exemptions.toggleCardioExempt}
                    openDetailModal={openDetailModal}
                />
                <Divider style={{ marginTop: theme.spacing.s, marginBottom: theme.spacing.s }} />
                <AltitudeAdjustmentComponent selectedValue={altitudeGroup} onValueChange={setAltitudeGroup} openDetailModal={openDetailModal} />
            </ScrollView>
        </Card>
    </View>
  );
}