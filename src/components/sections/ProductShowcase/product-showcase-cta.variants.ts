import { cva } from "class-variance-authority";

export const productShowcaseCTAVariants = cva([
  "relative z-10",
  "flex w-full justify-center",
  "pt-8 pb-10",
]);

export const productShowcaseCTAButtonVariants = cva(["w-full sm:w-auto"]);
