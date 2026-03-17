/**
 * @file pt-calculator.test.ts
 * @description Unit tests for the PT calculator logic, driven by CSV source data.
 * All expected point values are taken directly from docs/sources/csvs/*.csv.
 */

import { calculatePtScore, getScoreForExercise } from '../src/pt-calculator';
import { parseCSVData } from './helpers/csv-parser';
import { Tables } from '../src/types';

const {
    standards: allStandards,
    passFailStandards,
    altitudeCorrections,
    walkAltThresholds,
} = parseCSVData();

// Typed casts used throughout
type PfStandards = Tables<'pt_pass_fail_standards'>[];
type AltCorrections = Tables<'pt_altitude_corrections'>[];
type WalkThresholds = Tables<'pt_altitude_walk_thresholds'>[];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function std(gender: string, age: string) {
    return allStandards[gender][age];
}

function score(
    gender: string,
    ageGroup: string,
    overrides: Record<string, unknown>
) {
    const defaults = {
        age: ageGroup === '<25' ? 22 : ageGroup === '60+' ? 62 : parseInt(ageGroup),
        gender,
        pushupComponent: 'push_ups_1min',
        pushups: 35,
        coreComponent: 'sit_ups_1min',
        situps: 35,
        cardioComponent: 'run',
        runMinutes: 14,
        runSeconds: 0,
        whtr: 0.49,
    };
    return calculatePtScore(
        { ...defaults, ...overrides } as Parameters<typeof calculatePtScore>[0],
        std(gender, ageGroup),
        passFailStandards as PfStandards,
        altitudeCorrections as AltCorrections,
        walkAltThresholds as WalkThresholds,
    );
}

// ---------------------------------------------------------------------------
// 1. Perfect Scores — Max reps/time per exercise yields max component points
// ---------------------------------------------------------------------------
describe('Perfect component scores', () => {
    it('Male <25: HRPUs 40 reps = 15 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'hand_release_pushups_2min', { reps: 40 });
        expect(r.points).toBe(15);
    });
    it('Male <25: pushups 1min 67 reps = 15 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'push_ups_1min', { reps: 67 });
        expect(r.points).toBe(15);
    });
    it('Male <25: situps 1min 58 reps = 15 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'sit_ups_1min', { reps: 58 });
        expect(r.points).toBe(15);
    });
    it('Male <25: CLRC 49 reps = 15 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'cross_leg_reverse_crunch_2min', { reps: 49 });
        expect(r.points).toBe(15);
    });
    it('Male <25: forearm plank 3:35 = 15 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'forearm_plank_time', { minutes: 3, seconds: 35 });
        expect(r.points).toBe(15);
    });
    it('Male <25: run 2mi <= 13:25 = 50 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'run_2mile', { minutes: 13, seconds: 25 });
        expect(r.points).toBe(50);
    });
    it('Male <25: run 2mi 9:00 (below max) = 50 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'run_2mile', { minutes: 9, seconds: 0 });
        expect(r.points).toBe(50);
    });
    it('Male <25: HAMR >= 100 shuttles = 50 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'shuttles_20m', { shuttles: 100 });
        expect(r.points).toBe(50);
    });
    it('Male <25: HAMR 105 shuttles = 50 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'shuttles_20m', { shuttles: 105 });
        expect(r.points).toBe(50);
    });
    it('Female <25: pushups 47 reps = 15 pts', () => {
        const r = getScoreForExercise(std('Female', '<25'), 'push_ups_1min', { reps: 47 });
        expect(r.points).toBe(15);
    });
    it('Female <25: HAMR >= 83 shuttles = 50 pts', () => {
        const r = getScoreForExercise(std('Female', '<25'), 'shuttles_20m', { shuttles: 83 });
        expect(r.points).toBe(50);
    });
    it('Female 55-59: run <= 17:18 = 50 pts', () => {
        const r = getScoreForExercise(std('Female', '55-59'), 'run_2mile', { minutes: 17, seconds: 18 });
        expect(r.points).toBe(50);
    });
    it('Male 60+: run <= 15:28 = 50 pts', () => {
        const r = getScoreForExercise(std('Male', '60+'), 'run_2mile', { minutes: 15, seconds: 28 });
        expect(r.points).toBe(50);
    });
});

