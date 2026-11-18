import { cva } from "class-variance-authority";

export const mobileNavigationTriggerVariants = cva([
  "relative inline-flex size-11 shrink-0",
  "items-center justify-center",
  "rounded-full border border-border/70",
  "bg-surface/90 text-foreground",
  "backdrop-blur-md",
  "cursor-pointer",
  "transition-[background-color,border-color] duration-200",
  "hover:border-accent hover:bg-surface",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-focus-ring",
  "motion-reduce:transition-none",
]);

export const mobileNavigationPanelVariants = cva([
  "fixed inset-0 z-110",
  "flex h-dvh w-full flex-col",
  "overflow-hidden overflow-x-hidden",
  "rounded-none border-0",
  "bg-background text-foreground",
  "outline-none",
  "lg:hidden",
  "data-[state=open]:animate-nav-enter",
  "data-[state=closed]:animate-nav-exit",
  "motion-reduce:animate-none",
]);

export const mobileNavigationLinkVariants = cva(
  [
    "group flex min-h-18 w-full",
    "items-center justify-between gap-4",
    "border-b border-border/60 py-5",
    "text-[clamp(1.5rem,5vw,2.25rem)]",
    "font-medium leading-tight",
    "transition-colors duration-200",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-focus-ring",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      active: {
        true: "text-brand-forest",
        false: "text-foreground hover:text-brand-mineral",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
