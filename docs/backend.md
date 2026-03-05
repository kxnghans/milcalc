# Backend and Data Architecture

This document details the data layer of MilCalc, built on Supabase (PostgreSQL, Auth, Storage), and how it synchronizes with the mobile client.

## 1. Data-Store Rationale: PostgreSQL

MilCalc utilizes PostgreSQL (via Supabase) as its primary relational engine.
*   **Structured Standards**: Military standards (PT scoring, Pay scales) are inherently relational and hierarchical. PostgreSQL's ACID compliance ensures that a change to a single "Standard" version propagates accurately across all related lookup views.
*   **Complex Joins**: The calculation logic frequently requires joining user demographics with multiple scoring tables. Offloading this logic to PostgreSQL views or performing them locally in SQLite ensures high performance without complex application-side mapping.

## 2. Optimization Mandates

To ensure cost-efficiency and performance for thousands of concurrent users:

### 2.1 Write-Throttling & Metadata Sync
Instead of clients polling for data, we use a **Metadata Pulse** strategy:
-   Clients only poll the `sync_metadata` table (a single row per domain).
-   **Optimization**: This reduces the read load on heavy lookup tables by 99%, as clients only re-fetch data when the metadata version increments.

### 2.2 Relational Caching (SQLite)
The mobile app mirrors the PostgreSQL schema in a local `expo-sqlite` database.
-   **Scalar Counters**: We use triggers in the local database to update "Aggregate" scores, reducing the need for the React UI to recalculate total scores on every minor input change.

### 2.3 Ephemeral Storage Tier
-   User-specific session data (e.g., a "current" un-saved PT calculation) is stored in the React state or `AsyncStorage` and never hits the backend, reducing DB writes and costs.

## 3. Security & RBAC (Role-Based Access Control)

MilCalc enforces strict access boundaries using PostgreSQL Row Level Security (RLS).

### 3.1 Role Definitions
*   **`anon` (Anonymous)**: Read-only access to "Public Knowledge" domains (Standards, Pay Rates, Help Text).
*   **`authenticated` (Future)**: Access to Personal Best history and synced preferences.
*   **`service_role` (Admin)**: Full CRUD for data management via MCP tools.

### 3.2 Policy Mandates
1.  **Public Access**: `CREATE POLICY "Public Read" ON public.pt_muscular_fitness_standards FOR SELECT USING (true);`
2.  **Zero-Write for Clients**: No `INSERT`, `UPDATE`, or `DELETE` policies exist for the `anon` or `authenticated` roles on standards tables.
3.  **Metadata Trigger**: Every table update triggers `FUNCTION update_sync_metadata()`, ensuring the "Version Clock" is always accurate.

## 4. Database Migration Workflow

To ensure schema consistency across environments, MilCalc relies on the Supabase MCP tools.

1.  **Define Schema**: Write a `CREATE TABLE` or `ALTER TABLE` SQL statement.
2.  **Apply Migration**: Use the MCP `apply_migration` tool to execute the DDL safely.
3.  **Seed Data**: Parse local CSV or JSON data files into `INSERT` statements.
4.  **Types Validation**: Run `generate_typescript_types` to ensure the frontend `types.ts` aligns perfectly.