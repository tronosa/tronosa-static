import { cva } from "class-variance-authority";

export const relatedPostsVariants = cva([
  "relative w-full",
  "text-brand-forest",
  "border-t border-current/10",
]);

export const relatedPostsHeaderVariants = cva([
  "mb-8 flex max-w-4xl flex-col",
  "items-start gap-4",
  "md:mb-12 md:gap-5",
]);

export const relatedPostsEyebrowVariants = cva([
  "flex items-center gap-3",
  "text-xs font-semibold uppercase",
  "tracking-[0.18em]",
]);

export const relatedPostsAccentVariants = cva([
  "h-0.5 w-6 shrink-0",
  "bg-brand-bronze",
]);

export const relatedPostsTitleVariants = cva([
  "max-w-4xl text-balance",
  "text-[clamp(2rem,4vw,4rem)]",
  "font-semibold leading-[1.06]",
  "tracking-[-0.045em]",
]);

export const relatedPostsListVariants = cva([
  "w-full min-w-0",
  "divide-y divide-brand-forest/15",
  "border-y border-brand-forest/20",
]);

export const relatedPostsItemVariants = cva([
  "group relative grid min-w-0",
  "grid-cols-[auto_minmax(0,1fr)_auto]",
  "items-center gap-4 py-6",
  "md:gap-8 md:py-8",
  "lg:gap-10 lg:py-10",
  "rounded-sm",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-focus-ring",
]);

export const relatedPostsItemNumberVariants = cva([
  "min-w-6 self-start pt-1",
  "md:min-w-10",
  "text-xs font-semibold tabular-nums",
  "text-brand-forest md:text-sm",
  "transition-colors duration-300",
  "group-hover:text-brand-bronze",
  "group-focus-visible:text-brand-bronze",
  "motion-reduce:transition-none",
]);

export const relatedPostsItemContentVariants = cva([
  "flex min-w-0 flex-col",
  "items-start gap-2 md:gap-3",
]);

export const relatedPostsItemMetaVariants = cva([
  "flex flex-wrap items-center",
  "gap-x-3 gap-y-1",
  "text-[0.625rem] sm:text-xs",
  "font-medium uppercase tracking-wider",
]);

export const relatedPostsItemMetaSeparatorVariants = cva([
  "size-1 shrink-0 rounded-full",
  "bg-brand-bronze",
]);

export const relatedPostsItemTitleVariants = cva([
  "max-w-3xl text-balance wrap-break-word",
  "text-[clamp(1.25rem,2.5vw,2.25rem)]",
  "font-semibold leading-[1.15]",
  "tracking-[-0.035em]",
]);

export const relatedPostsItemDescriptionVariants = cva([
  "max-w-2xl wrap-break-word",
  "text-sm leading-relaxed",
  "text-brand-graphite md:text-base",
]);

export const relatedPostsItemIconVariants = cva([
  "flex size-10 shrink-0",
  "items-center justify-center",
  "rounded-full border border-brand-bronze",
  "md:size-12 lg:size-14",
  "transition-colors duration-300",
  "group-hover:border-brand-forest",
  "group-hover:bg-brand-forest",
  "group-hover:text-brand-ivory",
  "group-focus-visible:border-brand-forest",
  "group-focus-visible:bg-brand-forest",
  "group-focus-visible:text-brand-ivory",
  "motion-reduce:transition-none",
]);

export const relatedPostsItemArrowVariants = cva(["size-4 shrink-0 md:size-5"]);
