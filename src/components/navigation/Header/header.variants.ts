import { cva } from "class-variance-authority";

export const headerVariants = cva([
  "relative z-50 w-full",
  "bg-transparent",
  "py-4 md:py-6",
  "[body:has([data-video-hero],[data-image-hero])_&]:absolute",
  "[body:has([data-video-hero],[data-image-hero])_&]:top-0",
  "[body:has([data-video-hero],[data-image-hero])_&]:inset-x-0",
]);

export const headerInnerVariants = cva(
  [
    "flex w-full items-center justify-between gap-6",
    "px-4 lg:px-6",
    "rounded-full",
    "border border-white/20",
    "bg-white/12",
    "backdrop-blur-sm backdrop-saturate-150",
    "shadow-[0_8px_32px_rgba(23,63,53,0.06)]",
    "transition-[background-color,box-shadow]",
    "duration-300 ease-in-out",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      size: {
        default: "h-18 md:h-20",
        compact: "h-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);
