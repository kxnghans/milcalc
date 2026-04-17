import { Tables } from "./supabase";

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

export interface PtStandard {
  exercise: string | null;
  measurement: string | number | null;
  performanceRange?: [number, number]; // [min, max] pre-parsed numeric values
  points: number;
  healthRiskCategory?: string | null;
}

export interface PtPerformance {
  minutes?: number;
  seconds?: number;
  shuttles?: number;
  reps?: number;
}

export interface PtInputs {
  age: number;
  gender: string;
  pushups?: number;
  situps?: number;
  reverseCrunches?: number;
  plankMinutes?: number;
  plankSeconds?: number;
  runMinutes?: number;
  runSeconds?: number;
  shuttles?: number;
  walkMinutes?: number;
  walkSeconds?: number;
  whtr?: number;
  isStrengthExempt?: boolean;
  isCoreExempt?: boolean;
  isCardioExempt?: boolean;
  isWhtrExempt?: boolean;
  pushupComponent: string;
  coreComponent: string;
  cardioComponent: string;
  altitudeGroup?: string;
}

export type DependentStatus =
  | "Veteran alone"
  | "With spouse only"
  | "With spouse and 1 parent"
  | "With spouse and 2 parents"
  | "With 1 parent only"
  | "none";
export type DisabilityPercentage =
  | "0%"
  | "10%"
  | "20%"
  | "30%"
  | "40%"
  | "50%"
  | "60%"
  | "70%"
  | "80%"
  | "90%"
  | "100%";

export type AltitudeAdjustments = {
  run: Tables<"run_altitude_adjustments">[];
  hamr: Tables<"hamr_altitude_adjustments">[];
  walk: Tables<"walk_altitude_adjustments">[];
};
