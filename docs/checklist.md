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

---

## 🚀 Active To-Do: System Hardening & Seeding

### 1. Offline & Hydration
- [ ] **Implement Hybrid Seeding**: Integrate `seed-data.json` into the initial launch logic to ensure immediate functionality without first-sync delay.
- [ ] **Data Export**: Generate a fresh `seed-data.json` containing the new unified PT standards.

### 2. UI & Architecture Validation
- [ ] **Architecture Toggle ("New")**: Add a neumorphic slide toggle (default to ON) in the `ScoreDisplay` component (PT Calculator and Best Score screens).
- [ ] **Dual-Logic Bridge**: Implement state logic to switch between Legacy (old data) and Unified (2025 schema) calculation models based on the toggle state.
- [ ] **Health Risk Categories**: Integrate `health_risk_category` column back into `pt_scoring_standards` to support cardio-specific stratification.

### 3. Performance & Quality Assurance
- [ ] **Maestro E2E Suite**: Configure Maestro for "Golden Path" validation (Pay -> PT -> Retirement flow).
- [ ] **Physical Device Audit**: Profile memory and render performance on iOS/Android (React 19 / New Arch).

### 4. Security & Infrastructure
- [ ] **Finalize RLS Policies**: Audit all Supabase tables for strict Row Level Security (RLS) before production push.
- [ ] **Metadata Optimization**: Refine `SyncManager` logic to handle large-scale schema migrations more gracefully.

---

## 🧠 Strategic Context
- **Human Readability**: Performance values are stored as Text (e.g., `"13:25"`) to match source PDFs.
- **Parser Intelligence**: The logic engine is responsible for parsing these strings into numeric values for comparison.
- **Idempotency**: Seed files are self-contained; running `push_ups_1min.sql` updates ONLY push-up data.
- **Offline First**: All new tables are added to the `SyncManager` tracking.
