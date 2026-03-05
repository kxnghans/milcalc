/**
 * @file best-score.tsx
 * @description This file defines the "Best Score" screen of the mobile application.
 * It allows users to input their personal bests for each PT exercise component
 * and calculates their best possible overall score based on these individual achievements.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  Card,
  IconRow,
  useTheme,
  SegmentedSelector,
  Icon,
  useScoreColors,
  useDemographicsState,
  useBestScoreState,
  ExemptButton,
  MASCOT_URLS
} from '@repo/ui';
import { ICONS } from '@repo/ui/icons';
import { getScoreCategory } from '@repo/utils';
import ScoreDisplay from '../../components/ScoreDisplay';
import NumberInput from '../../components/NumberInput';
import TimeInput from '../../components/TimeInput';
import Demographics from '../../components/Demographics';
import AltitudeAdjustmentComponent from "../../components/AltitudeAdjustmentComponent";
import Divider from '../../components/Divider';
import DocumentModal from '../../components/DocumentModal';
import DetailModal from '../../components/DetailModal';
import DismissKeyboardView from '../../components/DismissKeyboardView';
import ScreenHeader from '../../components/ScreenHeader';

/**
 * A component that renders a section for a specific PT category (Strength, Core, Cardio).
 * It displays the exercises within that category, inputs for the user's best performance,
 * and the corresponding scores.
 * @param {object} props - The component props.
 * @returns {JSX.Element} The rendered section.
 */
type BestScoreExercise = 
  | { label: string; value: string; type: 'number'; onValueChange: (val: string) => void }
  | { label: string; value: string; type: 'time'; onValueChange: (val: { minutes: string; seconds: string }) => void };

interface BestScoreSectionProps {
  title: string;
  exercises: BestScoreExercise[];
  scores: (number | string)[];
  bestValues: Record<string, string | { minutes: string; seconds: string }>;
  maxScore: number;
  isExempt: boolean;
  onToggleExempt: () => void;
  openDetailModal: (key: string, mascot: ImageSourcePropType) => void;
}

