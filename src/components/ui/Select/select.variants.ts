import { cva } from "class-variance-authority";

export const selectTriggerVariants = cva([
  "inline-flex min-h-12 w-full min-w-0",
  "items-center justify-between gap-4",
  "rounded-full border border-border",
  "bg-surface px-5 py-3",
  "text-foreground",
  "cursor-pointer",
  "transition-colors duration-200",
  "hover:border-brand-mineral",
  "data-[state=open]:border-brand-mineral-deep",
  "data-placeholder:text-foreground-muted",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-focus-ring",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "motion-reduce:transition-none",
]);

export const selectContentVariants = cva([
  "relative z-100",
  "min-w-[var(--radix-select-trigger-width)]",
  "max-h-[var(--radix-select-content-available-height)]",
  "overflow-hidden",
  "rounded-2xl border border-border",
  "bg-surface text-foreground",
  "shadow-lg",
]);

export const selectViewportVariants = cva(["p-2"]);

export const selectItemVariants = cva([
  "relative flex min-h-11",
  "items-center justify-between gap-4",
  "rounded-xl px-4 py-3",
  "outline-none select-none",
  "cursor-pointer",
  "transition-colors duration-200",
  "data-highlighted:bg-product-surface-subtle",
  "data-[state=checked]:text-product-accent",
  "data-disabled:pointer-events-none",
  "data-disabled:opacity-50",
  "motion-reduce:transition-none",
]);

export const selectIndicatorVariants = cva([
  "flex size-5 shrink-0",
  "items-center justify-center",
  "text-product-accent",
]);

export const selectIconVariants = cva([
  "size-4 shrink-0",
  "text-foreground-muted",
]);

export const selectScrollButtonVariants = cva([
  "flex h-7 items-center justify-center",
  "bg-surface text-foreground-muted",
]);
