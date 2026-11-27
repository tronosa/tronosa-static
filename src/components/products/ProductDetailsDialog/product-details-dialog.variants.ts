import { cva } from "class-variance-authority";

export const productDialogTriggerVariants = cva([
  "w-fit max-w-full",
  "border-product-accent",
  "text-product-accent",
  "hover:border-product-accent",
  "hover:bg-product-accent",
  "hover:text-primary-foreground",
]);

export const productDialogOverlayVariants = cva([
  "fixed inset-0 z-100",
  "bg-dialog-overlay/60",
]);

export const productDialogContentVariants = cva([
  "fixed left-1/2 top-1/2 z-101",
  "w-[calc(100%-2rem)] max-w-2xl",
  "max-h-[calc(100dvh-2rem)]",
  "-translate-x-1/2 -translate-y-1/2",
  "overflow-y-auto overscroll-contain",
  "rounded-2xl md:rounded-3xl",
  "bg-dialog-surface text-product-foreground",
  "p-6 md:p-10",
  "shadow-2xl",
  "outline-none",
]);

export const productDialogHeaderVariants = cva([
  "flex items-center justify-between gap-4",
  "mb-6",
]);

export const productDialogCloseVariants = cva([
  "flex size-10 shrink-0",
  "items-center justify-center",
  "rounded-full border border-product-border",
  "cursor-pointer",
  "transition-colors duration-200",
  "hover:bg-product-surface",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-focus-ring",
  "motion-reduce:transition-none",
]);

export const productDialogIntroVariants = cva(["flex flex-col gap-4"]);

export const productDialogFactsVariants = cva([
  "my-8 grid grid-cols-1 gap-3",
  "sm:grid-cols-2",
]);

export const productDialogFactVariants = cva([
  "flex min-w-0 flex-col gap-2",
  "rounded-card",
  "bg-product-surface-subtle",
  "p-5",
]);

export const productDialogSectionsVariants = cva(["flex flex-col"]);

export const productDialogSectionVariants = cva([
  "flex flex-col gap-3",
  "border-t border-product-border",
  "py-6",
]);

export const productDialogFooterVariants = cva(["mt-4 flex justify-end"]);
