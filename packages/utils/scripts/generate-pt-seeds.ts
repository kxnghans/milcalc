import * as fs from 'fs';
import * as path from 'path';

const csvDir = path.join(__dirname, '../../../uploadcsv');
const seedDir = path.join(__dirname, '../../../supabase/seeds');

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

function generateScoringSeed() {
    const rows = readCSV('pt_scoring_standards.csv');
    let sql = `DELETE FROM public.pt_scoring_standards;\n`;
    sql += `INSERT INTO public.pt_scoring_standards (exercise_type, gender, age_group, performance, points, health_risk_category)\n`;
    sql += `VALUES \n`;

    const values: string[] = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 5) continue;
        const [exercise, gender, age, performance, points, risk] = row;
        const riskVal = risk ? `'${risk}'` : 'NULL';
        values.push(`  ('${exercise}', '${gender}', '${age}', '${performance}', ${points}, ${riskVal})`);
    }

    sql += values.join(',\n');
    sql += `;`;

    fs.writeFileSync(path.join(seedDir, 'pt_standards.sql'), sql);
    console.log(`Generated pt_standards.sql`);
}

function generatePassFailSeed() {
    const scoringRows = readCSV('pt_scoring_standards.csv');
    const maxPerfMap: Record<string, string> = {};
    const maxPointsMap: Record<string, number> = {};

    for (let i = 1; i < scoringRows.length; i++) {
        const row = scoringRows[i];
        if (row.length < 5) continue;
        const [exercise, gender, age, performance, pointsStr] = row;
        const key = `${exercise}-${gender}-${age}`;
        const points = parseFloat(pointsStr);
        if (!(key in maxPointsMap) || points > maxPointsMap[key]) {
            maxPointsMap[key] = points;
            maxPerfMap[key] = performance;
        }
    }

    const rows = readCSV('pt_pass_fail_standards.csv');
    let sql = `DELETE FROM public.pt_pass_fail_standards;\n`;
    sql += `INSERT INTO public.pt_pass_fail_standards (exercise_type, gender, age_group, min_performance, max_performance)\n`;
    sql += `VALUES \n`;

    const values: string[] = [];
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 4) continue;
        const [exercise, gender, age, minPerf] = row;
        const key = `${exercise}-${gender}-${age}`;
        const maxPerf = maxPerfMap[key];
        const maxPerfSql = maxPerf !== undefined ? `'${maxPerf}'` : 'NULL';
        values.push(`  ('${exercise}', '${gender}', '${age}', '${minPerf}', ${maxPerfSql})`);
    }

    sql += values.join(',\n');
    sql += `;`;

    fs.writeFileSync(path.join(seedDir, 'pt_pass_fail.sql'), sql);
    console.log(`Generated pt_pass_fail.sql`);
}

function generateAltitudeSeed() {
    const corrRows = readCSV('pt_altitude_corrections.csv');
    let sql = `DELETE FROM public.pt_altitude_corrections;\n`;
    sql += `INSERT INTO public.pt_altitude_corrections (exercise_type, altitude_group, altitude_range, perf_start, perf_end, correction)\n`;
    sql += `VALUES \n`;

    const corrValues: string[] = [];
    for (let i = 1; i < corrRows.length; i++) {
        const row = corrRows[i];
        if (row.length < 6) continue;
        const [exercise, group, range, start, end, corr] = row;
        const startVal = start ? `'${start}'` : 'NULL';
        const endVal = end ? `'${end}'` : 'NULL';
        corrValues.push(`  ('${exercise}', '${group}', '${range}', ${startVal}, ${endVal}, ${corr})`);
    }
    sql += corrValues.join(',\n');
    sql += `;\n\n`;

    const walkRows = readCSV('pt_altitude_walk_thresholds.csv');
    sql += `DELETE FROM public.pt_altitude_walk_thresholds;\n`;
    sql += `INSERT INTO public.pt_altitude_walk_thresholds (sex, altitude_group, altitude_range, age_range, max_time)\n`;
    sql += `VALUES \n`;

    const walkValues: string[] = [];
    for (let i = 1; i < walkRows.length; i++) {
        const row = walkRows[i];
        if (row.length < 5) continue;
        const [sex, group, range, age, maxTime] = row;
        walkValues.push(`  ('${sex}', '${group}', '${range}', '${age}', '${maxTime}')`);
    }
    sql += walkValues.join(',\n');
    sql += `;`;

    fs.writeFileSync(path.join(seedDir, 'pt_altitude.sql'), sql);
    console.log(`Generated pt_altitude.sql`);
}

function generateAll() {
    generateScoringSeed();
    generatePassFailSeed();
    generateAltitudeSeed();
}

generateAll();
