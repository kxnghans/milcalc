import data from '../../ui/src/pt-data.json';

const timeToSeconds = (time: string) => {
    const [minutes, seconds] = time.split(':').map(Number);
    return minutes * 60 + seconds;
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

export const calculatePtScore = (inputs: any) => {
    const ageGroup = getAgeGroup(inputs.age, inputs.gender);
    if (!ageGroup) return { totalScore: 0 };

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
