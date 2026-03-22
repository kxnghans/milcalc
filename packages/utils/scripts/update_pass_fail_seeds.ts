import * as fs from 'fs';

const standardsPath = 'supabase/seeds/pt_standards.sql';
const passFailPath = 'supabase/seeds/pt_pass_fail.sql';

const standardsContent = fs.readFileSync(standardsPath, 'utf8');
const passFailContent = fs.readFileSync(passFailPath, 'utf8');

const maxPerfMap: Record<string, string> = {};
const maxPointsMap: Record<string, number> = {};

const stdRegex = /\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*([0-9.]+),\s*(NULL|'[^']+')\s*\)/g;
let match;
while ((match = stdRegex.exec(standardsContent)) !== null) {
  const [, exercise, gender, age, performance, pointsStr] = match;
  const key = `${exercise}-${gender}-${age}`;
  const points = parseFloat(pointsStr);
  if (!(key in maxPointsMap) || points > maxPointsMap[key]) {
    maxPointsMap[key] = points;
    maxPerfMap[key] = performance;
  }
}

const pfRegex = /\(\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)'(\s*,\s*(?:NULL|'[^']+'))?\s*\)/g;

const newPassFailContent = passFailContent.replace(pfRegex, (fullMatch, exercise, gender, age, minPerf) => {
  const key = `${exercise}-${gender}-${age}`;
  const maxPerf = maxPerfMap[key];
  const maxPerfSql = maxPerf !== undefined ? `'${maxPerf}'` : 'NULL';
  return `('${exercise}', '${gender}', '${age}', '${minPerf}', ${maxPerfSql})`;
});

const finalContent = newPassFailContent.replace(
  'INSERT INTO public.pt_pass_fail_standards (exercise_type, gender, age_group, min_performance)',
  'INSERT INTO public.pt_pass_fail_standards (exercise_type, gender, age_group, min_performance, max_performance)'
);

fs.writeFileSync(passFailPath, finalContent);
console.log('Updated pt_pass_fail.sql');
