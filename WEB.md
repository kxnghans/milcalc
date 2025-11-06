# MilCalc Web Application Development Plan

This document outlines the strategic plan for building the web-based version of the MilCalc application.

## 1. Project Goal

The primary objective is to create a web-based version of the existing MilCalc mobile application, cloning its functionality while adapting the user interface for a landscape-oriented, desktop-first experience. The web application will feature a persistent sidebar for navigation, a header for displaying primary calculation results, and a multi-column layout for the main content area of each calculator.

## 2. High-Level Architecture

The web application will be built using Next.js and will leverage the existing shared packages in the monorepo:

*   **`packages/ui`**: Will contain all reusable UI components, which will be made compatible with both web and mobile.
*   **`packages/utils`**: Will provide all the core logic for the calculators, including state management hooks and data fetching functions.

The main layout will consist of:

*   A **Sidebar** for navigation, using the `IconRow` component.
*   A **Header** to display the `ScoreDisplay` or `PayDisplay` components.
*   A **Main Content Area** with a multi-column layout for the calculator inputs and results.

## 3. Development Plan

### Phase 1: Foundation and Component Migration

1.  **Web App Structure:**
    *   Create a `components` directory inside `apps/web/app`.
    *   Implement the main layout in `apps/web/app/layout.tsx` us
    *   ing CSS Grid or Flexbox.
    *   Create a `Sidebar` component in `apps/web/app/components/Sidebar.tsx`.
    *   Create a `Header` component in `apps/web/app/components/Header.tsx`.
2.  **Component Migration:**
    *   Migrate all reusable components from `apps/mobile/app/components` to `packages/ui/src/components`.
    *   Update all imports in the mobile app to reference the new location of the migrated components.
3.  **Web Compatibility:**
    *   Ensure all components in `packages/ui` are web-compatible, using `react-native-web` or creating web-specific implementations where necessary.

### Phase 2: PT Calculator Page

1.  **Page and Layout:**
    *   Create the page file at `apps/web/app/pt-calculator/page.tsx`.
    *   Implement a four-column layout for the body.
2.  **Component Integration and State Management:**
    *   Integrate the `usePtCalculatorState` hook.
    *   Render the `ScoreDisplay` in the header.
    *   Populate the columns with the `Demographics`, `AltitudeAdjustmentComponent`, `StrengthComponent`, `CoreComponent`, and `CardioComponent` components.

### Phase 3: Pay Calculator Page

1.  **Page and Components:**
    *   Create the page file at `apps/web/app/pay-calculator/page.tsx`.
    *   Create new, reusable components in `packages/ui` for the pay calculator inputs.
2.  **Layout and State:**
    *   Implement a three-column layout for the body.
    *   Integrate the `usePayCalculatorState` hook.
    *   Render the `PayDisplay` in the header.
    *   Populate the columns with the new components.

### Phase 4: Retirement Calculator Page

1.  **Investigation and Component Creation:**
    *   Investigate the existing retirement calculator in the mobile app.
    *   Create the necessary input components in `packages/ui`.
2.  **Page and Layout:**
    *   Create the page file at `apps/web/app/retirement-calculator/page.tsx`.
    *   Design and implement a multi-column layout.
3.  **Integration:**
    *   Integrate the `useRetirementCalculatorState` hook.
    *   Render the `PayDisplay` in the header and the new input components in the body.

## 4. Testing Strategy

*   **Unit and Integration Testing:** Each new or migrated component will be tested to ensure it functions correctly.
*   **End-to-End Testing:** An end-to-end testing suite will be developed to simulate user flows for each calculator.
*   **Cross-Browser and Responsiveness Testing:** Manual testing will be performed across different browsers and screen sizes.

## 5. Potential Challenges

*   **Styling and Responsiveness:** Adapting the mobile-first styles to a responsive web layout will require careful CSS management.
*   **Component Reusability:** If a component requuires refactoring just create a new one.
*   **Component Reorg:** Do not move any existing components location that would break the imports of the mobile app
  

I have set up the environment variables for both the web and mobile applications. The `.gitignore` file already includes `.env` and `.env.local`, so your keys will not be committed to the repository.

You can now proceed with running the application.

### 1. Understanding the Goal

The objective is to expand the web application (`apps/web`) to mirror the functionality of the existing mobile application (`apps/mobile`). This involves creating a responsive, landscape-oriented web design that includes a sidebar for navigation, a header for displaying results (like scores or pay), and a multi-column layout for the main content. The layout specifications for the PT, Pay, and Retirement calculator pages have been provided. A key constraint is to avoid refactoring existing shared components in any way that would break the mobile app; new web-specific components should be created as needed.

### 2. Investigation & Analysis

To formulate a successful strategy, a thorough investigation of the existing codebase is required. The following steps will be taken:

*   **Analyze the Web App's Current State:**
    *   Read `apps/web/app/layout.tsx` and `apps/web/app/page.tsx` to understand the fundamental structure and layout of the web application.
    *   Examine `apps/web/app/pt-calculator/page.tsx` to see how pages are currently constructed.
    *   Review `apps/web/package.json` and `apps/web/tsconfig.json` to understand dependencies, scripts, and TypeScript configurations specific to the web app.

*   **Analyze the Mobile App's Structure:**
    *   Read `apps/mobile/app/(tabs)/_layout.tsx` to understand the mobile app's navigation structure (tab bar).
    *   Examine the main feature pages: `apps/mobile/app/(tabs)/pt-calculator.tsx`, `apps/mobile/app/(tabs)/pay-calculator.tsx`, and `apps/mobile/app/(tabs)/retirement-calculator.tsx` to understand their component composition and layout.
    *   List the components in `apps/mobile/app/components/` to identify mobile-specific UI elements.

