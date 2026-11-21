import type { ReactNode } from "react";

export const MAIN_CONTENT_ID = "main-content";

interface MainProps {
  children: ReactNode;
}

export function Main({ children }: MainProps) {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      {children}
    </main>
  );
}
