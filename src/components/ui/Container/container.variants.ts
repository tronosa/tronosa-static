import { cva } from "class-variance-authority";

export const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      wide: "max-w-[var(--container-wide)]",
      default: "max-w-[var(--container-default)]",
      narrow: "max-w-[var(--container-narrow)]",
      prose: "max-w-[var(--container-prose)]",
      full: "max-w-none",
    },
    gutter: {
      default: "px-5 sm:px-8 lg:px-10",
      compact: "px-4 sm:px-6",
      none: "px-0",
    },
  },
  defaultVariants: {
    size: "default",
    gutter: "default",
  },
});
