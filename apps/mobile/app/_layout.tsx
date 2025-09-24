import { Slot } from "expo-router";
import { ThemeProvider } from "@repo/ui/src/contexts/ThemeContext";

export default function Layout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}