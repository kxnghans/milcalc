# MilCalc Execution Checklist (Strategic)

## ✅ Completed Milestones (Summary)
- **Monorepo & API Architecture**: Turborepo operational with Supabase RLS security audit complete.
- **Standardized UI System**: Context-driven overlays, Neumorphic primitives, and stabilized `StyleSheet` lifecycle hooks.
- **Unified PT Data Model**: Consolidated 7 fragmented tables into a 4-table modular architecture (2025 Standards).
- **Offline-First Resilience**: Hybrid seeding engine (`seed-data.json` fallback) and SQLite hydration layer implemented.
- **Core Calculation Validation**: PT (2025/2026 Standards), Pay (2025 Base Pay / 2026 BAH), and WHtR scoring engines validated against source PDFs.
- **UI Performance Hardening**: Elimination of infinite update loops and "Maximum update depth" errors via strict context memoization (`useMemo`, `useCallback`) and style stabilization across all components and tab screens.

---

## 🚀 Strategic & Technical Refinements (Scheduled)

### 1. Financial Logic Refinement (High Priority)
- [x] **FICA Calculation Correction**: 
    - *Annotation*: Update `calculatePay` in `packages/utils` to apply the 7.65% FICA rate strictly to **Base Pay**. Currently applying to total taxable income, which is incorrect for military standards.
- [x] **BRS Tiered Matching**:
    - *Annotation*: Implement the statutory tiered matching law (100% match on first 3%, 50% match on next 2%) instead of a naive 1-to-1 model.
- [x] **CA State Tax Sanitization**:
    - *Annotation*: Patch the `1.0` tax rate data bug for California at the API initialization layer to ensure correct bracket logic.
- [x] **Monthly Compound Interest**:
    - *Annotation*: Refactor TSP projections in `retirement-calculator.ts` to use monthly compounding for higher financial fidelity.

### 2. PT Calculator & Scoring (Precision)
- [x] **Alternate PT Score Trap**: 
    - *Annotation*: Implement `&&` logic for alternate exercises (e.g., Push-ups AND HR Push-ups) to ensure a category is only marked `Exempt` if ALL possible exercises within it are exempt.
- [x] **Range-Based Performance Optimization**:
    - *Annotation*: Pre-parse the human-readable standards (e.g., `13:25`) into numeric seconds ONCE during hydration to prevent regex overhead in the real-time scoring loop.
- [ ] **Altitude Walk Correction**:
    - *Annotation*: Audit the walk threshold calculation in `pt-calculator.ts` to ensure it correctly pulls from demographic-specific altitude tables for all 3 groups.

### 3. Statutory Calculation Edge Cases (Accuracy)
- [x] **VA Disability "Offset" (CRDP)**:
    - *Annotation*: Update `retirement-calculator.ts` to implement the dollar-for-dollar offset for disability ratings under 50% (non-CRDP cases).
- [x] **Reserve Inactive Point Cap**:
    - *Annotation*: Implement the statutory 130-point annual ceiling for National Guard and Reserve retirement multipliers (Title 10 U.S.C. § 12733). Currently, all points provided are used in projections.
- [x] **Senior Officer Pay Cap (Level II)**:
    - *Annotation*: Apply the Executive Level II statutory cap to base pay calculations for O-7 to O-10 in `pay-calculator.ts`.
- [x] **WHtR Rounding Precision**:
    - *Annotation*: Force `toFixed(2)` rounding before comparing WHtR results to score charts to prevent "rounding into failure."

### 4. API & Infrastructure Optimization
- [x] **TTL Caching Manager**:
    - *Annotation*: Implement 24-hour TTL logic for metadata syncs to reduce Supabase egress and improve launch speed.
- [x] **RPC Data Bundling**:
    - *Annotation*: Create a single Postgres RPC to fetch all reference data in one handshake, reducing latency and database reads.

### 5. Isolated Demographic Hydration & Profile Prompting (Current Goal)
- [x] **Standardize Hydration Logic (PT)**: 
    - *Annotation*: Refactor `useDemographicsState.ts` to implement the `hasModified` ref pattern for Age and Gender.
- [x] **Implement "Save to Profile" Prompt (PT)**: 
    - *Annotation*: Add logic to `useDemographicsState.ts` to trigger a native `Alert` if a user inputs Age/Gender and it is empty in their profile.
- [x] **Standardize Hydration Logic (Pay)**: 
    - *Annotation*: Refactor `usePayCalculatorState.ts` to accept `initialAge` and `initialGender` and implement the `hasModified` ref pattern.
