import type { ReactNode } from "react";

export interface NavigationLinkProps {
  href: string;
  relatedPaths?: readonly string[];
  variant: "desktop" | "mobile";
  children: ReactNode;
}
