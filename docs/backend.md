# Backend Architecture & Data Strategy

This document outlines the architectural principles and technical implementation of MilCalc's data layer, detailing the synchronization strategy between Supabase and the local device.

## 1. Architectural Philosophy: Offline-First

MilCalc is designed for high-reliability in disconnected environments. The backend (Supabase) acts as the **Global Source of Truth**, while the local device (`expo-sqlite`) acts as the **Operational Source of Truth**.

### The "Zero-Latency" Rule
-   All UI components must read exclusively from the local SQLite cache via TanStack Query.
-   Direct network calls during a user's calculation flow are strictly prohibited to ensure a consistent 60FPS experience regardless of connectivity.

## 2. Connection & Sync Strategy

MilCalc utilizes the `@supabase/supabase-js` client (v2.74+) for all data orchestration. To minimize battery drain and data usage, the application avoids frequent polling of large standards tables through a lightweight "Metadata Pulse" system.

1.  **Metadata Tracking**: A `sync_metadata` table on Supabase tracks the `last_updated_at` timestamp for each logical table (e.g., `pt_standards`, `pay_scales`).
2.  **The Pulse**: Upon app launch or foregrounding, the `SyncManager` performs a single, small fetch of the `sync_metadata` table.
3.  **Invalidation & Hydration**: If the local metadata timestamp is older than the backend timestamp, the `SyncManager` initiates a background fetch for only the affected tables, updating the local SQLite cache.
4.  **Operational Flow**: Supabase ↔ `sync_metadata` ↔ `SyncManager` ↔ `expo-sqlite`.

## 3. Data Tiering

We categorize data into three tiers based on volatility and access patterns:

| Tier | Example | Storage | Sync Frequency |
| :--- | :--- | :--- | :--- |
| **Static Standards** | PT Scoring, Pay Scales | SQLite / `seed-data.json` | First Launch / On Change |
| **Dynamic Metadata** | `sync_metadata` | SQLite / Memory | Every Launch |
| **User State** | Current Inputs, Best Scores | SQLite (Smart Cache) | Never (Local Only) |

## 4. Database Schema

### 4.1 Fitness Standards (2025/2026 Architecture)
The 2025/2026 PT Architecture simplifies the schema into a **4-table model** for easier maintenance and human auditability. Performance values (e.g., `"13:25"`, `"<= 0.49"`, `"45-48"`) are stored as **Text** to precisely match source DAFMAN 36-2905 PDFs.

-   **`pt_scoring_standards`**: Unified lookup for all exercise points. Includes `gender`, `age_group`, `exercise_type`, `performance`, `points`, and `health_risk_category`.
-   **`pt_pass_fail_standards`**: Defines the minimum passing thresholds for all events by `gender` and `age_group`.
-   **`pt_altitude_corrections`**: Performance offsets (Run subtractions / HAMR additions) for high-elevation environments.
-   **`pt_altitude_walk_thresholds`**: Demographic-specific max times for the 2km Walk at altitude, indexed by `sex` and `altitude_group`.
-   **Parser Intelligence**: The `@repo/utils` logic engine features a `parsePerformanceRange` utility that dynamically parses ranges (`"45-48"`), inequalities (`">= 50"`), and exact values from the text performance columns.

### 4.2 Financial Logic (Pay & Retirement)
The financial system uses a mix of the most recent available scales. Versioning is handled at the table-name level to allow for historical comparisons.

-   **`base_pay_2025`**: Standard basic pay tables for the current year (relational by rank/YOS).
-   **`reserve_drill_pay`**: Prorated pay tables for Guard and Reserve drills, calculated as 1/30th of monthly base pay per drill period.
-   **`bah_rates_2026`**: Unified housing allowance lookup reflecting the 2026 rate cycle. Includes a `has_dependents` boolean and columns for all pay grades.
-   **`bas_rates_2025`**: Subsistence allowance lookup.
-   **`federal_tax_data` / `state_tax_data`**: Tax brackets and standard deductions (with specific overrides for CA logic).
-   **`veterans_disability_compensation_2025`**: Monthly VA rates for service-connected disabilities.


### 4.3 Contextual CMS (Help System)
All help content is managed via a segmented key-value store to support rich markdown rendering:
-   `pt_help_details`
-   `pay_help_details`
-   `retirement_help_details`
-   `best_score_help_details`

### 4.4 System Metadata
-   **`sync_metadata`**: Orchestrates incremental background synchronization by tracking table versions.

## 5. Local Relational Caching (Smart Cache)

The local SQLite database mirrors the relational structure of PostgreSQL. This allows the `@repo/utils` library to perform complex joins (e.g., joining demographics with scoring tables) locally, ensuring that "What-If" scenarios reflect instantly without network overhead.

## 6. Security & Access Control

MilCalc enforces strict **Row Level Security (RLS)** to protect data integrity and ensure public accessibility where required:
-   **Public `anon` Role**: Read-only access (`SELECT`) to all standards, help, and metadata tables. This allows the application to function without user accounts.
-   **Security Defenses**: Table RLS policies explicitly deny `INSERT`, `UPDATE`, and `DELETE` for the anonymous role, preventing any client-side tampering with military standards.
-   **Server-Side Integrity**: All schema modifications and data updates are handled via `service_role` migrations, ensuring a verifiable audit trail for the Global Source of Truth.
-   **Cache Invalidation**: Automated triggers on standard tables update the `sync_metadata` timestamp, forcing a background refresh on all client devices upon their next "Pulse".

## 7. Data Management Workflow

1.  **Migration**: Schema changes are applied via `pnpm supabase migration up`.
2.  **Type Safety**: TypeScript types are synchronized using `generate_typescript_types` to `packages/utils/src/types.ts`.
3.  **Seeding**: Production snapshots are exported to `seed-data.json` for first-launch offline hydration.
4.  **Versioning**: Data tables are versioned. The `SyncManager` transitions to newer scales (e.g., 2025/2026) by updating the `sync_metadata` pointers.
