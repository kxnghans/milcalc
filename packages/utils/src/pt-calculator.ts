/**
 * @file pt-calculator.ts
 * @description This file contains the core logic for calculating Air Force Physical Fitness (PT) scores.
 * It uses a unified schema and human-readable performance strings from the database.
 */

import { PtStandard, PtPerformance, PtInputs, Tables } from './types';

/**
 * Converts a time string (e.g., "mm:ss", "mm:ss*", "<= 15:30") to seconds.
 */
export const timeToSeconds = (time: string | number | null): number => {
    if (time === null || time === undefined) return 0;
    const timeStr = String(time).trim();
    if (!timeStr || timeStr.toUpperCase() === 'N/A') return 0;

    // Remove prefixes and artifacts
    const cleaned = timeStr.replace(/[<>=* ]/g, '');
    const parts = cleaned.split(':').map(Number);
    
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return isNaN(Number(cleaned)) ? 0 : Number(cleaned);
};

/**
 * Parses a performance string into a numeric value for comparison.
 */
/**
 * Parses a performance string into a numeric range [min, max].
 */
const parsePerformanceRange = (perf: string | number | null): [number, number] => {
    if (perf === null || perf === undefined) return [0, 0];
    const s = String(perf).trim();
    
    // Range format "X-Y"
    if (s.includes('-')) {
        const parts = s.split('-').map(p => p.trim());
        if (parts.length === 2) {
            const minStr = parts[0];
            const maxStr = parts[1];
            const min = minStr.includes(':') ? timeToSeconds(minStr) : parseFloat(minStr.replace(/[<>=* ]/g, ''));
            const max = maxStr.includes(':') ? timeToSeconds(maxStr) : parseFloat(maxStr.replace(/[<>=* ]/g, ''));
            if (!isNaN(min) && !isNaN(max)) {
                return [min, max];
            }
        }
    }

    // Single value or prefix/suffix (>=, <=, *, etc)
    const val = s.includes(':') ? timeToSeconds(s) : (parseFloat(s.replace(/[<>=* ]/g, '')) || 0);
    
    if (s.includes('>=') || s.includes('>')) {
        return [val, Infinity];
    }
    if (s.includes('<=') || s.includes('<')) {
        return [-Infinity, val];
    }
    
    return [val, val];
};

/**
 * Determines the appropriate age group string based on age.
 */
export const getAgeGroupString = (age: number): string | null => {
    if (age < 25) return '<25';
    if (age >= 25 && age <= 29) return '25-29';
    if (age >= 30 && age <= 34) return '30-34';
    if (age >= 35 && age <= 39) return '35-39';
    if (age >= 40 && age <= 44) return '40-44';
    if (age >= 45 && age <= 49) return '45-49';
    if (age >= 50 && age <= 54) return '50-54';
    if (age >= 55 && age <= 59) return '55-59';
    if (age >= 60) return '60+';
    return null;
};

/**
 * Finds the score and health risk category for a given performance value.
 */
const findScore = (standards: PtStandard[], performanceValue: number, higherIsBetter: boolean, rawMeasurement?: string): { points: number; healthRiskCategory: string | null } => {
    // 1. Try exact string match first if rawMeasurement is provided
    if (rawMeasurement) {
        const exact = standards.find(s => s.measurement === rawMeasurement);
        if (exact) {
            return { points: exact.points, healthRiskCategory: exact.healthRiskCategory ?? null };
        }
    }

    let bestMatch: PtStandard | null = null;
    let limitValue = higherIsBetter ? -1 : Infinity;

    for (const s of standards) {
        const [min, max] = parsePerformanceRange(s.measurement);
        
        let match = false;
        if (higherIsBetter) {
            match = performanceValue >= min;
        } else {
            match = performanceValue <= max;
        }
        
        if (match) {
            if (higherIsBetter) {
                // We want the HIGHEST threshold we have met (the largest min)
                if (min > limitValue) {
                    limitValue = min;
                    bestMatch = s;
                } else if (min === limitValue && (!bestMatch || s.points > bestMatch.points)) {
                    // Tie-breaker: take higher points if thresholds are equal
                    bestMatch = s;
                }
            } else {
                // We want the LOWEST threshold we are under (the smallest max)
                if (max < limitValue) {
                    limitValue = max;
                    bestMatch = s;
                } else if (max === limitValue && (!bestMatch || s.points > bestMatch.points)) {
                    // Tie-breaker
                    bestMatch = s;
                }
            }
        }
    }
    
    return { 
        points: bestMatch ? bestMatch.points : 0, 
        healthRiskCategory: bestMatch ? (bestMatch.healthRiskCategory ?? null) : null 
    };
};

/**
 * Calculates score for WHtR.
 */
