import { cva } from "class-variance-authority";

export const featuredChapterVariants = cva([
  "relative w-full",
  "text-brand-forest",
]);

export const featuredChapterHeaderVariants = cva([
  "mb-6 flex flex-wrap items-center",
  "justify-between gap-4",
  "border-b border-brand-forest/15",
  "pb-4 md:mb-8",
]);

export const featuredChapterEyebrowVariants = cva([
  "flex items-center gap-3",
  "text-xs font-semibold uppercase",
  "tracking-[0.16em]",
]);

export const featuredChapterAccentVariants = cva([
  "h-0.5 w-6 shrink-0",
  "bg-brand-bronze",
]);

export const featuredChapterLabelVariants = cva([
  "text-xs font-medium uppercase",
  "tracking-[0.12em]",
]);

export const featuredChapterLinkVariants = cva(
  [
    "group relative grid min-w-0",
    "items-center gap-8",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-8",
    "focus-visible:outline-focus-ring",
  ],
  {
    variants: {
      hasImage: {
        true: [
          "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]",
          "lg:gap-12 xl:gap-20",
        ],
        false: "max-w-4xl",
      },
    },
    defaultVariants: {
      hasImage: true,
    },
  },
);

export const featuredChapterVisualVariants = cva(["relative min-w-0"]);

export const featuredChapterMediaVariants = cva([
  "relative isolate w-full overflow-hidden",
  "aspect-5/4",
  "rounded-2xl md:rounded-3xl",
  "bg-brand-forest/5",
  "sm:aspect-16/10",
  "lg:aspect-auto",
  "lg:h-[clamp(20rem,32vw,28rem)]",
]);

export const featuredChapterImageVariants = cva([
  "size-full object-cover",
  "transition-transform duration-700",
  "ease-[cubic-bezier(0.22,1,0.36,1)]",
  "motion-safe:group-hover:scale-[1.045]",
  "motion-safe:group-focus-visible:scale-[1.045]",
  "motion-reduce:transition-none",
]);

export const featuredChapterMediaFrameVariants = cva([
  "pointer-events-none absolute inset-3",
  "rounded-sm md:rounded-xl",
  "border border-white/30",
  "transition-colors duration-500",
  "group-hover:border-white/60",
  "motion-reduce:transition-none",
]);

export const featuredChapterMediaFooterVariants = cva([
  "flex items-center justify-between",
  "gap-4 py-3",
]);

export const featuredChapterMediaLabelVariants = cva([
  "text-[0.625rem] font-medium uppercase",
  "tracking-[0.18em] sm:text-xs",
]);

export const featuredChapterMediaAccentVariants = cva([
  "h-0.5 w-8 shrink-0",
  "bg-brand-bronze",
]);

export const featuredChapterContentVariants = cva(
  ["relative flex min-w-0 flex-col", "items-start gap-5", "md:gap-6"],
  {
    variants: {
      hasImage: {
        true: "lg:py-4",
        false: "py-6",
      },
    },
    defaultVariants: {
      hasImage: true,
    },
  },
);

export const featuredChapterNumberRowVariants = cva([
  "flex w-full items-end gap-5",
]);

export const featuredChapterNumberVariants = cva([
  "shrink-0 font-medium leading-[0.85]",
  "text-[clamp(4rem,7vw,7rem)]",
  "tracking-[-0.08em]",
  "text-brand-bronze",
  "tabular-nums",
]);

export const featuredChapterNumberLineVariants = cva([
  "mb-1 h-px flex-1",
  "bg-brand-bronze/40",
]);

export const featuredChapterMetaVariants = cva([
  "flex flex-wrap items-center",
  "gap-x-3 gap-y-2",
  "text-xs font-semibold uppercase",
  "tracking-widest",
]);

export const featuredChapterMetaSeparatorVariants = cva([
  "size-1 shrink-0 rounded-full",
  "bg-brand-bronze",
]);

export const featuredChapterTitleVariants = cva([
  "max-w-3xl text-balance wrap-break-word",
  "text-[clamp(2rem,3.8vw,3.75rem)]",
  "font-semibold leading-[1.06]",
  "tracking-[-0.045em]",
]);

export const featuredChapterDescriptionVariants = cva([
  "max-w-lg text-base leading-relaxed",
  "text-brand-graphite",
  "md:text-lg",
]);

export const featuredChapterCtaVariants = cva([
  "mt-1 flex w-full items-center",
  "justify-between gap-5",
  "border-t border-brand-forest/15",
  "pt-5 md:pt-6",
  "text-sm font-semibold",
]);

export const featuredChapterIconVariants = cva([
  "flex size-12 shrink-0",
  "items-center justify-center rounded-full",
  "border border-brand-bronze",
  "transition-colors duration-300",
  "group-hover:bg-brand-forest",
  "group-hover:border-brand-forest",
  "group-hover:text-brand-ivory",
  "group-focus-visible:bg-brand-forest",
  "group-focus-visible:text-brand-ivory",
  "motion-reduce:transition-none",
]);

export const featuredChapterArrowVariants = cva([
  "size-5 shrink-0",
  "motion-reduce:transition-none",
]);
