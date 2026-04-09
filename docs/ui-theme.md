# UI & Design System

MilCalc utilizes a custom "Neumorphic" (soft UI) design system implemented entirely in React Native within the `packages/ui` library.

## 1. Interactive Physics

Neumorphism is not just a static style; it is a tactile philosophy. The "physics" of our UI must feel consistent to provide a high-quality UX.

### 1.1 Motion & Depth
-   **Elevation Curves**: When a button is pressed, it should transition from `NeumorphicOutset` to `NeumorphicInset` using a `bezier(0.4, 0, 0.2, 1)` easing curve over 150ms.
-   **Tactile Feedback**: Every successful "Set" action (e.g., locking in a PT score) should trigger a `light` haptic feedback pulse on supported devices.

### 1.2 Interactive Hierarchy
-   **Primary (Elevated)**: Actionable cards and primary buttons. They "float" above the surface.
-   **Secondary (Sunken)**: Inputs, progress tracks, and inactive toggles. They are "etched" into the surface.

## 2. Design Tokens (Single Source of Truth)

To eliminate "magic numbers" and ensure accessibility, we enforce strict adherence to the tokens defined in `packages/ui/src/theme.ts`.

### 2.1 Color Palette
| Token | Light Value | Dark Value | Intent |
| :--- | :--- | :--- | :--- |
| `primary` | `#00BFA5` (Teal) | `#00BFA5` (Teal) | Brand / Primary Action |
| `secondary` | `#0073ed` | `#006ce0` | Secondary Action / Links |
| `background` | `#bbbfc6` | `#141415` | Main Surface |
| `surface` | `#e5e5ea` | `#2c2c2f` | Card Surface / Elevated |
| `text` | `#0065d1` | `#268ffe` | Subtitles / Secondary Text |
| `primaryText` | `#00251A` | `#00251A` | Primary Content / High Contrast |
| `success` | `#00C853` | `#00C853` | Pass / Positive |
| `error` | `#d92f20` | `#d93d2f` | Fail / Critical |
| `warning` | `#FFD600` | `#FFD600` | Cautionary States |

### 2.2 Typography
| Type | Size | Weight |
| :--- | :--- | :--- |
| **Hero** | 40 | 700 |
| **Header** | 20 | 700 |
| **Title** | 17 | 700 |
| **Subtitle** | 14 | 600 |
| **Label** | 15 | 400 |
| **Body** | 13 | 400 |
| **BodyBold** | 13 | 500 |
| **Caption** | 11 | 400 |

### 2.3 Neumorphic Properties (Outset)
| Property | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| `shadowOpacity` | 0.2 | 0.5 |
| `highlightOpacity` | 0.9 | 0.15 |
| `shadowRadius` | 3.5 | 3 |
| `elevation` | 10 | 10 |

## 3. Token Marriage Rules

To eliminate "magic numbers" and ensure accessibility, we enforce strict pairings between tokens.

### 2.1 Color & Surface
-   **The Background Rule**: The `surface` color MUST be the same hex value as the `background` color to enable the neumorphic shadow blending effect.
-   **Contrast Mandate**: Text colors (`textPrimary`, `textSecondary`) must maintain a minimum 4.5:1 contrast ratio against the `surface` color.

### 2.2 Spacing & Radii
-   **Corner Continuity**: All `Card` and `Button` components must use the `borderRadius.lg` (16px) token to maintain a consistent "organic" feel.
-   **The "8pt" Grid**: All layout margins and paddings must be multiples of 8 (e.g., `spacing.m` = 16px, `spacing.l` = 24px).

## 3. Neumorphism Implementation

Neumorphism relies on manipulating multiple drop shadows (a dark shadow for depth, a light shadow for highlight) to make UI elements look like they are extruded from or pressed into the background material.

### 3.1 Shadow Logic (The "Sun" Principle)
We assume a light source at the top-left (10:30 position).
-   **Top-Left Shadow**: Light highlight (White at 50% opacity).
-   **Bottom-Right Shadow**: Dark depth (Black at 15% opacity).

### 3.2 Android Rendering Quirks & Solutions
React Native's native shadow properties (`shadowColor`, `shadowOffset`, etc.) do not render on Android. Instead, Android uses a hardware-accelerated `elevation` property, which behaves unpredictably with transparent backgrounds and complex nested layouts typical of Neumorphism.