const BestScoreSection = ({ 
  title, 
  exercises, 
  scores, 
  bestValues, 
  maxScore, 
  isExempt, 
  onToggleExempt, 
  openDetailModal 
}: BestScoreSectionProps) => {
  const { theme } = useTheme();

  const excellentColors = useScoreColors('excellent');
  const passColors = useScoreColors('pass');
  const failColors = useScoreColors('fail');

  const getScoreColor = (score: number | string, maxScore: number) => {
    const numericScore = typeof score === 'number' ? score : parseFloat(String(score)) || 0;
    const category = getScoreCategory(numericScore, maxScore);
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
        marginLeft: theme.spacing.s,
        marginRight: 'auto',
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
    helpIcon: {
        margin: theme.spacing.s,
    },
    fullWidth: {
        width: '100%',
    },
  });

  const maxNumericScore = Math.max(0, ...scores.filter((s): s is number => typeof s === 'number'));
  let selectedExerciseValues: string[] = [];

  if (maxNumericScore > 0 && !isExempt) {
      selectedExerciseValues = scores.reduce((acc: string[], score, index) => {
          if (score === maxNumericScore) {
              acc.push(exercises[index].value);
          }
          return acc;
      }, []);
  }

  const getMascot = (sectionTitle: string): ImageSourcePropType => {
    switch (sectionTitle) {
      case "Strength":
        return { uri: MASCOT_URLS.PUSHUP };
      case "Core":
        return { uri: MASCOT_URLS.CRUNCH };
      case "Cardio":
        return { uri: MASCOT_URLS.RUN };
      default:
        return { uri: MASCOT_URLS.SPLASH };
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <TouchableOpacity onPress={() => openDetailModal(`best_score_${title.toLowerCase()}`, getMascot(title))}>
            <Icon name={ICONS.HELP} size={16} color={theme.colors.disabled} style={styles.helpIcon} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>{title}</Text>
        <ExemptButton onPress={onToggleExempt} isActive={isExempt} />
      </View>
        <SegmentedSelector
            options={exercises.map(e => ({ label: e.label, value: e.value }))}
            selectedValues={selectedExerciseValues}
            onValueChange={() => {}}
            isTouchable={false}
        />
      <View style={styles.gridContainer}>
        {exercises.map((exercise, index) => {
            const exerciseValue = bestValues[exercise.value];
            const isTimeType = exercise.type === 'time' && typeof exerciseValue === 'object';
            return (
                <View key={index} style={styles.gridColumn}>
                    {exercise.type === 'number' ? 
                        <NumberInput value={exerciseValue as string} onChangeText={exercise.onValueChange as (text: string) => void} placeholder='--' style={styles.fullWidth} isExempt={isExempt} /> : 
                        <TimeInput 
                            minutes={isTimeType ? exerciseValue.minutes : ''} 
                            seconds={isTimeType ? exerciseValue.seconds : ''} 
                            setMinutes={(minutes) => exercise.onValueChange({ minutes, seconds: isTimeType ? exerciseValue.seconds : '' })} 
                            setSeconds={(seconds) => exercise.onValueChange({ minutes: isTimeType ? exerciseValue.minutes : '', seconds })} 
                            style={styles.fullWidth} 
                            isExempt={isExempt} 
                        />
                    }
                </View>
            );
        })}
      </View>
      <View style={styles.scoreRow}>
        <IconRow 
            icons={scores.map((s, index) => {
                const isWalk = exercises[index]?.value === 'walk';
                let text = s ? String(s) : '0';
                let color = theme.colors.text;

                if (isExempt) {
                    text = 'Exempt';
                    color = theme.colors.disabled;
                } else if (isWalk) {
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

export default function BestScoreScreen() {
  const { theme, themeMode, toggleTheme } = useTheme();
  const [isPdfModalVisible, setPdfModalVisible] = React.useState(false);
  const [detailModalContentKey, setDetailModalContentKey] = React.useState<string | null>(null);
  const [detailModalMascot, setDetailModalMascot] = React.useState<ImageSourcePropType | null>(null);
  const [detailModalSource, setDetailModalSource] = React.useState<'pt' | 'pay' | 'retirement' | 'best_score'>('best_score');

  const openDetailModal = (key: string, mascot: ImageSourcePropType, source: 'pt' | 'pay' | 'retirement' | 'best_score' = 'best_score') => {
    setDetailModalContentKey(key);
    setDetailModalMascot(mascot);
    setDetailModalSource(source);
  };

  const closeDetailModal = () => {
    setDetailModalContentKey(null);
    setDetailModalMascot(null);
  };

  const { age, setAge, gender, setGender, altitudeGroup, setAltitudeGroup } = useDemographicsState();
  const { inputs, outputs, exemptions } = useBestScoreState(age, gender, altitudeGroup);
  const { isLoading } = outputs;

  const getThemeIcon = () => {
    if (themeMode === 'light') return ICONS.THEME_LIGHT;
    if (themeMode === 'dark') return ICONS.THEME_DARK;
    return ICONS.THEME_AUTO;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.s,
        paddingVertical: theme.spacing.xs,
    },
    card: {
        flex: 1,
    },
    dismissKeyboard: {
        flex: 0, 
        width: '100%',
    },
    divider: {
        marginTop: theme.spacing.s, 
        marginBottom: theme.spacing.s,
    }
  });

  const strengthExercises: BestScoreExercise[] = [
    { label: '1-Min Push-ups', value: 'push_ups_1min', type: 'number', onValueChange: inputs.setPushUps },
    { label: '2-Min HR Push-ups', value: 'hand_release_pushups_2min', type: 'number', onValueChange: inputs.setHrPushUps },
  ];
  const strengthScores = [outputs.scores.push_ups_1min || 0, outputs.scores.hand_release_pushups_2min || 0];
  const strengthBestValues = { push_ups_1min: inputs.pushUps, hand_release_pushups_2min: inputs.hrPushUps };

  const coreExercises: BestScoreExercise[] = [
    { label: '1-Min Sit-ups', value: 'sit_ups_1min', type: 'number', onValueChange: inputs.setSitUps },
    { label: '2-Min CL Crunch', value: 'cross_leg_reverse_crunch_2min', type: 'number', onValueChange: inputs.setCrunches },
    { label: 'Forearm Planks', value: 'forearm_plank_time', type: 'time', onValueChange: (value: { minutes: string; seconds: string }) => { inputs.setPlankMinutes(value.minutes); inputs.setPlankSeconds(value.seconds); } },
  ];
  const coreScores = [outputs.scores.sit_ups_1min || 0, outputs.scores.cross_leg_reverse_crunch_2min || 0, outputs.scores.forearm_plank_time || 0];
  const coreBestValues = { sit_ups_1min: inputs.sitUps, cross_leg_reverse_crunch_2min: inputs.crunches, forearm_plank_time: { minutes: inputs.plankMinutes, seconds: inputs.plankSeconds } };

  const cardioExercises: BestScoreExercise[] = [
    { label: '1.5-Mile Run', value: 'run', type: 'time', onValueChange: (value: { minutes: string; seconds: string }) => { inputs.setRunMinutes(value.minutes); inputs.setRunSeconds(value.seconds); } },
    { label: '20m HAMR', value: 'shuttles', type: 'number', onValueChange: inputs.setShuttles },
    { label: '2-km Walk', value: 'walk', type: 'time', onValueChange: (value: { minutes: string; seconds: string }) => { inputs.setWalkMinutes(value.minutes); inputs.setWalkSeconds(value.seconds); } },
  ];
  const cardioScores = [outputs.scores.run || 0, outputs.scores.shuttles || 0, outputs.scores.walk || 'N/A'];
  const cardioBestValues = { run: { minutes: inputs.runMinutes, seconds: inputs.runSeconds }, shuttles: inputs.shuttles, walk: { minutes: inputs.walkMinutes, seconds: inputs.walkSeconds } };

  return (
    <View style={styles.container}>
        <ScreenHeader title="Best PT Score Calculator" isLoading={isLoading} />
        <DocumentModal category="PT" isModalVisible={isPdfModalVisible} setModalVisible={setPdfModalVisible} />
        <DetailModal isVisible={!!detailModalContentKey} onClose={closeDetailModal} contentKey={detailModalContentKey} source={detailModalSource} mascotAsset={detailModalMascot} />
        <View style={styles.content}>
            <DismissKeyboardView style={styles.dismissKeyboard}>
            <ScoreDisplay score={{ totalScore: outputs.bestScore, isPass: outputs.bestScore >= 75 }} showBreakdown={false} />
            <IconRow
                icons={[
                {
                    name: themeMode === 'auto' ? ICONS.HOME_FILLED : ICONS.HOME,
                    href: "/(tabs)/pt-calculator",
                },
                {
                    name: ICONS.DOCUMENT,
                    onPress: () => setPdfModalVisible(true),
                },
                {
                    name: getThemeIcon(),
                    onPress: toggleTheme,
                },
                ]}
            />
            </DismissKeyboardView>
            <Card style={styles.card}>
                <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                    <DismissKeyboardView>
                    <Demographics age={age} setAge={setAge} gender={gender} setGender={setGender} />
                    <Divider style={styles.divider} />
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
                    <Divider style={styles.divider} />
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
                    <Divider style={styles.divider} />
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
                    <Divider style={styles.divider} />
                    <AltitudeAdjustmentComponent selectedValue={altitudeGroup} onValueChange={setAltitudeGroup} openDetailModal={(key, mascot) => openDetailModal(key, mascot, 'pt')} />
                    </DismissKeyboardView>
                </KeyboardAwareScrollView>
            </Card>
        </View>
    </View>
  );
}