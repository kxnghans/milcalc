import * as fs from 'fs';
import * as path from 'path';

const csvDir = path.join(__dirname, '../../../docs/sources/csvs');
const seedDir = path.join(__dirname, '../../../supabase/seeds');

function readCSV(filename: string): string[][] {
    const content = fs.readFileSync(path.join(csvDir, filename), 'utf-8');
    return content.trim().split('\n').map(line => line.split(',').map(s => s.trim().replace(/^"(.*)"$/, '$1')));
}

const AGE_GROUPS = ['<25', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'];

function generateScoringSeed(csvFile: string, sqlFile: string, exerciseType: string) {
    const rows = readCSV(csvFile);
    const headers = rows[0];
    const ageIndices: Record<string, number> = {};
    AGE_GROUPS.forEach(age => {
        const idx = headers.indexOf(age);
        if (idx !== -1) ageIndices[age] = idx;
    });

    let sql = `DELETE FROM public.pt_scoring_standards WHERE exercise_type = '${exerciseType}';\n`;
    sql += `WITH group_ids AS (SELECT id, sex, age_range FROM public.pt_age_sex_groups)\n`;
    sql += `INSERT INTO public.pt_scoring_standards (age_sex_group_id, exercise_type, performance, points)\n`;
    sql += `SELECT g.id, '${exerciseType}', t.performance, t.points\n`;
    sql += `FROM (VALUES \n`;

    const values: string[] = [];

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < headers.length) continue;
        const gender = row[0];
        const performance = row[1]; // Keep as-is (e.g. 19:45*)

        for (const age of AGE_GROUPS) {
            const ageIdx = ageIndices[age];
            if (ageIdx === undefined) continue;
            
            const points = parseFloat(row[ageIdx]);
            if (isNaN(points)) continue;

            values.push(`  ('${gender}', '${age}', '${performance}', ${points.toFixed(1)})`);
        }
    }

    sql += values.join(',\n');
    sql += `\n) AS t(sex, age_range, performance, points)\n`;
    sql += `JOIN group_ids g ON g.sex = t.sex AND g.age_range = t.age_range;`;

    fs.writeFileSync(path.join(seedDir, 'pt_standards', sqlFile), sql);
    console.log(`Generated pt_standards/${sqlFile}`);
}

function generateInvertedScoringSeed(csvFile: string, sqlFile: string, exerciseType: string) {
    const rows = readCSV(csvFile);
    const headers = rows[0];
    const ageIndices: Record<string, number> = {};
    AGE_GROUPS.forEach(age => {
        const idx = headers.indexOf(age);
        if (idx !== -1) ageIndices[age] = idx;
    });

    let sql = `DELETE FROM public.pt_scoring_standards WHERE exercise_type = '${exerciseType}';\n`;
    sql += `WITH group_ids AS (SELECT id, sex, age_range FROM public.pt_age_sex_groups)\n`;
    sql += `INSERT INTO public.pt_scoring_standards (age_sex_group_id, exercise_type, performance, points)\n`;
    sql += `SELECT g.id, '${exerciseType}', t.performance, t.points\n`;
    sql += `FROM (VALUES \n`;

    const values: string[] = [];

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

            values.push(`  ('${gender}', '${age}', '${performance}', ${points.toFixed(1)})`);
        }
    }

    sql += values.join(',\n');
    sql += `\n) AS t(sex, age_range, performance, points)\n`;
    sql += `JOIN group_ids g ON g.sex = t.sex AND g.age_range = t.age_range;`;

    fs.writeFileSync(path.join(seedDir, 'pt_standards', sqlFile), sql);
    console.log(`Generated pt_standards/${sqlFile}`);
}

function generateWhtrSeed() {
    const rows = readCSV('pt_scoring_whtr.csv');
    let sql = `DELETE FROM public.pt_scoring_standards WHERE exercise_type = 'whtr';\n`;
    sql += `INSERT INTO public.pt_scoring_standards (exercise_type, performance, points, health_risk_category)\n`;
    sql += `VALUES \n`;

    const values: string[] = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 3) continue;
        const performance = row[0];
        const risk = row[1];
        const points = parseFloat(row[2]);
        values.push(`  ('whtr', '${performance}', ${points.toFixed(1)}, '${risk}')`);
    }

    sql += values.join(',\n');
    sql += `;`;

    fs.writeFileSync(path.join(seedDir, 'pt_whtr.sql'), sql);
    console.log(`Generated pt_whtr.sql`);
}

function generateAll() {
    generateScoringSeed('pt_scoring_pushups_1min.csv', 'push_ups_1min.sql', 'push_ups_1min');
    generateScoringSeed('pt_scoring_situps_1min.csv', 'sit_ups_1min.sql', 'sit_ups_1min');
    generateScoringSeed('pt_scoring_hand_release_pushups_2min.csv', 'hand_release_pushups_2min.sql', 'hand_release_pushups_2min');
    generateScoringSeed('pt_scoring_cross_leg_reverse_crunch_2min.csv', 'cross_leg_reverse_crunch_2min.sql', 'cross_leg_reverse_crunch_2min');
    generateScoringSeed('pt_scoring_forearm_plank.csv', 'forearm_plank_time.sql', 'forearm_plank_time');
    
    generateInvertedScoringSeed('pt_scoring_run_2mile.csv', 'run_2mile.sql', 'run_2mile');
    generateInvertedScoringSeed('pt_scoring_hamr_shuttles.csv', 'shuttles_20m.sql', 'shuttles_20m');
    
    generateWhtrSeed();
}

generateAll();
