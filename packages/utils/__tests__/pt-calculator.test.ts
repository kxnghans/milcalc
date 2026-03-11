/**
 * @file pt-calculator.test.ts
 * @description Unit tests for the PT calculator logic in pt-calculator.ts.
 */

import { calculatePtScore, getScoreForExercise } from '../src/pt-calculator';
import { mockStandards, mockPassFailStandards, mockAltitudeCorrections, mockWalkAltThresholds } from './test-mocks/pt-data-mocks';
import { Tables } from '../src/types';

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
                whtr: 0.49,
                isWhtrExempt: false
            };
            const result = calculatePtScore(
                inputs, 
                standards, 
                mockPassFailStandards as Tables<'pt_pass_fail_standards'>[], 
                mockAltitudeCorrections as Tables<'pt_altitude_corrections'>[], 
                mockWalkAltThresholds as Tables<'pt_altitude_walk_thresholds'>[]
            );
            expect(result.totalScore).toBe(100);
            expect(result.pushupScore).toBe(15);
            expect(result.coreScore).toBe(15);
            expect(result.cardioScore).toBe(50);
            expect(result.whtrScore).toBe(20);
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
                runSeconds: 14,
                whtr: 0.49,
            };
            const result = calculatePtScore(
                inputs, 
                standards, 
                mockPassFailStandards as Tables<'pt_pass_fail_standards'>[], 
                mockAltitudeCorrections as Tables<'pt_altitude_corrections'>[], 
                mockWalkAltThresholds as Tables<'pt_altitude_walk_thresholds'>[]
            );
            // 12 + 11.2 + 45 + 20 = 88.2
            expect(result.totalScore).toBeCloseTo(88.2);
            expect(result.isPass).toBe(true);
        });

        it('should fail with one component score at 0', () => {
            const inputs = {
                age: 24,
                gender: 'Male',
                pushupComponent: 'hand_release_pushups_2min',
                pushups: 40,
                coreComponent: 'cross_leg_reverse_crunch_2min',
                reverseCrunches: 49,
                cardioComponent: 'run',
                runMinutes: 20,
                runSeconds: 0,
                whtr: 0.49,
            };
            const result = calculatePtScore(
                inputs, 
                standards, 
                mockPassFailStandards as Tables<'pt_pass_fail_standards'>[], 
                mockAltitudeCorrections as Tables<'pt_altitude_corrections'>[], 
                mockWalkAltThresholds as Tables<'pt_altitude_walk_thresholds'>[]
            );
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
                runMinutes: 9, 
                runSeconds: 14,
                altitudeGroup: 'group1',
                whtr: 0.49
            };
            const result = calculatePtScore(
                inputs, 
                standards, 
                mockPassFailStandards as Tables<'pt_pass_fail_standards'>[], 
                mockAltitudeCorrections as Tables<'pt_altitude_corrections'>[], 
                mockWalkAltThresholds as Tables<'pt_altitude_walk_thresholds'>[]
            );
            // 9:14 -> 554s. Corr: 2s -> 552s (9:12). Score 50.
            expect(result.cardioScore).toBe(50);
        });
    });

    describe('calculatePtScore - Female 35-39', () => {
        const standards = mockStandards["Female"]["35-39"];

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
                whtr: 0.49
            };
            const result = calculatePtScore(
                inputs, 
                standards, 
                mockPassFailStandards as Tables<'pt_pass_fail_standards'>[], 
                mockAltitudeCorrections as Tables<'pt_altitude_corrections'>[], 
                mockWalkAltThresholds as Tables<'pt_altitude_walk_thresholds'>[]
            );
            // Score = (15 + 15 + 20) / 50 * 100 = 100
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
                altitudeGroup: 'group1',
                whtr: 0.49
            };
            const result = calculatePtScore(
                inputs, 
                standards, 
                mockPassFailStandards as Tables<'pt_pass_fail_standards'>[], 
                mockAltitudeCorrections as Tables<'pt_altitude_corrections'>[], 
                mockWalkAltThresholds as Tables<'pt_altitude_walk_thresholds'>[]
            );
            // Max time at altitude is 18:45. User time is 19:00.
            expect(result.walkPassed).toBe('fail');
            expect(result.isPass).toBe(false);
        });
    });

    describe('getScoreForExercise', () => {
        const standards = mockStandards["Male"]["<25"];

        it('should calculate score for push_ups_1min', () => {
            expect(getScoreForExercise(standards, 'push_ups_1min', { reps: 67 })).toBe(15);
            expect(getScoreForExercise(standards, 'push_ups_1min', { reps: 40 })).toBe(10.2);
        });

        it('should calculate score for run', () => {
            expect(getScoreForExercise(standards, 'run', { minutes: 9, seconds: 12 })).toBe(50);
            expect(getScoreForExercise(standards, 'run', { minutes: 12, seconds: 14 })).toBe(45);
        });

        it('should calculate score for shuttles with altitude adjustment', () => {
            // Raw 50 shuttles (38.7 pts). Group 1 Corr: +1 = 51 shuttles (still 38.7 in mock).
            const scoreWithAltitude = getScoreForExercise(
                standards, 
                'shuttles', 
                { shuttles: 50 }, 
                'group1', 
                mockAltitudeCorrections as Tables<'pt_altitude_corrections'>[]
            );
            expect(scoreWithAltitude).toBe(38.7);
        });
    });
});
