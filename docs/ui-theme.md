# UI & Design System

MilCalc utilizes a custom "Neumorphic" (soft UI) design system implemented entirely in React Native within the `packages/ui` library.

## 1. Theming Infrastructure

The core of the visual language is defined in `packages/ui/src/theme.ts` and provided to the app via `ThemeContext.tsx`.

### 1.1 Color Palettes
The app supports fully dynamic Light and Dark modes.
-   **Primary**: Interactive elements (brand blue/teal).
-   **Background/Surface**: In neumorphism, the background color and the surface color of components are usually identical or very close to blend the component into the background.
-   **Status Colors**: `success`, `error`, and `ninetyPlus` (used for excellent PT scores).

### 1.2 Spacing & Typography
-   Strict adherence to standard spacing increments (`xs`, `s`, `m`, `l`, `xl`).
-   Typography is categorized semantically (`header`, `title`, `body`, `caption`) with predefined font sizes and weights. Avoid manual styling of text.

## 2. Neumorphism Implementation

Neumorphism relies on manipulating multiple drop shadows (a dark shadow for depth, a light shadow for highlight) to make UI elements look like they are extruded from or pressed into the background material.

### 2.1 NeumorphicOutset
Used for standard cards, buttons, and elevated surfaces.
-   Projects outward.
-   Uses complex shadow configurations (`shadowOffset`, `shadowOpacity`, `elevation` on Android).

### 2.2 NeumorphicInset
Used for text inputs, depressed toggle states, and progress bar tracks.
-   Appears sunken into the screen.

*Note: React Native's default shadow styling is limited on Android. The UI library carefully manages `elevation` and background colors to emulate these effects cross-platform. We utilize React Native Reanimated and Skia for high-performance visual effects where necessary.*

## 3. Core Components

All screens should be built by composing these shared primitives from `packages/ui`:

-   **`Card`**: A standard container utilizing `NeumorphicOutset`.
-   **`StyledTextInput` & `StyledPicker`**: Form inputs utilizing `NeumorphicInset` to indicate editable areas.
-   **`StyledButton` & `PillButton`**: Interactive touch targets. Include built-in loading states and disabled state styling.
-   **`ProgressBar`**: A custom visualizer used extensively in the PT Calculator.
    -   *Logic*: The `value` determines the physical fill width of the bar. The calculated `score` (passed separately) determines the bar's color (Excellent, Pass, Fail) via `@repo/utils/color-utils`.
-   **`DetailModal`**: The central engine for the contextual help system. Automatically parses markdown.

## 4. Keyboard Management

Mobile ergonomic standards are enforced via the `DismissKeyboardView` component. All scrollable forms must be wrapped in this view, ensuring that tapping anywhere outside an input field dismisses the on-screen keyboard cleanly.