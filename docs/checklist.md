# MilCalc Execution Checklist

## All Completed Till Date

*   **Monorepo Infrastructure:**
    *   Set up Turborepo and pnpm workspaces.
    *   Configured shared ESLint and TypeScript configurations.
    *   Established strict `check-types` pipeline across all packages.
*   **UI / Design System:**
    *   Built `packages/ui` with Neumorphic design tokens (`theme.ts`).
    *   Created core primitives: `Card`, `NeumorphicInset`, `NeumorphicOutset`, `StyledTextInput`, `ProgressBar`.
    *   Implemented unified Light/Dark mode contexts.
*   **Backend / Supabase:**
    *   Configured Supabase client in `packages/utils`.
    *   Created and populated standard tables (`pt_muscular_fitness_standards`, `base_pay_2024`, `federal_tax_data`, etc.).
    *   Built API wrapper functions for fetching and joining Postgres data.
*   **PT Calculator Feature:**
    *   Implemented pure logic in `pt-calculator.ts` covering standard tests, exemptions, and walk logic.
    *   Built `usePtCalculatorState` hook with input debouncing.
    *   Developed the mobile UI with modular components (`StrengthComponent`, `CardioComponent`).
*   **Pay & Retirement Features:**
    *   Implemented pure logic for Active/Reserve pay, tax brackets, and VA disability comparisons.
    *   Implemented High-3/BRS math and TSP forecasting.
    *   Built respective UI screens and state hooks.
*   **Contextual Help CMS:**
    *   Deployed `DetailModal` capable of fetching markdown strings from Supabase based on content keys.
*   **Testing:**
    *   Wrote 64 unit tests covering 100% of the pure calculation functions in `packages/utils`.
    *   Fixed strict typing and mock data shape alignment.
*   **Production Readiness - Phase 1 (Security & Config):**
    *   Migrated from `app.json` to dynamic `app.config.ts`.
    *   Standardized iOS/Android identifiers to `dev.milcalc.mobile`.
    *   Secured environment variables using `process.env.EXPO_PUBLIC_*`.
    *   Cleaned up unnecessary permissions in the manifest.
    *   Anchored ESLint with `root: true` in all packages.
*   **Production Readiness - Phase 2 (Persistent Smart Cache):**
    *   Integrated `expo-sqlite` and `@tanstack/react-query-persist-client`.
    *   Implemented persistent state using `AsyncStorage` (as the primary driver for TanStack Query state).
    *   Updated `_layout.tsx` with `PersistQueryClientProvider`.
*   **Production Readiness - Phase 3 (Metadata Sync Engine):**
    *   Created `sync-api.ts` and mapped query keys in `sync-metadata-keys.ts`.
    *   Implemented `SyncManager.tsx` component for background metadata-driven invalidation.
    *   Wrapped the application with `SyncManager` for automatic launch-time updates.

---

## To-Do (Actionable Remaining Tasks)

### 1. Hybrid Seeding (Offline First-Launch)
- [ ] Generate a `seed-data.json` file containing all static Supabase tables (PT standards, tax data).
- [ ] Write logic to hydrate the persistent cache from `seed-data.json` if the app is launched for the first time without internet.

### 2. Store Compliance & Polish
- [ ] Use `expo-optimize` to generate adaptive icons and splash screens from `3d_splash.png`.
- [ ] Draft a Privacy Policy emphasizing client-side processing and offline calculation.
- [ ] Conduct a physical device test focusing on React 19 / New Architecture performance.
- [ ] Configure Maestro for E2E Golden Path testing.

### 3. CI/CD Pipeline Setup
- [ ] Create GitHub Actions workflow to run `pnpm lint`, `pnpm check-types`, and `pnpm test` on every PR.
- [ ] Automate Expo EAS Build triggers for staging environments.

### 4. Database Security Audit
- [ ] Review all Supabase Row Level Security (RLS) policies.
- [ ] Ensure all static lookup tables (tax rates, PT standards) are strictly read-only for public anonymous roles.
- [ ] Implement database triggers to automatically update the `sync_metadata` table when data changes.