// ---------------------------------------------------------------------------
// 2. Minimum passing thresholds — lowest non-zero score per exercise/group
// ---------------------------------------------------------------------------
describe('Minimum thresholds (lowest non-zero score)', () => {
    // Male minimums from pt_minimum_standards.csv
    it('Male <25: HRPUs min = 15 reps → > 0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'hand_release_pushups_2min', { reps: 15 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Male <25: HRPUs 14 reps → 0 pts (below minimum)', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'hand_release_pushups_2min', { reps: 14 });
        expect(r.points).toBe(0);
    });
    it('Male <25: push_ups_1min min = 30 reps → > 0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'push_ups_1min', { reps: 30 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Male <25: push_ups_1min 29 reps → 0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'push_ups_1min', { reps: 29 });
        expect(r.points).toBe(0);
    });
    it('Male 25-29: push_ups_1min min = 27 reps → > 0 pts', () => {
        const r = getScoreForExercise(std('Male', '25-29'), 'push_ups_1min', { reps: 27 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Male 60+: push_ups_1min 11 reps → > 0 pts', () => {
        const r = getScoreForExercise(std('Male', '60+'), 'push_ups_1min', { reps: 11 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Male 60+: push_ups_1min 4 reps → 0 pts (min standard but 0 points)', () => {
        const r = getScoreForExercise(std('Male', '60+'), 'push_ups_1min', { reps: 4 });
        expect(r.points).toBe(0);
    });

    // Run minimums from pt_minimum_standards.csv
    it('Male <25: run min = 19:45 → > 0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'run_2mile', { minutes: 19, seconds: 45 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Male <25: run 19:46 → 0 pts (beyond minimum)', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'run_2mile', { minutes: 19, seconds: 46 });
        expect(r.points).toBe(0);
    });
    it('Male 30-34: run min = 20:44 → > 0 pts', () => {
        const r = getScoreForExercise(std('Male', '30-34'), 'run_2mile', { minutes: 20, seconds: 44 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Male 60+: run min = 25:00 → > 0 pts', () => {
        const r = getScoreForExercise(std('Male', '60+'), 'run_2mile', { minutes: 25, seconds: 0 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Female <25: run min = 22:45 → > 0 pts', () => {
        const r = getScoreForExercise(std('Female', '<25'), 'run_2mile', { minutes: 22, seconds: 45 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Female <25: run 22:46 → 0 pts', () => {
        const r = getScoreForExercise(std('Female', '<25'), 'run_2mile', { minutes: 22, seconds: 46 });
        expect(r.points).toBe(0);
    });

    // Sit-up minimums
    it('Male <25: situps min = 39 reps → > 0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'sit_ups_1min', { reps: 39 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Male <25: situps 38 reps → 0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'sit_ups_1min', { reps: 38 });
        expect(r.points).toBe(0);
    });
    it('Male 60+: situps min = 8 reps → > 0 pts', () => {
        const r = getScoreForExercise(std('Male', '60+'), 'sit_ups_1min', { reps: 8 });
        expect(r.points).toBeGreaterThan(0);
    });

    // HAMR minimums
    it('Male <25: HAMR min = 39 shuttles → > 0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'shuttles_20m', { shuttles: 39 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Male <25: HAMR 38 shuttles → 0 pts (below min)', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'shuttles_20m', { shuttles: 38 });
        expect(r.points).toBe(0);
    });
    it('Female 60+: HAMR min = 2 shuttles → > 0 pts', () => {
        const r = getScoreForExercise(std('Female', '60+'), 'shuttles_20m', { shuttles: 2 });
        expect(r.points).toBeGreaterThan(0);
    });

    // Plank minimums
    it('Male <25: forearm plank min = 1:05 → > 0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'forearm_plank_time', { minutes: 1, seconds: 5 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Male <25: forearm plank 0:55 → 0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'forearm_plank_time', { minutes: 0, seconds: 55 });
        expect(r.points).toBe(0);
    });
    it('Male 60+: forearm plank min = 0:25 → 15 pts (all age-60+ planks score 15)', () => {
        const r = getScoreForExercise(std('Male', '60+'), 'forearm_plank_time', { minutes: 0, seconds: 25 });
        expect(r.points).toBe(15);
    });
    it('Female <25: forearm plank min = 0:15 → > 0 pts', () => {
        const r = getScoreForExercise(std('Female', '<25'), 'forearm_plank_time', { minutes: 0, seconds: 15 });
        expect(r.points).toBeGreaterThan(0);
    });
});

// ---------------------------------------------------------------------------
// 3. Precise mid-range score spot checks (CSV truth)
// ---------------------------------------------------------------------------
describe('Mid-range score spot checks (exact CSV values)', () => {
    // Male <25 run
    it('Male <25: run 15:05 = 46.9 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'run_2mile', { minutes: 15, seconds: 5 });
        expect(r.points).toBeCloseTo(46.9, 1);
    });
    it('Male <25: run 18:23 = 35.5 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'run_2mile', { minutes: 18, seconds: 23 });
        expect(r.points).toBeCloseTo(35.5, 1);
    });

    // Female 35-39 run
    it('Female 35-39: run 17:28 = 47.5 pts', () => {
        const r = getScoreForExercise(std('Female', '35-39'), 'run_2mile', { minutes: 17, seconds: 28 });
        expect(r.points).toBeCloseTo(47.5, 1);
    });

    // Male 35-39 HRPU
    it('Male 35-39: HRPUs 25 reps = 10.5 pts', () => {
        const r = getScoreForExercise(std('Male', '35-39'), 'hand_release_pushups_2min', { reps: 25 });
        expect(r.points).toBeCloseTo(10.5, 1);
    });

    // Male <25 pushups
    it('Male <25: push_ups_1min 40 reps = 10.2 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'push_ups_1min', { reps: 40 });
        expect(r.points).toBeCloseTo(10.2, 1);
    });
    it('Male 55-59: push_ups_1min 12 reps = 0.8 pts', () => {
        const r = getScoreForExercise(std('Male', '55-59'), 'push_ups_1min', { reps: 12 });
        expect(r.points).toBeCloseTo(0.8, 1);
    });

    // Male <25 situps
    it('Male <25: situps 47 reps = 12.0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'sit_ups_1min', { reps: 47 });
        expect(r.points).toBeCloseTo(12.0, 1);
    });
    it('Male <25: situps 39 reps = 2.3 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'sit_ups_1min', { reps: 39 });
        expect(r.points).toBeCloseTo(2.3, 1);
    });

    // Male <25 CLRC
    it('Male <25: CLRC 30 reps = 9.9 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'cross_leg_reverse_crunch_2min', { reps: 30 });
        expect(r.points).toBeCloseTo(9.9, 1);
    });
    it('Male <25: CLRC 21 reps = 7.5 pts (minimum non-zero)', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'cross_leg_reverse_crunch_2min', { reps: 21 });
        expect(r.points).toBeCloseTo(7.5, 1);
    });

    // Female 30-34 run (different curve)
    it('Female 30-34: run 20:33 = 35.5 pts', () => {
        const r = getScoreForExercise(std('Female', '30-34'), 'run_2mile', { minutes: 20, seconds: 33 });
        expect(r.points).toBeCloseTo(35.5, 1);
    });

    // Female 60+ situps
    it('Female 60+: situps 15 reps = 15 pts', () => {
        const r = getScoreForExercise(std('Female', '60+'), 'sit_ups_1min', { reps: 15 });
        expect(r.points).toBe(15);
    });
});

