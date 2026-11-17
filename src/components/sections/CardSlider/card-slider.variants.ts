import { cva } from "class-variance-authority";

export const cardSliderVariants = cva("py-16 md:py-24");

export const cardSliderHeaderVariants = cva(
  "mb-8 max-w-3xl space-y-3 md:mb-12",
);

export const sliderCardVariants = cva(
  [
    "relative isolate flex aspect-square w-full min-w-0",
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
  "space-y-2 wrap-break-word",
]);

export const sliderCardScrollVariants = cva([
  "min-h-0 flex-1 overflow-y-auto",
  "overscroll-y-auto scrollbar-thin",
  "focus-visible:outline-2",
  "focus-visible:-outline-offset-2",
  "focus-visible:outline-current",
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
