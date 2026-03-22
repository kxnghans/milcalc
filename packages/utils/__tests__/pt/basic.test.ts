import { std, getScoreForExercise } from './setup';

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
