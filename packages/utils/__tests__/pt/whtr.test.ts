import { calculatePtScore, std } from "./setup";

// ---------------------------------------------------------------------------
// 7. WHtR Scoring
// ---------------------------------------------------------------------------
describe("WHtR Scoring", () => {
  const defaultComponents = {
    pushupComponent: "push_ups_1min",
    coreComponent: "sit_ups_1min",
    cardioComponent: "run",
  };
  const s = std("Male", "<25");

  it("WHtR <= 0.49 = 20 pts", () => {
    const r = calculatePtScore(
      {
        age: 22,
        gender: "Male",
        whtr: 0.49,
        ...defaultComponents,
      } as Parameters<typeof calculatePtScore>[0],
      s,
      [],
      [],
      [],
    );
    expect(r.whtrScore).toBe(20);
  });
  it("WHtR 0.48 = 20 pts", () => {
    const r = calculatePtScore(
      {
        age: 22,
        gender: "Male",
        whtr: 0.48,
        ...defaultComponents,
      } as Parameters<typeof calculatePtScore>[0],
      s,
      [],
      [],
      [],
    );
    expect(r.whtrScore).toBe(20);
  });
  it("WHtR 0.50 = 19 pts", () => {
    const r = calculatePtScore(
      {
        age: 22,
        gender: "Male",
        whtr: 0.5,
        ...defaultComponents,
      } as Parameters<typeof calculatePtScore>[0],
      s,
      [],
      [],
      [],
    );
    expect(r.whtrScore).toBe(19);
  });
  it("WHtR 0.51 = 18 pts", () => {
    const r = calculatePtScore(
      {
        age: 22,
        gender: "Male",
        whtr: 0.51,
        ...defaultComponents,
      } as Parameters<typeof calculatePtScore>[0],
      s,
      [],
      [],
      [],
    );
    expect(r.whtrScore).toBe(18);
  });
  it("WHtR 0.55 = 12.5 pts", () => {
    const r = calculatePtScore(
      {
        age: 22,
        gender: "Male",
        whtr: 0.55,
        ...defaultComponents,
      } as Parameters<typeof calculatePtScore>[0],
      s,
      [],
      [],
      [],
    );
    expect(r.whtrScore).toBe(12.5);
  });
  it("WHtR 0.59 = 2.5 pts", () => {
    const r = calculatePtScore(
      {
        age: 22,
        gender: "Male",
        whtr: 0.59,
        ...defaultComponents,
      } as Parameters<typeof calculatePtScore>[0],
      s,
      [],
      [],
      [],
    );
    expect(r.whtrScore).toBe(2.5);
  });
  it("WHtR >= 0.60 = 0 pts and fail", () => {
    const r = calculatePtScore(
      {
        age: 22,
        gender: "Male",
        whtr: 0.6,
        ...defaultComponents,
      } as Parameters<typeof calculatePtScore>[0],
      s,
      [],
      [],
      [],
    );
    expect(r.whtrScore).toBe(0);
    expect(r.isPass).toBe(false);
  });
});
