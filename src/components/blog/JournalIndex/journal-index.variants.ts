import { cva } from "class-variance-authority";

export const journalIndexVariants = cva(["w-full text-brand-forest"]);

export const journalIndexHeaderVariants = cva([
  "mb-8 flex flex-col items-start",
  "gap-4 md:mb-12",
]);

export const journalIndexEyebrowVariants = cva([
  "flex items-center gap-3",
  "text-xs font-semibold uppercase",
  "tracking-[0.18em]",
]);

export const journalIndexAccentVariants = cva([
  "h-0.5 w-6 shrink-0 bg-brand-bronze",
]);

export const journalIndexTitleVariants = cva([
  "text-[clamp(2.25rem,5vw,4.5rem)]",
  "font-semibold leading-tight",
  "tracking-[-0.045em]",
]);

export const journalIndexDescriptionVariants = cva([
  "max-w-lg text-base leading-relaxed",
  "text-brand-graphite",
]);

export const journalIndexListVariants = cva([
  "border-t border-brand-forest/30",
  "divide-y divide-brand-forest/15",
]);

export const journalIndexItemLinkVariants = cva([
  "group grid min-w-0 items-center",
  "grid-cols-[auto_minmax(0,1fr)_auto]",
  "gap-4 py-6 md:gap-8 md:py-8",
  "rounded-sm",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-focus-ring",
]);

export const journalIndexItemNumberVariants = cva([
  "self-start pt-1",
  "text-xs font-semibold tabular-nums",
  "text-brand-bronze md:text-sm",
]);

export const journalIndexItemContentVariants = cva([
  "flex min-w-0 flex-col gap-2",
]);

export const journalIndexItemMetaVariants = cva([
  "flex flex-wrap items-center",
  "gap-x-3 gap-y-1",
  "text-xs font-medium uppercase",
  "tracking-wider",
]);

export const journalIndexItemTitleVariants = cva([
  "text-xl font-semibold leading-snug",
  "tracking-tight md:text-2xl",
  "wrap-break-word",
]);

export const journalIndexItemArrowVariants = cva([
  "flex size-11 shrink-0",
  "items-center justify-center rounded-full",
  "border border-brand-bronze",
  "transition-colors duration-300",
  "group-hover:bg-brand-forest",
  "group-hover:text-brand-ivory",
  "group-focus-visible:bg-brand-forest",
  "group-focus-visible:text-brand-ivory",
  "motion-reduce:transition-none",
]);
