# MilCalc

MilCalc is a modern, cross-platform suite of tools designed for United States military personnel to track and calculate fitness and finance metrics. Built with a focus on accuracy and a clean, neumorphic user interface.

## Features

-   **Air Force PT Calculator**: Calculate PT scores with automatic altitude adjustments.
-   **Pay Calculator**: Estimate military pay, including BAH, BAS, and special pays. Includes VA Disability pay comparison.
-   **Retirement Calculator**: Estimate retirement pay based on various retirement plans (High-3, BRS), including TSP and disability estimates.
-   **Contextual In-App Help**: A comprehensive, markdown-enabled help system provides detailed explanations for calculations and UI elements throughout the app.
-   **Best Score Tracker**: Track personal bests for each PT exercise.
-   **Dynamic Theming**: Switch between light, dark, and system-default themes.

## Tech Stack

This project is a monorepo built with [pnpm workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turbo.build/repo).

-   **Backend**: [Supabase](https://supabase.com/) (Postgres Database, Auth, Storage)
-   **Mobile App**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
-   **Shared UI**: A custom component library in `packages/ui` built with React Native.
-   **Shared Logic**: Core calculation utilities and Supabase clients in `packages/utils`.
-   **Configuration**: Shared ESLint and TypeScript configurations for consistent code quality.

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
-   [pnpm](https://pnpm.io/)

### Installation

1.  **Install dependencies** from the root of the monorepo:
    ```bash
    pnpm install
    ```

2.  **Run the development server**
    This command uses `turbo` to start the mobile app.
    ```bash
    pnpm dev
    ```

## Viewing the Apps

After running `pnpm dev`, you will see output for the mobile app in your terminal.

### Mobile (Expo)

1.  **Install the Expo Go app** on your iOS or Android device.
    -   [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
    -   [iOS App Store](https://apps.apple.com/us/app/expo-go/id982107779)
2.  **Connect to the same Wi-Fi network** as your computer.
3.  **Scan the QR code** displayed in your terminal using the Expo Go app. This will open the MilCalc app on your device.

## File Structure
Here is a brief overview of the project's file structure:

```
.
├── apps
│   └── mobile
│       ├── app
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   └── (tabs)           # Main application screens (PT, Pay, Retirement)
│       ├── assets
│       ├── package.json
│       └── tsconfig.json
├── docs                      # Project documentation
│   ├── milcalc.md           # Consolidated implementation details
│   ├── SUPABASE.md          # Supabase integration and tools
│   └── TESTING.md           # Testing procedures
├── packages
│   ├── ui                    # Shared UI component library
│   │   ├── src
│   │   │   ├── components
│   │   │   └── hooks        # Feature-specific state hooks
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── utils                 # Shared utility functions and core logic
│       ├── src
│       │   ├── pt-calculator.ts
│       │   ├── pay-calculator.ts
│       │   └── retirement-calculator.ts
│       ├── package.json
│       └── tsconfig.json
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── README.md
└── tsconfig.json
```

`apps`: Contains the source code for the applications.

`mobile`: The Expo mobile application.

`packages`: Contains the shared packages used by the applications.

`config`: Shared configuration files (ESLint, TypeScript, etc.).

`ui`: Shared UI components.

`utils`: Shared utility functions.

`.gitignore`: Specifies which files and directories to ignore in version control.

`package.json`: Contains the project's dependencies and scripts.

`pnpm-lock.yaml`: The lockfile for pnpm, ensuring consistent dependency versions.

`pnpm-workspace.yaml`: The configuration file for the pnpm workspace.

`README.md`: This file.

`tsconfig.json`: The root TypeScript configuration file.