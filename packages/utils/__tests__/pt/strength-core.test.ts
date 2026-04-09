import { std, getScoreForExercise } from './setup';

// ---------------------------------------------------------------------------
// 3. Precise mid-range score spot checks (CSV truth)
// ---------------------------------------------------------------------------
describe('Mid-range score spot checks (exact CSV values)', () => {
    // Male 35-39 HRPU
    it('Male 35-39: HRPUs 29 reps = 6.5 pts', () => {
        const r = getScoreForExercise(std('Male', '35-39'), 'hand_release_pushups_2min', { reps: 29 });
        expect(r.points).toBeCloseTo(6.5, 1);
    });

    // Male <25 pushups
    it('Male <25: push_ups_1min 40 reps = 6.0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'push_ups_1min', { reps: 40 });
        expect(r.points).toBeCloseTo(6.0, 1);
    });
    it('Male 55-59: push_ups_1min 14 reps = 2.5 pts', () => {
        const r = getScoreForExercise(std('Male', '55-59'), 'push_ups_1min', { reps: 14 });
        expect(r.points).toBeCloseTo(2.5, 1);
    });

    // Male <25 situps
    it('Male <25: situps 47 reps = 9.5 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'sit_ups_1min', { reps: 47 });
        expect(r.points).toBeCloseTo(9.5, 1);
    });
    it('Male <25: situps 33 reps = 2.5 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'sit_ups_1min', { reps: 33 });
        expect(r.points).toBeCloseTo(2.5, 1);
    });

    // Male <25 CLRC
    it('Male <25: CLRC 50 reps = 10.0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'cross_leg_reverse_crunch_2min', { reps: 50 });
        expect(r.points).toBeCloseTo(10.0, 1);
    });
    it('Male <25: CLRC 35 reps = 2.5 pts (minimum non-zero)', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'cross_leg_reverse_crunch_2min', { reps: 35 });
        expect(r.points).toBeCloseTo(2.5, 1);
    });

    // Female 60+ situps
    it('Female 60+: situps 26 reps = 12.5 pts', () => {
        const r = getScoreForExercise(std('Female', '60+'), 'sit_ups_1min', { reps: 26 });
        expect(r.points).toBe(12.5);
    });
});

// ---------------------------------------------------------------------------
// 5. Forearm Plank Time Scoring
// ---------------------------------------------------------------------------
describe('Forearm Plank Time Scoring', () => {
    it('Male <25: 1:35 = 2.5 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'forearm_plank_time', { minutes: 1, seconds: 35 });
        expect(r.points).toBeCloseTo(2.5, 1);
    });
    it('Male <25: 2:30 = 8.0 pts', () => {
        const r = getScoreForExercise(std('Male', '<25'), 'forearm_plank_time', { minutes: 2, seconds: 30 });
        expect(r.points).toBeCloseTo(8.0, 1);
    });
    it('Male 25-29: 2:30 = 8.5 pts', () => {
        const r = getScoreForExercise(std('Male', '25-29'), 'forearm_plank_time', { minutes: 2, seconds: 30 });
        expect(r.points).toBeCloseTo(8.5, 1);
    });
    it('Male 40-44: 1:30 = 4.0 pts', () => {
        const r = getScoreForExercise(std('Male', '40-44'), 'forearm_plank_time', { minutes: 1, seconds: 30 });
        expect(r.points).toBeCloseTo(4.0, 1);
    });
    it('Male 50-54: 1:05 = 2.5 pts (min for age group)', () => {
        const r = getScoreForExercise(std('Male', '50-54'), 'forearm_plank_time', { minutes: 1, seconds: 5 });
        expect(r.points).toBeCloseTo(2.5, 1);
    });
    it('Female <25: 1:30 = 2.5 pts (minimum non-zero)', () => {
        const r = getScoreForExercise(std('Female', '<25'), 'forearm_plank_time', { minutes: 1, seconds: 30 });
        expect(r.points).toBeCloseTo(2.5, 1);
    });
    it('Female <25: 2:00 = 5.5 pts', () => {
        const r = getScoreForExercise(std('Female', '<25'), 'forearm_plank_time', { minutes: 2, seconds: 0 });
        expect(r.points).toBeCloseTo(5.5, 1);
    });
    it('Female 35-39: 2:30 = 10.0 pts', () => {
        const r = getScoreForExercise(std('Female', '35-39'), 'forearm_plank_time', { minutes: 2, seconds: 30 });
        expect(r.points).toBeCloseTo(10.0, 1);
    });
    it('Female 55-59: 3:00 = 15.0 pts (max for age group)', () => {
        const r = getScoreForExercise(std('Female', '55-59'), 'forearm_plank_time', { minutes: 3, seconds: 0 });
        expect(r.points).toBe(15.0);
    });
});
