import { cva } from "class-variance-authority";

export const desktopNavigationLinkVariants = cva(
  [
    "group relative inline-flex min-h-11 items-center",
    "text-sm font-medium",
    "transition-colors duration-200",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-4",
    "focus-visible:outline-focus-ring",
  ],
  {
    variants: {
      active: {
        true: "text-foreground",
        false: "text-foreground-muted hover:text-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
