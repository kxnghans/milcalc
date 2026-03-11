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
const parsePerformance = (perf: string | number | null): number => {
    if (perf === null || perf === undefined) return 0;
    const s = String(perf).trim();
    if (s.includes(':')) return timeToSeconds(s);
    return parseFloat(s.replace(/[<>=* ]/g, '')) || 0;
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
 * Finds the score for a given performance value based on an array of standards.
 */
const findScore = (standards: PtStandard[], performanceValue: number, higherIsBetter: boolean): number => {
    let bestPoints = 0;
    for (const s of standards) {
        const standardPerf = parsePerformance(s.measurement);
        const match = higherIsBetter ? performanceValue >= standardPerf : performanceValue <= standardPerf;
        if (match) {
            bestPoints = Math.max(bestPoints, s.points);
        }
    }
    return bestPoints;
};

/**
 * Calculates score for WHtR.
 */
const getWhtrScore = (standards: PtStandard[], whtr: number): number => {
    if (!whtr) return 0;
    return findScore(standards.filter(s => s.exercise === 'whtr'), whtr, false); // Lower is better for WHtR
};

/**
 * Calculates score for any exercise.
 */
export const getScoreForExercise = (
    standards: PtStandard[], 
    component: string, 
    performance: PtPerformance, 
    altitudeGroup?: string, 
    altitudeCorrections?: Tables<'pt_altitude_corrections'>[]
): number => {
    const componentStandards = standards.filter(s => s.exercise === component);
    if (componentStandards.length === 0) return 0;

    let perfValue = 0;
    let higherIsBetter = true;

    if (component === 'run' || component === 'run_2mile') {
        higherIsBetter = false;
        perfValue = (performance.minutes || 0) * 60 + (performance.seconds || 0);
        
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

    return findScore(componentStandards, perfValue, higherIsBetter);
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
            return t.altitude_group === altitudeGroup && age >= min && age <= max;
        });
        if (threshold) maxTime = timeToSeconds(threshold.max_time);
    } else {
        const standard = passFailStandards.find(s => s.exercise_type === 'walk_2km');
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
        return { totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, whtrScore: 0, isPass: false, walkPassed: 'n/a' };
    }

    let earnedPoints = 0;
    let totalPossiblePoints = 100;

    // WHtR
    let whtrScore: number | string = 0;
    if (inputs.isWhtrExempt) {
        whtrScore = 'Exempt';
        totalPossiblePoints -= 20;
    } else {
        whtrScore = getWhtrScore(standards, inputs.whtr || 0);
        earnedPoints += whtrScore;
    }

    // Strength
    let pushupScore: number | string = 0;
    if (inputs.isStrengthExempt) {
        pushupScore = 'Exempt';
        totalPossiblePoints -= 15;
    } else {
        pushupScore = getScoreForExercise(standards, inputs.pushupComponent, { reps: inputs.pushups });
        earnedPoints += pushupScore;
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
        coreScore = getScoreForExercise(standards, inputs.coreComponent, perf);
        earnedPoints += coreScore;
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
        cardioScore = getScoreForExercise(
            standards, 
            inputs.cardioComponent === 'run' ? 'run_2mile' : 'shuttles_20m',
            { minutes: inputs.runMinutes, seconds: inputs.runSeconds, shuttles: inputs.shuttles },
            inputs.altitudeGroup,
            altitudeCorrections
        );
        earnedPoints += cardioScore;
    }

    const compositeScore = totalPossiblePoints > 0 ? (earnedPoints / totalPossiblePoints) * 100 : 100;

    // Note: The 2025 model defines pass as composite >= 75 AND meeting component minimums.
    // In our CSV, minimums are the absolute lowest value that yields > 0 points.
    const isPass = compositeScore >= 75 && 
                   (inputs.isStrengthExempt || (typeof pushupScore === 'number' && pushupScore > 0)) &&
                   (inputs.isCoreExempt || (typeof coreScore === 'number' && coreScore > 0)) &&
                   (inputs.isCardioExempt || (inputs.cardioComponent === 'walk' ? walkPassed === 'pass' : (typeof cardioScore === 'number' && cardioScore > 0))) &&
                   (inputs.isWhtrExempt || (typeof whtrScore === 'number' && whtrScore > 0));

    return { totalScore: compositeScore, cardioScore, pushupScore, coreScore, whtrScore, isPass, walkPassed };
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
export const getMinMaxValues = (standards: PtStandard[], component: string) => {
    const compStandards = standards.filter(s => s.exercise === component);
    if (compStandards.length === 0) return { min: 0, max: 0 };

    const values = compStandards.map(s => parsePerformance(s.measurement)).filter(v => v > 0);
    return { min: Math.min(...values), max: Math.max(...values) };
};

/**
 * Gets min/max for cardio components.
 */
export const getCardioMinMaxValues = (standards: PtStandard[], passFailStandards: Tables<'pt_pass_fail_standards'>[], component: string) => {
    if (component === 'walk') {
        const s = passFailStandards.find(s => s.exercise_type === 'walk_2km');
        return { min: s ? timeToSeconds(s.min_performance) : 0, max: 0 };
    }

    const comp = component === 'run' ? 'run_2mile' : (component === 'shuttles' ? 'shuttles_20m' : component);
    const compStandards = standards.filter(s => s.exercise === comp);
    if (compStandards.length === 0) return { min: 0, max: 0 };

    const values = compStandards.map(s => parsePerformance(s.measurement)).filter(v => v > 0);
    if (comp === 'run_2mile') {
        return { min: Math.max(...values), max: Math.min(...values) }; // min is slowest, max is fastest
    }
    return { min: Math.min(...values), max: Math.max(...values) };
};

export const getPerformanceForScore = (standards: PtStandard[], component: string, targetScore: number): number => {
    const comp = component === 'run' ? 'run_2mile' : (component === 'shuttles' ? 'shuttles_20m' : component);
    const candidates = standards.filter(s => s.exercise === comp && s.points >= targetScore);
    if (candidates.length === 0) return 0;

    const values = candidates.map(c => parsePerformance(c.measurement));
    return comp === 'run_2mile' ? Math.min(...values) : Math.max(...values);
};

export const getDynamicHelpText = (componentKey: string, age: number, gender: string, performance: PtPerformance, standards: PtStandard[]): string => {
    if (!age || !gender || !standards) return "";
    const score = getScoreForExercise(standards, componentKey, performance);
    let perfText = "";
    if (performance.reps) perfText = `${performance.reps} reps`;
    else if (performance.minutes || performance.seconds) perfText = `${performance.minutes}:${String(performance.seconds).padStart(2, '0')}`;
    else if (performance.shuttles) perfText = `${performance.shuttles} shuttles`;

    return perfText ? `For a ${age}-year-old ${gender}, ${perfText} results in ${score.toFixed(2)} points.` : "";
};
