import { std, getScoreForExercise } from './setup';

// ---------------------------------------------------------------------------
// 3. Precise mid-range score spot checks (CSV truth)
// ---------------------------------------------------------------------------
describe('Mid-range score spot checks (exact CSV values)', () => {
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

    // Female 60+ situps
    it('Female 60+: situps 15 reps = 15 pts', () => {
        const r = getScoreForExercise(std('Female', '60+'), 'sit_ups_1min', { reps: 15 });
        expect(r.points).toBe(15);
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
