# MilCalc

MilCalc is a modern, cross-platform suite of tools designed for United States military personnel to track and calculate fitness and finance metrics. Built with a focus on accuracy, offline reliability, and a clean, neumorphic user interface.

## Features

-   **100% Offline Capable**: "Smart Cache" architecture (SQLite + React Query) ensures all tools work instantly on flightlines and in deployed environments without cell service.
-   **Air Force PT Calculator**: Calculate PT scores with automatic altitude adjustments.
-   **Pay Calculator**: Estimate military pay, including BAH, BAS, and special pays. Includes VA Disability pay comparison.
-   **Retirement Calculator**: Estimate retirement pay based on various retirement plans (High-3, BRS), including TSP and disability estimates.
-   **Contextual In-App Help**: A comprehensive, markdown-enabled help system provides detailed explanations for calculations and UI elements.
-   **Best Score Tracker**: Track personal bests for each PT exercise.
-   **Dynamic Theming**: Switch between light, dark, and system-default themes.

## Tech Stack

This project is a monorepo built with [pnpm workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turbo.build/repo).

-   **Backend**: [Supabase](https://supabase.com/) (Postgres Database, Auth, Storage)
-   **Mobile App**: [React Native](https://reactnative.dev/) with [Expo Router](https://docs.expo.dev/router/introduction/)
-   **Offline Persistence**: `expo-sqlite` backing TanStack Query via `@tanstack/react-query-persist-client`.
-   **Shared UI**: A custom component library in `packages/ui` built with React Native.
-   **Shared Logic**: Core calculation utilities and Supabase clients in `packages/utils`.
-   **Configuration**: Shared ESLint and TypeScript configurations for consistent code quality.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
-   [pnpm](https://pnpm.io/)

### Installation & Setup

1.  **Install dependencies** from the root of the monorepo:
    ```bash
    pnpm install
    ```

2.  **Run the development server**
    This command uses `turbo` to start the mobile app along with any necessary background tasks.
    ```bash
    pnpm dev
    ```

3.  **Code Quality Tools**
    - Linting: `pnpm lint` or `turbo run lint`
    - Type-Checking: `pnpm check-types` or `turbo run check-types`
    - Testing: `pnpm test`

## Viewing the Apps

After running `pnpm dev`, you will see output for the mobile app in your terminal.

### Mobile (Expo)

1.  **Install the Expo Go app** on your iOS or Android device.
    -   [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
    -   [iOS App Store](https://apps.apple.com/us/app/expo-go/id982107779)
2.  **Connect to the same Wi-Fi network** as your computer.
3.  **Scan the QR code** displayed in your terminal using the Expo Go app.

## Project Structure

Here is a detailed overview of the MilCalc monorepo architecture:

```text
.
├── apps
│   └── mobile                         # (Layer 2) Main mobile application
│       ├── app                        # (Layer 3) Expo Router structure
│       │   ├── _layout.tsx            # (Layer 4) Root navigation layout
│       │   ├── index.tsx              # (Layer 4) Entry screen
│       │   ├── (tabs)                 # (Layer 4) Main tab navigation
│       │   │   ├── _layout.tsx        # (Layer 5) Tab bar configuration
│       │   │   ├── pt-calculator.tsx  # (Layer 5) PT Calculator screen
│       │   │   └── pay-calculator.tsx # (Layer 5) Pay Calculator screen
│       │   └── components             # (Layer 4) App-specific UI components
│       │       └── PayCalculator      # (Layer 5) Modularized calculator UI
│       ├── assets                     # (Layer 3) Static assets (images, icons)
│       └── package.json               # (Layer 3) Mobile app dependencies
├── docs                               # (Layer 2) Project documentation
│   ├── architecture.md                # (Layer 3) System map and logic flows
│   ├── backend.md                     # (Layer 3) Database schema and Supabase rules
│   ├── checklist.md                   # (Layer 3) Execution tracker and milestones
│   ├── PRD.md                         # (Layer 3) Product requirements
│   ├── testing.md                     # (Layer 3) Testing strategies
│   └── ui-theme.md                    # (Layer 3) Design system and UI standards
├── packages
│   ├── eslint-config                  # (Layer 2) Shared linting configuration
│   │   ├── base.js                    # (Layer 3) Node/TS base rules
│   │   └── react-native.js            # (Layer 3) RN specific rules
│   ├── typescript-config              # (Layer 2) Shared TS configuration
│   ├── ui                             # (Layer 2) Shared UI component library
│   │   ├── src                        # (Layer 3) Library source
│   │   │   ├── components             # (Layer 4) Shared primitives (Buttons, Cards)
│   │   │   ├── contexts               # (Layer 4) Shared contexts (ThemeContext)
│   │   │   └── hooks                  # (Layer 4) Shared feature state (usePtCalculatorState)
│   │   └── package.json               # (Layer 3) UI package definitions
│   └── utils                          # (Layer 2) Shared core logic
│       ├── src                        # (Layer 3) Calculation and API utilities
│       │   ├── pt-calculator.ts       # (Layer 4) Pure math for PT scores
│       │   ├── pay-supabase-api.ts    # (Layer 4) Supabase data fetching
│       │   └── index.ts               # (Layer 4) Library exports
│       └── __tests__                  # (Layer 3) Unit tests for utils
├── .gitignore
├── GEMINI.md                          # (Layer 1) AI agent instructions
├── package.json                       # (Layer 1) Root workspace dependencies
├── pnpm-workspace.yaml                # (Layer 1) Monorepo workspace setup
└── turbo.json                         # (Layer 1) Turborepo task pipeline
```

## Architecture

The project enforces a strict three-tier architecture:
1. **Presentation Layer**: Stateless UI components and Expo routing (`apps/mobile`, `packages/ui/src/components`).
2. **State & Persistence Layer**: Custom hooks using React Query and SQLite to manage offline data state (`packages/ui/src/hooks`).
3. **Core Logic Layer**: Pure mathematical functions and database sync APIs (`packages/utils`).

For detailed documentation, please refer to the `/docs` directory.