To maintain visual parity and avoid artifacts:
1.  **Avoid Blurry Press Bleed**: Do not use `TouchableOpacity` on small elevated elements (like Icon buttons). The default fade applies to the entire container, causing the underlying Android `elevation` shadow to "bleed" through as an ugly gray halo.
    *   **Solution**: Use `<Pressable>` and apply the opacity change *only* to the foreground content (the icon or text) via the `({ pressed })` render function, leaving the container fully opaque. Or, explicitly pass `activeOpacity={1}` if using `TouchableOpacity` and no visual feedback is desired.
2.  **Eliminate "Pill Borders"**: High `elevation` values on small, deeply rounded containers can cause hard gray artifact lines resembling borders.
    *   **Solution**: For small action buttons or list items on Android, consider neutralizing the elevation entirely (`elevation={0}`) if the aesthetic suffers, relying instead on background contrast.
3.  **Prevent Text Clipping**: When rendering text inside custom layout containers (especially in rows like segmented selectors), Android's default font padding can cause clipping if margins and paddings are tightly matched to emulate a box-model layout.
    *   **Solution**: Apply `includeFontPadding: false` to text styles rendered inside strict neumorphic boundaries.

## 4. Banned Practices

-   **Banned**: Inline `rgba()` strings or manually manipulating hex opacities. **Mandatory**: Use `getAlphaColor(hex, alpha)` from `ThemeContext`. Hex strings are only allowed as arguments to this utility.
-   **Banned**: Hardcoded margin/padding values. **Use**: `theme.spacing` tokens.
-   **Banned**: Direct `Elevation` props on Android. **Use**: Wrapped primitives from `@repo/ui`.
-   **Banned**: Redundant theme icon logic or manual modal state (`isVisible`, `contentKey`) in screen files. **Use**: `MainCalculatorLayout`, `SmartIconRow`, and global overlay hooks (`useOverlay`).
-   **Banned**: Unstable `StyleSheet.create` calls inside component bodies or un-memoized context values. **Use**: `useMemo` or move styles outside the component. Use `useCallback` for context setters.

## 5. Composition Primitives

To maintain structural consistency across the "Delivery Domain," we use high-level composition components.

### 5.1 MainCalculatorLayout
A root-level wrapper for all calculator screens located in `apps/mobile/components/MainCalculatorLayout.tsx`.
-   **Structure**: `View` > `ScreenHeader` > `DismissKeyboardView` > `Card` (Summary) > `SmartIconRow` > `Card` (Inputs) > `KeyboardAwareScrollView`.
-   **Props**: `title`, `isLoading`, `summaryContent`, `inputContent`, `actions`, `onReset`, `onHelp`, `onDocument`.

### 5.2 SmartIconRow
An intelligent version of `IconRow` that internally consumes `ThemeContext` and `OverlayContext`.
-   **Automatic Actions**: Handles 'reset', 'help' (triggers `openHelp`), 'document' (triggers `openDocuments`), 'theme' (toggles system theme), and navigation to 'best_score' or 'home'.
-   **Usage**: `<SmartIconRow actions={['reset', 'help', 'document', 'theme']} onReset={...} />`.

### 5.3 Composite Inputs
Composite inputs (inputs with left/right prefix elements like an `ExemptButton` or `$`) use a flexible container model to prevent early text wrapping while maintaining a specific visual center:
-   **Structure**: Container split relies on `flex: 1` (left prefix box) and `flex: 2` (right flexible box). 
-   **Alignment Offset**: To center text naturally at the 35% mark of the overall parent container instead of the 50% mark of the right container, the `TextInput` applies `textAlign: 'center'` combined with a relative translation `left: '-15%'` when a left-side prefix exists. Do not use an artificial trailing spacer (`flex: 30`) or `textAlign: 'left'`, as both clip long text values.

## 6. Keyboard & Ergonomics

Mobile ergonomic standards are enforced via the `DismissKeyboardView` component. All scrollable forms must be wrapped in this view, ensuring that tapping anywhere outside an input field dismisses the on-screen keyboard cleanly. Avoid "keyboard entrapment" by ensuring all inputs are accessible within the scroll viewport.