import {
  AltCorrections,
  altitudeCorrections,
  getScoreForExercise,
  score,
  std,
} from "./setup";

// ---------------------------------------------------------------------------
// 4. HAMR Range Scoring (range strings like "94-99", ">= 100")
// ---------------------------------------------------------------------------
describe("HAMR Range Scoring", () => {
  // Male <25: values from CSV
  it("Male <25: 84 shuttles = 49.5 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "shuttles_20m", {
      shuttles: 84,
    });
    expect(r.points).toBeCloseTo(49.5, 1);
  });
  it("Male <25: 81 shuttles = 49.0 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "shuttles_20m", {
      shuttles: 81,
    });
    expect(r.points).toBeCloseTo(49.0, 1);
  });
  it("Male <25: 67 shuttles = 44.0 pts", () => {
    const r = getScoreForExercise(std("Male", "<25"), "shuttles_20m", {
      shuttles: 67,
    });
    expect(r.points).toBeCloseTo(44.0, 1);
  });
  it("Male 55-59: >= 69 shuttles = 50 pts", () => {
    const r = getScoreForExercise(std("Male", "55-59"), "shuttles_20m", {
      shuttles: 69,
    });
    expect(r.points).toBe(50);
  });
  it("Female <25: >= 68 shuttles = 50 pts", () => {
    const r = getScoreForExercise(std("Female", "<25"), "shuttles_20m", {
      shuttles: 68,
    });
    expect(r.points).toBe(50);
  });

  // Altitude corrections for HAMR (CSV Group 1 = +1 shuttle)
  it("Male <25: 86 shuttles + group1 altitude (+1) = 50 pts (87 required)", () => {
    const r = getScoreForExercise(
      std("Male", "<25"),
      "shuttles_20m",
      { shuttles: 86 },
      "group1",
      altitudeCorrections as AltCorrections,
    );
    expect(r.points).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// 9. Altitude Run Corrections
// ---------------------------------------------------------------------------
describe("Run Altitude Corrections", () => {
  // Group 1 (5350-5499ft): 0:00-13:25 → -2s
  it("Male <25: 13:27 run + group1 (-2s) → scores 50 (13:25 required)", () => {
    const r = getScoreForExercise(
      std("Male", "<25"),
      "run_2mile",
      { minutes: 13, seconds: 27 },
      "group1",
      altitudeCorrections as AltCorrections,
    );
    expect(r.points).toBe(50);
  });
  it("Male <25: 16:35 run + group1 (-3s) → 16:32 → 41.0 pts", () => {
    const r = getScoreForExercise(
      std("Male", "<25"),
      "run_2mile",
      { minutes: 16, seconds: 35 },
      "group1",
      altitudeCorrections as AltCorrections,
    );
    expect(r.points).toBeCloseTo(41.0, 1);
  });
});

// ---------------------------------------------------------------------------
// 10. Walk Test
// ---------------------------------------------------------------------------
describe("Walk Test (2km)", () => {
  it("Female 38: walk 17:20 → pass (under standard 17:28)", () => {
    const r = score("Female", "35-39", {
      pushupComponent: "push_ups_1min",
      pushups: 42,
      coreComponent: "sit_ups_1min",
      situps: 43,
      cardioComponent: "walk",
      walkMinutes: 17,
      walkSeconds: 20,
      whtr: 0.49,
    });
    expect(r.walkPassed).toBe("pass");
    expect(r.isPass).toBe(true);
  });
  it("Female 38: walk 17:30 → fail (over standard 17:28)", () => {
    const r = score("Female", "35-39", {
      pushupComponent: "push_ups_1min",
      pushups: 42,
      coreComponent: "sit_ups_1min",
      situps: 43,
      cardioComponent: "walk",
      walkMinutes: 17,
      walkSeconds: 30,
      whtr: 0.49,
    });
    expect(r.walkPassed).toBe("fail");
    expect(r.isPass).toBe(false);
  });
});
