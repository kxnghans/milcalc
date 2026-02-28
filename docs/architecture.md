# Application Architecture

This document maps out the core architecture, state management patterns, and application loops of the MilCalc application, with a focus on its offline-first design.

## 1. System Topology

The MilCalc application operates on a strict three-tier architecture within a Monorepo environment:

1.  **Presentation Layer (`apps/mobile`, `packages/ui/src/components`)**
    -   Built with React Native and Expo Router.
    -   Responsible purely for rendering UI and capturing user input.
    -   Stateless components whenever possible.

2.  **State Management & Persistence Layer (`packages/ui/src/hooks`)**
    -   Custom React hooks (e.g., `usePtCalculatorState`, `usePayCalculatorState`).
    -   Acts as the central "brain" for each feature.
    -   **Smart Cache:** Uses `@tanstack/react-query` backed by an `expo-sqlite` persistent store. This ensures the app can function 100% offline using the last known good data.

3.  **Core Logic & API Layer (`packages/utils`)**
    -   **Calculation Utilities (`*-calculator.ts`)**: 100% pure functions. They take data and user input as arguments and return computed results. They perform no side-effects.
    -   **Supabase Clients (`*-supabase-api.ts`)**: Dedicated modules for interfacing with the Supabase PostgreSQL backend.

## 2. Routing Structure (Expo Router)

The application uses file-based routing via Expo Router.

-   **`apps/mobile/app/_layout.tsx`**: The root layout. Wraps the app in necessary providers (`PersistQueryClientProvider` for offline-capable React Query, `ThemeProvider` for dynamic styling).
-   **`apps/mobile/app/index.tsx`**: Entry point that redirects to the primary tab.
-   **`apps/mobile/app/(tabs)/`**: Contains the main bottom tab navigation.
    -   `pt-calculator.tsx`: Physical Training Assessment calculator.
    -   `pay-calculator.tsx`: Military Pay and VA Disability calculator.
    -   `retirement-calculator.tsx`: High-3 and BRS Retirement projection.
    -   `best-score.tsx`: Personal record tracking.

## 3. State Management Patterns

We intentionally avoid massive global state stores (like Redux) in favor of localized, feature-specific hook aggregation and persistent caching.

### 3.1 The "Hook Aggregator" Pattern
For complex screens like the PT Calculator, state is broken down into smaller domain hooks, then combined:
-   `useDemographicsState`: Tracks age, gender.
-   `useStrengthState`: Tracks pushups.
-   **`usePtCalculatorState`**: Combines the above. Monitors for changes, debounces the aggregate data, fetches standards from the *local cache* (via React Query), and passes the stabilized data to `calculatePtScore`.

### 3.2 Persistent Cache-Aside Pattern
MilCalc is designed to work on a flightline with zero cell service:
1.  **Seed Data:** On the very first launch, if the local SQLite database is empty, the app hydrates the cache from a bundled `seed-data.json` file.
2.  **Local First:** `useQuery` hooks always read from the local SQLite cache first (`staleTime: Infinity`).
3.  **Metadata Sync Engine:** On app resume, a lightweight background query fetches a `sync_metadata` table from Supabase. If the cloud timestamp is newer than the local cache, the specific queries are invalidated and re-fetched in the background, implementing a true Stale-While-Revalidate pattern.

## 4. Feature Loops

### 4.1 The Calculation Loop (Example: Pay Calculator)
1.  **User Input**: User changes their "Years of Service".
2.  **Debounce**: The hook waits for input to settle (500ms).
3.  **Data Fetch**: `getPayData` is called. React Query intercepts this and instantly returns the pay tables from the local `expo-sqlite` database.
4.  **Pure Calculation**: `calculatePay()` is invoked with the local data.
5.  **Render**: The resulting object is passed down to `PayDisplay.tsx`.

### 4.2 The Contextual Help Loop
1.  A user taps a help icon.
2.  `DetailModal` opens and requests a `contentKey` (e.g., 'bah').
3.  The modal queries the local cache for the markdown string.
4.  If the device later syncs and finds a newer version of the help text in Supabase, it updates the cache silently.