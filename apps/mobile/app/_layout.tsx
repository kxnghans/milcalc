/**
 * @file _layout.tsx
 * @description This file defines the root layout for the mobile application.
 * According to Expo Router's conventions, this component wraps all other routes.
 * It's used here to provide the theme context to the entire app.
 */

import { Slot } from "expo-router";
import { ThemeProvider } from "@repo/ui/src/contexts/ThemeContext";

/**
 * The root layout component for the app.
 * It wraps the entire application in the `ThemeProvider` to ensure all
 * components have access to the theme.
 * @returns {JSX.Element} The rendered layout.
 */
export default function Layout() {
  return (
    <ThemeProvider>
      {/* The <Slot> component from expo-router renders the current child route. */}
      <Slot />
    </ThemeProvider>
  );
}