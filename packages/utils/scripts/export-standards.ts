
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key missing from .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TABLES_TO_EXPORT = [
  'pt_age_sex_groups',
  'pt_scoring_standards',
  'pt_pass_fail_standards',
  'pt_altitude_corrections',
  'pt_altitude_walk_thresholds',
  'base_pay_2024',
  'bah_rates_2026',
  'bas_rates',
  'federal_tax_data',
  'state_tax_data',
  'veterans_disability_compensation',
  'reserve_drill_pay',
  'pt_help_details',
  'pay_help_details',
  'retirement_help_details',
  'best_score_help_details'
];

async function exportData() {
  const seedData: Record<string, unknown[]> = {};

  for (const table of TABLES_TO_EXPORT) {
    console.log(`Fetching ${table}...`);
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.error(`Error fetching ${table}:`, error);
      continue;
    }
    seedData[table] = data;
  }

  const outputPath = path.join(__dirname, '../../../apps/mobile/assets/seed-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2));
  console.log(`Successfully exported data to ${outputPath}`);
}

exportData();
