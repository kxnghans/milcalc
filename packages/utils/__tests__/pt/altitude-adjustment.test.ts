import { getScoreForExercise, checkWalkPass } from '../../src/pt-calculator';
import { PtStandard, Tables } from '../../src/types';

describe('PT Calculator - Altitude Adjustments', () => {
    const mockStandards: PtStandard[] = [
        { exercise: 'run_2mile', measurement: '14:00', points: 50, healthRiskCategory: 'Low' },
        { exercise: 'run_2mile', measurement: '14:30', points: 45, healthRiskCategory: 'Low' },
        { exercise: 'shuttles_20m', measurement: '50', points: 50, healthRiskCategory: 'Low' },
        { exercise: 'shuttles_20m', measurement: '40', points: 40, healthRiskCategory: 'Low' },
    ];

    const mockAltitudeCorrections: Tables<'pt_altitude_corrections'>[] = [
        { 
            id: 1, exercise_type: 'run_2mile', altitude_group: 'Group 1', 
            perf_start: '0:00', perf_end: '14:00', correction: 15, created_at: '' 
        },
        { 
            id: 2, exercise_type: 'run_2mile', altitude_group: 'Group 1', 
            perf_start: '14:01', perf_end: '16:00', correction: 20, created_at: '' 
        },
        { 
            id: 3, exercise_type: 'shuttles_20m', altitude_group: 'Group 1', 
            perf_start: null, perf_end: null, correction: 3, created_at: '' 
        },
    ];

    const mockPassFail: Tables<'pt_pass_fail_standards'>[] = [
        { 
            id: 1, exercise_type: 'walk_2km', gender: 'Male', age_group: '25-29', 
            min_performance: '18:00', max_performance: null, created_at: '' 
        }
    ];

    const mockWalkAltThresholds: Tables<'pt_altitude_walk_thresholds'>[] = [
        { 
            id: 1, sex: 'Male', altitude_group: 'Group 1', 
            age_range: '18-29', max_time: '20:15', created_at: '' 
        }
    ];

    describe('2-Mile Run Altitude Adjustment', () => {
        it('should subtract 15s from run time for Group 1 (0-14:00)', () => {
            // User runs 14:10. Adjustment of 15s (since 14:10 - 15s = 13:55, which is <= 14:00)
            // Actually, the correction is applied to the perfValue BEFORE findScore.
            // If user runs 14:10, and correction is 15s, adjusted time is 13:55.
            // 13:55 is <= 14:00 threshold, so they get 50 points.
            const res = getScoreForExercise(mockStandards, 'run_2mile', { minutes: 14, seconds: 10 }, 'Group 1', mockAltitudeCorrections);
            expect(res.points).toBe(50);
        });

        it('should subtract 20s from run time for Group 1 (14:01-16:00)', () => {
            // User runs 14:40. Correction is 20s. Adjusted time is 14:20.
            // 14:20 is <= 14:30 threshold, so they get 45 points.
            const res = getScoreForExercise(mockStandards, 'run_2mile', { minutes: 14, seconds: 40 }, 'Group 1', mockAltitudeCorrections);
            expect(res.points).toBe(45);
        });
    });

    describe('20m HAMR (Shuttles) Altitude Adjustment', () => {
        it('should add 3 shuttles for Group 1', () => {
            // User does 37 shuttles. Correction is +3. Adjusted is 40.
            // 40 shuttles matches 40 points.
            const res = getScoreForExercise(mockStandards, 'shuttles_20m', { shuttles: 37 }, 'Group 1', mockAltitudeCorrections);
            expect(res.points).toBe(40);
        });
    });

    describe('2-km Walk Altitude Adjustment', () => {
        it('should use altitude max_time instead of normal min_performance', () => {
            // Normal max time is 18:00.
            // Altitude Group 1 max time is 20:15.
            // User walks 19:30. Should FAIL normal, but PASS altitude.
            const normal = checkWalkPass(25, 'Male', 19, 30, mockPassFail, mockWalkAltThresholds, 'normal');
            expect(normal).toBe('fail');

            const altitude = checkWalkPass(25, 'Male', 19, 30, mockPassFail, mockWalkAltThresholds, 'Group 1');
            expect(altitude).toBe('pass');
        });

        it('should handle case-insensitive gender for walk adjustment', () => {
            // Inputs are lowercase 'male' from UI.
            const altitude = checkWalkPass(25, 'male', 19, 30, mockPassFail, mockWalkAltThresholds, 'Group 1');
            expect(altitude).toBe('pass');
        });
    });
});
