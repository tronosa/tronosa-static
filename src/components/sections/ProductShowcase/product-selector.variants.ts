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
    "relative flex shrink-0 flex-col",
    "items-center justify-center",
    "w-20 min-h-28",
    "sm:w-24 sm:min-h-32",
    "gap-2 rounded-2xl border p-3",
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

export const productSelectorImageVariants = cva([
  "h-16 w-auto max-w-full",
  "sm:h-20",
  "object-contain select-none",
]);

export const productSelectorVolumeVariants = cva([
  "text-xs font-medium",
  "whitespace-nowrap tabular-nums",
]);

export const productSelectorInputVariants = cva(["sr-only"]);
