# MilCalc Execution Checklist

## Completed Milestones (Thematic Summary)

### Architecture & Core Infrastructure
- **Monorepo & API Layer**: Established Turborepo with shared packages (`@repo/ui`, `@repo/utils`).
- **Offline-First Resilience**: Implemented a hybrid seeding engine (`seed-data.json`) ensuring 100% "Airplane Mode" reliability via `expo-sqlite`.
- **API Optimization**: Consolidated 7 fragmented tables into a modular 4-table schema with RPC data bundling to minimize handheld latency.
- **Environment Security**: Completed a full Supabase RLS audit; all sensitive keys are build-time injected.

### Pure-Logic Calculation Engines
- **DAFMAN 36-2905 Accuracy**: Validated PT (2025/2026) standards with 180 exhaustive test cases, including Altitude Walk and HAMR traps.
- **Financial Fidelity**: Corrected FICA rates to scope strictly to Base Pay; implemented BRS tiered matching and monthly compound interest for TSP.
- **Statutory Guardrails**: Applied Executive Level II pay caps for Senior Officers and annual point ceilings (Title 10 U.S.C. § 12733) for Guard/Reserve.
- **Shared Tax Utilities**: Centralized federal and state tax logic from pay and retirement calculators into a single validated module (`tax-utils.ts`).

### Premium UI/UX & Interaction
- **Neumorphic Design System**: Delivered a consistent Soft-UI across all screens via themed `@repo/ui` primitives.
- **Context-Driven UI**: Replaced messy local state with global `OverlayContext` for help, documents, and feedback flows.
- **Keyboard UX**: Refactored `BugReportView` with keyboard-aware scrolling to preserve visibility of lower form fields.

### Performance & Stability
- **Style Stabilization**: Eliminated infinite re-renders by enforcing `useMemo` for style factories and context values.
- **Lifecycle Hardening**: Resolved "Maximum update depth exceeded" errors by strictly memoizing root providers.
- **Component Modularization**: Decoupled monolithic screens into domain-specific subdirectories (`PtCalculator/`, `PayCalculator/`, `RetirementCalculator/`).

---

## Active Roadmap (Refined To-Dos)

### Phase 1: Pay API Sanitization
*Goal: Remove logic duplication in database access layer.*
- [ ] **YOS Column Selector**: Extract the 40+ branch `if/else` ladders for Years of Service (YOS) column selection into a shared utility in `pay-supabase-api.ts`.
- [ ] **Query Result Wrapping**: Standardize `sanitizeError` and result logging across all Supabase API files to reduce boilerplate.

### Phase 2: Type Safety Hardening
*Goal: Eliminate remaining `any` boundaries in data hydration.*
- [ ] **Typed JSON Parsing**: Add typed guards (or `zod` schema) for `JSON.parse(result.value)` in `ProfileContext.tsx` to resolve `no-unsafe-argument` warnings.
- [ ] **SQLite Row Mapping**: Replace implicit SQLite results with explicit interfaces for all `db.getFirstSync` and `db.getAllSync` calls in the bootstrap layer.

### Phase 3: Component Housekeeping & Standardization
*Goal: Fix duplication and optimize the component tree.*
- [ ] **Consolidate `LabelWithHelp`**: Merge `NewLabelWithHelp` (Pay) and `LabelWithHelp` (Retirement) into a single optimized primitive in `@repo/ui`.
- [ ] **Extract `BestScoreSection`**: Pull the 450+ line inline component from `best-score.tsx` into `components/PtCalculator/`.
- [ ] **Scope `GenderSelector`**: Move from root `components/` to `PtCalculator/` (or promote to `@repo/ui` if shared intent).
- [ ] **Memoize `PayDemographics` Styles**: Move `StyleSheet.create` inside a `useMemo` block to comply with performance standards.

### Phase 4: Structural Decomposition & "God" Modals
*Goal: Thin the root layout and monolithic UI components.*
- [ ] **Extract `useAppBootstrap`**: Move DB initialization, seeding logic, and sync-metadata handshakes from `_layout.tsx` into a custom hook.
- [ ] **Modularize `DetailModal`**: Extract domain-specific help templates (PT, Pay, Retirement) and the Markdown parser from the 440-line `DetailModal.tsx`.
- [ ] **Persistence Layer Separation**: Encapsulate TanStack Query persist options and SQLite storage wrapper into a separate `PersistenceProvider`.

### Phase 5: Domain Logic Isolation
*Goal: Decouple calculation math from data fetching.*
- [ ] **Scoring Engine Split**: Break down `pt-calculator.ts` into `scoring.ts`, `altitude.ts`, and `standards-utils.ts` to separate pure math from metadata lookups.
- [ ] **Income/Deduction Reducers**: Modularize special pay and deduction summation logic in `pay-calculator.ts`.

### Phase 5: Reliability & Quality Gates
*Goal: Establish permanent safety nets for the production target.*
- [ ] **PT Fallback Engine**: Add missing Cardio Risk Category safety guards in `ScoreDisplay.tsx` to prevent crashes on partial DB results.
- [ ] **Standardize Style Linting**: Resolve the noise from `no-unused-styles` vs Style Factory pattern.
