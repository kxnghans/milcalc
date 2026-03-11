# Data Architecture & Sync Strategy

This document outlines the architectural principles governing MilCalc's data layer, focusing on the "Offline-First" synchronization between Supabase and the local device.

## 1. Architectural Philosophy: Offline-First

MilCalc is designed for high-reliability in disconnected environments. The backend (Supabase) acts as the **Global Source of Truth**, while the local device (`expo-sqlite`) acts as the **Operational Source of Truth**.

### The "Zero-Latency" Rule
-   All UI components must read exclusively from the local SQLite cache via TanStack Query.
-   Direct network calls during a user's calculation flow are strictly prohibited to ensure a consistent 60FPS experience regardless of connectivity.

## 2. Sync Mechanism: The "Metadata Pulse"

To minimize battery drain and data usage, MilCalc avoids frequent polling of large standards tables. Instead, it uses a lightweight versioning system:

1.  **Metadata Table**: A `sync_metadata` table tracks the `last_updated_at` timestamp for each logical table (e.g., `pt_standards`, `pay_scales`).
2.  **The Pulse**: Upon app launch or foregrounding, the `SyncManager` performs a single, small fetch of the `sync_metadata` table.
3.  **Invalidation**: If the local metadata timestamp is older than the backend timestamp, the `SyncManager` initiates a background fetch for only the affected tables.
4.  **Operational Status**: The `SyncManager` is fully active and manages hydration for all fitness, pay, and tax standards.

## 3. Data Tiering

We categorize data into three tiers based on volatility and access patterns:

| Tier | Example | Storage | Sync Frequency |
| :--- | :--- | :--- | :--- |
| **Static Standards** | PT Scoring, Pay Scales | SQLite / `seed-data.json` | First Launch / On Change |
| **Dynamic Metadata** | `sync_metadata` | SQLite / Memory | Every Launch |
| **User State** | Current Inputs, Best Scores | SQLite (Smart Cache) | Never (Local Only) |

## 4. HUMAN-READABLE DATA (2025 Architecture)

The 2025 PT Architecture prioritizes **human auditaiblity**. Performance values (e.g., `"13:25"`, `"<= 0.49"`, `"45-48"`) are stored as **Text** in the database to precisely match source DAFMAN 36-2905 PDFs.

- **Parser Intelligence**: The `@repo/utils` logic engine is responsible for parsing these strings into numeric values (seconds, floats, or integers) at runtime for comparison.
- **Unified Schema**: 7 fragmented fitness tables have been consolidated into 4 modular, exercise-centric tables (`pt_scoring_standards`, `pt_pass_fail_standards`, `pt_altitude_corrections`, `pt_altitude_walk_thresholds`).

## 5. RELATIONAL CACHING (Smart Cache)

The local SQLite database (the "Smart Cache") mirrors the relational structure of PostgreSQL. This allows the `@repo/utils` library to perform complex joins (e.g., joining demographics with scoring tables) locally, ensuring that "What-If" scenarios (like changing an age bracket) reflect instantly.

## 5. Security Architecture

-   **Row Level Security (RLS)**: Public tables are strictly `SELECT`-only for the `anon` role.
-   **No Client Writes**: The mobile application does not possess the credentials to modify standard tables, preventing accidental data corruption or malicious injection.
-   **Audit Logs**: All modifications to the "Global Source of Truth" are performed via migrations or authenticated management tools, maintaining a clear audit trail.
