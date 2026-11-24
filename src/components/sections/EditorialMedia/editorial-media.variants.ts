import { cva } from "class-variance-authority";

export const editorialMediaVariants = cva([
  "relative bg-transparent",
  "my-16 md:my-20 lg:my-24",
]);

export const editorialMediaLayoutVariants = cva([
  "grid grid-cols-1 items-center",
  "gap-8 md:gap-10 lg:gap-14",
  "lg:grid-cols-2",
]);

export const editorialMediaTextVariants = cva(
  ["flex min-w-0 flex-col items-start gap-4 md:gap-5"],
  {
    variants: {
      mediaPosition: {
        right: "lg:col-start-1 lg:row-start-1",
        left: "lg:col-start-2 lg:row-start-1",
      },
    },
    defaultVariants: {
      mediaPosition: "right",
    },
  },
);

export const editorialMediaEyebrowVariants = cva([
  "text-xs font-semibold uppercase",
  "tracking-[0.18em]",
  "text-foreground-bronze",
  "md:text-sm",
]);

export const editorialMediaTitleVariants = cva([
  "max-w-2xl text-balance text-brand-mineral-deep",
]);

export const editorialMediaParagraphsVariants = cva([
  "flex max-w-xl flex-col gap-4",
]);

export const editorialMediaParagraphVariants = cva([
  "text-base leading-relaxed text-foreground-muted",
  "md:text-lg",
]);

export const editorialMediaPlacementVariants = cva(
  ["w-full min-w-0 lg:mx-auto lg:max-w-140"],
  {
    variants: {
      mediaPosition: {
        right: "lg:col-start-2 lg:row-start-1",
        left: "lg:col-start-1 lg:row-start-1",
      },
    },
    defaultVariants: {
      mediaPosition: "right",
    },
  },
);

export const editorialMediaVisualVariants = cva([
  "relative isolate aspect-4/3",
  "overflow-hidden rounded-2xl md:rounded-3xl",
  "bg-brand-mineral-deep",
]);

export const editorialMediaVideoVariants = cva([
  "absolute inset-0 size-full object-cover",
]);

export const editorialMediaGalleryVariants = cva(["relative w-full min-w-0"]);

export const editorialMediaGallerySlideVariants = cva([
  "absolute inset-0 size-full",
  "transition-opacity duration-500 ease-in-out",
  "motion-reduce:transition-none",
]);

export const editorialMediaGalleryControlsVariants = cva([
  "flex items-center justify-between gap-3 pt-3",
]);

export const editorialMediaGalleryNavigationVariants = cva([
  "flex items-center gap-2",
]);

export const editorialMediaGalleryActionsVariants = cva([
  "flex items-center gap-3",
]);

export const editorialMediaGalleryCounterVariants = cva([
  "text-sm tabular-nums text-brand-mineral-deep",
]);

export const editorialMediaGalleryButtonVariants = cva([
  "inline-flex size-11 shrink-0",
  "items-center justify-center rounded-full",
  "border border-brand-mineral-deep/30",
  "text-brand-mineral-deep",
  "cursor-pointer",
  "transition-colors duration-200",
  "hover:bg-brand-mineral-deep hover:text-white",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-brand-mineral-deep",
  "motion-reduce:transition-none",
  "disabled:cursor-not-allowed disabled:opacity-40",
]);

export const editorialMediaCtaVariants = cva([
  "mt-2 w-full justify-between sm:w-auto",
]);
