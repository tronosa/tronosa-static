import { cva } from "class-variance-authority";

export const desktopNavigationLinkVariants = cva(
  [
    "group relative inline-flex min-h-11 items-center",
    "text-sm font-medium",
    "transition-colors duration-200",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-4",
    "focus-visible:outline-(--nav-fg)",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      active: {
        true: "text-(--nav-hover)",
        false: "text-(--nav-fg) hover:text-(--nav-hover)",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
