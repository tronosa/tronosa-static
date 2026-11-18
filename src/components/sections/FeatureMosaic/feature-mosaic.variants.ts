import { cva } from "class-variance-authority";
export const featureMosaicHeaderVariants = cva(
  "mb-8 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12",
);
export const featureMosaicGridVariants = cva(
  "grid min-w-0 gap-4 lg:grid-cols-2 lg:items-stretch",
);
export const featureMosaicImageVariants = cva(
  "relative aspect-square min-w-0 overflow-hidden rounded-3xl bg-brand-stone lg:aspect-auto lg:min-h-96",
  {
    variants: {
      imagePosition: { left: "lg:order-first", right: "lg:order-last" },
    },
  },
);
export const featureMosaicCardsVariants = cva(
  "grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2 lg:auto-rows-fr",
);
export const featureMosaicCardVariants = cva(
  "flex min-w-0 flex-col justify-between gap-8 rounded-3xl bg-brand-stone p-6 text-primary wrap-break-word sm:p-8",
);
