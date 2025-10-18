/**
 * @file pt-calculator.ts
 * @description This file contains the core logic for calculating Air Force Physical Fitness (PT) scores.
 * It includes functions to determine age groups, calculate scores for various exercises,
 * handle altitude adjustments, and determine pass/fail status, including exemption logic.
 */

import { getPtStandards } from './pt-supabase-api';

/**
 * Converts a time string (e.g., "mm:ss") to seconds.
 * @param time - The time string to convert.
 * @returns The total number of seconds, or 0 if the format is invalid.
 */
const timeToSeconds = (time: string): number => {
    if (!time) return 0;
    const cleanedTime = String(time).replace(/[^0-9:]/g, '');
    const parts = cleanedTime.split(':').map(Number);
    if (parts.length === 2) {
        // Valid "mm:ss" format
        return parts[0] * 60 + parts[1];
    }
    return 0;
};

/**
 * Determines the appropriate age group string based on age.
 * @param age - The person's age.
 * @returns The age group string (e.g., "25-29") or null if not found.
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
 * Calculates the score for a cardio exercise (run or shuttle).
 * @param ageGroup - The person's age group data.
 * @param component - The specific cardio component ('run' or 'shuttles').
 * @param performance - An object containing the performance metrics (minutes/seconds for run, shuttles count).
 * @returns The calculated score for the cardio component.
 */
const getCardioScore = (standards: any[], component: string, performance: any): number => {
    // For 'more is better' exercises like shuttles, standards are sorted best-to-worst.
    // We need to reverse them to find the first threshold the user meets from worst-to-best.
    const cardioStandards = standards.filter(s => s.exercise === component);

    if (component === 'run') {
        const runTimeInSeconds = performance.minutes * 60 + performance.seconds;
        if (runTimeInSeconds === 0) return 0;

        for (const standard of cardioStandards) {
            const measurement = standard.measurement as string;
            if (measurement.includes('-')) {
                const [start, end] = measurement.split('-').map(time => timeToSeconds(time.trim()));
                if (runTimeInSeconds >= start && runTimeInSeconds <= end) {
                    return standard.points;
                }
            } else {
                const time = timeToSeconds(measurement);
                if (runTimeInSeconds <= time) {
                    return standard.points;
                }
            }
        }
    } else if (component === 'shuttles') {
        const shuttles = performance.shuttles;
        if (shuttles === 0) return 0;

        // Since standards are reversed (worst to best), we find the first one the user meets.
        for (const standard of cardioStandards) {
            const measurement = String(standard.measurement).trim();
            if (measurement.includes('-')) {
                // Use regex to safely extract numbers, ignoring characters like '*'.
                const parts = measurement.split('-');
                const start = parseInt(parts[0].replace(/[^0-9]/g, ''));
                const end = parseInt(parts[1].replace(/[^0-9]/g, ''));

                if (!isNaN(start) && !isNaN(end) && shuttles >= start && shuttles <= end) {
                    return standard.points;
                }
            } else if (measurement.startsWith('>')) {
                const value = parseInt(measurement.replace(/[^0-9]/g, ''));
                if (!isNaN(value) && shuttles > value) {
                    return standard.points;
                }
            } else {
                const value = parseInt(measurement.replace(/[^0-9]/g, ''));
                if (!isNaN(value) && shuttles >= value) {
                    return standard.points;
                }
            }
        }
    }

    return 0;
};

const getMuscularFitnessScore = (standards: any[], component: string, reps: number): number => {
    if (!reps) return 0;
    const exerciseStandards = standards.filter(s => s.exercise === component);

    for (const standard of exerciseStandards) {
        if (reps >= parseInt(String(standard.measurement).replace(/[^0-9]/g, ''))) {
            return standard.points;
        }
    }
    return 0;
};

const getPlankScore = (standards: any[], performance: any): number => {
    const plankTimeInSeconds = performance.minutes * 60 + performance.seconds;
    if (plankTimeInSeconds === 0) return 0;
    const plankStandards = standards.filter(s => s.exercise === 'forearm_plank_time');

    for (const standard of plankStandards) {
        if (plankTimeInSeconds >= timeToSeconds(standard.measurement)) {
            return standard.points;
        }
    }
    return 0;
};

/**
 * Calculates the score for a single exercise, applying altitude adjustments if necessary.
 * @param age - The person's age.
 * @param gender - The person's gender.
 * @param component - The exercise component being scored.
 * @param performance - An object with performance data (reps, time, etc.).
 * @param altitudeGroup - The selected altitude group (e.g., 'group1', 'group2').
 * @returns The final score for the exercise.
 */
