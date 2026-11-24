import { cva } from "class-variance-authority";

export const productSelectorVariants = cva(["relative w-full min-w-0"]);

export const productSelectorOptionsVariants = cva([
  "flex w-full flex-wrap",
  "items-center justify-center",
  "gap-2 sm:gap-3",
  "lg:justify-end",
]);

export const productSelectorCardVariants = cva(
  [
    "relative block shrink-0",
    "h-32 w-20",
    "sm:h-36 sm:w-24",
    "rounded-2xl border",
    "cursor-pointer select-none",
    "transition-colors duration-300",
    "focus-within:outline-2",
    "focus-within:outline-offset-2",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      active: {
        true: ["border-(--product-accent)", "bg-white/45"],
        false: ["border-current/10", "bg-white/10", "hover:bg-white/30"],
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const productSelectorImageContainerVariants = cva([
  "absolute inset-x-2 top-3 bottom-9",
  "flex items-center justify-center",
  "overflow-hidden",
]);

export const productSelectorImageVariants = cva([
  "block h-full w-auto max-w-full",
  "object-contain select-none",
]);

export const productSelectorVolumeVariants = cva([
  "absolute bottom-3 inset-x-0",
  "flex h-5 items-center justify-center",
  "text-xs font-medium leading-none",
  "whitespace-nowrap tabular-nums",
]);

export const productSelectorInputVariants = cva(["sr-only"]);
