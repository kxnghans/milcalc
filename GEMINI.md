# Gemini Project Context: MilCalc

This document provides context for the Gemini AI assistant to understand the MilCalc project.

## Project Overview

MilCalc is a monorepo application built with pnpm workspaces. It includes:

-   `apps/web`: A Next.js web application.
-   `apps/mobile`: A React Native mobile application using Expo.
-   `packages/ui`: A shared UI component library.
-   `packages/eslint-config`: Shared ESLint configurations.
-   `packages/typescript-config`: Shared TypeScript configurations.

The project combines features for military personnel, such as an Air Force PT Calculator, and a travel planning tool. The mobile app features a dynamic theme system with light, dark, and automatic modes. It also includes progress bars for all physical training components to provide users with immediate feedback on their performance. A new "Best Score" page has been added to help users track their personal bests. The main screen now includes icons for navigating to the "Best Score" page, linking to official PT documents, and switching the theme.

The Best Score page displays the user's best score for each exercise. It features a main score display, a navigation row with a home button, and a card containing sections for Strength, Core, and Cardio. Each section has a segmented selector for different exercises, input fields for the best scores, and a display for the score of each exercise.

## Building and Running

The project uses `pnpm` as the package manager and `turbo` as the monorepo build tool.

-   **Install dependencies:**
    ```bash
    pnpm install
    ```

-   **Run development servers:**
    This command starts both the web and mobile app development servers.
    ```bash
    pnpm dev
    ```

-   **Build for production:**
    ```bash
    pnpm build
    ```

### Web App

-   **Run:** `pnpm --filter unpack-web dev`
-   **Access:** http://localhost:3000
-   **PT Calculator:** http://localhost:3000/pt-calculator

### Mobile App

-   **Run:** `pnpm --filter unpack-mobile dev`
-   **Access:** Use the Expo Go app and scan the QR code from the terminal.

## Development Conventions

-   **Code Style:** The project uses a shared ESLint configuration (`packages/eslint-config`) to enforce a consistent coding style.
-   **TypeScript:** Shared TypeScript configurations (`packages/typescript-config`) are used across the monorepo.
-   **Commenting:** All new files must be commented to explain their purpose and functionality.
-   **Code Reuse:** Maximize code reuse across the applications by creating shared components and utilities in the `packages` directory.
-   **Focus:** Current development is focused on the mobile application first.
-   **Documentation:** When modifying the project, always consider whether the `GEMINI.md` file needs to be updated to reflect the changes.
-   **Version Control:** Ensure that any necessary files are added to the `.gitignore` file to avoid committing unnecessary files.
-   **Pnpm Overrides:** When installing new dependencies, always check the `pnpm.overrides` in the root `package.json` to avoid version conflicts.
-   **Expressions**: Always use true conditions when making expressions.

### Component Design Principles

-   **Separation of Concerns:** Components should be self-contained and not impose layout styles on their children. Physical properties like `flex`, `margin`, and `height` should be specified by the parent component through style props (e.g., `containerStyle`, `contentStyle`). This makes components more reusable and predictable.

## Data Sources

-   **`packages/ui/src/pt-data.json`**: This file contains the scoring data for the PT calculator. It should never be changed.
-   **`packages/ui/src/data/walk-standards.json`**: This file contains the walk standards for the 2-kilometer walk, separated by gender and age group.

## UI and Styling

### Neumorphic Components

The project uses two main neumorphic components to create its visual style: `NeumorphicInset` and `NeumorphicOutset`.

#### `NeumorphicOutset` Styling

The `NeumorphicOutset` component has been refactored to provide more control over its styling, particularly margins.

-   **`containerStyle`**: Use this prop to apply styles to the outer container of the component. This is where you should apply layout styles like `margin` and `flex`.
-   **`contentStyle`**: Use this prop to apply styles to the inner content area of the component. This is where you should apply styles like `padding` and `alignItems`.
-   **`style` (deprecated)**: This prop is deprecated but is maintained for backward compatibility. It applies styles to the content area. Please use `containerStyle` or `contentStyle` for new development.

The default margin for `NeumorphicOutset` is `theme.spacing.s`.

### Theme

The `shadowRadius` for the neumorphic outset effect has been updated to `5` for both the light and dark themes. This change is located in `packages/ui/src/theme.ts`.

## Component Library (`packages/ui`)

### New Components

- **`Icon`**: A new `Icon` component has been created in `packages/ui/src/components/Icon.tsx`. It acts as a wrapper around `@expo/vector-icons` to provide a consistent way to use icons throughout the application.

### Component Updates

- **`IconRow`**: This component has been updated to be more flexible. It can now display text in addition to icons, making it reusable for displaying scores.
- **`ProgressBar`**: The `ProgressBar` component now supports a `isPassFail` mode, which is used for the walk component of the PT test. It also has a `withNeumorphic` prop to conditionally apply the neumorphic effect.
- **`ScoreDisplay`**: The `ScoreDisplay` component now has a `showBreakdown` prop to conditionally render the score breakdown section. It also handles the display of "Pass", "Fail", or "N/A" for the walk component.
- **`NumberInput` and `TimeInput`**: These components now have a `withNeumorphic` prop to conditionally apply the `NeumorphicInset` effect. This allows them to be used in different contexts, such as on the Best Score page.