export const getWhtrScore = (standards: PtStandard[], whtr: number): { points: number; healthRiskCategory: string | null } => {
    if (!whtr) return { points: 0, healthRiskCategory: null };
    return findScore(standards.filter(s => s.exercise === 'whtr'), whtr, false); // Lower is better for WHtR
};

/**
 * Calculates score and health risk for any exercise.
 */
export const getScoreForExercise = (
    standards: PtStandard[], 
    component: string, 
    performance: PtPerformance, 
    altitudeGroup?: string, 
    altitudeCorrections?: Tables<'pt_altitude_corrections'>[],
    rawMeasurement?: string
): { points: number; healthRiskCategory: string | null } => {
    const componentStandards = standards.filter(s => s.exercise === component);
    if (componentStandards.length === 0) return { points: 0, healthRiskCategory: null };

    let perfValue = 0;
    let higherIsBetter = true;

    if (component === 'run' || component === 'run_2mile') {
        higherIsBetter = false;
        perfValue = (performance.minutes || 0) * 60 + (performance.seconds || 0);
        if (perfValue === 0) return { points: 0, healthRiskCategory: null };

        // Apply correction
        if (altitudeGroup && altitudeGroup !== 'normal' && altitudeCorrections) {
            const correction = altitudeCorrections.find(c => 
                c.exercise_type === 'run_2mile' && 
                c.altitude_group === altitudeGroup &&
                perfValue >= timeToSeconds(c.perf_start) &&
                perfValue <= timeToSeconds(c.perf_end)
            );
            if (correction) perfValue -= correction.correction;
        }
    } else if (component === 'shuttles' || component === 'shuttles_20m') {
        perfValue = performance.shuttles || 0;
        higherIsBetter = true;

        if (altitudeGroup && altitudeGroup !== 'normal' && altitudeCorrections) {
            const correction = altitudeCorrections.find(c => 
                c.exercise_type === 'shuttles_20m' && 
                c.altitude_group === altitudeGroup
            );
            if (correction) perfValue += correction.correction;
        }
    } else if (component === 'forearm_plank_time') {
        perfValue = (performance.minutes || 0) * 60 + (performance.seconds || 0);
        higherIsBetter = true;
    } else {
        perfValue = performance.reps || 0;
        higherIsBetter = true;
    }

    return findScore(componentStandards, perfValue, higherIsBetter, rawMeasurement);
};

/**
 * Checks if the walk test passes.
 */
export const checkWalkPass = (
    age: number, 
    gender: string, 
    minutes: number, 
    seconds: number, 
    passFailStandards: Tables<'pt_pass_fail_standards'>[], 
    walkAltitudeThresholds: Tables<'pt_altitude_walk_thresholds'>[], 
    altitudeGroup?: string
): 'pass' | 'fail' | 'n/a' => {
    const userTime = minutes * 60 + seconds;
    if (userTime === 0) return 'n/a';

    let maxTime = 0;

    if (altitudeGroup && altitudeGroup !== 'normal' && walkAltitudeThresholds) {
        const threshold = walkAltitudeThresholds.find(t => {
            const [min, max] = t.age_range.split('-').map(Number);
            return t.sex === gender && t.altitude_group === altitudeGroup && age >= min && age <= max;
        });
        if (threshold) maxTime = timeToSeconds(threshold.max_time);
    } else {
        const ageGroup = getAgeGroupString(age);
        const standard = passFailStandards.find(s => 
            s.exercise_type === 'walk_2km' && 
            s.gender === gender && 
            s.age_group === ageGroup
        );
        if (standard) maxTime = timeToSeconds(standard.min_performance);
    }

    if (!maxTime) return 'n/a';
    return userTime <= maxTime ? 'pass' : 'fail';
};

/**
 * Main calculation entry point.
 */
