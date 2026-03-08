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

## 2. Token Marriage Rules

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

-   **Banned**: Inline `rgba()` strings. **Use**: `getAlphaColor(hex, alpha)`.
-   **Banned**: Hardcoded margin/padding values. **Use**: `theme.spacing` tokens.
-   **Banned**: Direct `Elevation` props on Android. **Use**: Wrapped primitives from `@repo/ui`.

## 5. Keyboard & Ergonomics

Mobile ergonomic standards are enforced via the `DismissKeyboardView` component. All scrollable forms must be wrapped in this view, ensuring that tapping anywhere outside an input field dismisses the on-screen keyboard cleanly. Avoid "keyboard entrapment" by ensuring all inputs are accessible within the scroll viewport.