import { Slot } from "expo-router";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function Layout() {
  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
}