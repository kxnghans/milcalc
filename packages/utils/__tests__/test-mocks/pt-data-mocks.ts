/**
 * @file pt-data-mocks.ts
 * @description Provides mock data for PT calculation unit tests.
 */

import { PtStandard, Tables } from '../../src/types';

export const mockStandards: { [key: string]: { [key: string]: PtStandard[] } } = {
    "Male": {
        "<25": [
            // Strength (15 pts max)
            { exercise: 'hand_release_pushups_2min', measurement: '40', points: 15.0 },
            { exercise: 'hand_release_pushups_2min', measurement: '30', points: 12.0 },
            { exercise: 'hand_release_pushups_2min', measurement: '15', points: 7.5 },
            { exercise: 'push_ups_1min', measurement: '67', points: 15.0 },
            { exercise: 'push_ups_1min', measurement: '40', points: 10.2 },
            // Core (15 pts max)
            { exercise: 'cross_leg_reverse_crunch_2min', measurement: '49', points: 15.0 }, 
            { exercise: 'cross_leg_reverse_crunch_2min', measurement: '35', points: 11.2 },
            { exercise: 'sit_ups_1min', measurement: '58', points: 15.0 },
            { exercise: 'sit_ups_1min', measurement: '42', points: 9.0 },
            { exercise: 'forearm_plank_time', measurement: '3:35', points: 15.0 },
            { exercise: 'forearm_plank_time', measurement: '2:30', points: 11.5 },
            // Cardio (50 pts max)
            { exercise: 'run', measurement: '9:12', points: 50.0 },
            { exercise: 'run', measurement: '12:14', points: 45.0 }, 
            { exercise: 'run_2mile', measurement: '9:12', points: 50.0 },
            { exercise: 'run_2mile', measurement: '12:14', points: 45.0 }, 
            { exercise: 'shuttles', measurement: '100', points: 50.0 },
            { exercise: 'shuttles', measurement: '50', points: 38.7 },
            { exercise: 'shuttles_20m', measurement: '100', points: 50.0 },
            { exercise: 'shuttles_20m', measurement: '50', points: 38.7 },
            // WHtR (20 pts max)
            { exercise: 'whtr', measurement: '0.49', points: 20.0 },
        ]
    },
    "Female": {
        "35-39": [
            { exercise: 'push_ups_1min', measurement: '42', points: 15.0 },
            { exercise: 'push_ups_1min', measurement: '25', points: 11.2 },
            { exercise: 'sit_ups_1min', measurement: '43', points: 15.0 },
            { exercise: 'sit_ups_1min', measurement: '30', points: 11.2 },
            { exercise: 'run', measurement: '11:06', points: 50.0 },
            { exercise: 'run', measurement: '15:21', points: 45.0 },
            { exercise: 'run_2mile', measurement: '11:06', points: 50.0 },
            { exercise: 'run_2mile', measurement: '15:21', points: 45.0 },
            { exercise: 'whtr', measurement: '0.49', points: 20.0 },
        ]
    }
};

export const mockPassFailStandards: Partial<Tables<'pt_pass_fail_standards'>>[] = [
    { exercise_type: 'push_ups_1min', min_performance: '30' },
    { exercise_type: 'hand_release_pushups_2min', min_performance: '15' },
    { exercise_type: 'sit_ups_1min', min_performance: '39' },
    { exercise_type: 'cross_leg_reverse_crunch_2min', min_performance: '21' },
    { exercise_type: 'run_2mile', min_performance: '19:45' },
    { exercise_type: 'walk_2km', min_performance: '17:28' },
];

export const mockAltitudeCorrections: Partial<Tables<'pt_altitude_corrections'>>[] = [
    { exercise_type: 'run_2mile', altitude_group: 'group1', perf_start: '9:13', perf_end: '9:22', correction: 2 },
    { exercise_type: 'shuttles_20m', altitude_group: 'group1', correction: 1 },
];

export const mockWalkAltThresholds: Partial<Tables<'pt_altitude_walk_thresholds'>>[] = [
    { sex: 'Female', age_range: '30-39', altitude_group: 'group1', max_time: '18:45' },
];
