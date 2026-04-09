import * as fs from 'fs';
import * as path from 'path';

const csvDir = path.join(__dirname, '../../../docs/sources/csvs');
const seedDir = path.join(__dirname, '../../../supabase/seeds');

function readCSV(filename: string): string[][] {
    const content = fs.readFileSync(path.join(csvDir, filename), 'utf-8');
    return content.trim().split('\n').map(line => line.split(',').map(s => s.trim().replace(/^"(.*)"$/, '$1')));
}

function readSQL(filename: string): string {
    return fs.readFileSync(path.join(seedDir, filename), 'utf-8');
}

/**
 * Validates that the SQL seed for a specific exercise matches the CSV data.
 */
function validateScoringSeed(csvFile: string, sqlFile: string, exerciseType: string, isInverted: boolean = false) {
    const csvRows = readCSV(csvFile);
    const sqlContent = readSQL(sqlFile);
    
    const headers = csvRows[0];
    const ageGroups = ['<25', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'];
    const ageIndices: Record<string, number> = {};
    ageGroups.forEach(age => {
        const idx = headers.indexOf(age);
        if (idx !== -1) ageIndices[age] = idx;
    });

    console.log(`Checking ${exerciseType}...`);
    let errors = 0;

    for (let i = 1; i < csvRows.length; i++) {
        const row = csvRows[i];
        if (row.length < headers.length) continue;
        const gender = row[0];
        
        let pointsValue = 0;
        let perfBase = "";

        if (!isInverted) {
            // Standard: gender, reps, age_groups...
            perfBase = row[1];
        } else {
            // Inverted: gender, points, age_groups...
            pointsValue = parseFloat(row[1]);
        }

        for (const age of ageGroups) {
            const ageIdx = ageIndices[age];
            if (ageIdx === undefined) continue;
            
            let expectedPoints: number;
            let performance: string;

            if (!isInverted) {
                expectedPoints = parseFloat(row[ageIdx]);
                performance = perfBase;
            } else {
                expectedPoints = pointsValue!;
                performance = row[ageIdx];
            }

            if (isNaN(expectedPoints) || !performance || performance === 'N/A') continue;

            // Escape special regex characters in performance and age
            const escapedPerf = performance.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const escapedAge = age.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Search for the entry in SQL: ('Gender', 'Age', 'Perf', Points)
            const pointsStr = expectedPoints.toFixed(1);
            const pointsIntStr = Math.round(expectedPoints).toString();
            
            // Match either 15.0 or 15
            const pointsPattern = `(${pointsStr.replace('.', '\\.')}|${pointsIntStr})`;
            const sqlPattern = new RegExp(`'${exerciseType}',\\s*'${gender}',\\s*'${escapedAge}',\\s*'${escapedPerf}',\\s*${pointsPattern}`, 'i');
            
            if (!sqlPattern.test(sqlContent)) {
                console.error(`  [MISSING] ${gender} ${age} perf=${performance} points=${expectedPoints}`);
                errors++;
            }
        }
    }
    
    if (errors === 0) {
        console.log(`  [OK] ${exerciseType} matches CSV.`);
    } else {
        console.log(`  [FAIL] ${exerciseType} has ${errors} discrepancies.`);
    }
    return errors;
}

function validateWhtr() {
    console.log(`Checking whtr...`);
    const csvRows = readCSV('pt_scoring_whtr.csv');
    const sqlContent = fs.readFileSync(path.join(seedDir, 'pt_whtr.sql'), 'utf-8');
    let errors = 0;

    for (let i = 1; i < csvRows.length; i++) {
        const row = csvRows[i];
        if (row.length < 3) continue;
        const performance = row[0];
        const points = parseFloat(row[2]);

        const escapedPerf = performance.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const sqlPattern = new RegExp(`'whtr',\\s*'${escapedPerf}',\\s*${points.toFixed(1)}`, 'i');
        if (!sqlPattern.test(sqlContent)) {
            console.error(`  [MISSING] whtr perf=${performance} points=${points}`);
            errors++;
        }
    }
    if (errors === 0) {
        console.log(`  [OK] whtr matches CSV.`);
    } else {
        console.log(`  [FAIL] whtr has ${errors} discrepancies.`);
    }
    return errors;
}

function validateAll() {
    let totalErrors = 0;
    
    totalErrors += validateScoringSeed('pt_scoring_pushups_1min.csv', 'pt_standards.sql', 'push_ups_1min', true);
    totalErrors += validateScoringSeed('pt_scoring_situps_1min.csv', 'pt_standards.sql', 'sit_ups_1min', true);
    totalErrors += validateScoringSeed('pt_scoring_hand_release_pushups_2min.csv', 'pt_standards.sql', 'hand_release_pushups_2min', true);
    totalErrors += validateScoringSeed('pt_scoring_cross_leg_reverse_crunch_2min.csv', 'pt_standards.sql', 'cross_leg_reverse_crunch_2min', true);
    totalErrors += validateScoringSeed('pt_scoring_forearm_plank.csv', 'pt_standards.sql', 'forearm_plank_time', true);
    
    totalErrors += validateScoringSeed('pt_scoring_run_2mile.csv', 'pt_standards.sql', 'run_2mile', true);
    totalErrors += validateScoringSeed('pt_scoring_hamr_shuttles.csv', 'pt_standards.sql', 'shuttles_20m', true);
    
    totalErrors += validateWhtr();

    if (totalErrors > 0) {
        console.log(`\nTotal Discrepancies Found: ${totalErrors}`);
        process.exit(1);
    } else {
        console.log(`\nAll standards validated successfully.`);
    }
}

validateAll();
