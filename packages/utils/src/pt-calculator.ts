import data from '../../ui/src/data/pt-data.json';

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
        if (group.age_range.includes('over')) {
            const minAge = parseInt(group.age_range.replace('over ', ''));
            return age > minAge;
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
            } else if (bracketTime.includes('-')) {
                const [start, end] = bracketTime.split(' - ').map(timeToSeconds);
                if (runTimeInSeconds >= start && runTimeInSeconds <= end) {
                    return bracket.points;
                }
            }
        }
    }
    return 0;
};

const getMuscularFitnessScore = (ageGroup: any, component: string, reps: number) => {
    const table = ageGroup.muscular_fitness.parsed_top_rows[component];
    if (!table) return 0;

    for (const row of table) {
        if (typeof row.reps === 'string') {
            if (row.reps.includes('>=')) {
                if (reps >= parseInt(row.reps.replace('>= ', ''))) {
                    return row.points;
                }
            } else if (row.reps.includes('>')) {
                if (reps > parseInt(row.reps.replace('> ', ''))) {
                    return row.points;
                }
            }
        } else if (reps === row.reps) {
            return row.points;
        }
    }
    return 0;
};

const getPlankScore = (ageGroup: any, performance: any) => {
    const plankTimeInSeconds = performance.minutes * 60 + performance.seconds;
    if (plankTimeInSeconds === 0) return 0;
    const table = ageGroup.muscular_fitness.parsed_top_rows['forearm_plank_time'];
    if (!table) return 0;

    for (const row of table) {
        const bracketTime = row.time.replace('*', '');
        if (bracketTime.includes('>')) {
            if (plankTimeInSeconds > timeToSeconds(bracketTime.replace('> ', ''))) {
                return row.points;
            }
        } else {
            if (plankTimeInSeconds >= timeToSeconds(bracketTime)) {
                return row.points;
            }
        }
    }
    return 0;
};

export const getMinMaxValues = (age: number, gender: string, component: string) => {
    const ageGroup = getAgeGroup(age, gender);
    if (!ageGroup) return { min: 0, max: 0 };

    if (component === 'run') {
        const brackets = ageGroup.cardiorespiratory.run_time_brackets;
        const maxTimeString = brackets[0].run_time.replace('≤ ', '');
        const minTimeString = brackets[brackets.length - 1].run_time.split(' - ')[1].replace('*','');
        return { min: timeToSeconds(minTimeString), max: timeToSeconds(maxTimeString) };
    }

    const muscularFitnessComponent = component.includes('pushups') ? 'push_ups_1min' : (component.includes('situps') ? 'sit_ups_1min' : 'cross_leg_reverse_crunch_2min');
    const table = ageGroup.muscular_fitness.parsed_top_rows[muscularFitnessComponent];
    if (!table || table.length === 0) return { min: 0, max: 0 };

    const maxReps = parseInt(String(table[0].reps).replace('>= ', '').replace('> ', ''));
    
    // This is a workaround as the full table is not available.
    // We are looking for the minimum points for passing, which is not 0.
    // The provided data only has top rows, so we find the lowest reps in the provided data.
    let minReps = 0;
    for(let i = table.length - 1; i >= 0; i--) {
        if(table[i].points > 0) {
            minReps = parseInt(String(table[i].reps));
            break;
        }
    }

    return { min: minReps, max: maxReps };
}

export const calculatePtScore = (inputs: any) => {
    const ageGroup = getAgeGroup(inputs.age, inputs.gender);
    if (!inputs.age || !inputs.gender) return { totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false };
    if (!ageGroup) return { totalScore: 0, cardioScore: 0, pushupScore: 0, coreScore: 0, isPass: false };

    const cardioScore = getCardioScore(ageGroup, inputs.cardioComponent, {
        minutes: inputs.runMinutes,
        seconds: inputs.runSeconds,
    });

    const pushupScore = getMuscularFitnessScore(ageGroup, inputs.pushupComponent, inputs.pushups);

    let coreScore = 0;
    if (inputs.coreComponent === 'situps_1min') {
        coreScore = getMuscularFitnessScore(ageGroup, 'sit_ups_1min', inputs.situps);
    } else if (inputs.coreComponent === 'cross_leg_reverse_crunch_2min') {
        coreScore = getMuscularFitnessScore(ageGroup, 'cross_leg_reverse_crunch_2min', inputs.reverseCrunches);
    } else if (inputs.coreComponent === 'forearm_plank_time') {
        coreScore = getPlankScore(ageGroup, { minutes: inputs.plankMinutes, seconds: inputs.plankSeconds });
    }

    const totalScore = cardioScore + pushupScore + coreScore;

    return {
        totalScore,
        cardioScore,
        pushupScore,
        coreScore,
        isPass: totalScore >= 75,
    };
};