*   **Analyze Shared Code (`packages`):**
    *   Review the contents of `packages/ui/src/components/` to catalog the available shared UI components.
    *   Study the custom hooks in `packages/ui/src/hooks/`, particularly the state management hooks (`usePtCalculatorState`, `usePayCalculatorState`, `useRetirementCalculatorState`), which are critical for feature implementation.
    *   Examine the utility functions in `packages/utils/src/`, including calculators and Supabase API interactions, to understand the core business logic.

*   **Critical Questions to Answer:**
    *   **Navigation:** How should the sidebar navigation be implemented in the Next.js app router? Does a reusable `IconRow` component exist that can be adapted, or does a new component need to be built?
    *   **Styling & Theming:** How is styling handled across the monorepo? How can the existing neumorphic design be adapted for a responsive web layout without modifying shared components? How will theme switching (light/dark mode) be implemented for the web?
    *   **Component Strategy:** Which components from `packages/ui` can be directly reused? For components that require different layouts on the web, what is the best approach to create web-specific versions in `apps/web/components` that wrap or compose existing shared components?
    *   **Layout Implementation:** What is the best way to implement the specified multi-column layouts (e.g., CSS Grid, Flexbox)?

### 3. Proposed Strategic Approach

The implementation will be broken down into phased, iterative stages:

*   **Phase 1: Establish the Web Application Shell**
    1.  **Create the Main Layout:** Modify `apps/web/app/layout.tsx` to establish the primary structure, including a dedicated area for a sidebar and a main content view.
    2.  **Implement the Sidebar:** Create a new `Sidebar` component within `apps/web/components/`. This component will handle navigation between the different calculators. It will be styled for a vertical, landscape-friendly orientation.
    3.  **Implement Theme Switching:** Create a theme provider in `apps/web/app/providers.tsx` to manage light and dark modes, mirroring the functionality of the mobile app's `ThemeContext`.

*   **Phase 2: Build the PT Calculator Page**
    1.  **Create the Page File:** Set up the page at `apps/web/app/pt-calculator/page.tsx`.
    2.  **Structure the Page:** Use the `usePtCalculatorState` hook to manage the page's logic.
    3.  **Build the Header:** The header section will prominently feature the `ScoreDisplay` component.
    4.  **Construct the Multi-Column Body:**
        *   **Column 1 (Inputs):** Create a web-specific `PTCalculatorInputs` component to house the `Demographics` and `AltitudeAdjustmentComponent`.
        *   **Columns 2, 3, & 4 (Exercise Components):** Create new web-specific components (`WebStrengthComponent`, `WebCoreComponent`, `WebCardioComponent`) that arrange the input fields from the existing shared components (`StrengthComponent`, `CoreComponent`, `CardioComponent`) in a vertical stack suitable for a column.

*   **Phase 3: Build the Pay Calculator Page**
    1.  **Create the Page File:** Set up the page at `apps/web/app/pay-calculator/page.tsx`.
    2.  **Structure the Page:** Use the `usePayCalculatorState` hook for state management.
    3.  **Build the Header:** The header will feature the `PayDisplay` component.
    4.  **Construct the Multi-Column Body:**
        *   **Column 1 (Inputs):** Create a `PayCalculatorInputs` component for primary inputs (e.g., Pay Grade, YOS, Tax Status).
        *   **Column 2 (Special Duty & Deductions):** Create components to manage special duty pay and deductions, each in its own column.

*   **Phase 4: Build the Retirement Calculator Page**
    1.  **Create the Page File:** Set up the page at `apps/web/app/retirement-calculator/page.tsx`.
    2.  **Structure the Page:** Use the `useRetirementCalculatorState` hook.
    3.  **Build the Header:** The header will also use the `PayDisplay` component.
    4.  **Construct the Multi-Column Body:** Based on an analysis of the mobile app, group related inputs into logical columns to create an intuitive user experience.

### 4. Verification Strategy

To ensure the successful implementation of the plan and prevent regressions, the following verification steps will be essential:

*   **Visual and Functional Testing:** Manually test each new page across modern web browsers (Chrome, Firefox, Safari) and at various screen sizes to confirm responsive design and correct functionality.
*   **No Regressions in Mobile:** After each phase, run the mobile application to guarantee that no changes to shared packages have introduced bugs or broken existing features.
*   **Code Quality Checks:** Continuously run linting and type-checking (`pnpm lint`, `pnpm tsc`) to maintain code quality and type safety.
*   **User Flow Testing:** Perform end-to-end tests of the user flows for each calculator on the web app to ensure the calculations are correct and the user experience is seamless.

### 5. Anticipated Challenges & Considerations

*   **Responsive Styling:** The primary challenge will be adapting the mobile-first neumorphic styles to a responsive web layout without altering the shared UI components. This will necessitate careful use of CSS media queries and potentially creating wrapper components to apply web-specific styles.
*   **Component Duplication vs. Composition:** Adhering to the "no refactoring" rule for shared components means a careful strategy is needed. The plan will favor creating new, web-specific components in `apps/web/components` that compose and style the shared components from `packages/ui`, rather than duplicating logic.
*   **State Management in Next.js:** While the shared hooks are designed to be environment-agnostic, they must be tested to ensure they behave as expected within the Next.js server-side and client-side rendering lifecycle.
*   **Maintaining Consistency:** Ensuring a consistent user experience and design language between the mobile and web applications will require careful attention to detail throughout the development process.