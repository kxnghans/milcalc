# MilCalc Execution Checklist (Refined)

## ✅ Completed Milestones
- **Monorepo Architecture**: Fully operational.
- **Pure Logic Engines**: PT (50-20-15-15 refactor complete), Pay, and Retirement.
- **Unified PT Database Refactor**: Consolidated 7 fragmented tables into 4 modular, simplified tables (`pt_scoring_standards`, `pt_pass_fail_standards`, `pt_altitude_corrections`, `pt_altitude_walk_thresholds`).
- **Unified BAH 2026 Schema Integration**: Transitioned to the `bah_rates_2026` unified table with `has_dependents` boolean logic across the API and SyncManager.
- **2025 PT Standards Ingestion**: 100% of standards ingested into Supabase simplified schema.
- **PT Parser Engine**: Robust string-to-numeric calculation engine in `packages/utils`.
- **Hybrid Seeding (Offline First)**: Integrated `seed-data.json` hydration in `_layout.tsx`.
- **Logic Validation**: Unit tests added for height conversion math and WHtR scoring edge cases.
- **Cross-Check Verification**: Exhaustive test suite (`pt-calculator-exhaustive.test.ts`) validated against 12 original source CSVs in `docs/sources/csvs/`.
- **Sea-Level Walk Integration**: Demographic-specific walk standards added to `pt_pass_fail_standards`.
- **Maintenance Script Alignment**: `generate-pt-seeds.ts` and `generate-upload-csvs.ts` updated to the 4-table simplified architecture.
- **RLS Security Audit**: Verified strict read-only access for `anon` on all PT tables.
- **System Hardening (Stability)**: Resolved \"Maximum update depth exceeded\" infinite loops by enforcing strict context memoization (`useMemo`, `useCallback`) and style stabilization across all components and tab screens.
- **PT Progress Bar Alignment**: Refactored progress bars to semantic \"Pass/Max\" thresholds and corrected the 50-20-15-15 point mapping for the 2025 standards.
- **WHtR UI Integration**: Added a dedicated progress bar and health risk category display for the Waist-to-Height Ratio in both Demographics and Score Display.
- **Cardio Risk Display**: Integrated real-time health risk category visualization for Run and HAMR events.

---

## 🚀 Active To-Do: Quality & Finalization

### 1. Unified PT Data & Offline Sync
- [x] **Data Export Verification**: Re-run `pnpm data:export` to update `apps/mobile/assets/seed-data.json` from the new Supabase simplified tables.
- [x] **SyncManager Validation**: Verify that the mobile app correctly handles the bulk sync and local SQLite hydration for the 4 new tables.
- [x] **Altitude Walk Correction**: Audit the walk threshold calculation in `pt-calculator.ts` to ensure it correctly pulls from `pt_altitude_walk_thresholds` for all 3 altitude groups.

### 2. Performance & Quality Assurance
- [ ] **Maestro E2E Suite**: Configure Maestro for \"Golden Path\" validation (Demographics -> PT Calculator -> Cardio/Strength/Core Selection -> Result Breakdown).
- [ ] **Physical Device Audit**: Profile memory and render performance on iOS/Android (React 19 / New Arch).
- [x] **Component Threshold Audit**: Verified all muscular (15pts) and cardio (50pts) thresholds in the UI components match the 2025 model.

### 3. Security & Infrastructure
- [x] **Finalize RLS Policies**: Audit all PT tables for strict Row Level Security (RLS) to ensure `anon` is restricted to `SELECT` only.
- [x] **Metadata Optimization**: Verify that updating `sync_metadata` for the new tables triggers the background fetch correctly.

---

## 🧠 Strategic Context
- **Cross-Check Architecture**: The application uses the **Simplified Schema** (optimized for lookups), while the testing suite uses the **Source CSVs** (optimized for human auditability). This provides a high-confidence verification loop.
- **Human Readability**: Performance values are stored as Text (e.g., `"13:25"`) to match source PDFs.
- **Offline First**: All new tables are added to the `SyncManager` tracking and included in the `seed-data.json` fallback.
- **Supabase Tier**: Supabase acts as the Global Source of Truth, tracking versioning via `sync_metadata`.