export const calculatePtScore = (
    inputs: PtInputs, 
    standards: PtStandard[], 
    passFailStandards: Tables<'pt_pass_fail_standards'>[], 
    altitudeCorrections: Tables<'pt_altitude_corrections'>[],
    walkAltitudeThresholds: Tables<'pt_altitude_walk_thresholds'>[]
) => {
    if (inputs.age == null || !inputs.gender) {
        return { 
            totalScore: 0, 
            cardioScore: 0, 
            pushupScore: 0, 
            coreScore: 0, 
            whtrScore: 0, 
            isPass: false, 
            walkPassed: 'n/a', 
            cardioRiskCategory: null as string | null,
            whtrRiskCategory: null as string | null
        };
    }

    let earnedPoints = 0;
    let totalPossiblePoints = 100;
    let cardioRiskCategory: string | null = null;
    let whtrRiskCategory: string | null = null;

    // WHtR
    let whtrScore: number | string = 0;
    if (inputs.isWhtrExempt) {
        whtrScore = 'Exempt';
        totalPossiblePoints -= 20;
    } else {
        const res = getWhtrScore(standards, inputs.whtr || 0);
        whtrScore = res.points;
        whtrRiskCategory = res.healthRiskCategory;
        earnedPoints += res.points;
    }

    // Strength
    let pushupScore: number | string = 0;
    if (inputs.isStrengthExempt) {
        pushupScore = 'Exempt';
        totalPossiblePoints -= 15;
    } else {
        const res = getScoreForExercise(standards, inputs.pushupComponent, { reps: inputs.pushups });
        pushupScore = res.points;
        earnedPoints += res.points;
    }

    // Core
    let coreScore: number | string = 0;
    if (inputs.isCoreExempt) {
        coreScore = 'Exempt';
        totalPossiblePoints -= 15;
    } else {
        const perf = inputs.coreComponent === 'forearm_plank_time' 
            ? { minutes: inputs.plankMinutes, seconds: inputs.plankSeconds }
            : { reps: inputs.coreComponent === 'sit_ups_1min' ? inputs.situps : inputs.reverseCrunches };
        const res = getScoreForExercise(standards, inputs.coreComponent, perf);
        coreScore = res.points;
        earnedPoints += res.points;
    }

    // Cardio
    let cardioScore: number | string = 0;
    let walkPassed: 'pass' | 'fail' | 'n/a' = 'n/a';
    if (inputs.isCardioExempt) {
        cardioScore = 'Exempt';
        totalPossiblePoints -= 50;
    } else if (inputs.cardioComponent === 'walk') {
        walkPassed = checkWalkPass(inputs.age, inputs.gender, inputs.walkMinutes || 0, inputs.walkSeconds || 0, passFailStandards, walkAltitudeThresholds, inputs.altitudeGroup);
        totalPossiblePoints -= 50;
    } else {
        const res = getScoreForExercise(
            standards, 
            inputs.cardioComponent === 'run' ? 'run_2mile' : 'shuttles_20m',
            { minutes: inputs.runMinutes, seconds: inputs.runSeconds, shuttles: inputs.shuttles },
            inputs.altitudeGroup,
            altitudeCorrections
        );
        cardioScore = res.points;
        cardioRiskCategory = res.healthRiskCategory;
        earnedPoints += res.points;
    }

    const compositeScore = totalPossiblePoints > 0 ? (earnedPoints / totalPossiblePoints) * 100 : 100;

    // Note: The 2025 model defines pass as composite >= 75 AND meeting component minimums.
    // In our CSV, minimums are the absolute lowest value that yields > 0 points.
    const isPass = compositeScore >= 75 && 
                   (inputs.isStrengthExempt || (typeof pushupScore === 'number' && pushupScore > 0)) &&
                   (inputs.isCoreExempt || (typeof coreScore === 'number' && coreScore > 0)) &&
                   (inputs.isCardioExempt || (inputs.cardioComponent === 'walk' ? walkPassed === 'pass' : (typeof cardioScore === 'number' && cardioScore > 0))) &&
                   (inputs.isWhtrExempt || (typeof whtrScore === 'number' && whtrScore > 0));

    return { 
        totalScore: compositeScore, 
        cardioScore, 
        pushupScore, 
        coreScore, 
        whtrScore, 
        isPass, 
        walkPassed, 
        cardioRiskCategory,
        whtrRiskCategory 
    };
};

/**
 * Calculates the best possible total score from a set of individual exercise scores.
 */
export const calculateBestScore = (scores: { [key: string]: number | string }): number => {
    let totalPossiblePoints = 100;
    let earnedPoints = 0;

    const whtrScore = typeof scores.whtr === 'number' ? scores.whtr : 0;
    const strengthScore = Math.max(
        typeof scores.push_ups_1min === 'number' ? scores.push_ups_1min : 0,
        typeof scores.hand_release_pushups_2min === 'number' ? scores.hand_release_pushups_2min : 0
    );
    const coreScore = Math.max(
        typeof scores.sit_ups_1min === 'number' ? scores.sit_ups_1min : 0,
        typeof scores.cross_leg_reverse_crunch_2min === 'number' ? scores.cross_leg_reverse_crunch_2min : 0,
        typeof scores.forearm_plank_time === 'number' ? scores.forearm_plank_time : 0
    );
    const cardioScore = Math.max(
        typeof scores.run === 'number' ? scores.run : 0,
        typeof scores.run_2mile === 'number' ? scores.run_2mile : 0,
        typeof scores.shuttles === 'number' ? scores.shuttles : 0,
        typeof scores.shuttles_20m === 'number' ? scores.shuttles_20m : 0
    );

    if (scores.whtr === 'Exempt') totalPossiblePoints -= 20; else earnedPoints += whtrScore;
    if (scores.push_ups_1min === 'Exempt' || scores.hand_release_pushups_2min === 'Exempt') totalPossiblePoints -= 15; else earnedPoints += strengthScore;
    if (scores.sit_ups_1min === 'Exempt' || scores.cross_leg_reverse_crunch_2min === 'Exempt' || scores.forearm_plank_time === 'Exempt') totalPossiblePoints -= 15; else earnedPoints += coreScore;
    if (scores.run === 'Exempt' || scores.run_2mile === 'Exempt' || scores.shuttles === 'Exempt' || scores.shuttles_20m === 'Exempt') totalPossiblePoints -= 50; else earnedPoints += cardioScore;

    return totalPossiblePoints > 0 ? (earnedPoints / totalPossiblePoints) * 100 : 100;
};

