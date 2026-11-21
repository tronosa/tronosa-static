import { cva } from "class-variance-authority";

export const articleImageSectionVariants = cva(["relative w-full"]);

export const articleImageFigureVariants = cva("mx-auto w-full", {
  variants: {
    layout: {
      reading: "max-w-2xl",
      medium: "max-w-4xl",
      wide: "max-w-none",
    },
  },
  defaultVariants: {
    layout: "wide",
  },
});

export const articleImageMediaVariants = cva(
  [
    "relative w-full overflow-hidden",
    "rounded-xl md:rounded-2xl",
    "bg-brand-forest/5",
  ],
  {
    variants: {
      layout: {
        reading: "h-56 sm:h-72 md:h-80",
        medium: "h-64 sm:h-80 md:h-96",
        wide: "h-64 sm:h-80 md:h-120 lg:h-140",
      },
    },
    defaultVariants: {
      layout: "wide",
    },
  },
);

export const articleImageCaptionVariants = cva([
  "mt-3 text-sm leading-relaxed",
  "text-foreground-muted",
]);