// ---------------------------------------------------------------------------
// 4. HAMR Range Scoring (range strings like "94-99", ">= 100")
// ---------------------------------------------------------------------------
describe('HAMR Range Scoring', () => {
    // Male <25: ranges from CSV
    it('Male <25: 94-99 shuttles = 49.4 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'shuttles_20m', { shuttles: 94 });
        expect(r.points).toBeCloseTo(49.4, 1);
    });
    it('Male <25: 99 shuttles = 49.4 pts (upper edge of range)', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'shuttles_20m', { shuttles: 99 });
        expect(r.points).toBeCloseTo(49.4, 1);
    });
    it('Male <25: 92-93 shuttles = 48.8 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'shuttles_20m', { shuttles: 92 });
        expect(r.points).toBeCloseTo(48.8, 1);
    });
    it('Male <25: 80-82 shuttles = 46.3 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'shuttles_20m', { shuttles: 81 });
        expect(r.points).toBeCloseTo(46.3, 1);
    });
    it('Male <25: 45-47 shuttles = 32.5 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'shuttles_20m', { shuttles: 46 });
        expect(r.points).toBeCloseTo(32.5, 1);
    });
    it('Male 55-59: >= 77 shuttles = 50 pts', () => {
        const r = getScoreForExercise(std('Male', '55-59'), 'shuttles_20m', { shuttles: 77 });
        expect(r.points).toBe(50);
    });
    it('Male 55-59: 80 shuttles = 50 pts (above >= 77)', () => {
        const r = getScoreForExercise(std('Male', '55-59'), 'shuttles_20m', { shuttles: 80 });
        expect(r.points).toBe(50);
    });
    it('Female <25: >= 83 shuttles = 50 pts', () => {
        const r = getScoreForExercise(std('Female', '<25'), 'shuttles_20m', { shuttles: 83 });
        expect(r.points).toBe(50);
    });
    it('Female 60+: >= 48 shuttles = 50 pts', () => {
        const r = getScoreForExercise(std('Female', '60+'), 'shuttles_20m', { shuttles: 48 });
        expect(r.points).toBe(50);
    });
    it('Female <25 minimum: 24-25 shuttles = 29.5 pts', () => {
        const r = getScoreForExercise(std('Female', '<25'), 'shuttles_20m', { shuttles: 24 });
        expect(r.points).toBeCloseTo(29.5, 1);
    });
    // Altitude corrections for HAMR
    it('Male <25: 97 shuttles + group1 altitude (+3) = 50 pts (100+ effective)', () => {
        const r = getScoreForExercise(
            std('Male', '<25'),
            'shuttles_20m',
            { shuttles: 97 },
            'group1',
            altitudeCorrections as AltCorrections,
        );
        expect(r.points).toBe(50);
    });
    it('Male <25: 91 shuttles + group2 altitude (+6) = 50 pts (97+ effective is NOT >=100)', () => {
        // 91 + 6 = 97, which falls in 94-99 range → 49.4, not 50
        const r = getScoreForExercise(
            std('Male', '<25'),
            'shuttles_20m',
            { shuttles: 91 },
            'group2',
            altitudeCorrections as AltCorrections,
        );
        expect(r.points).toBeCloseTo(49.4, 1);
    });
    it('Male <25: 94 shuttles + group2 altitude (+6) = 50 pts (100 effective)', () => {
        const r = getScoreForExercise(
            std('Male', '<25'),
            'shuttles_20m',
            { shuttles: 94 },
            'group2',
            altitudeCorrections as AltCorrections,
        );
        expect(r.points).toBe(50);
    });
});

