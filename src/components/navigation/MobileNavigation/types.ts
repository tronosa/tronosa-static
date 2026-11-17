import type { ReactNode } from "react";

export type MobileNavigationDialogProps = {
  children: ReactNode;
  title: string;
  openLabel: string;
  closeLabel: string;
};
