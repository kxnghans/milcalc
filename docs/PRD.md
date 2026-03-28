# Product Requirements Document (PRD) - MilCalc

## 1. Product Mission & Vision

MilCalc is a professional-grade calculation suite designed specifically for US military personnel. Its mission is to deliver high-precision, offline-reliable tools for fitness evaluations, financial planning, and retirement forecasting—all wrapped in a cohesive, neumorphic user interface.

## 2. Core Value Propositions

-   **Zero-Latency & Offline-First**: Guaranteed to function in flightlines, bunkers, and deployment zones with 100% reliability without network connectivity.
-   **High-Fidelity Calculations**: Pure-logic engines that precisely mirror Air Force and DOD standards, removing ambiguity from critical calculations.
-   **Tactile Neumorphic UI**: A custom design system that provides a tactile, "physics-based" experience for on-the-go interactions.

## 3. User Segments

| Role | Primary Intent | Critical Feature |
| :--- | :--- | :--- |
| **Active Duty** | Compliance & Career | PT Score Calculator (Competitive) |
| **Guard & Reserve** | Financial Tracking | Drill Pay & Point-based Retirement |
| **Retiree / Veteran** | Wealth Management | VA Disability Offset & Pension Analysis |

## 4. Logical Domains & Features

### 4.1 Fitness: PT & Performance Tracker
-   **Air Force PT Standard**: Real-time scoring for all muscular and cardio-respiratory events, aligned with **DAFMAN 36-2905 (2025/2026)**.
-   **Altitude Adaptation**: Integrated lookup for altitude offsets (HAMR, 1.5M, 2KM Walk).
-   **Health Risk Mapping**: Automated calculation and visualization of health risk categories for WHtR and Cardio components.
-   **Personal Bests**: Persistent local tracking of achievement milestones.

### 4.2 Finance: Active & Reserve Pay
-   **Consolidated Pay Engine**: Breakdown of Basic Pay (2025), BAH (Housing 2026), and BAS (Subsistence 2025).
-   **Drill Pay Projections**: Prorated calculations for Guard and Reserve drills.
-   **Tax Simulation & Overrides**: Accurate FICA and withholding estimates with the ability for users to manually override calculated taxes for precise modeling.
-   **VA Disability Integration**: Real-time "Offset" logic comparing military pay vs. tax-free VA compensation.

### 4.3 Strategy: Retirement & TSP Growth
-   **Plan Modeling**: High-3 vs. BRS pension comparisons.
-   **TSP Forecasting**: Investment growth projections based on contributions, BRS matching, and user-defined rates of return.
-   **Retirement Age Calculator**: Projects eligibility dates for Active (including Break in Service) and "Reduced Age" for Guard/Reserve (based on qualifying deployments).
-   **VA Integration**: Models "Concurrent Receipt" (CRDP/CRSC) where VA disability pay is added to the pension for eligible retirees.

## 5. Non-Functional Requirements (UX Standards)

-   **Responsiveness**: Main UI thread must maintain 60FPS during active calculation.
-   **Accessibility**: High-contrast ratios (>4.5:1) for all data-rich components.
-   **Privacy**: Zero collection of PII. All sensitive inputs remain on-device only.
-   **Persistence**: Calculation state must survive app reloads and background terminations via SQLite persistence.

## 6. Technical Foundations

-   **Architecture**: Turborepo / pnpm Monorepo.
-   **Stack**: Expo (React Native), TypeScript, TanStack Query, `expo-sqlite`.
-   **Backend**: Supabase (Metadata Sync Tier).
-   **UX Pattern**: Context-Driven UI (Global Overlays via `OverlayContext`).
-   **UI Core**: Standardized `MainCalculatorLayout` and `SmartIconRow` for all calculator screens.
