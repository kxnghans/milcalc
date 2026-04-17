import { getScoreForExercise, std } from "./setup";

// ---------------------------------------------------------------------------
// 1. Perfect Scores — Max reps/time per exercise yields max component points
// ---------------------------------------------------------------------------
describe("Perfect component scores", () => {
  it("Male <25: HRPUs 52 reps = 15 pts", () => {
    const r = getScoreForExercise(
      std("Male", "<25"),
      "hand_release_pushups_2min",
      { reps: 52 },
    );
    expect(r.points).toBe(15);
  });
  it("Male <25: pushups 1min 67 reps = 15 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "push_ups_1min", {
      reps: 67,
    });
    expect(r.points).toBe(15);
  });
  it("Male <25: situps 1min 58 reps = 15 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "sit_ups_1min", {
      reps: 58,
    });
    expect(r.points).toBe(15);
  });
  it("Male <25: CLRC 60 reps = 15 pts", () => {
    const r = getScoreForExercise(
      std("Male", "<25"),
      "cross_leg_reverse_crunch_2min",
      { reps: 60 },
    );
    expect(r.points).toBe(15);
  });
  it("Male <25: forearm plank 3:40 = 15 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "forearm_plank_time", {
      minutes: 3,
      seconds: 40,
    });
    expect(r.points).toBe(15);
  });
  it("Male <25: run 2mi <= 13:25 = 50 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "run_2mile", {
      minutes: 13,
      seconds: 25,
    });
    expect(r.points).toBe(50);
  });
  it("Male <25: run 2mi 9:00 (below max) = 50 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "run_2mile", {
      minutes: 9,
      seconds: 0,
    });
    expect(r.points).toBe(50);
  });
  it("Male <25: HAMR >= 100 shuttles = 50 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "shuttles_20m", {
      shuttles: 100,
    });
    expect(r.points).toBe(50);
  });
  it("Male <25: HAMR 105 shuttles = 50 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "shuttles_20m", {
      shuttles: 105,
    });
    expect(r.points).toBe(50);
  });
  it("Female <25: pushups 50 reps = 15 pts", () => {
    const r = getScoreForExercise(std("Female", "<25"), "push_ups_1min", {
      reps: 50,
    });
    expect(r.points).toBe(15);
  });
  it("Female <25: HAMR >= 83 shuttles = 50 pts", () => {
    const r = getScoreForExercise(std("Female", "<25"), "shuttles_20m", {
      shuttles: 83,
    });
    expect(r.points).toBe(50);
  });
  it("Female 55-59: run <= 17:18 = 50 pts", () => {
    const r = getScoreForExercise(std("Female", "55-59"), "run_2mile", {
      minutes: 17,
      seconds: 18,
    });
    expect(r.points).toBe(50);
  });
  it("Male 60+: run <= 15:28 = 50 pts", () => {
    const r = getScoreForExercise(std("Male", "60+"), "run_2mile", {
      minutes: 15,
      seconds: 28,
    });
    expect(r.points).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// 2. Minimum passing thresholds — lowest non-zero score per exercise/group
// ---------------------------------------------------------------------------
describe("Minimum thresholds (lowest non-zero score)", () => {
  // Male minimums from pt_minimum_standards.csv
  it("Male <25: HRPUs min = 27 reps → > 0 pts", () => {
    const r = getScoreForExercise(
      std("Male", "<25"),
      "hand_release_pushups_2min",
      { reps: 27 },
    );
    expect(r.points).toBeGreaterThan(0);
  });
  it("Male <25: HRPUs 26 reps → 0 pts (below minimum)", () => {
    const r = getScoreForExercise(
      std("Male", "<25"),
      "hand_release_pushups_2min",
      { reps: 26 },
    );
    expect(r.points).toBe(0);
  });
  it("Male <25: push_ups_1min min = 30 reps → > 0 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "push_ups_1min", {
      reps: 30,
    });
    expect(r.points).toBeGreaterThan(0);
  });
  it("Male <25: push_ups_1min 29 reps → 0 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "push_ups_1min", {
      reps: 29,
    });
    expect(r.points).toBe(0);
  });
  it("Male 25-29: push_ups_1min min = 28 reps → > 0 pts", () => {
    const r = getScoreForExercise(std("Male", "25-29"), "push_ups_1min", {
      reps: 28,
    });
    expect(r.points).toBeGreaterThan(0);
  });
  it("Male 60+: push_ups_1min 12 reps → > 0 pts", () => {
    const r = getScoreForExercise(std("Male", "60+"), "push_ups_1min", {
      reps: 12,
    });
    expect(r.points).toBeGreaterThan(0);
  });
  it("Male 60+: push_ups_1min 4 reps → 0 pts (min standard but 0 points)", () => {
    const r = getScoreForExercise(std("Male", "60+"), "push_ups_1min", {
      reps: 4,
    });
    expect(r.points).toBe(0);
  });

  // Run minimums from pt_minimum_standards.csv
  it("Male <25: run min = 19:45 → > 0 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "run_2mile", {
      minutes: 19,
      seconds: 45,
    });
    expect(r.points).toBeGreaterThan(0);
  });
  it("Male <25: run 19:46 → 0 pts (beyond minimum)", () => {
    const r = getScoreForExercise(std("Male", "<25"), "run_2mile", {
      minutes: 19,
      seconds: 46,
    });
    expect(r.points).toBe(0);
  });
  it("Male 30-34: run min = 20:44 → > 0 pts", () => {
    const r = getScoreForExercise(std("Male", "30-34"), "run_2mile", {
      minutes: 20,
      seconds: 44,
    });
    expect(r.points).toBeGreaterThan(0);
  });
  it("Male 60+: run min = 24:00 → > 0 pts", () => {
    const r = getScoreForExercise(std("Male", "60+"), "run_2mile", {
      minutes: 24,
      seconds: 0,
    });
    expect(r.points).toBeGreaterThan(0);
  });
  it("Female <25: run min = 25:23 → > 0 pts", () => {
    const r = getScoreForExercise(std("Female", "<25"), "run_2mile", {
      minutes: 25,
      seconds: 23,
    });
    expect(r.points).toBeGreaterThan(0);
  });
  it("Female <25: run 25:24 → 0 pts", () => {
    const r = getScoreForExercise(std("Female", "<25"), "run_2mile", {
      minutes: 25,
      seconds: 24,
    });
    expect(r.points).toBe(0);
  });

  // Sit-up minimums
  it("Male <25: situps min = 33 reps → > 0 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "sit_ups_1min", {
      reps: 33,
    });
    expect(r.points).toBeGreaterThan(0);
  });
  it("Male <25: situps 32 reps → 0 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "sit_ups_1min", {
      reps: 32,
    });
    expect(r.points).toBe(0);
  });
  it("Male 60+: situps min = 17 reps → > 0 pts", () => {
    const r = getScoreForExercise(std("Male", "60+"), "sit_ups_1min", {
      reps: 17,
    });
    expect(r.points).toBeGreaterThan(0);
  });

  // HAMR minimums
  it("Male <25: HAMR min = 42 shuttles → > 0 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "shuttles_20m", {
      shuttles: 42,
    });
    expect(r.points).toBeGreaterThan(0);
  });
  it("Male <25: HAMR 41 shuttles → 0 pts (below min)", () => {
    const r = getScoreForExercise(std("Male", "<25"), "shuttles_20m", {
      shuttles: 41,
    });
    expect(r.points).toBe(0);
  });
  it("Female 60+: HAMR min = 11 shuttles → > 0 pts", () => {
    const r = getScoreForExercise(std("Female", "60+"), "shuttles_20m", {
      shuttles: 11,
    });
    expect(r.points).toBeGreaterThan(0);
  });

  // Plank minimums
  it("Male <25: forearm plank min = 1:35 → > 0 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "forearm_plank_time", {
      minutes: 1,
      seconds: 35,
    });
    expect(r.points).toBeGreaterThan(0);
  });
  it("Male <25: forearm plank 1:30 → 0 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "forearm_plank_time", {
      minutes: 1,
      seconds: 30,
    });
    expect(r.points).toBe(0);
  });
  it("Male 60+: forearm plank min = 0:55 → > 0 pts", () => {
    const r = getScoreForExercise(std("Male", "60+"), "forearm_plank_time", {
      minutes: 0,
      seconds: 55,
    });
    expect(r.points).toBeGreaterThan(0);
  });
  it("Female <25: forearm plank min = 1:30 → > 0 pts", () => {
    const r = getScoreForExercise(std("Female", "<25"), "forearm_plank_time", {
      minutes: 1,
      seconds: 30,
    });
    expect(r.points).toBeGreaterThan(0);
  });
});
