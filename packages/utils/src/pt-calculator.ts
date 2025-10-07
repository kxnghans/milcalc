/**
 * @file pt-calculator.ts
 * @description This file contains the core logic for calculating Air Force Physical Fitness (PT) scores.
 * It includes functions to determine age groups, calculate scores for various exercises,
 * handle altitude adjustments, and determine pass/fail status, including exemption logic.
 */

import { ptData as data, walkStandards, altitudeAdjustments } from '@repo/data';

/**
 * Converts a time string (e.g., "mm:ss") to seconds.
 * @param time - The time string to convert.
 * @returns The total number of seconds, or 0 if the format is invalid.
 */
const timeToSeconds = (time: string): number => {
    if (!time) return 0;
    const parts = time.split(':').map(Number);
    if (parts.length === 2) {
        // Valid "mm:ss" format
        return parts[0] * 60 + parts[1];
    }
    return 0;
};

/**
 * Finds the appropriate age and gender group from the PT data.
 * @param age - The person's age.
 * @param sex - The person's gender ("male" or "female").
 * @returns The age group object from the data, or undefined if not found.
 */
const getAgeGroup = (age: number, sex: string) => {
    const gender = sex.charAt(0).toUpperCase() + sex.slice(1);
    return data.age_sex_groups.find(group => {
        if (group.sex !== gender) return false;

        // Handle age ranges like "<25"
        if (group.age_range.includes('<')) {
            const maxAge = parseInt(group.age_range.replace('<', ''));
            return age < maxAge;
        }
        // Handle age ranges like "60+"
        if (group.age_range.includes('+')) {
            const minAge = parseInt(group.age_range.replace('+', ''));
            return age >= minAge;
        }
        // Handle standard age ranges like "25-29"
        const [min, max] = group.age_range.split('-').map(Number);
        return age >= min && age <= max;
    });
};

/**
 * Calculates the score for a cardio exercise (run or shuttle).
 * @param ageGroup - The person's age group data.
 * @param component - The specific cardio component ('run' or 'shuttles').
 * @param performance - An object containing the performance metrics (minutes/seconds for run, shuttles count).
 * @returns The calculated score for the cardio component.
 */
const getCardioScore = (ageGroup: any, component: string, performance: any): number => {
    if (component === 'run') {
        const runTimeInSeconds = performance.minutes * 60 + performance.seconds;
        if (runTimeInSeconds === 0) return 0;

        // Find the matching score bracket for the run time
        for (const bracket of ageGroup.cardiorespiratory.run_time_brackets) {
            const bracketTime = bracket.run_time.replace('*', '');
            if (bracketTime.includes('≤')) {
                if (runTimeInSeconds <= timeToSeconds(bracketTime.replace('≤ ', ''))) {
                    return bracket.points;
                }
            } else if (bracketTime.includes('<')) {
                if (runTimeInSeconds < timeToSeconds(bracketTime.replace('< ', ''))) {
                    return bracket.points;
                }
            } else if (bracketTime.includes(' - ')) {
                const [start, end] = bracketTime.split(' - ').map(timeToSeconds);
                if (runTimeInSeconds >= start && runTimeInSeconds <= end) {
                    return bracket.points;
                }
            }
        }
    } else if (component === 'shuttles') {
        const shuttles = performance.shuttles;
        if (shuttles === 0) return 0;

        // Find the matching score bracket for the shuttle count
        for (const bracket of ageGroup.cardiorespiratory.run_time_brackets) {
            const shuttleRange = bracket.shuttles_range.replace('*', '');
            if (shuttleRange.includes('>')) {
                const minShuttles = parseInt(shuttleRange.replace('> ', ''));
                if (shuttles > minShuttles) {
                    return bracket.points;
                }
            } else if (shuttleRange.includes(' - ')) {
                const [start, end] = shuttleRange.split(' - ').map(Number);
                if (shuttles >= start && shuttles <= end) {
                    return bracket.points;
                }
            } else if (shuttleRange.includes('≥')) {
                const minShuttles = parseInt(shuttleRange.replace('≥ ', ''));
                if (shuttles >= minShuttles) {
                    return bracket.points;
                }
            }
        }
    }
    return 0; // Return 0 if no bracket is matched
};

/**
 * Calculates the score for a muscular fitness exercise (e.g., push-ups, sit-ups).
 * @param ageGroup - The person's age group data.
 * @param component - The specific muscular fitness component.
 * @param reps - The number of repetitions performed.
 * @returns The calculated score for the component.
 */
