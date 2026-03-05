# Product Requirements Document (PRD) - MilCalc

## 1. Product Overview

### 1.1 Mission Statement
MilCalc is a comprehensive suite of tools designed to empower military personnel by providing accurate, accessible, and easy-to-use calculators for fitness, finance, and retirement planning.

### 1.2 Purpose
Simplify complex military-specific calculations—such as PT scores, monthly pay (including disability offsets), and long-term retirement benefits—into a single, polished mobile application. **Crucially, the app must function 100% offline to support deployed service members.**

## 2. Target Audience
-   **Active Duty Personnel:** Requiring regular PT score calculations and accurate monthly pay/tax estimations.
-   **Guard & Reserve Members:** Needing drill pay calculations and points-based retirement projections.
-   **Military Retirees/Veterans:** Interested in disability pay comparisons and retirement benefit tracking.

## 3. Feature Categorization by User Intent

We distinguish between features based on the user's emotional and operational state during use.

### 3.1 Competitive & Critical (High Precision)
These features are used when the user is "on the clock" or facing official evaluations. UI must be high-contrast, input-efficient, and error-proof.

*   **Air Force PT Calculator**:
    *   *Intent*: Competitive. Users are often stressed or physically exhausted while checking scores.
    *   *Requirement*: Zero-latency calculation. Instant visual feedback (Red/Green) on pass/fail status. Automatic altitude detection.
*   **Best Score Tracker**:
    *   *Intent*: Achievement-oriented. Users are tracking personal growth and potential.
    *   *Requirement*: Persistence across sessions. Clear "Record" indicators.

### 3.2 Exploratory & Financial (Low Friction / Planning)
These features are used for long-term planning and "what-if" scenarios. UI should be detailed, informative, and focused on clarity over speed.

*   **Pay Calculator**:
    *   *Intent*: Financial planning. Users are comparing career moves or analyzing tax implications.
    *   *Requirement*: Detailed breakdown of allowances (BAH/BAS) and deductions (FICA/Taxes). VA Disability comparison mode.
*   **Retirement Calculator**:
    *   *Intent*: Strategic planning. Users are projecting 20+ years into the future.
    *   *Requirement*: Multi-plan support (High-3/BRS). Multi-year TSP growth forecasting. Reserve point conversion logic.

### 3.3 Educational & Supportive
*   **Contextual Help System**:
    *   *Intent*: Learning. Users are seeking the "Why" behind a number.
    *   *Requirement*: Markdown support for readability. Deep-linking from specific calculation components.

## 4. Technical Stack

-   **Frontend:** React Native (Expo), TypeScript.
-   **Design:** Shared UI package featuring a Neumorphic design system.
-   **Backend:** Supabase (PostgreSQL, Auth).
-   **Offline Persistence:** `expo-sqlite` and `@tanstack/react-query-persist-client`.
-   **Architecture:** Turborepo managed pnpm monorepo.

## 5. User Experience (UX) Standards

-   **100% Offline Ready:** Functions immediately without requiring a network connection on first launch (via bundled seed data).
-   **Interactive Physics**: Utilize `react-native-reanimated` for "tactile" feedback on neumorphic buttons and sliders.
-   **Debounced Inputs**: Prevents UI jitter by delaying heavy calculations (like complex tax engines) until user input pauses (500ms).
-   **Visual Hierarchy**: Progress bars intelligently color-code themselves based on official military scoring categories (Excellent: Blue/Green, Pass: Green, Fail: Red).