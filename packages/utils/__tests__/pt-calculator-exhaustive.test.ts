/**
 * @file pt-calculator-exhaustive.test.ts
 * @description Exhaustive unit tests for the PT calculator logic,
 * verifying every performance row in the source CSVs.
 */

import { calculatePtScore, getScoreForExercise } from "../src/pt-calculator";
import { PtPerformance } from "../src/types";
import { parseCSVData } from "./helpers/csv-parser";

const { standards: allStandards, exhaustiveExpectedScores } = parseCSVData();

// Helper to find the internal getWhtrScore logic which is not exported
// We can use calculatePtScore with mocks or just use findScore logic if we wanted.
// But wait, pt-calculator.ts has getScoreForExercise but getWhtrScore is private.
// Actually, getScoreForExercise is exported, let's see if it handles 'whtr'.
// It doesn't seem to explicitly handle 'whtr' in the if/else but the 'else' uses 'reps'.

describe("PT Calculator - Exhaustive CSV Validation", () => {
  // Group tests by exercise to keep output manageable
  const exercises = Array.from(
    new Set(exhaustiveExpectedScores.map((s) => s.exercise)),
  );

  exercises.forEach((exercise) => {
    describe(`Exercise: ${exercise}`, () => {
      const exerciseScores = exhaustiveExpectedScores.filter(
        (s) => s.exercise === exercise,
      );

      // Further group by gender and age group for better structure
      const genderAges = Array.from(
        new Set(exerciseScores.map((s) => `${s.gender}|${s.ageGroup}`)),
      );

      genderAges.forEach((ga) => {
        const [gender, ageGroup] = ga.split("|");
        const groupScores = exerciseScores.filter(
          (s) => s.gender === gender && s.ageGroup === ageGroup,
        );

        // Group by raw performance string to handle distinct rows like '24-26' vs '24-26*'
        const uniqueTests = groupScores;

        it(`should match all CSV points for ${gender} ${ageGroup}`, () => {
          const standards = allStandards[gender][ageGroup];

          uniqueTests.forEach((expected) => {
            let resultPoints = 0;
            const cleanPerf = expected.performance.replace(/[<>=* ]/g, "");

            if (exercise === "whtr") {
              // Since getWhtrScore is private, we use calculatePtScore with exemptions for others
              const res = calculatePtScore(
                {
                  age: parseInt(ageGroup.replace(/[<+]/g, "") || "20", 10),
                  gender,
                  whtr: parseFloat(cleanPerf),
                  isStrengthExempt: true,
                  isCoreExempt: true,
                  isCardioExempt: true,
                  pushupComponent: "push_ups_1min",
                  coreComponent: "sit_ups_1min",
                  cardioComponent: "run",
                },
                standards,
                [],
                [],
                [],
              );
              resultPoints =
                typeof res.whtrScore === "number" ? res.whtrScore : 0;
            } else {
              let performance: PtPerformance = {};

              if (exercise === "run" || exercise === "run_2mile") {
                const parts = cleanPerf.split(":").map(Number);
                performance = { minutes: parts[0], seconds: parts[1] || 0 };
              } else if (exercise === "forearm_plank_time") {
                const parts = cleanPerf.split(":").map(Number);
                performance = { minutes: parts[0], seconds: parts[1] || 0 };
              } else if (
                exercise === "shuttles" ||
                exercise === "shuttles_20m"
              ) {
                performance = { shuttles: parseInt(cleanPerf, 10) };
              } else {
                // reps
                performance = { reps: parseInt(cleanPerf, 10) };
              }

              const res = getScoreForExercise(
                standards,
                exercise,
                performance,
                undefined,
                undefined,
                expected.performance,
              );
              resultPoints = res.points;
            }

            try {
              expect(resultPoints).toBeCloseTo(expected.points, 1);
            } catch (e) {
              throw new Error(
                `Failed for ${gender} ${ageGroup} ${exercise} perf="${expected.performance}": Expected ${expected.points}, Got ${resultPoints}`,
              );
            }
          });
        });
      });
    });
  });
});
