# MilCalc: Review, Gaps & Roadmap

This document tracks known architectural gaps, code quality violations, and organizational inconsistencies that require resolution. It serves as the primary audit record for engineering reviews.

---

## 1. Data Privacy & PII Handling

MilCalc is designed with a "Zero-Trust" approach to user data.

-   **Client-Side Processing**: All sensitive calculations (Pay, Retirement, PT Scores) are performed entirely on the user's device. No user-inputted values are transmitted to Supabase or any external server.
-   **No PII Collection**: The application does not collect Names, SSNs, or Unit information. Users are 100% anonymous.
-   **Local Persistence**: User settings and profile data are stored exclusively in `expo-sqlite`. No AsyncStorage is used.

---

## 2. Security Checklist

- [x] Environment variables (Supabase Keys) are injected at build time and not committed to git.
- [x] All Supabase RLS policies are "Read-Only" for public data.
- [x] Codebase is free of hardcoded credentials.
- [x] `app.config.ts` uses `process.env` for all sensitive configuration.
- [ ] (Planned) Integrate `pnpm audit` + `snyk` into CI/CD for dependency vulnerability scanning.

---

## 3. Anti-Abuse & Integrity

-   **Schema Constraints**: The local SQLite database enforces data types at the storage layer.
-   **Pure Logic Validation**: `@repo/utils` engines include range-checking to ensure results remain within DAFMAN/DoD bounds.

---

## 4. Supply Chain & Dependency Safety

-   **Lockfile Integrity**: `pnpm-lock.yaml` is the source of truth. PRs modifying the lockfile must be manually audited.
-   **Minimal Permissions**: `app.json` is configured with the absolute minimum required native permissions.

---

## 5. Identified Gaps & Implementation Debt

> This section is the primary action register. Each row represents concrete technical debt awaiting resolution. Validated against the live codebase.

| # | Area | Gap / Violation | Evidence | Severity | Status |
|---|------|-----------------|----------|----------|--------|
| 1 | **Logic DRY** | `calculateFederalTax` and `calculateStateTax` are duplicated verbatim in both `pay-calculator.ts` and `retirement-calculator.ts`. Should be extracted to `packages/utils/src/tax-utils.ts`. | `grep calculateFederalTax` → 4 hits across 2 files | 🟡 Medium | ⏳ Pending |
| 2 | **Type Safety** | `ProfileContext.tsx` line 79: `JSON.parse(result.value)` returns `any` spread directly into a typed `ProfileData` setter — the source of the `@typescript-eslint/no-unsafe-argument` lint warning. Requires a typed guard or `zod` parse at the DB read boundary. | Lint output: `79:22 warning Unsafe argument of type any` | 🟡 Medium | ⏳ Pending |
| 3 | **`LabelWithHelp` Duplication** | Two near-identical label+help-icon components exist in parallel: `LabelWithHelp` in `RetirementCalculator/RetirementUiComponents.tsx` and `NewLabelWithHelp` in `PayCalculator/PayUiComponents.tsx`. Both serve the same purpose. Should be unified into a single `LabelWithHelp` exported from `@repo/ui`. | `grep LabelWithHelp` → 18 hits across 4 files; `grep NewLabelWithHelp` → 15 hits across 3 files | 🟡 Medium | ⏳ Pending |
| 4 | **PT UI Fallback** | No graceful fallback exists when a Cardio Risk Category is absent from the DB response. `ScoreDisplay` will render a blank or potentially crash-prone state for missing entries. | No conditional render guard found in `ScoreDisplay.tsx` | 🟡 Medium | ⏳ Pending |
| 5 | **`best-score.tsx` Size** | `best-score.tsx` is 524 lines and contains a full inline `BestScoreSection` component. This should be extracted to `components/PtCalculator/BestScoreSection.tsx` to match the modular pattern established for all other calculators. | File length: 524 lines; `BestScoreSection` defined at line 70 | 🟡 Medium | ⏳ Pending |
| 6 | **`_layout.tsx` Decomposition** | Root `_layout.tsx` is ~420 lines and handles bottom sheet, overlay routing, keyboard listeners, and SQLite hydration bootstrap concurrently. The DB hydration and sync init logic should be extracted to a `hooks/useAppBootstrap.ts`. | File length: ~420 lines | 🟡 Medium | ⏳ Pending |
| 7 | **`PayDemographics` StyleSheet** | `PayDemographics.tsx` calls `StyleSheet.create(...)` bare inside the component function body (line 81), not wrapped in `useMemo`. This creates a new StyleSheet object on every render, violating the Zero-Tolerance Performance Policy. | `view_file PayDemographics.tsx:81` → bare `StyleSheet.create({` | 🟡 Medium | ⏳ Pending |
| 8 | **`no-unused-styles` Noise** | `react-native/no-unused-styles: warn` is globally enabled but generates false positives against the `useMemo` Style Factory pattern (styles returned from `useMemo` are not statically analyzable by the rule). Suppression strategy is not yet standardized. | Lint output: 280 warnings, majority from `no-unused-styles` | 🟢 Low | ⏳ Pending |
| 9 | **`GenderSelector` Scope** | `GenderSelector.tsx` lives in the shared `components/` root but has exactly one consumer: `PtCalculator/Demographics.tsx`. If it remains PT-only, it should move to `PtCalculator/`. If shared, it belongs in `@repo/ui`. | `grep GenderSelector` → only imported by `PtCalculator/Demographics.tsx` | 🟢 Low | ⏳ Pending |
| 10 | **CI/CD Pipeline** | No CI pipeline (GitHub Actions, EAS) is configured. No automated lint, type-check, or test gates run on commits or PRs. No `.github/` directory exists in the repo root. | `list_dir .github` → directory does not exist | 🔴 High | ⏳ Pending |

