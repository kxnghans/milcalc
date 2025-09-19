import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px",
      }}
    >
      {children}
    </div>
  );
}
