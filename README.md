# MilCalc 🏋️‍♂️

MilCalc is a modern, cross-platform suite of tools designed for United States military personnel to track and calculate fitness and finance metrics. Built with a focus on accuracy and a clean, neumorphic user interface.

## ✨ Features

-   **Accurate PT Calculator**: Calculate your score for the US Air Force Physical Fitness Test based on the latest official standards (`dafman36-2905`). All data is served from a scalable Supabase backend.
-   **Best Score Tracker**: Keep a running log of your personal bests for each component of the PT test to see your best possible score at a glance.
-   **Dynamic Theming**: Seamlessly switch between light, dark, and system-default themes.
-   **Modern Neumorphic UI**: A clean, tactile, and intuitive user interface built with a shared component library.
-   **Official Document Viewer**: Quickly access official PDF documents like `dafman36-2905` from within the app.

## 🛠️ Tech Stack

This project is a monorepo built with [pnpm workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turbo.build/repo).

-   **Backend**: [Supabase](https://supabase.com/) (Postgres Database, Auth, Storage)
-   **Mobile App**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
-   **Web App**: [Next.js](https://nextjs.org/)
-   **Shared UI**: A custom component library in `packages/ui` built with React Native.
-   **Shared Logic**: Core calculation utilities and Supabase clients in `packages/utils`.
-   **Configuration**: Shared ESLint and TypeScript configurations for consistent code quality.

## 📂 Project Structure

-   `apps/mobile`: The primary Expo (React Native) application.
-   `apps/web`: A Next.js web application (secondary focus).
-   `packages/ui`: Shared React Native components (ProgressBar, Buttons, Inputs, etc.).
-   `packages/utils`: Core business logic (`pt-calculator.ts`) and Supabase clients (`pt-supabase-api.ts`).
-   `packages/data`: Contains static data and assets used by the applications.
-   `packages/eslint-config`: Shared ESLint rules.
-   `packages/typescript-config`: Shared TypeScript `tsconfig.json` files.

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
-   [pnpm](https://pnpm.io/)

### Installation

1.  **Install dependencies** from the root of the monorepo:
    ```bash
    pnpm install
    ```

2.  **Run the development servers**
    This command uses `turbo` to start the web and mobile apps in parallel.
    ```bash
    pnpm dev
    ```

## 👀 Viewing the Apps

After running `pnpm dev`, you will see output from both the web and mobile apps in your terminal.

### Mobile (Expo)

The primary focus of development is the mobile app.

1.  **Install the Expo Go app** on your iOS or Android device.
    -   [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
    -   [iOS App Store](https://apps.apple.com/us/app/expo-go/id982107779)
2.  **Connect to the same Wi-Fi network** as your computer.
3.  **Scan the QR code** displayed in your terminal using the Expo Go app. This will open the MilCalc app on your device.

### Web

To view the web app, open the URL provided in the terminal (typically `http://localhost:3000`). The PT Calculator is available at `/pt-calculator`.
