/**
 * @file pt-data-mocks.ts
 * @description Provides mock data for PT calculation unit tests.
 * This data simulates the structures returned from Supabase API calls.
 */

// This data is a simplified and corrected representation of what the getPtStandards function would return.
// It is NOT the raw database table data. It is the transformed data.
export const mockStandards = {
    "Male": {
        "<25": [
            // Strength
            { exercise: 'hand_release_pushups_2min', measurement: '40', points: 20.0 },
            { exercise: 'hand_release_pushups_2min', measurement: '30', points: 16.0 },
            { exercise: 'hand_release_pushups_2min', measurement: '15', points: 10.0 },
            { exercise: 'hand_release_pushups_2min', measurement: '10', points: 0 },
            // Core
            { exercise: 'cross_leg_reverse_crunch_2min', measurement: '49', points: 20.0 },
            { exercise: 'cross_leg_reverse_crunch_2min', measurement: '35', points: 15.0 },
            { exercise: 'cross_leg_reverse_crunch_2min', measurement: '21', points: 10.0 },
            { exercise: 'cross_leg_reverse_crunch_2min', measurement: '10', points: 0 },
            // Cardio
            { exercise: 'run', measurement: '9:12', points: 60.0 },
            { exercise: 'run', measurement: '12:34', points: 52.0 },
            { exercise: 'run', measurement: '15:21', points: 35.0 },
            { exercise: 'run', measurement: '20:00', points: 0 },
        ]
    },
    "Female": {
        "35-39": [
            // Strength
            { exercise: 'push_ups_1min', measurement: '42', points: 20.0 },
            { exercise: 'push_ups_1min', measurement: '25', points: 15.0 },
            { exercise: 'push_ups_1min', measurement: '10', points: 10.0 },
            { exercise: 'push_ups_1min', measurement: '5', points: 0 },
            // Core
            { exercise: 'sit_ups_1min', measurement: '43', points: 20.0 },
            { exercise: 'sit_ups_1min', measurement: '30', points: 15.0 },
            { exercise: 'sit_ups_1min', measurement: '24', points: 3.0 },
            { exercise: 'sit_ups_1min', measurement: '20', points: 0 },
            // Cardio
            { exercise: 'run', measurement: '11:06', points: 60.0 },
            { exercise: 'run', measurement: '15:21', points: 54.0 },
            { exercise: 'run', measurement: '20:34', points: 38.5 },
            { exercise: 'run', measurement: '25:00', points: 0 },
        ]
    }
};

// Simulates data from `walk_standards`
export const mockWalkStandards = [
    { gender: "Male", age_range: "<30", max_time: "15:50" },
    { gender: "Male", age_range: "30-39", max_time: "16:18" },
    { gender: "Male", age_range: "40-49", max_time: "16:49" },
    { gender: "Male", age_range: "50-59", max_time: "17:28" },
    { gender: "Male", age_range: "60+", max_time: "19:01" },
    { gender: "Female", age_range: "<30", max_time: "17:17" },
    { gender: "Female", age_range: "30-39", max_time: "17:45" },
    { gender: "Female", age_range: "40-49", max_time: "18:19" },
    { gender: "Female", age_range: "50-59", max_time: "18:57" },
    { gender: "Female", age_range: "60+", max_time: "20:33" },
];

// Simulates data from `run_altitude_adjustments`, `walk_altitude_adjustments`, etc.
export const mockAltitudeAdjustments = {
    run: [
        { altitude_group: 'group1', time_range_start: 552, time_range_end: 574, correction: 23 }, // Male <25
        { altitude_group: 'group1', time_range_start: 666, time_range_end: 698, correction: 32 }, // Female 35-39
    ],
    walk: [
        { altitude_group: 'group1', gender: 'Male', age_range_start: 0, age_range_end: 29, max_time: 1010 }, // 16:50
        { altitude_group: 'group1', gender: 'Female', age_range_start: 30, age_range_end: 39, max_time: 1125 }, // 18:45
    ],
    hamr: [
        { altitude_group: 'group1', shuttles_to_add: 2 },
    ]
};