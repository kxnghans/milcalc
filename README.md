# MilCalc

MilCalc is a modern, cross-platform suite of tools designed for United States military personnel to track and calculate fitness and finance metrics. Built with a focus on accuracy, offline reliability, and a clean, neumorphic user interface.

## 🚀 Tech Stack Summary

MilCalc is built as a high-performance monorepo using industry-standard tools:

*   **Monorepo Management**: [Turborepo](https://turbo.build/repo) + [pnpm Workspaces](https://pnpm.io/workspaces).
*   **Mobile Framework**: [React Native](https://reactnative.dev/) via [Expo](https://expo.dev/) (SDK 54+), utilizing the New Architecture and React 19.
*   **Backend-as-a-Service**: [Supabase](https://supabase.com/) (PostgreSQL, PostgREST, Auth).
*   **Data Orchestration**: [TanStack Query v5](https://tanstack.com/query/latest) with `expo-sqlite` persistence for "Zero-Latency" offline-first performance.
*   **Design System**: Custom Neumorphic library in `@repo/ui`, utilizing `react-native-reanimated` for fluid interactions.
*   **Language**: Strict [TypeScript](https://www.typescriptlang.org/) across all packages.
*   **Testing**: [Jest](https://jestjs.io/) for unit/integration logic; [Maestro](https://maestro.mobile.dev/) (planned) for E2E flows.

## 📦 Project Structure & Logical Domains

The codebase is partitioned into distinct logical layers to ensure separation of concerns and maximize code reuse:

```text
.
├── apps
│   └── mobile                         # [UI/DELIVERY DOMAIN] - Primary mobile application
│       ├── app                        # Expo Router: File-based navigation and screen layouts
│       │   ├── (tabs)                 # Main application features (PT, Pay, Retirement)
│       │   └── _layout.tsx            # Global providers (Theme, Query, Persistence)
│       ├── components                 # App-specific UI components (Composition layer)
│       └── app.config.ts              # Dynamic Expo configuration and environment injection
├── docs                               # [KNOWLEDGE DOMAIN] - Technical specifications
│   ├── architecture.md                # System map and state machine logic
│   ├── backend.md                     # Supabase schema and sync strategy
│   └── ui-theme.md                    # Design tokens and neumorphic principles
├── packages
│   ├── ui                             # [DESIGN DOMAIN] - Shared UI component library
│   │   └── src
│   │       ├── components             # Atomic primitives (Buttons, Cards, Inputs)
│   │       ├── hooks                  # Feature-specific state hooks (usePtCalculatorState)
│   │       └── theme.ts               # Centralized design tokens (Colors, Spacing)
│   ├── utils                          # [LOGIC DOMAIN] - Pure business logic and API
│   │   └── src
│   │       ├── *-calculator.ts        # Side-effect free mathematical engines
│   │       ├── *-supabase-api.ts      # Typed data-fetching and transformation
│   │       └── types.ts               # Global TypeScript definitions
│   └── typescript-config              # [INFRA DOMAIN] - Shared build configurations
├── .git                               # Version control
├── GEMINI.md                          # AI Operating Instructions
├── package.json                       # Root workspace and script definitions
└── turbo.json                         # Build pipeline and cache orchestration
```

## 🛠 Getting Started (Localized Setup)

### 1. Environment Prerequisites
- **Node.js**: v20.x or higher (LTS recommended).
- **pnpm**: v10.x (Check via `pnpm -v`).
- **Expo Go**: Installed on your physical iOS/Android device.

### 2. Installation
From the root directory, install all dependencies and link workspace packages:
```bash
pnpm install
```

### 3. Local Development
Start the development server:
```bash
pnpm dev
```

For physical device testing over a network (Remote Tunnel):
```bash
pnpm dev:remote     # Starts expo server with tunnel enabled
```

To reset the development environment and clear the cache:
```bash
pnpm dev:clear      # Starts expo server with clear and tunnel flags
```
*Tip: Scan the QR code in your terminal using the Expo Go app.*

### 4. Quality Rigor
Run the full validation suite before pushing changes:
```bash
pnpm lint           # Check code style
pnpm check-types    # Validate TypeScript integrity
pnpm test           # Execute Jest logic tests
```

## 🧠 Architectural Philosophy

MilCalc enforces a **Logic-Decoupled** architecture. Components in `apps/mobile` or `packages/ui` must never contain business math. All calculations are handled by pure, testable functions in `packages/utils`. This ensures that a change to the Air Force PT scoring standards only needs to be updated in one file to reflect across the entire system.

For deep-dives into specific modules, see the [Documentation Index](./docs/README.md).