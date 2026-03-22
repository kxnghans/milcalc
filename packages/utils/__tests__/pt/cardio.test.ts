import { std, getScoreForExercise, score, altitudeCorrections, AltCorrections } from './setup';

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
        const r = getScoreForExercise(
            std('Male', '<25'), 'run_2mile',
            { minutes: 13, seconds: 55 },
            'group1',
            altitudeCorrections as AltCorrections,
        );
        expect(r.points).toBeCloseTo(49.4, 1);
    });
    it('Male <25: 14:27 run + group1 (14:01-16:00, -20s) → 14:07 → 48.8 pts', () => {
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
    it('Female 38: walk 22:50 → pass (under standard 22:59)', () => {
        const r = score('Female', '35-39', {
            pushupComponent: 'push_ups_1min', pushups: 42,
            coreComponent: 'sit_ups_1min', situps: 43,
            cardioComponent: 'walk', walkMinutes: 22, walkSeconds: 50,
            whtr: 0.49,
        });
        expect(r.walkPassed).toBe('pass');
        expect(r.isPass).toBe(true);
    });
    it('Female 38: walk 23:00 → fail (over standard 22:59)', () => {
        const r = score('Female', '35-39', {
            pushupComponent: 'push_ups_1min', pushups: 42,
            coreComponent: 'sit_ups_1min', situps: 43,
            cardioComponent: 'walk', walkMinutes: 23, walkSeconds: 0,
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
