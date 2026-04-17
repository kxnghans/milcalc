import { calculatePtScore, getScoreForExercise } from "../../src/pt-calculator";
import { Tables } from "../../src/types";
import { parseCSVData } from "../helpers/csv-parser";

export const {
  standards: allStandards,
  passFailStandards,
  altitudeCorrections,
  walkAltThresholds,
} = parseCSVData();

// Typed casts used throughout
export type PfStandards = Tables<"pt_pass_fail_standards">[];
export type AltCorrections = Tables<"pt_altitude_corrections">[];
export type WalkThresholds = Tables<"pt_altitude_walk_thresholds">[];

export function std(gender: string, age: string) {
  return allStandards[gender][age];
}

export function score(
  gender: string,
  ageGroup: string,
  overrides: Record<string, unknown>,
) {
  const defaults = {
    age: ageGroup === "<25" ? 22 : ageGroup === "60+" ? 62 : parseInt(ageGroup),
    gender,
    pushupComponent: "push_ups_1min",
    pushups: 35,
    coreComponent: "sit_ups_1min",
    situps: 35,
    cardioComponent: "run",
    runMinutes: 14,
    runSeconds: 0,
    whtr: 0.49,
  };
  return calculatePtScore(
    { ...defaults, ...overrides } as Parameters<typeof calculatePtScore>[0],
    std(gender, ageGroup),
    passFailStandards as PfStandards,
    altitudeCorrections as AltCorrections,
    walkAltThresholds as WalkThresholds,
  );
}

export { calculatePtScore, getScoreForExercise };