/**
 * Gets min/max for muscular components.
 */
/**
 * Gets the maximum points possible for a given exercise component.
 */
export const getMaxScoreForExercise = (component: string): number => {
    if (component === 'run' || component === 'run_2mile' || component === 'shuttles' || component === 'shuttles_20m' || component === 'walk') return 50;
    if (component === 'whtr') return 20;
    // Strength (Pushups) and Core (Situps/Plank) are 15 points each in the 2025 standards.
    return 15;
};

/**
 * Gets semantic min/max thresholds for muscular components.
 */
export const getMinMaxValues = (standards: PtStandard[], component: string) => {
    const compStandards = standards.filter(s => s.exercise === component);
    if (compStandards.length === 0) return { min: 0, max: 0 };

    // Pass Threshold: The performance required for the lowest possible positive score.
    const passThreshold = getPerformanceForScore(standards, component, 0.1); 
    
    // Max Points Threshold: The performance required for 100% points in this component.
    const maxPoints = Math.max(...compStandards.map(s => s.points));
    const maxPointsThreshold = getPerformanceForScore(standards, component, maxPoints);

    return { min: passThreshold, max: maxPointsThreshold };
};

/**
 * Gets semantic min/max thresholds for cardio components.
 */
export const getCardioMinMaxValues = (standards: PtStandard[], passFailStandards: Tables<'pt_pass_fail_standards'>[], component: string) => {
    if (component === 'walk') {
        const s = passFailStandards.find(s => s.exercise_type === 'walk_2km');
        return { min: s ? timeToSeconds(s.min_performance) : 0, max: 0 };
    }

    const comp = component === 'run' ? 'run_2mile' : (component === 'shuttles' ? 'shuttles_20m' : component);
    const compStandards = standards.filter(s => s.exercise === comp);
    if (compStandards.length === 0) return { min: 0, max: 0 };

    const passThreshold = getPerformanceForScore(standards, comp, 0.1);
    const maxPoints = Math.max(...compStandards.map(s => s.points));
    const maxPointsThreshold = getPerformanceForScore(standards, comp, maxPoints);

    return { min: passThreshold, max: maxPointsThreshold };
};

export const getPerformanceForScore = (standards: PtStandard[], component: string, targetScore: number): number => {
    const comp = component === 'run' ? 'run_2mile' : (component === 'shuttles' ? 'shuttles_20m' : component);
    // Find all standards that grant AT LEAST the target score.
    const candidates = standards.filter(s => s.exercise === comp && s.points >= targetScore);
    if (candidates.length === 0) {
        // Fallback: If no one reaches targetScore, return the best performance available.
        const allComp = standards.filter(s => s.exercise === comp);
        if (allComp.length === 0) return 0;
        const allValues = allComp.map(c => parsePerformanceRange(c.measurement)[0]);
        return comp === 'run_2mile' ? Math.min(...allValues) : Math.max(...allValues);
    }

    const higherIsBetter = !(comp === 'run_2mile');
    const values = candidates.map(c => {
        const [min, max] = parsePerformanceRange(c.measurement);
        // For 'higher is better', the minimum performance required is the 'min' of the range.
        // For 'lower is better' (run), the maximum performance allowed is the 'max' of the range.
        return higherIsBetter ? min : max;
    });

    // For run: we want the slowest time (max value) that still achieves the target score.
    // For others: we want the lowest reps (min value) that still achieves the target score.
    return higherIsBetter ? Math.min(...values) : Math.max(...values);
};

export const getDynamicHelpText = (componentKey: string, age: number, gender: string, performance: PtPerformance, standards: PtStandard[]): string => {
    if (!age || !gender || !standards) return "";
    const res = getScoreForExercise(standards, componentKey, performance);
    const score = res.points;
    let perfText = "";
    if (performance.reps) perfText = `${performance.reps} reps`;
    else if (performance.minutes || performance.seconds) perfText = `${performance.minutes}:${String(performance.seconds).padStart(2, '0')}`;
    else if (performance.shuttles) perfText = `${performance.shuttles} shuttles`;

    return perfText ? `For a ${age}-year-old ${gender}, ${perfText} results in ${score.toFixed(2)} points.` : "";
};
