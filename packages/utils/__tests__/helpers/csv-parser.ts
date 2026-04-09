import * as fs from 'fs';
import * as path from 'path';
import { PtStandard, Tables } from '../../src/types';

export interface ExpectedScore {
    gender: string;
    ageGroup: string;
    exercise: string;
    performance: string;
    points: number;
}

// Utility to convert seconds back to "mm:ss" if needed
function secondsToMMSS(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

const csvDir = path.join(__dirname, '../../../../docs/sources/csvs');

function readCSV(filename: string): string[][] {
    const content = fs.readFileSync(path.join(csvDir, filename), 'utf-8');
    return content.trim().split('\n').map(line => {
        // Handle potential quoted fields if they exist, though simple split often works for these files
        return line.split(',').map(s => s.trim().replace(/^"(.*)"$/, '$1'));
    });
}

export function parseCSVData() {
    const standards: { [gender: string]: { [ageGroup: string]: PtStandard[] } } = {
        Male: {},
        Female: {}
    };

    const exhaustiveExpectedScores: ExpectedScore[] = [];

    const ageGroups = ['<25', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'];

    // Initialize the structure
    for (const gender of ['Male', 'Female']) {
        for (const age of ageGroups) {
            standards[gender][age] = [];
        }
    }

    const files = [
        { name: 'pt_scoring_cross_leg_reverse_crunch_2min.csv', exercise: 'cross_leg_reverse_crunch_2min', type: 'reps' },
        // Forearm plank CSV uses 'time' column (e.g. '2:30') as measurement, not reps
        { name: 'pt_scoring_forearm_plank.csv', exercise: 'forearm_plank_time', type: 'time' },
        { name: 'pt_scoring_hand_release_pushups_2min.csv', exercise: 'hand_release_pushups_2min', type: 'reps' },
        { name: 'pt_scoring_pushups_1min.csv', exercise: 'push_ups_1min', type: 'reps' },
        { name: 'pt_scoring_situps_1min.csv', exercise: 'sit_ups_1min', type: 'reps' },
        { name: 'pt_scoring_hamr_shuttles.csv', exercise: 'shuttles_20m', type: 'points' },
        { name: 'pt_scoring_run_2mile.csv', exercise: 'run_2mile', type: 'points' },
    ];

    for (const file of files) {
        const rows = readCSV(file.name);
        if (rows.length === 0) continue;
        const headers = rows[0];
        
        // Find indices of age groups
        const ageIndices: Record<string, number> = {};
        for (const age of ageGroups) {
            const idx = headers.indexOf(age);
            if (idx !== -1) {
                ageIndices[age] = idx;
            }
        }

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < headers.length) continue;
            
            const gender = row[0];
            if (gender !== 'Male' && gender !== 'Female') continue;

            const points = parseFloat(row[1]);
            if (isNaN(points)) continue;

            for (const age of ageGroups) {
                const ageIdx = ageIndices[age];
                if (ageIdx === undefined) continue;
                const cellValue = row[ageIdx];

                if (!cellValue || cellValue === 'N/A' || cellValue === '' || cellValue === '-') continue;

                const measurement = cellValue;

                const standardEntry: PtStandard = {
                    exercise: file.exercise,
                    measurement: measurement,
                    points: points
                };

                standards[gender][age].push(standardEntry);
                
                exhaustiveExpectedScores.push({
                    gender,
                    ageGroup: age,
                    exercise: file.exercise,
                    performance: measurement,
                    points
                });

                // Compatibility mappings
                if (file.exercise === 'run_2mile') {
                    standards[gender][age].push({ ...standardEntry, exercise: 'run' });
                    exhaustiveExpectedScores.push({
                        gender,
                        ageGroup: age,
                        exercise: 'run',
                        performance: measurement,
                        points
                    });
                }
                if (file.exercise === 'shuttles_20m') {
                    standards[gender][age].push({ ...standardEntry, exercise: 'shuttles' });
                    exhaustiveExpectedScores.push({
                        gender,
                        ageGroup: age,
                        exercise: 'shuttles',
                        performance: measurement,
                        points
                    });
                }
            }
        }
    }

    // Parse WHtR
    const whtrRows = readCSV('pt_scoring_whtr.csv');
    for (let i = 1; i < whtrRows.length; i++) {
        const row = whtrRows[i];
        if (row.length < 3) continue;
        const whtrValue = row[0];
        const risk = row[1];
        const points = parseFloat(row[2]);

        for (const gender of ['Male', 'Female']) {
            for (const age of ageGroups) {
                const entry = {
                    exercise: 'whtr',
                    measurement: whtrValue,
                    points: points,
                    healthRiskCategory: risk
                };
                standards[gender][age].push(entry);
                exhaustiveExpectedScores.push({
                    gender,
                    ageGroup: age,
                    exercise: 'whtr',
                    performance: whtrValue,
                    points
                });
            }
        }
    }

    // Parse Pass/Fail
    const pfRows = readCSV('pt_minimum_standards.csv');
    const pfHeaders = pfRows[0];
    const passFailStandards: Partial<Tables<'pt_pass_fail_standards'>>[] = [];
    
    const exerciseMap: Record<string, string> = {
        'push_ups_1min': 'push_ups_1min',
        'hand_release_pushups_2min': 'hand_release_pushups_2min',
        'sit_ups_1min': 'sit_ups_1min',
        'cross_leg_reverse_crunch_2min': 'cross_leg_reverse_crunch_2min',
        'forearm_plank': 'forearm_plank_time',
        'run_2mile': 'run_2mile',
        'hamr_shuttles': 'shuttles_20m'
    };

    for (let i = 1; i < pfRows.length; i++) {
        const row = pfRows[i];
        if (row.length < pfHeaders.length) continue;
        const sex = row[0];
        const age_range = row[1];

        for (let j = 2; j < pfHeaders.length; j++) {
            const header = pfHeaders[j];
            const mappedEx = exerciseMap[header];
            if (mappedEx && row[j] && row[j] !== 'N/A') {
                const minPerf = row[j];
                passFailStandards.push({
                    exercise_type: mappedEx,
                    gender: sex,
                    age_group: age_range,
                    min_performance: minPerf
                });
                if (mappedEx === 'run_2mile') {
                    passFailStandards.push({
                        exercise_type: 'run',
                        gender: sex,
                        age_group: age_range,
                        min_performance: minPerf
                    });
                }
            }
        }
    }

    // Parse actual walk sea level standards
    try {
        const walkSeaLevelRows = readCSV('pt_standards_walk.csv');
        const walkHeaders = walkSeaLevelRows[0];
        for (let i = 1; i < walkSeaLevelRows.length; i++) {
            const row = walkSeaLevelRows[i];
            const sex = row[0];
            for (let j = 1; j < walkHeaders.length; j++) {
                const age_range = walkHeaders[j];
                const minPerf = row[j];
                passFailStandards.push({
                    exercise_type: 'walk_2km',
                    gender: sex,
                    age_group: age_range,
                    min_performance: minPerf
                });
            }
        }
    } catch (e) {
        console.warn('Missing pt_standards_walk.csv, falling back to 17:28');
        passFailStandards.push({ exercise_type: 'walk_2km', min_performance: '17:28' });
    }

    // Parse Altitude Adjustments
    const altitudeCorrections: Partial<Tables<'pt_altitude_corrections'>>[] = [];
    
    try {
        const runAltRows = readCSV('pt_altitude_run.csv');
        for (let i = 1; i < runAltRows.length; i++) {
            const row = runAltRows[i];
            if (row.length < 5) continue;
            altitudeCorrections.push({
                exercise_type: 'run_2mile',
                altitude_group: row[0].replace(/Group /i, 'group').toLowerCase(),
                perf_start: row[2],
                perf_end: row[3],
                correction: parseInt(row[4], 10)
            });
        }
    } catch (e) { console.warn('Missing pt_altitude_run.csv'); }

    try {
        const hamrAltRows = readCSV('pt_altitude_hamr.csv');
        for (let i = 1; i < hamrAltRows.length; i++) {
            const row = hamrAltRows[i];
            if (row.length < 3) continue;
            altitudeCorrections.push({
                exercise_type: 'shuttles_20m',
                altitude_group: row[0].replace(/Group /i, 'group').toLowerCase(),
                correction: parseInt(row[2], 10)
            });
        }
    } catch (e) { console.warn('Missing pt_altitude_hamr.csv'); }

    // Parse Walk Altitude Adjustments
    const walkAltThresholds: Partial<Tables<'pt_altitude_walk_thresholds'>>[] = [];
    try {
        const walkAltRows = readCSV('pt_altitude_walk.csv');
        for (let i = 1; i < walkAltRows.length; i++) {
            const row = walkAltRows[i];
            if (row.length < 6) continue;
            walkAltThresholds.push({
                sex: row[0],
                altitude_group: row[1].replace(/Group /i, 'group').toLowerCase(),
                age_range: `${row[3]}-${row[4]}`,
                max_time: secondsToMMSS(parseInt(row[5], 10))
            });
        }
    } catch (e) { console.warn('Missing pt_altitude_walk.csv'); }

    // Deduplicate exhaustiveExpectedScores to take the max points for any given (gender, age, exercise, performance)
    const dedupedMap = new Map<string, ExpectedScore>();
    for (const exp of exhaustiveExpectedScores) {
        const key = `${exp.gender}-${exp.ageGroup}-${exp.exercise}-${exp.performance}`;
        const existing = dedupedMap.get(key);
        if (!existing || exp.points > existing.points) {
            dedupedMap.set(key, exp);
        }
    }

    return {
        standards,
        exhaustiveExpectedScores: Array.from(dedupedMap.values()),
        passFailStandards,
        altitudeCorrections,
        walkAltThresholds
    };
}