export const getScoreForExercise = (standards: any[], component: string, performance: any, altitudeGroup?: string, altitudeAdjustments?: any): number => {

    let adjustedPerformance = { ...performance };

    // Apply altitude adjustments for cardio components
    if (altitudeGroup && altitudeGroup !== 'normal' && altitudeAdjustments) {
        if (component === 'run' && altitudeAdjustments.run) {
            const runTimeInSeconds = performance.minutes * 60 + performance.seconds;
            const correction = altitudeAdjustments.run.find(c => c.altitude_group === altitudeGroup && runTimeInSeconds >= c.time_range_start && runTimeInSeconds <= c.time_range_end);
            if (correction) {
                const adjustedTimeInSeconds = runTimeInSeconds - correction.correction;
                adjustedPerformance.minutes = Math.floor(adjustedTimeInSeconds / 60);
                adjustedPerformance.seconds = adjustedTimeInSeconds % 60;
            }
        } else if (component === 'shuttles' && altitudeAdjustments.hamr) {
            const adjustment = altitudeAdjustments.hamr.find(a => a.altitude_group === altitudeGroup);
            if (adjustment) {
                adjustedPerformance.shuttles = (adjustedPerformance.shuttles || 0) + adjustment.shuttles_to_add;
            }
        }
    }

    // Route to the correct scoring function based on the component
    switch (component) {
        case 'run':
        case 'shuttles':
            return getCardioScore(standards, component, adjustedPerformance);
        case 'push_ups_1min':
        case 'hand_release_pushups_2min':
        case 'sit_ups_1min':
        case 'cross_leg_reverse_crunch_2min':
            return getMuscularFitnessScore(standards, component, adjustedPerformance.reps);
        case 'forearm_plank_time':
            return getPlankScore(standards, adjustedPerformance);
        default:
            return 0;
    }
};

/**
 * Determines the age group index for the walk test.
 * @param age - The person's age.
 * @returns The index of the age group (0-4), or -1 if not found.
 */
const getAgeGroupIndex = (age: number): number => {
    if (age < 30) return 0;
    if (age >= 30 && age <= 39) return 1;
    if (age >= 40 && age <= 49) return 2;
    if (age >= 50 && age <= 59) return 3;
    if (age >= 60) return 4;
    return -1;
}

/**
 * Checks if the 2-kilometer walk meets the passing criteria.
 * @param age - The person's age.
 * @param gender - The person's gender.
 * @param minutes - The minutes part of the walk time.
 * @param seconds - The seconds part of the walk time.
 * @param altitudeGroup - The selected altitude group.
 * @returns 'pass', 'fail', or 'n/a' if data is insufficient.
 */
export const checkWalkPass = async (age: number, gender: string, minutes: number, seconds: number, walkStandards: any[], altitudeAdjustments: any[], altitudeGroup?: string): Promise<'pass' | 'fail' | 'n/a'> => {
    const userTimeInSeconds = minutes * 60 + seconds;
    if (userTimeInSeconds === 0) return 'n/a';

    const ageIndex = getAgeGroupIndex(age);
    if (ageIndex === -1) return 'n/a';

    let maxTimeInSeconds = 0;

    if (altitudeGroup && altitudeGroup !== 'normal') {
        if (altitudeAdjustments) {
            const capitalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
            const adjustment = altitudeAdjustments.find(a => 
                a.altitude_group === altitudeGroup && 
                a.gender.toLowerCase() === capitalizedGender.toLowerCase() && 
                age >= a.age_range_start && 
                age <= a.age_range_end
            );
            if (adjustment) {
                maxTimeInSeconds = adjustment.max_time;
            }
        }
    } else {
        if (walkStandards) {
            const standard = walkStandards.find(s => s.age_range === getAgeGroupString(age));
            if (standard) {
                maxTimeInSeconds = timeToSeconds(standard.max_time);
            }
        }
    }

    if (maxTimeInSeconds === 0) return 'n/a';

    return userTimeInSeconds <= maxTimeInSeconds ? 'pass' : 'fail';
};

/**
 * Calculates the total PT score based on all component inputs, including exemptions.
 * @param inputs - An object containing all user inputs (age, gender, performance, and exemption status for each component).
 * @returns An object with the composite score, component scores, pass/fail status, and walk status.
 */
