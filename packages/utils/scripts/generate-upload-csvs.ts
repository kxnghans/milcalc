import * as fs from 'fs';
import * as path from 'path';

const csvDir = path.join(__dirname, '../../../docs/sources/csvs');
const uploadDir = path.join(__dirname, '../../../uploadcsv');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

function readCSV(filename: string): string[][] {
    const content = fs.readFileSync(path.join(csvDir, filename), 'utf-8');
    return content.trim().split('\n').map(line => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    });
}

const AGE_GROUPS = ['<25', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'];

function processInvertedScoringCSV(csvFile: string, exerciseType: string): string[] {
    const rows = readCSV(csvFile);
    const headers = rows[0];
    const ageIndices: Record<string, number> = {};
    AGE_GROUPS.forEach(age => {
        const idx = headers.indexOf(age);
        if (idx !== -1) ageIndices[age] = idx;
    });

    const output: string[] = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < headers.length) continue;
        const gender = row[0];
        const points = parseFloat(row[1]);

        for (const age of AGE_GROUPS) {
            const ageIdx = ageIndices[age];
            if (ageIdx === undefined) continue;
            
            const performance = row[ageIdx];
            if (!performance || performance === 'N/A' || performance === '') continue;

            output.push(`${exerciseType},${gender},${age},${performance},${points.toFixed(1)},`);
        }
    }
    return output;
}

function generateScoringStandards() {
    const scoringRows: string[] = ['exercise_type,gender,age_group,performance,points,health_risk_category'];
    
    scoringRows.push(...processInvertedScoringCSV('pt_scoring_pushups_1min.csv', 'push_ups_1min'));
    scoringRows.push(...processInvertedScoringCSV('pt_scoring_situps_1min.csv', 'sit_ups_1min'));
    scoringRows.push(...processInvertedScoringCSV('pt_scoring_hand_release_pushups_2min.csv', 'hand_release_pushups_2min'));
    scoringRows.push(...processInvertedScoringCSV('pt_scoring_cross_leg_reverse_crunch_2min.csv', 'cross_leg_reverse_crunch_2min'));
    scoringRows.push(...processInvertedScoringCSV('pt_scoring_forearm_plank.csv', 'forearm_plank_time'));
    scoringRows.push(...processInvertedScoringCSV('pt_scoring_run_2mile.csv', 'run_2mile'));
    scoringRows.push(...processInvertedScoringCSV('pt_scoring_hamr_shuttles.csv', 'shuttles_20m'));

    // WHtR
    const whtrRows = readCSV('pt_scoring_whtr.csv');
    for (let i = 1; i < whtrRows.length; i++) {
        const row = whtrRows[i];
        if (row.length < 3) continue;
        const performance = row[0];
        const risk = row[1];
        const points = parseFloat(row[2]);
        scoringRows.push(`whtr,Both,All,${performance},${points.toFixed(1)},${risk}`);
    }

    fs.writeFileSync(path.join(uploadDir, 'pt_scoring_standards.csv'), scoringRows.join('\n'));
    console.log('Generated uploadcsv/pt_scoring_standards.csv');
}

function generatePassFailStandards() {
    const rows = readCSV('pt_minimum_standards.csv');
    const exerciseMap: Record<string, number> = {
        'push_ups_1min': 2,
        'hand_release_pushups_2min': 3,
        'sit_ups_1min': 4,
        'cross_leg_reverse_crunch_2min': 5,
        'forearm_plank_time': 6,
        'run_2mile': 7,
        'shuttles_20m': 8
    };

    const passFailRows: string[] = ['exercise_type,gender,age_group,min_performance'];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 9) continue;
        const gender = row[0];
        const age = row[1];
        
        for (const [exerciseType, colIdx] of Object.entries(exerciseMap)) {
            const minPerf = row[colIdx];
            passFailRows.push(`${exerciseType},${gender},${age},${minPerf}`);
        }
    }

    // Add Walk Sea Level Standards
    const walkRows = readCSV('pt_standards_walk.csv');
    const walkHeaders = walkRows[0];
    for (let i = 1; i < walkRows.length; i++) {
        const row = walkRows[i];
        const gender = row[0];
        for (let j = 1; j < walkHeaders.length; j++) {
            const ageGroup = walkHeaders[j];
            const minPerf = row[j];
            passFailRows.push(`walk_2km,${gender},${ageGroup},${minPerf}`);
        }
    }

    fs.writeFileSync(path.join(uploadDir, 'pt_pass_fail_standards.csv'), passFailRows.join('\n'));
    console.log('Generated uploadcsv/pt_pass_fail_standards.csv');
}

function generateAltitudeCorrections() {
    const correctionsRows: string[] = ['exercise_type,altitude_group,altitude_range,perf_start,perf_end,correction'];
    
    // Run
    const runRows = readCSV('pt_altitude_run.csv');
    for (let i = 1; i < runRows.length; i++) {
        const row = runRows[i];
        if (row.length < 5) continue;
        correctionsRows.push(`run_2mile,${row[0]},${row[1]},${row[2]},${row[3]},${row[4]}`);
    }

    // HAMR
    const hamrRows = readCSV('pt_altitude_hamr.csv');
    for (let i = 1; i < hamrRows.length; i++) {
        const row = hamrRows[i];
        if (row.length < 3) continue;
        correctionsRows.push(`shuttles_20m,${row[0]},${row[1]},,,${row[2]}`);
    }

    fs.writeFileSync(path.join(uploadDir, 'pt_altitude_corrections.csv'), correctionsRows.join('\n'));
    console.log('Generated uploadcsv/pt_altitude_corrections.csv');
}

function generateAltitudeWalkThresholds() {
    const walkRows: string[] = ['sex,altitude_group,altitude_range,age_range,max_time'];
    const rows = readCSV('pt_altitude_walk.csv');
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 6) continue;
        const max_time_seconds = parseInt(row[5]);
        const minutes = Math.floor(max_time_seconds / 60);
        const seconds = max_time_seconds % 60;
        const max_time = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        walkRows.push(`${row[0]},${row[1]},${row[2]},${row[3]}-${row[4]},${max_time}`);
    }

    fs.writeFileSync(path.join(uploadDir, 'pt_altitude_walk_thresholds.csv'), walkRows.join('\n'));
    console.log('Generated uploadcsv/pt_altitude_walk_thresholds.csv');
}

generateScoringStandards();
generatePassFailStandards();
generateAltitudeCorrections();
generateAltitudeWalkThresholds();