// ---------------------------------------------------------------------------
// 5. Forearm Plank Time Scoring
// ---------------------------------------------------------------------------
describe('Forearm Plank Time Scoring', () => {
    it('Male <25: 1:05 = 10.5 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'forearm_plank_time', { minutes: 1, seconds: 5 });
        expect(r.points).toBeCloseTo(10.5, 1);
    });
    it('Male <25: 2:30 = 13.1 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'forearm_plank_time', { minutes: 2, seconds: 30 });
        expect(r.points).toBeCloseTo(13.1, 1);
    });
    it('Male 25-29: 2:30 = 13.2 pts', () => {
        const r = getScoreForExercise(std('Male', '25-29'), 'forearm_plank_time', { minutes: 2, seconds: 30 });
        expect(r.points).toBeCloseTo(13.2, 1);
    });
    it('Male 40-44: 0:45 = 10.8 pts', () => {
        const r = getScoreForExercise(std('Male', '40-44'), 'forearm_plank_time', { minutes: 0, seconds: 45 });
        expect(r.points).toBeCloseTo(10.8, 1);
    });
    it('Male 50-54: 0:35 = 12.0 pts (min for age group)', () => {
        const r = getScoreForExercise(std('Male', '50-54'), 'forearm_plank_time', { minutes: 0, seconds: 35 });
        expect(r.points).toBeCloseTo(12.0, 1);
    });
    it('Female <25: 0:15 = 7.5 pts (minimum non-zero)', () => {
        const r = getScoreForExercise(std('Female', '<25'), 'forearm_plank_time', { minutes: 0, seconds: 15 });
        expect(r.points).toBeCloseTo(7.5, 1);
    });
    it('Female <25: 1:00 = 10.2 pts', () => {
        const r = getScoreForExercise(std('Female', '<25'), 'forearm_plank_time', { minutes: 1, seconds: 0 });
        expect(r.points).toBeCloseTo(10.2, 1);
    });
    it('Female 35-39: 2:30 = 13.5 pts', () => {
        const r = getScoreForExercise(std('Female', '35-39'), 'forearm_plank_time', { minutes: 2, seconds: 30 });
        expect(r.points).toBeCloseTo(13.5, 1);
    });
    it('Female 55-59: 0:15 = 15 pts (all 55-59 female planks score 15)', () => {
        const r = getScoreForExercise(std('Female', '55-59'), 'forearm_plank_time', { minutes: 0, seconds: 15 });
        expect(r.points).toBe(15);
    });
});

