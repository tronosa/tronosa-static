import { cva } from "class-variance-authority";

export const contentSectionVariants = cva(["relative"]);

export const contentSectionContainerVariants = cva("mx-auto w-full", {
  variants: {
    width: {
      narrow: "max-w-2xl",
      medium: "max-w-4xl",
      wide: "max-w-5xl",
    },
  },
  defaultVariants: {
    width: "narrow",
  },
});

export const contentSectionBodyVariants = cva(["space-y-6", "wrap-break-word"]);
