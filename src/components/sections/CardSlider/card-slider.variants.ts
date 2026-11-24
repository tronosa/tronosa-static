import { cva } from "class-variance-authority";

export const cardSliderHeaderVariants = cva([
  "mb-8 max-w-3xl",
  "flex flex-col gap-3",
  "md:mb-12",
]);

export const cardSliderEyebrowVariants = cva([
  "text-xs font-semibold uppercase",
  "tracking-[0.18em] text-foreground-bronze",
  "md:text-sm",
]);

export const sliderCardVariants = cva(
  [
    "relative isolate flex h-full w-full min-w-0",
    "min-h-96 sm:min-h-108 lg:min-h-120",
    "flex-col justify-between overflow-hidden",
    "rounded-2xl p-5 sm:p-6 lg:p-7",
  ],
  {
    variants: {
      kind: {
        text: "bg-brand-stone text-primary",
        image: "bg-brand-forest text-white",
      },
    },
  },
);

export const sliderCardContentVariants = cva([
  "relative z-10 mt-auto min-w-0",
  "flex flex-col gap-3",
  "wrap-break-word",
]);

export const sliderCardBodyVariants = cva([
  "relative z-10 flex min-w-0 flex-1 flex-col",
  "justify-between gap-8",
]);

export const sliderCardCtaVariants = cva([
  "inline-flex min-h-11 max-w-full items-center",
  "self-start gap-2 font-medium underline underline-offset-4",
  "transition-opacity duration-200",
  "hover:opacity-75",
  "focus-visible:rounded-sm",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-current",
  "motion-reduce:transition-none",
]);

export const sliderControlVariants = cva([
  "inline-flex size-12 shrink-0",
  "items-center justify-center",
  "rounded-full border border-primary",
  "bg-transparent text-primary",
  "cursor-pointer",
  "transition-[background-color,color,border-color]",
  "duration-300 ease-out",
  "hover:bg-primary hover:text-primary-foreground",
  "aria-disabled:cursor-default",
  "aria-disabled:opacity-35",
  "aria-disabled:hover:bg-transparent",
  "aria-disabled:hover:text-primary",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-focus-ring",
  "motion-reduce:transition-none",
]);