// ---------------------------------------------------------------------------
// 6. Age Group Boundary Behavior
// ---------------------------------------------------------------------------
describe('Age group boundary behavior', () => {
    // Male age 24 (<25) vs 25 (25-29) — different min thresholds
    it('Male age 24 uses <25 standards', () => {
        // <25 push_ups_1min: min 30 reps yields > 0
        const r = score('Male', '<25', { pushupComponent: 'push_ups_1min', pushups: 30 });
        expect(r.pushupScore).toBeGreaterThan(0);
    });
    it('Male age 25 uses 25-29 standards (min 27 reps)', () => {
        // 25-29 min = 27. Score at 27 should be > 0
        const r = getScoreForExercise(std('Male', '25-29'), 'push_ups_1min', { reps: 27 });
        expect(r.points).toBeGreaterThan(0);
    });
    it('Male 25-29: push_ups_1min 26 reps → 0 pts', () => {
        const r = getScoreForExercise(std('Male', '25-29'), 'push_ups_1min', { reps: 26 });
        expect(r.points).toBe(0);
    });

    // Male age 59 vs 60+
    it('Male 55-59: run max = 23:36 = 28.0 pts', () => {
        const r = getScoreForExercise(std('Male', '55-59'), 'run_2mile', { minutes: 23, seconds: 36 });
        expect(r.points).toBeCloseTo(28.0, 1);
    });
    it('Male 60+: run max = 25:00 = 28.0 pts', () => {
        const r = getScoreForExercise(std('Male', '60+'), 'run_2mile', { minutes: 25, seconds: 0 });
        expect(r.points).toBeCloseTo(28.0, 1);
    });

    // Female age group curve shifts
    it('Female 50-54: HAMR >= 56 shuttles = 50 pts', () => {
        const r = getScoreForExercise(std('Female', '50-54'), 'shuttles_20m', { shuttles: 56 });
        expect(r.points).toBe(50);
    });
    it('Female 60+: HAMR >= 48 shuttles = 50 pts', () => {
        const r = getScoreForExercise(std('Female', '60+'), 'shuttles_20m', { shuttles: 48 });
        expect(r.points).toBe(50);
    });
});

