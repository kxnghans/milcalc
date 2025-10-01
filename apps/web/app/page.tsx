/**
 * @file page.tsx
 * @description This file defines the main home page for the web application.
 */

import { Card } from "@repo/ui/card";

/**
 * The main home page component for the web application.
 * @returns {JSX.Element} The rendered home page.
 */
export default function HomePage() {
  return (
    <main>
      <Card>
        <h1>Hello from Web!</h1>
      </Card>
    </main>
  );
}