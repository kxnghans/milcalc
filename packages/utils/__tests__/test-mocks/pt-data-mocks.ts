/**
 * @file pt-data-mocks.ts
 * @description Provides mock data for PT calculation unit tests.
 * This data simulates the structures returned from Supabase API calls.
 */

// Simulates data from `run_altitude_adjustments`, `walk_altitude_adjustments`, etc.
export const mockStandards = {
    "Male": {
        "<25": [
            // Strength - Hand Release Pushups
            { exercise: 'hand_release_pushups_2min', measurement: '> 40', points: 20 },
            { exercise: 'hand_release_pushups_2min', measurement: '40', points: 20.0 },
            { exercise: 'hand_release_pushups_2min', measurement: '30', points: 16.0 },
            { exercise: 'hand_release_pushups_2min', measurement: '15', points: 10.0 },
            { exercise: 'hand_release_pushups_2min', measurement: '10', points: 0 },
            
            // Strength - Pushups 1 min
            { exercise: 'push_ups_1min', measurement: '≥ 67', points: 20.0 },
            { exercise: 'push_ups_1min', measurement: '40', points: 13.6 },
            { exercise: 'push_ups_1min', measurement: '30', points: 10.0 },
            { exercise: 'push_ups_1min', measurement: '0', points: 0 },
            
            // Core - Cross Leg Reverse Crunch
            { exercise: 'cross_leg_reverse_crunch_2min', measurement: '> 49', points: 20.0 },
            { exercise: 'cross_leg_reverse_crunch_2min', measurement: '49', points: 20.0 }, 
            { exercise: 'cross_leg_reverse_crunch_2min', measurement: '35', points: 15.0 },
            { exercise: 'cross_leg_reverse_crunch_2min', measurement: '21', points: 10.0 },
            { exercise: 'cross_leg_reverse_crunch_2min', measurement: '10', points: 0 },
            
            // Core - Situps 1 min
            { exercise: 'sit_ups_1min', measurement: '> 58', points: 20.0 },
            { exercise: 'sit_ups_1min', measurement: '58', points: 20.0 },
            { exercise: 'sit_ups_1min', measurement: '42', points: 12.0 },
            { exercise: 'sit_ups_1min', measurement: '30', points: 5.0 },
            { exercise: 'sit_ups_1min', measurement: '0', points: 0 },
            
             // Core - Forearm Plank
            { exercise: 'forearm_plank_time', measurement: '> 3:35', points: 20.0 },
            { exercise: 'forearm_plank_time', measurement: '3:35', points: 20.0 },
            { exercise: 'forearm_plank_time', measurement: '2:25', points: 15.3 },
            { exercise: 'forearm_plank_time', measurement: '1:00', points: 5.0 },
            { exercise: 'forearm_plank_time', measurement: '0:00', points: 0 },

            // Cardio - Run
            { exercise: 'run', measurement: '≤ 9:12', points: 60.0 },
            { exercise: 'run', measurement: '9:13 - 9:34', points: 59.5 },
            { exercise: 'run', measurement: '11:57 - 12:14', points: 54.0 }, 
            { exercise: 'run', measurement: '12:34 - 12:53', points: 52.0 },
            { exercise: 'run', measurement: '20:00', points: 0 },

            // Cardio - Shuttles (HAMR)
            { exercise: 'shuttles', measurement: '> 100', points: 60.0 },
            { exercise: 'shuttles', measurement: '48 - 50', points: 46.5 },
            { exercise: 'shuttles', measurement: '45 - 47', points: 44.0 },
            { exercise: 'shuttles', measurement: '39 - 41', points: 38.0 },
            { exercise: 'shuttles', measurement: '0', points: 0 },
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
    { id: 1, gender: "male", age_range: "<30", max_time: "16:16" },
    { id: 6, gender: "female", age_range: "<30", max_time: "17:22" },
    { id: 7, gender: "female", age_range: "30-39", max_time: "17:28" },
];

// Simulates data from `run_altitude_adjustments`, `walk_altitude_adjustments`, etc.
export const mockAltitudeAdjustments = {
    run: [
        { id: 2, altitude_group: 'group1', altitude_range: '5250 ft - 5499 ft', time_range_start: 553, time_range_end: 562, correction: 2 },
    ],
    walk: [
        { id: 1, gender: 'male', altitude_group: 'group1', altitude_range: '5250 ft - 5500 ft', age_range_start: 0, age_range_end: 29, max_time: 978 },
        { id: 2, gender: 'female', altitude_group: 'group1', altitude_range: '5250 ft - 5500 ft', age_range_start: 30, age_range_end: 39, max_time: 1125 }, 
    ],
    hamr: [
        { id: 1, altitude_group: 'group1', altitude_range: '5250 ft - 5500 ft', shuttles_to_add: 1 },
    ]
};
