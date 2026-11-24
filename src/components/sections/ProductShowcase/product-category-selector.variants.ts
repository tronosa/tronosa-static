import { cva } from "class-variance-authority";

export const productCategorySelectorVariants = cva([
  "relative z-20 mb-10 flex w-full min-w-0",
  "flex-wrap items-center justify-center",
  "gap-2 sm:gap-3",
  "lg:mb-16",
]);

export const productCategoryButtonVariants = cva(
  [
    "inline-flex min-h-11 items-center justify-center",
    "rounded-full border px-5 py-2.5",
    "text-sm font-medium",
    "cursor-pointer select-none",
    "transition-[background-color,border-color,color]",
    "duration-200",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-3",
    "focus-visible:outline-(--product-accent)",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      active: {
        true: [
          "border-(--product-accent)",
          "bg-(--product-accent)",
          "text-(--product-background)",
        ],
        false: [
          "border-current/30",
          "bg-white/20",
          "text-(--product-accent)",
          "hover:bg-white/40",
        ],
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