- [x] **Implement "Save to Profile" Prompt (Pay)**: 
    - *Annotation*: Add logic to `usePayCalculatorState.ts` to trigger a native `Alert` for Age/Gender profile saves.
- [x] **Standardize Hydration Logic (Retirement)**: 
    - *Annotation*: Refactor `useRetirementCalculatorState.ts` to handle Age (string) vs BirthDate (Date) hydration and implement the `hasModified` ref pattern.
- [x] **Implement "Save to Profile" Prompt (Retirement)**: 
    - *Annotation*: Add logic to `useRetirementCalculatorState.ts` to trigger a native `Alert` for Age profile saves.
- [x] **Update Tab Screens**: 
    - *Annotation*: Ensure `pt-calculator.tsx`, `pay-calculator.tsx`, and `retirement-calculator.tsx` correctly pass profile data to their respective hooks.
- [x] **Stability Check**: 
    - *Annotation*: Run `pnpm build` to ensure no regressions.

### 6. WHtR Calculation Fix
- [x] **Fix `get_pt_standards_bundle` RPC**: 
    - *Annotation*: Update the Supabase RPC to include WHtR standards (where gender='Both' and age_group='All').
- [x] **Verify `PtStandard` Mapping**: 
    - *Annotation*: Ensure `getPtStandardsBundle` correctly maps DB fields to `exercise` and parses performance ranges.
- [x] **Update `usePtCalculatorState.ts`**: 
    - *Annotation*: Ensure `calculatedWhtr` is passed to the engine with `isWhtrExempt: false`.
- [x] **UI Verification**: 
    - *Annotation*: Verify WHtR score displays in the Summary and Demographics sections.

### 7. Bug Report Keyboard Handling
- [x] **Investigate Keyboard Handling Patterns**: 
    - *Annotation*: Research `DismissKeyboardView` and `KeyboardAvoidingView` usage in the project.
- [x] **Refactor `BugReportView.tsx`**: 
    - *Annotation*: Wrap the form in a keyboard-aware scroll view to prevent the bottom field from being covered.
- [x] **Stability Check**: 
    - *Annotation*: Run `pnpm build` to ensure no regressions.

### 8. PT Standards CSV Audit (2025/2026 Manual Sync)
- [x] **Phase 1: PDF Source Audit**:
    - *Annotation*: Cross-reference `PFRA Scoring Charts.pdf` and `dafman36-2905.pdf` against existing CSV inventory. 
    - *Findings*: Identified major discrepancies in `pt_standards_walk.csv` (contained run minimums) and floor deltas in strength/core components compared to PFRA (2026) charts.
- [x] **Phase 2: Small Table Updates**:
    - *Annotation*: Update `pt_altitude_hamr.csv`, `pt_scoring_whtr.csv`, and `pt_standards_walk.csv` (Fixed 2.0km distance).
- [x] **Phase 3: Altitude Table Updates**:
    - *Annotation*: Update `pt_altitude_run.csv` and `pt_altitude_walk.csv` (Switched to granular DAFMAN 2026 tables).
- [x] **Phase 4: Minimum Standards (Floor) Audit**:
    - *Annotation*: Update `pt_minimum_standards.csv` to match new pass/fail thresholds.
- [x] **Phase 5: Full Scoring Table Audit (High Effort)**:
    - *Annotation*: Manually update all scoring CSVs using simplified point-inverted format for better maintainability.
- [x] **Phase 6: Schema & Engine Validation**:
    - *Annotation*: Successfully ran `validate-standards.ts` and `pt-calculator-exhaustive.test.ts`. (All 180 tests passed).

### 9. Project Stabilization & Workspace Audit
- [x] **Script Namespace Standardization**:
    - *Annotation*: Renamed and reorganized all mobile development scripts to use the `milcalc:` prefix (e.g., `milcalc:dev`, `milcalc:clear`, `milcalc:tunnel`).
- [x] **Comprehensive Temp File Deep Clean**:
    - *Annotation*: Manually purged all stale `.turbo`, `.expo`, `android/build`, `android/.gradle`, and `node_modules/.cache` directories across the monorepo to ensure zero artifact collision.
- [x] **Log File Sanitization**:
    - *Annotation*: Scanned and removed all `.log` files from the workspace to maintain a clean environment for new benchmarks.

---

## 🧠 Core Strategy Benchmarks
*   **Accuracy**: 100% fidelity to DAFMAN 36-2905 (2025) and DoD Pay Regulations.
*   **Performance**: Zero-latency UI interactions; zero `StyleSheet.create` calls in render bodies.
*   **Reliability**: Full "Airplane Mode" functionality via SQLite sync.
