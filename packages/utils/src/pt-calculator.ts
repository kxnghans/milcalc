import data from '../../ui/src/pt_data/pt-data.json';
import walkStandards from '../../ui/src/pt_data/walk-standards.json';

const timeToSeconds = (time: string) => {
    if (!time) return 0;
    const parts = time.split(':').map(Number);
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return 0;
};

const getAgeGroup = (age: number, sex: string) => {
    const gender = sex.charAt(0).toUpperCase() + sex.slice(1);
    return data.age_sex_groups.find(group => {
        if (group.sex !== gender) return false;
        if (group.age_range.includes('<')) {
            const maxAge = parseInt(group.age_range.replace('<', ''));
            return age < maxAge;
        }
        if (group.age_range.includes('+')) {
            const minAge = parseInt(group.age_range.replace('+', ''));
            return age >= minAge;
        }
        const [min, max] = group.age_range.split('-').map(Number);
        return age >= min && age <= max;
    });
};

const getCardioScore = (ageGroup: any, component: string, performance: any) => {
    if (component === 'run') {
        const runTimeInSeconds = performance.minutes * 60 + performance.seconds;
        if (runTimeInSeconds === 0) return 0;
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
    return 0;
};

const getMuscularFitnessScore = (ageGroup: any, component: string, reps: number) => {
    const table = ageGroup.muscular_fitness[component];
    if (!table || !reps) return 0;

    for (const row of table) {
        const rowRepsString = String(row.reps).replace(/[^0-9]/g, '');
        const rowReps = parseInt(rowRepsString);

        if (String(row.reps).includes('>') || String(row.reps).includes('≥')) {
            if (reps >= rowReps) {
                return row.points;
            }
        } else {
            if (reps >= rowReps) {
                return row.points;
            }
        }
    }
    return 0;
};

const getPlankScore = (ageGroup: any, performance: any) => {
    const plankTimeInSeconds = performance.minutes * 60 + performance.seconds;
    if (plankTimeInSeconds === 0) return 0;
    const table = ageGroup.muscular_fitness['forearm_plank_time'];
    if (!table) return 0;

    for (const row of table) {
        const bracketTime = row.time.replace(/[*≥>]/g, '').trim();
        const rowSeconds = timeToSeconds(bracketTime);

        if (plankTimeInSeconds >= rowSeconds) {
            return row.points;
        }
    }
    return 0;
};

const getAgeGroupIndex = (age: number) => {
    if (age < 30) return 0;
    if (age >= 30 && age <= 39) return 1;
    if (age >= 40 && age <= 49) return 2;
    if (age >= 50 && age <= 59) return 3;
    if (age >= 60) return 4;
    return -1;
}

export const checkWalkPass = (age: number, gender: string, minutes: number, seconds: number): 'pass' | 'fail' | 'n/a' => {
    const userTimeInSeconds = minutes * 60 + seconds;
    if (userTimeInSeconds === 0) return 'n/a';

    const ageIndex = getAgeGroupIndex(age);
    if (ageIndex === -1) return 'n/a';

    const standards = walkStandards[gender];
    if (!standards) return 'n/a';
    const maxTime = standards[ageIndex].max_time;
    const maxTimeInSeconds = timeToSeconds(maxTime);

    return userTimeInSeconds <= maxTimeInSeconds ? 'pass' : 'fail';
};

export const calculatePtScore = (inputs: any) => {
    if (inputs.age == null || isNaN(inputs.age) || !inputs.gender) return { totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false, walkPassed: 'n/a' };
    const ageGroup = getAgeGroup(inputs.age, inputs.gender);
    if (!ageGroup) return { totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false, walkPassed: 'n/a' };

    let cardioScore = 0;
    let walkPassed: 'pass' | 'fail' | 'n/a' = 'n/a';

    if (inputs.cardioComponent === 'walk') {
        walkPassed = checkWalkPass(inputs.age, inputs.gender, inputs.walkMinutes, inputs.walkSeconds);
    } else {
        cardioScore = getCardioScore(ageGroup, inputs.cardioComponent, {
            minutes: inputs.runMinutes,
            seconds: inputs.runSeconds,
            shuttles: inputs.shuttles,
        });
    }

    const pushupScore = getMuscularFitnessScore(ageGroup, inputs.pushupComponent, inputs.pushups);

    let coreScore = 0;
    if (inputs.coreComponent === 'sit_ups_1min') {
        coreScore = getMuscularFitnessScore(ageGroup, 'sit_ups_1min', inputs.situps);
    } else if (inputs.coreComponent === 'cross_leg_reverse_crunch_2min') {
        coreScore = getMuscularFitnessScore(ageGroup, 'cross_leg_reverse_crunch_2min', inputs.reverseCrunches);
    } else if (inputs.coreComponent === 'forearm_plank_time') {
        coreScore = getPlankScore(ageGroup, { minutes: inputs.plankMinutes, seconds: inputs.plankSeconds });
    }

    let totalScore = cardioScore + pushupScore + coreScore;
    let isPass = false;

    if (inputs.cardioComponent === 'walk') {
        if (walkPassed === 'pass' && pushupScore > 0 && coreScore > 0) {
            totalScore = ((pushupScore + coreScore) / 40) * 100;
            isPass = totalScore >= 75;
        } else {
            totalScore = pushupScore + coreScore;
            isPass = false;
        }
    } else {
        isPass = totalScore >= 75 && cardioScore > 0 && pushupScore > 0 && coreScore > 0;
    }

    return {
        totalScore,
        cardioScore,
        pushupScore,
        coreScore,
        isPass,
        walkPassed,
    };
};

export const getMinMaxValues = (age: number, sex: string, component: string) => {
    const ageGroup = getAgeGroup(age, sex);
    if (!ageGroup) return { min: 0, max: 0 };

    const table = ageGroup.muscular_fitness[component];
    if (!table || table.length === 0) return { min: 0, max: 0 };

    if (component === 'forearm_plank_time') {
        const timesInSeconds = table.map(row => {
            const timeString = String(row.time).replace(/[^0-9:]/g, '').trim();
            return timeToSeconds(timeString);
        });
        const min = Math.min(...timesInSeconds.filter(t => t > 0));
        const max = Math.max(...timesInSeconds);
        return { min, max };
    }

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

export const getCardioMinMaxValues = (age: number, sex: string, component: string) => {
    const ageGroup = getAgeGroup(age, sex);
    if (!ageGroup) return { min: 0, max: 0 };

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
            const shuttleString = bracket.shuttles_range.replace(/[≥*<>]/g, '').trim();
            if (shuttleString.includes(' - ')) {
                return parseInt(shuttleString.split(' - ')[1], 10);
            }
            return parseInt(shuttleString, 10);
        }).filter(s => !isNaN(s));

        return {
            min: Math.min(...shuttleCounts.filter(s => s > 0)),
            max: Math.max(...shuttleCounts),
        };
    }

    return { min: 0, max: 0 };
};
