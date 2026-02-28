# Backend and Data Architecture

This document details the data layer of MilCalc, built on Supabase (PostgreSQL, Auth, Storage), and how it synchronizes with the mobile client.

## 1. Database Schema & Tables

The backend is composed of several localized domains containing specific lookup tables.

### 1.1 PT Calculator Domain
-   `pt_age_sex_groups`: Defines age brackets and genders.
-   `pt_muscular_fitness_standards`, `pt_cardio_respiratory_standards`: Maps performance to points.
-   `walk_standards`: Pass/Fail time thresholds.
-   `run_altitude_adjustments`, etc.: Multipliers based on installation elevation.

### 1.2 Financial Domain
-   `base_pay_2024`: Basic pay tables.
-   `bah_rates_dependents` / `bah_rates_no_dependents`: Basic Allowance for Housing rates.
-   `federal_tax_data` / `state_tax_data`: Tax brackets.
-   `veterans_disability_compensation`: Monthly VA payment tables.

### 1.3 Content Management System Domain
-   `pt_help_details`, `pay_help_details`, etc.: Markdown-formatted text for in-app help.

### 1.4 Sync Engine (The "Single Source of Truth")
-   **`sync_metadata`**: A critical table that tracks the `last_updated_at` timestamp for every other table in the database. The mobile app uses this table to determine if its local SQLite cache is out of date.
-   **Automated Triggers**: PostgreSQL triggers (`tr_update_sync_metadata_*`) are established on all lookup tables to automatically update the `sync_metadata` timestamp whenever data is inserted, updated, or deleted. This ensures clients always have an accurate indicator of data freshness.

## 2. API Interaction Layer & Offline Seeding

All interaction with Supabase is managed through typed API wrappers in `packages/utils/src/`.

-   **Client Initialization**: Managed in `supabaseClient.ts`, securely pulling credentials from `app.config.ts` (which reads from `.env` during build).
-   **Offline Seeding**: The app ships with a `seed-data.json` file. If the app is launched in "Airplane Mode" for the first time, it hydrates the local SQLite database from this file, ensuring calculations work immediately without ever hitting Supabase.

## 3. Database Migration Workflow

To ensure schema consistency across environments, MilCalc relies on the Supabase MCP tools.

1.  **Define Schema**: Write a `CREATE TABLE` or `ALTER TABLE` SQL statement.
2.  **Apply Migration**: Use the MCP `apply_migration` tool to execute the DDL safely.
3.  **Seed Data**: Parse local CSV or JSON data files into `INSERT` statements, then execute them via `execute_sql`.
4.  **Update Sync Metadata**: Every time a table is updated via migration or data insert, a trigger or manual query MUST update the `last_updated_at` timestamp in the `sync_metadata` table so clients know to pull the fresh data.
5.  **Types Validation**: Run `generate_typescript_types` to ensure the frontend `types.ts` aligns perfectly.

## 4. Security Rules (RLS)

PostgreSQL Row Level Security (RLS) is strictly enforced.
-   **Public Data**: Tables like pay scales, PT standards, and help text are public for `SELECT` operations only. They require a policy allowing read access to the `anon` role. Writing is blocked.
-   **Config Protection**: Environment variables (Supabase URL/Anon Key) are injected at build time via Expo `app.config.ts` and are never hardcoded in the codebase.