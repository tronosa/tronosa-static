import { cva } from "class-variance-authority";

export const catalogVariants = cva(["text-product-foreground"]);

export const catalogHeaderVariants = cva([
  "mb-8 flex max-w-3xl flex-col gap-4",
  "md:mb-12",
]);

export const catalogEyebrowVariants = cva([
  "flex items-center gap-3 uppercase",
  "before:h-px before:w-8 before:bg-current",
]);

export const catalogFiltersVariants = cva([
  "flex flex-col gap-4",
  "border-y border-product-border",
  "py-6 sm:flex-row sm:flex-wrap sm:items-end",
]);

export const catalogFilterFieldVariants = cva([
  "flex min-w-0 flex-1 flex-col gap-2",
  "sm:max-w-72",
]);

export const catalogResultsVariants = cva(["my-6"]);

export const catalogGridVariants = cva([
  "grid grid-cols-1 items-stretch gap-8",
  "sm:grid-cols-2 lg:grid-cols-3",
  "lg:gap-10",
]);

export const catalogCardVariants = cva([
  "group flex h-full min-w-0 flex-col gap-5",
]);

export const catalogCardMediaVariants = cva([
  "relative isolate overflow-hidden",
  "rounded-2xl md:rounded-3xl",
  "aspect-4/5",
  "bg-product-surface",
  "bg-[radial-gradient(ellipse_at_center,var(--surface)_0%,transparent_72%)]",
]);

export const catalogCardImageVariants = cva([
  "absolute inset-x-[20%] top-[15%] bottom-[20%]",
  "transition-transform duration-500 ease-out",
  "group-hover:scale-105",
  "motion-reduce:transition-none",
  "motion-reduce:transform-none",
]);

export const catalogCardCategoryVariants = cva([
  "absolute inset-x-5 top-5 z-10",
  "uppercase",
]);

export const catalogCardVolumeVariants = cva([
  "absolute inset-x-5 bottom-5 z-10",
]);

export const catalogCardContentVariants = cva([
  "flex flex-1 flex-col items-start gap-3",
  "border-b border-product-border pb-6",
]);

export const catalogCardActionVariants = cva(["mt-auto pt-3"]);

export const catalogPreviewVariants = cva([
  "mb-6 rounded-2xl",
  "border border-product-border",
  "bg-product-surface-subtle p-5",
]);

export const catalogEmptyVariants = cva([
  "rounded-2xl border border-product-border",
  "p-8 md:p-12",
]);
