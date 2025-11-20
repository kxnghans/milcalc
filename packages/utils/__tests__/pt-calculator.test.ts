/**
 * @file pt-calculator.test.ts
 * @description Unit tests for the PT calculator logic in pt-calculator.ts.
 * @see ../TESTING.md
 */

import { calculatePtScore } from '../src/pt-calculator';
import { mockStandards, mockWalkStandards, mockAltitudeAdjustments } from './test-mocks/pt-data-mocks';

describe('PT Calculator', () => {
    describe('calculatePtScore - Male <25', () => {
        const standards = mockStandards["Male"]["<25"];

        it('should calculate a perfect score', async () => {
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
            const result = await calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            expect(result.totalScore).toBe(100);
            expect(result.pushupScore).toBe(20);
            expect(result.coreScore).toBe(20);
            expect(result.cardioScore).toBe(60);
            expect(result.isPass).toBe(true);
        });

        it('should calculate a passing score with medium values', async () => {
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
            const result = await calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            expect(result.totalScore).toBeCloseTo(83); // (16 + 15 + 52)
            expect(result.isPass).toBe(true);
        });

        it('should fail with one component score at 0', async () => {
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
            const result = await calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            expect(result.cardioScore).toBe(0);
            expect(result.isPass).toBe(false);
        });

        it('should apply altitude adjustment for run', async () => {
            const inputs = {
                age: 24,
                gender: 'Male',
                cardioComponent: 'run',
                runMinutes: 9, // Raw time in range for adjustment
                runSeconds: 30,
                altitudeGroup: 'group1'
            };
            const result = await calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            // Raw time 9:30 (570s). Adj: 570-23=547s (9:07). Score is 60.
            expect(result.cardioScore).toBe(60);
        });
    });

    describe('calculatePtScore - Female 35-39', () => {
        const standards = mockStandards["Female"]["35-39"];

        it('should calculate a score with push_ups and sit_ups', async () => {
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
            const result = await calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            expect(result.totalScore).toBeCloseTo(84); // 15 + 15 + 54
            expect(result.isPass).toBe(true);
        });

        it('should handle walk test (pass)', async () => {
            const inputs = {
                age: 38,
                gender: 'Female',
                pushupComponent: 'push_ups_1min',
                pushups: 42,
                coreComponent: 'sit_ups_1min',
                situps: 43,
                cardioComponent: 'walk',
                walkMinutes: 17,
                walkSeconds: 40,
            };
            const result = await calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            // Score is (20 + 20) / 40 * 100 = 100
            expect(result.totalScore).toBe(100);
            expect(result.walkPassed).toBe('pass');
            expect(result.isPass).toBe(true);
        });

        it('should handle walk test with altitude (fail)', async () => {
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
            const result = await calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            // Max time at altitude is 18:45 (1125s). User time is 19:00 (1140s).
            expect(result.walkPassed).toBe('fail');
            expect(result.isPass).toBe(false);
        });
    });

    describe('Exemptions', () => {
        const standards = mockStandards["Male"]["<25"];

        it('should calculate correctly with one component exempt', async () => {
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
            const result = await calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            // Score = (20 + 60) / 80 * 100 = 100
            expect(result.totalScore).toBe(100);
            expect(result.pushupScore).toBe('Exempt');
            expect(result.isPass).toBe(true);
        });

        it('should calculate correctly with two components exempt', async () => {
            const inputs = {
                age: 24,
                gender: 'Male',
                isStrengthExempt: true,
                isCoreExempt: true,
                cardioComponent: 'run',
                runMinutes: 9, // 60 pts
                runSeconds: 12,
            };
            const result = await calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            // Score = 60 / 60 * 100 = 100
            expect(result.totalScore).toBe(100);
            expect(result.isPass).toBe(true);
        });

        it('should pass with 100 if all components are exempt', async () => {
            const inputs = {
                age: 24,
                gender: 'Male',
                isStrengthExempt: true,
                isCoreExempt: true,
                isCardioExempt: true,
            };
            const result = await calculatePtScore(inputs, standards, mockWalkStandards, mockAltitudeAdjustments);
            expect(result.totalScore).toBe(100);
            expect(result.isPass).toBe(true);
        });
    });
});
