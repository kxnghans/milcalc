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
- [ ] **FICA Calculation Correction**: 
    - *Annotation*: Update `calculatePay` in `packages/utils` to apply the 7.65% FICA rate strictly to **Base Pay**. Currently applying to total taxable income, which is incorrect for military standards.
- [ ] **BRS Tiered Matching**:
    - *Annotation*: Implement the statutory tiered matching law (100% match on first 3%, 50% match on next 2%) instead of a naive 1-to-1 model.
- [ ] **CA State Tax Sanitization**:
    - *Annotation*: Patch the `1.0` tax rate data bug for California at the API initialization layer to ensure correct bracket logic. (Partial fix implemented in `pay-calculator.ts` logic as a hardcoded override; migration required for full resolution).
- [ ] **Monthly Compound Interest**:
    - *Annotation*: Refactor TSP projections in `retirement-calculator.ts` to use monthly compounding for higher financial fidelity.

### 2. PT Calculator & Scoring (Precision)
- [ ] **Alternate PT Score Trap**:
    - *Annotation*: Implement `&&` logic for alternate exercises (e.g., Push-ups AND HR Push-ups) to ensure a category is only marked `Exempt` if ALL possible exercises within it are exempt.
- [ ] **Range-Based Performance Optimization**:
    - *Annotation*: Pre-parse the human-readable standards (e.g., `13:25`) into numeric seconds ONCE during hydration to prevent regex overhead in the real-time scoring loop.
- [ ] **Altitude Walk Correction**:
    - *Annotation*: Audit the walk threshold calculation in `pt-calculator.ts` to ensure it correctly pulls from demographic-specific altitude tables for all 3 groups.

### 3. Statutory Calculation Edge Cases (Accuracy)
- [ ] **VA Disability "Offset" (CRDP)**:
    - *Annotation*: Update `retirement-calculator.ts` to implement the dollar-for-dollar offset for disability ratings under 50% (non-CRDP cases).
- [ ] **Reserve Inactive Point Cap**:
    - *Annotation*: Implement the statutory 130-point annual ceiling for National Guard and Reserve retirement multipliers (Title 10 U.S.C. § 12733). Currently, all points provided are used in projections.
- [ ] **Senior Officer Pay Cap (Level II)**:
    - *Annotation*: Apply the Executive Level II statutory cap to base pay calculations for O-7 to O-10 in `pay-calculator.ts`.
- [ ] **WHtR Rounding Precision**:
    - *Annotation*: Force `toFixed(2)` rounding before comparing WHtR results to score charts to prevent "rounding into failure."

### 4. API & Infrastructure Optimization
- [ ] **TTL Caching Manager**:
    - *Annotation*: Implement 24-hour TTL logic for metadata syncs to reduce Supabase egress and improve launch speed.
- [ ] **RPC Data Bundling**:
    - *Annotation*: Create a single Postgres RPC to fetch all reference data in one handshake, reducing latency and database reads.

### 4. UI/UX & Quality Assurance
- [ ] **TTS Disk Caching (`useScribeAudio`)**:
    - *Annotation*: Implement local hashing/caching for TTS output to bypass redundant Google Cloud API hits during exercise voice-overs.
- [ ] **Maestro E2E Suite**:
    - *Annotation*: Build "Golden Path" automated tests to verify the flow from Demographics entry to final PT Score breakdown.
- [ ] **Physical Device Audit**:
    - *Annotation*: Verify frame rates and memory footprint on React 19 / New Architecture (Expo 54) for both iOS and Android.

---

## 🧠 Core Strategy Benchmarks
*   **Accuracy**: 100% fidelity to DAFMAN 36-2905 (2025) and DoD Pay Regulations.
*   **Performance**: Zero-latency UI interactions; zero `StyleSheet.create` calls in render bodies.
*   **Reliability**: Full "Airplane Mode" functionality via SQLite sync.
