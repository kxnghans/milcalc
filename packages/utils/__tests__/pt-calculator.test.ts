/**
 * @file pt-calculator.test.ts
 * @description Unit tests for the PT calculator logic in pt-calculator.ts.
 * @see ../TESTING.md
 */

import { calculatePtScore, getScoreForExercise, calculateBestScore } from '../src/pt-calculator';
import { mockStandards, mockWalkStandards, mockAltitudeAdjustments } from './test-mocks/pt-data-mocks';

describe('PT Calculator', () => {
    describe('calculatePtScore - Male <25', () => {
        const standards = mockStandards["Male"]["<25"];

        it('should calculate a perfect score', () => {
            const inputs = {
                age: 24,
                gender: 'Male',
                isStrengthExempt: false,
                pushupComponent: 'hand_release_pushups_2min',
                pushups: 40,
                isCoreExempt: false,
                coreComponent: 'cross_leg_reverse_crunch_2min',
                reverseCrunches: 49,
                isCardioExempt: false,
                cardioComponent: 'run',
                runMinutes: 9,
                runSeconds: 12,
            };
            const result = calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            expect(result.totalScore).toBe(100);
            expect(result.pushupScore).toBe(20);
            expect(result.coreScore).toBe(20);
            expect(result.cardioScore).toBe(60);
            expect(result.isPass).toBe(true);
        });

        it('should calculate a passing score with medium values', () => {
            const inputs = {
                age: 24,
                gender: 'Male',
                pushupComponent: 'hand_release_pushups_2min',
                pushups: 30,
                coreComponent: 'cross_leg_reverse_crunch_2min',
                reverseCrunches: 35,
                cardioComponent: 'run',
                runMinutes: 12,
                runSeconds: 34,
            };
            const result = calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            expect(result.totalScore).toBeCloseTo(83); // (16 + 15 + 52)
            expect(result.isPass).toBe(true);
        });

        it('should fail with one component score at 0', () => {
            const inputs = {
                age: 24,
                gender: 'Male',
                pushupComponent: 'hand_release_pushups_2min',
                pushups: 40, // 20 pts
                coreComponent: 'cross_leg_reverse_crunch_2min',
                reverseCrunches: 49, // 20 pts
                cardioComponent: 'run',
                runMinutes: 20, // 0 pts
                runSeconds: 0,
            };
            const result = calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            expect(result.cardioScore).toBe(0);
            expect(result.isPass).toBe(false);
        });

        it('should apply altitude adjustment for run', () => {
            const inputs = {
                age: 24,
                gender: 'Male',
                pushupComponent: 'push_ups_1min',
                coreComponent: 'sit_ups_1min',
                cardioComponent: 'run',
                runMinutes: 9, // Raw time 9:14 (554s). Adj: 554-2=552s (9:12). Score is 60.
                runSeconds: 14,
                altitudeGroup: 'group1'
            };
            const result = calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            expect(result.cardioScore).toBe(60);
        });
    });

    describe('calculatePtScore - Female 35-39', () => {
        const standards = mockStandards["Female"]["35-39"];

        it('should calculate a score with push_ups and sit_ups', () => {
            const inputs = {
                age: 36,
                gender: 'Female',
                pushupComponent: 'push_ups_1min',
                pushups: 25,
                coreComponent: 'sit_ups_1min',
                situps: 30,
                cardioComponent: 'run',
                runMinutes: 15,
                runSeconds: 21,
            };
            const result = calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            expect(result.totalScore).toBeCloseTo(84); // 15 + 15 + 54
            expect(result.isPass).toBe(true);
        });

        it('should handle walk test (pass)', () => {
            const inputs = {
                age: 38,
                gender: 'Female',
                pushupComponent: 'push_ups_1min',
                pushups: 42,
                coreComponent: 'sit_ups_1min',
                situps: 43,
                cardioComponent: 'walk',
                walkMinutes: 17,
                walkSeconds: 0,
            };
            const result = calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            // Score is (20 + 20) / 40 * 100 = 100
            expect(result.totalScore).toBe(100);
            expect(result.walkPassed).toBe('pass');
            expect(result.isPass).toBe(true);
        });

        it('should handle walk test with altitude (fail)', () => {
            const inputs = {
                age: 38,
                gender: 'Female',
                pushupComponent: 'push_ups_1min',
                pushups: 42,
                coreComponent: 'sit_ups_1min',
                situps: 43,
                cardioComponent: 'walk',
                walkMinutes: 19,
                walkSeconds: 0,
                altitudeGroup: 'group1'
            };
            const result = calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            // Max time at altitude is 18:45 (1125s). User time is 19:00 (1140s).
            expect(result.walkPassed).toBe('fail');
            expect(result.isPass).toBe(false);
        });
    });

    describe('Exemptions', () => {
        const standards = mockStandards["Male"]["<25"];

        it('should calculate correctly with one component exempt', () => {
            const inputs = {
                age: 24,
                gender: 'Male',
                isStrengthExempt: true,
                pushupComponent: 'hand_release_pushups_2min',
                pushups: 0,
                coreComponent: 'cross_leg_reverse_crunch_2min',
                reverseCrunches: 49, // 20 pts
                cardioComponent: 'run',
                runMinutes: 9, // 60 pts
                runSeconds: 12,
            };
            const result = calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            // Score = (20 + 60) / 80 * 100 = 100
            expect(result.totalScore).toBe(100);
            expect(result.pushupScore).toBe('Exempt');
            expect(result.isPass).toBe(true);
        });

        it('should calculate correctly with two components exempt', () => {
            const inputs = {
                age: 24,
                gender: 'Male',
                isStrengthExempt: true,
                isCoreExempt: true,
                pushupComponent: 'push_ups_1min',
                coreComponent: 'sit_ups_1min',
                cardioComponent: 'run',
                runMinutes: 9, // 60 pts
                runSeconds: 12,
            };
            const result = calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            // Score = 60 / 60 * 100 = 100
            expect(result.totalScore).toBe(100);
            expect(result.isPass).toBe(true);
        });

        it('should pass with 100 if all components are exempt', () => {
            const inputs = {
                age: 24,
                gender: 'Male',
                isStrengthExempt: true,
                isCoreExempt: true,
                isCardioExempt: true,
                pushupComponent: 'push_ups_1min',
                coreComponent: 'sit_ups_1min',
                cardioComponent: 'run',
            };
            const result = calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            expect(result.totalScore).toBe(100);
            expect(result.isPass).toBe(true);
        });
    });

    describe('getScoreForExercise', () => {
        const standards = mockStandards["Male"]["<25"];

        it('should calculate score for push_ups_1min', () => {
            expect(getScoreForExercise(standards, 'push_ups_1min', { reps: 67 })).toBe(20);
            expect(getScoreForExercise(standards, 'push_ups_1min', { reps: 40 })).toBe(13.6);
        });

        it('should calculate score for hand_release_pushups_2min using reps property (BUG FIX CHECK)', () => {
            // This explicitly checks that passing { reps: 40 } works, confirming the fix
            expect(getScoreForExercise(standards, 'hand_release_pushups_2min', { reps: 40 })).toBe(20);
            expect(getScoreForExercise(standards, 'hand_release_pushups_2min', { reps: 30 })).toBe(16);
        });

        it('should calculate score for sit_ups_1min', () => {
            expect(getScoreForExercise(standards, 'sit_ups_1min', { reps: 58 })).toBe(20);
            expect(getScoreForExercise(standards, 'sit_ups_1min', { reps: 42 })).toBe(12);
        });

        it('should calculate score for cross_leg_reverse_crunch_2min', () => {
            expect(getScoreForExercise(standards, 'cross_leg_reverse_crunch_2min', { reps: 49 })).toBe(20);
            expect(getScoreForExercise(standards, 'cross_leg_reverse_crunch_2min', { reps: 35 })).toBe(15);
        });

        it('should calculate score for forearm_plank_time', () => {
            expect(getScoreForExercise(standards, 'forearm_plank_time', { minutes: 3, seconds: 35 })).toBe(20);
            expect(getScoreForExercise(standards, 'forearm_plank_time', { minutes: 2, seconds: 30 })).toBe(15.3);
        });

        it('should calculate score for run', () => {
            expect(getScoreForExercise(standards, 'run', { minutes: 9, seconds: 12 })).toBe(60);
            expect(getScoreForExercise(standards, 'run', { minutes: 12, seconds: 0 })).toBe(54);
        });

        it('should calculate score for run with altitude adjustment', () => {
            // Raw time 9:14 (554s). Group 1 Adj: -2s = 552s (9:12). Score should be 60.
            expect(getScoreForExercise(standards, 'run', { minutes: 9, seconds: 14 }, 'group1', mockAltitudeAdjustments)).toBe(60);
        });

        it('should calculate score for shuttles', () => {
            expect(getScoreForExercise(standards, 'shuttles', { shuttles: 101 })).toBe(60);
            expect(getScoreForExercise(standards, 'shuttles', { shuttles: 50 })).toBe(46.5);
        });

        it('should calculate score for shuttles with altitude adjustment', () => {
            // Raw 47 shuttles (44.0 pts). Group 1 Adj: +1 = 48 shuttles (46.5 pts).
            // Using logic: passing altitude adjustments should increase effective shuttles.
            const scoreWithoutAltitude = getScoreForExercise(standards, 'shuttles', { shuttles: 47 });
            const scoreWithAltitude = getScoreForExercise(standards, 'shuttles', { shuttles: 47 }, 'group1', mockAltitudeAdjustments);
            expect(scoreWithAltitude).toBeGreaterThan(scoreWithoutAltitude);
        });
    });

    describe('calculateBestScore', () => {
        it('should select the highest scores from each category', () => {
            const scores = {
                push_ups_1min: 15,
                hand_release_pushups_2min: 20, // Better strength
                sit_ups_1min: 18,
                cross_leg_reverse_crunch_2min: 19,
                forearm_plank_time: 20, // Better core
                run: 55,
                shuttles: 60, // Better cardio
            };
            // Total should be 20 + 20 + 60 = 100
            expect(calculateBestScore(scores)).toBe(100);
        });

        it('should handle missing values by treating them as 0', () => {
            const scores = {
                push_ups_1min: 15,
                // hand_release_pushups_2min missing
                sit_ups_1min: 18,
                // others missing
                run: 55,
            };
            // 15 + 18 + 55 = 88 / 100 * 100 = 88
            expect(calculateBestScore(scores)).toBe(88);
        });

        it('should handle exemptions correctly', () => {
            const scores = {
                push_ups_1min: 'Exempt',
                hand_release_pushups_2min: 0,
                sit_ups_1min: 20,
                cross_leg_reverse_crunch_2min: 0,
                forearm_plank_time: 0,
                run: 60,
                shuttles: 0,
            };
            // Exempt strength (total possible 80). Earned: 20 + 60 = 80. Score: 80/80 * 100 = 100.
            expect(calculateBestScore(scores)).toBe(100);
        });

        it('should return 100 if all are exempt', () => {
            const scores = {
                push_ups_1min: 'Exempt',
                sit_ups_1min: 'Exempt',
                run: 'Exempt',
            };
            expect(calculateBestScore(scores)).toBe(100);
        });
        
        it('should return 0 if all are exempt but fail condition triggers (edge case check)', () => {
             const scores = {
                push_ups_1min: 0,
                sit_ups_1min: 0,
                run: 0,
            };
            expect(calculateBestScore(scores)).toBe(0);
        });
    });
});