export const calculatePtScore = async (inputs: any, standards: any[], walkStandards: any[], altitudeAdjustments: any) => {
    // Validate required inputs
    if (inputs.age == null || isNaN(inputs.age) || !inputs.gender) {
        return { totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false, walkPassed: 'n/a' };
    }
    const ageGroupString = getAgeGroupString(inputs.age);
    if (!ageGroupString) {
        return { totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false, walkPassed: 'n/a' };
    }



    let totalPossiblePoints = 100;
    let earnedPoints = 0;

    // Strength Component
    let pushupScore: number | string = 0;
    if (inputs.isStrengthExempt) {
        pushupScore = 'Exempt';
        totalPossiblePoints -= 20;
    } else {
        pushupScore = getMuscularFitnessScore(standards, inputs.pushupComponent, inputs.pushups);
        earnedPoints += pushupScore;
    }

    // Core Component
    let coreScore: number | string = 0;
    if (inputs.isCoreExempt) {
        coreScore = 'Exempt';
        totalPossiblePoints -= 20;
    } else {
        if (inputs.coreComponent === 'sit_ups_1min') {
            coreScore = getMuscularFitnessScore(standards, 'sit_ups_1min', inputs.situps);
        } else if (inputs.coreComponent === 'cross_leg_reverse_crunch_2min') {
            coreScore = getMuscularFitnessScore(standards, 'cross_leg_reverse_crunch_2min', inputs.reverseCrunches);
        } else if (inputs.coreComponent === 'forearm_plank_time') {
            coreScore = getPlankScore(standards, { minutes: inputs.plankMinutes, seconds: inputs.plankSeconds });
        }
        earnedPoints += coreScore;
    }

    // Cardio Component
    let cardioScore: number | string = 0;
    let walkPassed: 'pass' | 'fail' | 'n/a' = 'n/a';
    if (inputs.isCardioExempt) {
        cardioScore = 'Exempt';
        totalPossiblePoints -= 60;
    } else if (inputs.cardioComponent === 'walk') {
        walkPassed = await checkWalkPass(inputs.age, inputs.gender, inputs.walkMinutes, inputs.walkSeconds, walkStandards, altitudeAdjustments.walk, inputs.altitudeGroup);
        totalPossiblePoints -= 60; // Walk test does not contribute points, max score is based on other components.
    } else {
        cardioScore = getCardioScore(standards, inputs.cardioComponent, {
            minutes: inputs.runMinutes,
            seconds: inputs.runSeconds,
            shuttles: inputs.shuttles,
        });
        earnedPoints += cardioScore;
    }

    // Calculate Composite Score
    let compositeScore = 0;
    if (totalPossiblePoints > 0) {
        compositeScore = (earnedPoints / totalPossiblePoints) * 100;
    } else if (inputs.isStrengthExempt && inputs.isCoreExempt && inputs.isCardioExempt) {
        compositeScore = 100;
    }

    // Determine Overall Pass/Fail Status
    const strengthMet = inputs.isStrengthExempt || (typeof pushupScore === 'number' && pushupScore > 0);
    const coreMet = inputs.isCoreExempt || (typeof coreScore === 'number' && coreScore > 0);
    const cardioMet = inputs.isCardioExempt || (inputs.cardioComponent === 'walk' ? walkPassed === 'pass' : (typeof cardioScore === 'number' && cardioScore > 0));

    const allMinsMet = strengthMet && coreMet && cardioMet;
    const isPass = allMinsMet && compositeScore >= 75;

    return {
        totalScore: compositeScore,
        cardioScore,
        pushupScore,
        coreScore,
        isPass,
        walkPassed,
    };
};

/**
 * Calculates the best possible total score from a set of individual exercise scores.
 * This is used for the "Best Score" feature.
 * @param scores - An object mapping exercise components to their highest achieved scores.
 * @returns The sum of the best scores from each category (strength, core, cardio).
 */
export const calculateBestScore = (scores: { [key: string]: number | string }): number => {
    let totalPossiblePoints = 100;
    let earnedPoints = 0;

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
        typeof scores.shuttles === 'number' ? scores.shuttles : 0
    );

    const isStrengthExempt = scores.push_ups_1min === 'Exempt' || scores.hand_release_pushups_2min === 'Exempt';
    const isCoreExempt = scores.sit_ups_1min === 'Exempt' || scores.cross_leg_reverse_crunch_2min === 'Exempt' || scores.forearm_plank_time === 'Exempt';
    const isCardioExempt = scores.run === 'Exempt' || scores.shuttles === 'Exempt';

    if (isStrengthExempt) {
        totalPossiblePoints -= 20;
    } else {
        earnedPoints += strengthScore;
    }

    if (isCoreExempt) {
        totalPossiblePoints -= 20;
    } else {
        earnedPoints += coreScore;
    }

    if (isCardioExempt) {
        totalPossiblePoints -= 60;
    } else {
        earnedPoints += cardioScore;
    }

    if (totalPossiblePoints === 0) {
        return (isStrengthExempt && isCoreExempt && isCardioExempt) ? 100 : 0;
    }

    const compositeScore = (earnedPoints / totalPossiblePoints) * 100;
    return compositeScore;
};