const getMuscularFitnessScore = (ageGroup: any, component: string, reps: number): number => {
    const table = ageGroup.muscular_fitness[component];
    if (!table || !reps) return 0;

    // Find the matching score for the number of reps
    for (const row of table) {
        const rowRepsString = String(row.reps).replace(/[^0-9]/g, '');
        const rowReps = parseInt(rowRepsString);

        // Handle ranges like ">62" or "≥62"
        if (String(row.reps).includes('>') || String(row.reps).includes('≥')) {
            if (reps >= rowReps) {
                return row.points;
            }
        } else {
            // Handle exact rep counts
            if (reps >= rowReps) {
                return row.points;
            }
        }
    }
    return 0; // Return 0 if no rep count is matched
};

/**
 * Calculates the score for the forearm plank exercise.
 * @param ageGroup - The person's age group data.
 * @param performance - An object containing the performance metrics (minutes/seconds).
 * @returns The calculated score for the plank.
 */
const getPlankScore = (ageGroup: any, performance: any): number => {
    const plankTimeInSeconds = performance.minutes * 60 + performance.seconds;
    if (plankTimeInSeconds === 0) return 0;
    const table = ageGroup.muscular_fitness['forearm_plank_time'];
    if (!table) return 0;

    // Find the matching score for the plank time
    for (const row of table) {
        const bracketTime = row.time.replace(/[*≥>]/g, '').trim();
        const rowSeconds = timeToSeconds(bracketTime);

        if (plankTimeInSeconds >= rowSeconds) {
            return row.points;
        }
    }
    return 0; // Return 0 if no time is matched
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
export const getScoreForExercise = (age: number, gender: string, component: string, performance: any, altitudeGroup?: string): number => {
    const ageGroup = getAgeGroup(age, gender);
    if (!ageGroup) return 0;

    let adjustedPerformance = { ...performance };

    // Apply altitude adjustments for cardio components
    if (altitudeGroup && altitudeGroup !== 'normal') {
        if (component === 'run') {
            const runTimeInSeconds = performance.minutes * 60 + performance.seconds;
            const correction = altitudeAdjustments.run.groups[altitudeGroup].corrections.find(c => runTimeInSeconds >= c.time_range[0] && runTimeInSeconds <= c.time_range[1]);
            if (correction) {
                const adjustedTimeInSeconds = runTimeInSeconds - correction.correction;
                adjustedPerformance.minutes = Math.floor(adjustedTimeInSeconds / 60);
                adjustedPerformance.seconds = adjustedTimeInSeconds % 60;
            }
        } else if (component === 'shuttles') {
            adjustedPerformance.shuttles += altitudeAdjustments.hamr.groups[altitudeGroup].shuttles_to_add;
        }
    }

    // Route to the correct scoring function based on the component
    switch (component) {
        case 'run':
        case 'shuttles':
            return getCardioScore(ageGroup, component, adjustedPerformance);
        case 'push_ups_1min':
        case 'hand_release_pushups_2min':
        case 'sit_ups_1min':
        case 'cross_leg_reverse_crunch_2min':
            return getMuscularFitnessScore(ageGroup, component, adjustedPerformance.reps);
        case 'forearm_plank_time':
            return getPlankScore(ageGroup, adjustedPerformance);
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
export const checkWalkPass = (age: number, gender: string, minutes: number, seconds: number, altitudeGroup?: string): 'pass' | 'fail' | 'n/a' => {
    const userTimeInSeconds = minutes * 60 + seconds;
    if (userTimeInSeconds === 0) return 'n/a';

    const ageIndex = getAgeGroupIndex(age);
    if (ageIndex === -1) return 'n/a';

    let maxTimeInSeconds = 0;

    // Determine the maximum allowed time based on altitude
    if (altitudeGroup && altitudeGroup !== 'normal') {
        // Defensive checks to prevent errors if data structure is missing expected values
        if (
            altitudeAdjustments.walk &&
            altitudeAdjustments.walk[gender] &&
            altitudeAdjustments.walk[gender][altitudeGroup] &&
            altitudeAdjustments.walk[gender][altitudeGroup].max_times &&
            altitudeAdjustments.walk[gender][altitudeGroup].max_times[ageIndex]
        ) {
            maxTimeInSeconds = altitudeAdjustments.walk[gender][altitudeGroup].max_times[ageIndex].max_time;
        } else {
            return 'n/a'; // Data not available for this combination
        }
    } else {
        const standards = walkStandards[gender];
        if (!standards || !standards[ageIndex]) return 'n/a';
        const maxTime = standards[ageIndex].max_time;
        maxTimeInSeconds = timeToSeconds(maxTime);
    }

    return userTimeInSeconds <= maxTimeInSeconds ? 'pass' : 'fail';
};

/**
 * Calculates the total PT score based on all component inputs, including exemptions.
 * @param inputs - An object containing all user inputs (age, gender, performance, and exemption status for each component).
 * @returns An object with the composite score, component scores, pass/fail status, and walk status.
 */
export const calculatePtScore = (inputs: any) => {
    // Validate required inputs
    if (inputs.age == null || isNaN(inputs.age) || !inputs.gender) {
        return { totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false, walkPassed: 'n/a' };
    }
    const ageGroup = getAgeGroup(inputs.age, inputs.gender);
    if (!ageGroup) {
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
        pushupScore = getMuscularFitnessScore(ageGroup, inputs.pushupComponent, inputs.pushups);
        earnedPoints += pushupScore;
    }

    // Core Component
    let coreScore: number | string = 0;
    if (inputs.isCoreExempt) {
        coreScore = 'Exempt';
        totalPossiblePoints -= 20;
    } else {
        if (inputs.coreComponent === 'sit_ups_1min') {
            coreScore = getMuscularFitnessScore(ageGroup, 'sit_ups_1min', inputs.situps);
        } else if (inputs.coreComponent === 'cross_leg_reverse_crunch_2min') {
            coreScore = getMuscularFitnessScore(ageGroup, 'cross_leg_reverse_crunch_2min', inputs.reverseCrunches);
        } else if (inputs.coreComponent === 'forearm_plank_time') {
            coreScore = getPlankScore(ageGroup, { minutes: inputs.plankMinutes, seconds: inputs.plankSeconds });
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
        walkPassed = checkWalkPass(inputs.age, inputs.gender, inputs.walkMinutes, inputs.walkSeconds, inputs.altitudeGroup);
        totalPossiblePoints -= 60; // Walk test does not contribute points, max score is based on other components.
    } else {
        let adjustedRunTime = { minutes: inputs.runMinutes, seconds: inputs.runSeconds };
        let adjustedShuttles = inputs.shuttles;

        if (inputs.altitudeGroup && inputs.altitudeGroup !== 'normal') {
            if (inputs.cardioComponent === 'run') {
                const runTimeInSeconds = inputs.runMinutes * 60 + inputs.runSeconds;
                const correction = altitudeAdjustments.run.groups[inputs.altitudeGroup]?.corrections.find(c => runTimeInSeconds >= c.time_range[0] && runTimeInSeconds <= c.time_range[1]);
                if (correction) {
                    const adjustedTimeInSeconds = runTimeInSeconds - correction.correction;
                    adjustedRunTime.minutes = Math.floor(adjustedTimeInSeconds / 60);
                    adjustedRunTime.seconds = adjustedTimeInSeconds % 60;
                }
            } else if (inputs.cardioComponent === 'shuttles') {
                adjustedShuttles += altitudeAdjustments.hamr.groups[inputs.altitudeGroup]?.shuttles_to_add || 0;
            }
        }
        cardioScore = getCardioScore(ageGroup, inputs.cardioComponent, {
            minutes: adjustedRunTime.minutes,
            seconds: adjustedRunTime.seconds,
            shuttles: adjustedShuttles,
        });
        earnedPoints += cardioScore;
    }

    // Calculate Composite Score
    let compositeScore = 0;
    if (totalPossiblePoints > 0) {
        compositeScore = (earnedPoints / totalPossiblePoints) * 100;
    } else if (inputs.isStrengthExempt && inputs.isCoreExempt && inputs.isCardioExempt) {
        // If all components are exempt, member is exempt from the test.
        // No score is given, but they "pass".
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
export const getMinMaxValues = (age: number, sex: string, component: string) => {
    const ageGroup = getAgeGroup(age, sex);
    if (!ageGroup) return { min: 0, max: 0 };

    const table = ageGroup.muscular_fitness[component];
    if (!table || table.length === 0) return { min: 0, max: 0 };

    // Handle time-based components like the plank
    if (component === 'forearm_plank_time') {
        const timesInSeconds = table.map(row => {
            const timeString = String(row.time).replace(/[^0-9:]/g, '').trim();
            return timeToSeconds(timeString);
        });
        const min = Math.min(...timesInSeconds.filter(t => t > 0));
        const max = Math.max(...timesInSeconds);
        return { min, max };
    }

    // Handle rep-based components
    const reps = table.map(row => {
        if (typeof row.reps === 'string') {
            const match = row.reps.replace(/[^0-9]/g, '');
            return match ? parseInt(match, 10) : 0;
        }
        return row.reps;
    });

    const min = Math.min(...reps.filter(r => r > 0));
    const max = Math.max(...reps);

    return { min, max };
};

/**
 * Gets the minimum and maximum possible performance values for a given cardio component.
 * @param age - The person's age.
 * @param sex - The person's gender.
 * @param component - The cardio component ('run', 'shuttles', or 'walk').
 * @returns An object with the min and max performance values. For run, min is slowest and max is fastest.
 */
export const getCardioMinMaxValues = (age: number, sex: string, component: string) => {
    const ageGroup = getAgeGroup(age, sex);
    if (!ageGroup) return { min: 0, max: 0 };

    // For the walk, "min" holds the passing time threshold
    if (component === 'walk') {
        const ageIndex = getAgeGroupIndex(age);
        if (ageIndex === -1) return { min: 0, max: 0 };

        const standards = walkStandards[sex];
        if (!standards) return { min: 0, max: 0 };

        const maxTime = standards[ageIndex].max_time;
        const maxTimeInSeconds = timeToSeconds(maxTime);
        return { min: maxTimeInSeconds, max: 0 }; // Using min to hold the passThreshold
    }

    const brackets = ageGroup.cardiorespiratory.run_time_brackets;
    if (!brackets || brackets.length === 0) return { min: 0, max: 0 };

    if (component === 'run') {
        const times = brackets.map(bracket => {
            const timeString = bracket.run_time.replace(/[≤*<>]/g, '').trim();
            if (timeString.includes(' - ')) {
                return timeToSeconds(timeString.split(' - ')[1]);
            }
            return timeToSeconds(timeString);
        }).filter(t => t > 0);

        return {
            min: Math.max(...times), // Slowest time
            max: Math.min(...times), // Fastest time
        };
    } else if (component === 'shuttles') {
        const shuttleCounts = brackets.map(bracket => {
            const shuttleRange = bracket.shuttles_range;
            if (shuttleRange.includes(' - ')) {
                const parts = shuttleRange.split(' - ');
                const highEnd = parts[1].replace(/[^0-9]/g, '');
                return parseInt(highEnd, 10);
            }
            const singleValue = shuttleRange.replace(/[^0-9]/g, '');
            return parseInt(singleValue, 10);
        }).filter(s => !isNaN(s));

        return {
            min: Math.min(...shuttleCounts.filter(s => s > 0)),
            max: Math.max(...shuttleCounts),
        };
    }

    return { min: 0, max: 0 };
};

/**
 * Gets the required performance for a given component to achieve a target score.
 * @param age - The person's age.
 * @param sex - The person's gender.
 * @param component - The exercise component.
 * @param targetScore - The desired score.
 * @returns The performance value (time in seconds, reps, or shuttle count) required to meet the target score.
 */
export const getPerformanceForScore = (age: number, sex: string, component: string, targetScore: number): number => {
    const ageGroup = getAgeGroup(age, sex);
    if (!ageGroup) return 0;

    if (component === 'run') {
        const brackets = ageGroup.cardiorespiratory.run_time_brackets;
        const candidates = brackets.filter(b => b.points >= targetScore);
        if (candidates.length === 0) return 9999; // Return a very high time if no score is high enough
        const times = candidates.map(b => {
            const timeString = b.run_time.replace(/[≤*<>]/g, '').trim();
            const timeParts = timeString.split(' - ');
            return timeToSeconds(timeParts[timeParts.length - 1]);
        });
        return Math.max(...times);
    }

    if (component === 'shuttles') {
        const brackets = ageGroup.cardiorespiratory.run_time_brackets;
        const candidates = brackets.filter(b => b.points >= targetScore);
        if (candidates.length === 0) return 999; // Return a high number if not achievable
        const shuttles = candidates.map(b => {
            const shuttleString = b.shuttles_range.replace(/[≥*<>]/g, '').trim();
            const shuttleParts = shuttleString.split(' - ');
            return parseInt(shuttleParts[0], 10);
        });
        return Math.min(...shuttles);
    }

    if (component === 'forearm_plank_time') {
        const table = ageGroup.muscular_fitness[component];
        const candidates = table.filter(row => row.points >= targetScore);
        if (candidates.length === 0) return 999; // Return a high number if not achievable
        const times = candidates.map(row => timeToSeconds(String(row.time).replace(/[^0-9:]/g, '')));
        return Math.min(...times);
    }

    // Handles push-ups, sit-ups, and reverse crunches
    const table = ageGroup.muscular_fitness[component];
    if (!table) return 0;
    const candidates = table.filter(row => row.points >= targetScore);
    if (candidates.length === 0) return 999; // Return a high number if not achievable
    const reps = candidates.map(row => parseInt(String(row.reps).replace(/[^0-9]/g, '')));
    return Math.min(...reps);
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