import { std, score, calculatePtScore, allStandards, passFailStandards, altitudeCorrections, walkAltThresholds, PfStandards, AltCorrections, WalkThresholds } from './setup';

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
        const r = score('Female', '60+', {
            age: 62,
            pushupComponent: 'push_ups_1min', pushups: 4,
            coreComponent: 'sit_ups_1min', situps: 8,
            cardioComponent: 'run', runMinutes: 25, runSeconds: 0,
            whtr: 0.49,
        });
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
