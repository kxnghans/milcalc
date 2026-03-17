# MilCalc Execution Checklist (Refined)

## ✅ Completed Milestones
- **Monorepo Architecture**: Fully operational.
- **Pure Logic Engines**: PT (50-20-15-15 refactor complete), Pay, and Retirement.
- **Neumorphic Design System**: Primitives stabilized.
- **Persistent Smart Cache**: `expo-sqlite` + TanStack Query.
- **Universal WHtR Logic**: Unified SQL-based lookup established.
- **DAFMAN 36-2905 Walk/Altitude**: Unified SQL-based scoring and thresholding established.
- **Unified PT Database Refactor**: Consolidated 7 fragmented tables into 4 modular, exercise-centric tables.
- **2025 PT Standards Ingestion**: 100% of muscular, cardio, walk, and altitude data transcribed from PDF to SQL.
- **PT Parser Engine**: Robust string-to-numeric calculation engine in `packages/utils`.
- **Hybrid Seeding (Offline First)**: Integrated `seed-data.json` hydration in `_layout.tsx`.
- **Cardio Risk Stratification**: Logic and UI updated to display health risk categories (High/Moderate/Low).
- **Dual-Logic Bridge Removal**: Architecture toggle deprecated; app now strictly follows the 2025 Unified Standard.
- **2025 Standard Seeding**: Run 2-Mile and all other exercise standards fully ingested and verified.
- **WHtR UI Overhaul**: Demographics component expanded with real-time Waist/Height inputs and unit toggles.

---

## 🚀 Active To-Do: System Hardening & Quality

### 1. PT Calculator UI & Logic Refinement
- [x] **Height Unit Conversion**: Implement automatic conversion (Ft/In ↔ Inches) in `useDemographicsState` hook.
- [x] **WHtR Supabase Integration**: Ensure WHtR scoring is correctly pulling from `pt_scoring_standards` and verify precision.
- [x] **Logic Validation**: Add unit tests for height conversion math and WHtR scoring edge cases (0.49, 0.50, 0.60).

### 2. Performance & Quality Assurance
- [ ] **Maestro E2E Suite**: Configure Maestro for "Golden Path" validation (Pay -> PT -> Retirement flow).
- [ ] **Physical Device Audit**: Profile memory and render performance on iOS/Android (React 19 / New Arch).

### 2. Security & Infrastructure
- [ ] **Finalize RLS Policies**: Audit all Supabase tables for strict Row Level Security (RLS) before production push.
- [ ] **Metadata Optimization**: Refine `SyncManager` logic to handle large-scale schema migrations more gracefully.

---

## 🧠 Strategic Context
- **Human Readability**: Performance values are stored as Text (e.g., `"13:25"`) to match source PDFs.
- **Parser Intelligence**: The logic engine is responsible for parsing these strings into numeric values for comparison.
- **Idempotency**: Seed files are self-contained; running `push_ups_1min.sql` updates ONLY push-up data.
- **Offline First**: All new tables are added to the `SyncManager` tracking.
