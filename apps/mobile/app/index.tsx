/**
 * @file index.tsx
 * @description This is the root entry point for the mobile application's routing.
 * Its sole purpose is to redirect the user to the main PT calculator screen when the app starts.
 */

import { Redirect } from 'expo-router';

/**
 * The root component of the app. It performs an immediate redirect to the pt-calculator screen.
 * @returns {JSX.Element} A Redirect component.
 */
export default function Index() {
  // Using <Redirect> from expo-router to navigate the user to the default screen.
  return <Redirect href="/pt-calculator" />;
}