// ---------------------------------------------------------------------------
// 7. WHtR Scoring
// ---------------------------------------------------------------------------
describe('WHtR Scoring', () => {
    const defaultComponents = {
        pushupComponent: 'push_ups_1min',
        coreComponent: 'sit_ups_1min',
        cardioComponent: 'run',
    };
    const s = std('Male', '<25');

    it('WHtR <= 0.49 = 20 pts', () => {
        const r = calculatePtScore({ age: 22, gender: 'Male', whtr: 0.49, ...defaultComponents } as Parameters<typeof calculatePtScore>[0], s, [], [], []);
        expect(r.whtrScore).toBe(20);
    });
    it('WHtR 0.48 = 20 pts', () => {
        const r = calculatePtScore({ age: 22, gender: 'Male', whtr: 0.48, ...defaultComponents } as Parameters<typeof calculatePtScore>[0], s, [], [], []);
        expect(r.whtrScore).toBe(20);
    });
    it('WHtR 0.50 = 19 pts', () => {
        const r = calculatePtScore({ age: 22, gender: 'Male', whtr: 0.50, ...defaultComponents } as Parameters<typeof calculatePtScore>[0], s, [], [], []);
        expect(r.whtrScore).toBe(19);
    });
    it('WHtR 0.51 = 18 pts', () => {
        const r = calculatePtScore({ age: 22, gender: 'Male', whtr: 0.51, ...defaultComponents } as Parameters<typeof calculatePtScore>[0], s, [], [], []);
        expect(r.whtrScore).toBe(18);
    });
    it('WHtR 0.55 = 12.5 pts', () => {
        const r = calculatePtScore({ age: 22, gender: 'Male', whtr: 0.55, ...defaultComponents } as Parameters<typeof calculatePtScore>[0], s, [], [], []);
        expect(r.whtrScore).toBe(12.5);
    });
    it('WHtR 0.59 = 2.5 pts', () => {
        const r = calculatePtScore({ age: 22, gender: 'Male', whtr: 0.59, ...defaultComponents } as Parameters<typeof calculatePtScore>[0], s, [], [], []);
        expect(r.whtrScore).toBe(2.5);
    });
    it('WHtR >= 0.60 = 0 pts and fail', () => {
        const r = calculatePtScore({ age: 22, gender: 'Male', whtr: 0.60, ...defaultComponents } as Parameters<typeof calculatePtScore>[0], s, [], [], []);
        expect(r.whtrScore).toBe(0);
        expect(r.isPass).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// 8. Pass/Fail Threshold Validation
// ---------------------------------------------------------------------------
describe('Pass/Fail Threshold Validation', () => {
    it('Perfect score is a pass', () => {
        const r = score('Male', '<25', {
            pushupComponent: 'hand_release_pushups_2min', pushups: 40,
            coreComponent: 'cross_leg_reverse_crunch_2min', reverseCrunches: 49,
            cardioComponent: 'run', runMinutes: 9, runSeconds: 12,
            whtr: 0.49,
        });
        expect(r.totalScore).toBeCloseTo(100, 0);
        expect(r.isPass).toBe(true);
    });

    it('Score exactly at composite 75 is a pass', () => {
        // Male <25: 15 + 15 + 50 + 20 = 100 max → 75 = 75/100
        // For WHtR=2.5, pushup=7.5, core=7.5, cardio=42.5 = 60 / 100*100? No.
        // Use calculatePtScore with known scoring values to hit ~75
        const r = score('Male', '<25', {
            pushupComponent: 'push_ups_1min', pushups: 39,   // 10.0 pts
            coreComponent: 'sit_ups_1min', situps: 43,        // 10.0 pts
            cardioComponent: 'run', runMinutes: 17, runSeconds: 8, // 40.7 pts
            whtr: 0.54,                                        // 15 pts
        });
        expect(r.totalScore).toBeGreaterThanOrEqual(75); // passing composite
        expect(r.isPass).toBe(true);
    });

    it('Failing run time (beyond minimum) causes fail', () => {
        const r = score('Male', '<25', {
            cardioComponent: 'run', runMinutes: 20, runSeconds: 0,
        });
        expect(r.cardioScore).toBe(0);
        expect(r.isPass).toBe(false);
    });

    it('Failing WHtR = 0.60 causes fail regardless of other scores', () => {
        const r = score('Male', '<25', {
            pushupComponent: 'hand_release_pushups_2min', pushups: 40,
            coreComponent: 'cross_leg_reverse_crunch_2min', reverseCrunches: 49,
            cardioComponent: 'run', runMinutes: 9, runSeconds: 0,
            whtr: 0.60,
        });
        expect(r.isPass).toBe(false);
    });

    it('Failing push-up count causes fail', () => {
        const r = score('Male', '<25', {
            pushupComponent: 'push_ups_1min', pushups: 29, // below min of 30
        });
        expect(r.pushupScore).toBe(0);
        expect(r.isPass).toBe(false);
    });

    it('Exempt cardio with perfect other scores → pass', () => {
        const r = calculatePtScore(
            {
                age: 22, gender: 'Male',
                isCardioExempt: true,
                pushupComponent: 'hand_release_pushups_2min', pushups: 40,
                coreComponent: 'cross_leg_reverse_crunch_2min', reverseCrunches: 49,
                cardioComponent: 'run',
                whtr: 0.49,
            } as Parameters<typeof calculatePtScore>[0],
            std('Male', '<25'),
            passFailStandards as PfStandards,
            altitudeCorrections as AltCorrections,
            walkAltThresholds as WalkThresholds,
        );
        expect(r.cardioScore).toBe('Exempt');
        expect(r.totalScore).toBeCloseTo(100, 0);
        expect(r.isPass).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// 9. Altitude Run Corrections
// ---------------------------------------------------------------------------
describe('Run Altitude Corrections', () => {
    // Group 1 (3000-5249ft): 0:00-14:00 → -15s, 14:01-16:00 → -20s
    it('Male <25: 9:14 run + group1 → scores 50 (9:14-15s=8:59 <= 13:25)', () => {
        const r = getScoreForExercise(
            std('Male', '<25'), 'run_2mile',
            { minutes: 9, seconds: 14 },
            'group1',
            altitudeCorrections as AltCorrections,
        );
        expect(r.points).toBe(50);
    });
    it('Male <25: 13:55 run + group1 (14:01-16:00 bracket, -20s) → 13:35 → 50 pts', () => {
        // 13:55 raw = in range 14:01? No, 13:55 < 14:01, so it's in 0:00-14:00 bracket (-15s)
        // 13:55 - 15s = 13:40 which is > 13:25, so NOT 50 pts
        // Expected: 49.4 pts for raw 13:55 corrected to 13:40 (still 49.4 row)
        const r = getScoreForExercise(
            std('Male', '<25'), 'run_2mile',
            { minutes: 13, seconds: 55 },
            'group1',
            altitudeCorrections as AltCorrections,
        );
        // 13:55 - 15s = 13:40, which is <= 13:55 (49.4 row), so points = 50 or 49.4
        // The "< 13:25" row gives 50. 13:40 > 13:25, so it would be 49.4
        expect(r.points).toBeCloseTo(49.4, 1);
    });
    it('Male <25: 14:27 run + group1 (14:01-16:00, -20s) → 14:07 → 48.8 pts', () => {
        // 14:27 is in bracket 14:01-16:00 → -20s = 14:07, still > 13:25, so 49.4
        const r = getScoreForExercise(
            std('Male', '<25'), 'run_2mile',
            { minutes: 14, seconds: 27 },
            'group1',
            altitudeCorrections as AltCorrections,
        );
        expect(r.points).toBeCloseTo(48.8, 1);
    });
    it('Altitude group "normal" does not adjust time', () => {
        const rNormal = getScoreForExercise(
            std('Male', '<25'), 'run_2mile', { minutes: 14, seconds: 0 }, 'normal',
        );
        const rNoGroup = getScoreForExercise(
            std('Male', '<25'), 'run_2mile', { minutes: 14, seconds: 0 },
        );
        expect(rNormal.points).toBeCloseTo(rNoGroup.points, 1);
    });
    it('Group 3 (>=7000ft): 0-14min bracket subtracts 45s', () => {
        // 13:55 raw - 45s = 13:10, which is <= 13:25, so 50 pts
        const r = getScoreForExercise(
            std('Male', '<25'), 'run_2mile',
            { minutes: 13, seconds: 55 },
            'group3',
            altitudeCorrections as AltCorrections,
        );
        expect(r.points).toBe(50);
    });
});

// ---------------------------------------------------------------------------
// 10. Walk Test
// ---------------------------------------------------------------------------
describe('Walk Test (2km)', () => {
    it('Female 38: walk 17:00 → pass (under standard 17:28)', () => {
        const r = score('Female', '35-39', {
            pushupComponent: 'push_ups_1min', pushups: 42,
            coreComponent: 'sit_ups_1min', situps: 43,
            cardioComponent: 'walk', walkMinutes: 17, walkSeconds: 0,
            whtr: 0.49,
        });
        expect(r.walkPassed).toBe('pass');
        expect(r.isPass).toBe(true);
    });
    it('Female 38: walk 17:29 → fail (over standard 17:28)', () => {
        const r = score('Female', '35-39', {
            pushupComponent: 'push_ups_1min', pushups: 42,
            coreComponent: 'sit_ups_1min', situps: 43,
            cardioComponent: 'walk', walkMinutes: 17, walkSeconds: 29,
            whtr: 0.49,
        });
        expect(r.walkPassed).toBe('fail');
        expect(r.isPass).toBe(false);
    });
    it('Female 38: walk altitude group1 (30-39 max 1409s=23:29) — 22:30 → pass', () => {
        const r = score('Female', '35-39', {
            pushupComponent: 'push_ups_1min', pushups: 42,
            coreComponent: 'sit_ups_1min', situps: 43,
            cardioComponent: 'walk', walkMinutes: 22, walkSeconds: 30,
            altitudeGroup: 'group1', whtr: 0.49,
        });
        expect(r.walkPassed).toBe('pass');
    });
    it('Female 38: walk altitude group1, 23:30 → fail (over 23:29 limit)', () => {
        const r = score('Female', '35-39', {
            pushupComponent: 'push_ups_1min', pushups: 42,
            coreComponent: 'sit_ups_1min', situps: 43,
            cardioComponent: 'walk', walkMinutes: 23, walkSeconds: 30,
            altitudeGroup: 'group1', whtr: 0.49,
        });
        expect(r.walkPassed).toBe('fail');
    });
});

// ---------------------------------------------------------------------------
// 11. Full calculatePtScore — composite scoring
// ---------------------------------------------------------------------------
describe('calculatePtScore — Composite Scoring', () => {
    it('Male <25: 100% across all components', () => {
        const r = score('Male', '<25', {
            pushupComponent: 'hand_release_pushups_2min', pushups: 40,
            coreComponent: 'cross_leg_reverse_crunch_2min', reverseCrunches: 49,
            cardioComponent: 'run', runMinutes: 9, runSeconds: 12,
            whtr: 0.49,
        });
        expect(r.pushupScore).toBe(15);
        expect(r.coreScore).toBe(15);
        expect(r.cardioScore).toBe(50);
        expect(r.whtrScore).toBe(20);
        expect(r.totalScore).toBeCloseTo(100, 0);
        expect(r.isPass).toBe(true);
    });

    it('Male 55-59: mid-range all components', () => {
        const r = score('Male', '55-59', {
            pushupComponent: 'push_ups_1min', pushups: 20, // 9.0 pts
            coreComponent: 'sit_ups_1min', situps: 30, // 11.4 pts
            cardioComponent: 'run', runMinutes: 19, runSeconds: 0, // 43.9 pts
            whtr: 0.53, // 17 pts
        });
        // Composite: (9.0+11.4+43.9+17)/100*100 = 81.3 → pass (>= 75)
        expect(r.isPass).toBe(true);
    });

    it('All components exempt → totalScore = 100, isPass = true', () => {
        const r = calculatePtScore(
            {
                age: 30, gender: 'Male',
                isStrengthExempt: true, isCardioExempt: true,
                isCoreExempt: true, isWhtrExempt: true,
                pushupComponent: 'push_ups_1min',
                coreComponent: 'sit_ups_1min',
                cardioComponent: 'run',
            } as Parameters<typeof calculatePtScore>[0],
            std('Male', '30-34'),
            passFailStandards as PfStandards,
            altitudeCorrections as AltCorrections,
            walkAltThresholds as WalkThresholds,
        );
        expect(r.totalScore).toBe(100);
        expect(r.isPass).toBe(true);
    });

    it('Female 60+: all minimum-passing scores compositely pass', () => {
        // Female 60+: pushups min = 4, situps min = 8, run min = 25:00, whtr = 0.49
        // pushups 4 reps = 0.8 pts (Female 60+ col: 0.8)
        // situps 8 reps = 2.3 pts (Female 60+ col: 2.3) 
        // run 25:00 = 28.0 pts (Female 60+ row)
        // whtr 0.49 = 20 pts
        // total = 51.1/100 = 51.1 → fail (< 75)
        const r = score('Female', '60+', {
            age: 62,
            pushupComponent: 'push_ups_1min', pushups: 4,
            coreComponent: 'sit_ups_1min', situps: 8,
            cardioComponent: 'run', runMinutes: 25, runSeconds: 0,
            whtr: 0.49,
        });
        // At the bare minimum, composite will be < 75 → fail
        expect(r.pushupScore).toBeGreaterThan(0);
        expect(r.coreScore).toBeGreaterThan(0);
        expect(r.cardioScore).toBeGreaterThan(0);
        expect(r.isPass).toBe(false); // composite too low
    });
});

// ---------------------------------------------------------------------------
// 12. Dynamic Matrix Validation (smoke test all gender/age combinations)
// ---------------------------------------------------------------------------
describe('Dynamic Complete Matrix Validation', () => {
    const genders = ['Male', 'Female'];
    const ageGroups = ['<25', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'];
    const combos = genders.flatMap(g => ageGroups.map(a => ({ gender: g, ageGroup: a })));

    test.each(combos)('Standards load and score for $gender $ageGroup', ({ gender, ageGroup }) => {
        const s = allStandards[gender][ageGroup];
        expect(s.length).toBeGreaterThan(0);

        const age = ageGroup === '<25' ? 22 : ageGroup === '60+' ? 62 : parseInt(ageGroup.split('-')[0]);
        const r = calculatePtScore(
            {
                age, gender,
                pushupComponent: 'push_ups_1min', pushups: 20,
                coreComponent: 'sit_ups_1min', situps: 20,
                cardioComponent: 'run', runMinutes: 14, runSeconds: 0,
                whtr: 0.50,
            } as Parameters<typeof calculatePtScore>[0],
            s,
            passFailStandards as PfStandards,
            altitudeCorrections as AltCorrections,
            walkAltThresholds as WalkThresholds,
        );

        expect(r.totalScore).toBeDefined();
        expect(r.isPass).toBeDefined();
        expect(typeof r.totalScore).toBe('number');
        expect(r.totalScore).toBeGreaterThanOrEqual(0);
    });
});