/**
 * Gets the minimum and maximum possible performance values (reps or time) for a given muscular fitness component.
 * @param age - The person's age.
 * @param sex - The person's gender.
 * @param component - The muscular fitness component.
 * @returns An object with the min and max performance values.
 */
export const getMinMaxValues = (standards: any[], component: string) => {
    if (!standards || standards.length === 0) return { min: 0, max: 0 };

    const exerciseStandards = standards.filter(s => s.exercise === component);
    if (exerciseStandards.length === 0) return { min: 0, max: 0 };

    if (component === 'forearm_plank_time') {
        const timesInSeconds = exerciseStandards.flatMap(row => {
            const measurement = row.measurement as string;
            if (measurement.includes('-')) {
                return measurement.split('-').map(time => timeToSeconds(time.trim()));
            } else {
                return timeToSeconds(measurement);
            }
        });
        return {
            min: Math.min(...timesInSeconds.filter(t => t > 0)),
            max: Math.max(...timesInSeconds),
        };
    }

    const reps = exerciseStandards.flatMap(row => {
        const measurement = String(row.measurement);
        if (measurement.includes('-')) {
            return measurement.split('-').map(s => parseInt(s.trim()));
        } else {
            return parseInt(measurement.replace(/[^0-9]/g, ''));
        }
    });
    return {
        min: Math.min(...reps.filter(r => r > 0)),
        max: Math.max(...reps),
    };
};

export const getCardioMinMaxValues = (standards: any[], walkStandards: any[], component: string) => {
    if (component === 'walk') {
        if (!walkStandards || walkStandards.length === 0) return { min: 0, max: 0 };
        const maxTime = walkStandards[0].max_time;
        return { min: timeToSeconds(maxTime), max: 0 };
    }

    if (!standards || standards.length === 0) return { min: 0, max: 0 };
    const exerciseStandards = standards.filter(s => s.exercise === component);
    if (exerciseStandards.length === 0) return { min: 0, max: 0 };

    if (component === 'run') {
        const times = exerciseStandards.flatMap(s => {
            const measurement = s.measurement as string;
            if (measurement.includes('-')) {
                return measurement.split('-').map(time => timeToSeconds(time.trim()));
            } else {
                return timeToSeconds(measurement);
            }
        });
        return {
            min: Math.max(...times), // Slowest time
            max: Math.min(...times.filter(t => t > 0)), // Fastest time
        };
    } else if (component === 'shuttles') {
        const shuttleCounts = exerciseStandards.flatMap(s => {
            const measurement = s.measurement as string;
            if (measurement.includes('-')) {
                return measurement.split('-').map(s => parseInt(s.trim()));
            } else {
                return parseInt(measurement.replace(/[^0-9]/g, ''));
            }
        });
        return {
            min: Math.min(...shuttleCounts.filter(s => s > 0)),
            max: Math.max(...shuttleCounts),
        };
    }

    return { min: 0, max: 0 };
};

export const getPerformanceForScore = (standards: any[], component: string, targetScore: number): number => {
    if (!standards || standards.length === 0) return 0;

    const exerciseStandards = standards.filter(s => s.exercise === component);
    const candidates = exerciseStandards.filter(s => s.points >= targetScore);
    if (candidates.length === 0) return 999;

    if (component === 'run' || component === 'forearm_plank_time') {
        const times = candidates.map(c => timeToSeconds(c.measurement));
        return Math.min(...times);
    } else {
        const reps = candidates.map(c => parseInt(c.measurement));
        return Math.min(...reps);
    }
};

/**
 * Generates a dynamic, human-readable string explaining the score for a given performance.
 * @param componentKey - The specific exercise component.
 * @param age - The user's age.
 * @param gender - The user's gender.
 * @param performance - An object containing the performance data (reps, minutes, seconds).
 * @returns A string detailing the calculated score, or an empty string if inputs are invalid.
 */
export const getDynamicHelpText = (componentKey: string, age: number, gender: string, performance: any): string => {
    if (!age || !gender) {
        return "Please enter age and gender to see dynamic scoring details.";
    }

    const score = getScoreForExercise(age, gender, componentKey, performance);

    let performanceText = "";
    if (performance.reps) {
        performanceText = `${performance.reps} reps`;
    } else if (performance.minutes || performance.seconds) {
        const minutes = performance.minutes || 0;
        const seconds = performance.seconds || 0;
        performanceText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    if (performanceText) {
        return `For a ${age}-year-old ${gender}, a performance of ${performanceText} results in a score of ${score.toFixed(2)} points.`;
    } else {
        return "Enter a performance value to see your calculated score.";
    }
};