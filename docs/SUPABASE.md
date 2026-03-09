# Supabase Integration & Schema

This document details the Supabase backend configuration, PostgreSQL schema, and data management workflows for MilCalc.

## 🔗 Connection Overview

MilCalc utilizes the `@supabase/supabase-js` client (v2.74+) for all data orchestration. The application follows an **Offline-First** philosophy:
-   **Primary Data Flow**: Supabase ↔ `sync_metadata` ↔ `SyncManager` ↔ `expo-sqlite`.
-   **Real-time Logic**: The client listens for version increments in the `sync_metadata` table to trigger background hydration of local tables.

## 🗄️ Database Schema

### 1. Fitness Standards (PT Calculator)
-   **`pt_age_sex_groups`**: Core demographic mapping for scoring brackets.
-   **`pt_muscular_fitness_standards`**: Lookup table for push-ups, sit-ups, and alternative strength events.
-   **`pt_cardio_respiratory_standards`**: Lookup table for 1.5-mile run and HAMR events.
-   **`walk_standards`**: Passing thresholds for the 2km walk assessment.
- **`run_altitude_adjustments` / `walk_altitude_adjustments` / `hamr_altitude_adjustments`**: Performance offsets for high-elevation environments.

### 2. Financial Logic (Pay & Retirement)
-   **`base_pay_2024`**: Standard basic pay tables (relational by rank/YOS).
-   **`reserve_drill_pay`**: Prorated pay tables for Guard and Reserve drills.
-   **`bah_rates_dependents` / `bah_rates_no_dependents`**: Housing allowance lookup by MHA/Zip.
-   **`bas_rates`**: Subsistence allowance lookup (versioned by year).
-   **`federal_tax_data` / `state_tax_data`**: Tax brackets and standard deductions (versioned by year).
-   **`veterans_disability_compensation`**: Monthly VA rates for service-connected disabilities.

### 3. Contextual CMS (Help System)
All help content is managed via a segmented key-value store to support rich markdown rendering:
-   **`pt_help_details`**
-   **`pay_help_details`**
-   **`retirement_help_details`**
-   **`best_score_help_details`**

### 4. System Metadata
- **`sync_metadata`**: Tracks the `last_updated_at` timestamp for all standards tables to orchestrate incremental background synchronization.

## 🔐 Security & Access Control

MilCalc enforces **Row Level Security (RLS)** to protect data integrity:
-   **`anon` Role**: Read-only access to all standards and help tables.
-   **`authenticated` Role**: Future-proofed for user-specific history sync.
-   **Triggers**: All financial updates are protected by the `update_sync_metadata()` function, ensuring client caches are invalidated immediately upon backend changes.

## 🛠️ Data Management Workflow

1.  **Migration**: Schema changes are applied via `pnpm supabase migration up` (or management tools).
2.  **Type Safety**: TypeScript types are synchronized using `generate_typescript_types` to `packages/utils/src/types.ts`.
3.  **Seeding**: Production snapshots are planned for export to `seed-data.json` for first-launch offline hydration. Currently, the app hydrates via background sync on first connected launch.
4.  **Versioning**: Data tables (e.g., `base_pay_2024`) are versioned. The `SyncManager` is designed to transition to newer scales (e.g., 2025/2026) by updating the `sync_metadata` pointers.
