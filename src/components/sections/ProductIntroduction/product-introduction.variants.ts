import { cva } from "class-variance-authority";

export const productIntroductionVariants = cva(["text-product-foreground"]);

export const productIntroductionLayoutVariants = cva([
  "grid grid-cols-1 items-end",
  "gap-6 md:gap-10",
  "lg:grid-cols-12 lg:gap-12",
]);

export const productIntroductionHeadingVariants = cva([
  "flex min-w-0 flex-col items-start gap-5",
  "lg:col-span-6",
]);

export const productIntroductionEyebrowVariants = cva([
  "flex items-center gap-3 uppercase",
  "text-product-accent",
  "before:h-px before:w-8 before:bg-current",
]);

export const productIntroductionTitleVariants = cva(["max-w-2xl text-balance"]);

export const productIntroductionDescriptionVariants = cva([
  "max-w-xl text-pretty",
  "lg:col-span-5 lg:col-start-8",
  "lg:pb-1",
]);

export const productIntroductionDividerVariants = cva([
  "mt-10 flex items-center gap-5",
  "text-brand-mineral",
  "md:mt-14 md:gap-8",
]);

export const productIntroductionLineVariants = cva([
  "h-px flex-1 bg-current opacity-40",
]);

export const productIntroductionIconVariants = cva(["h-8 w-6 shrink-0"]);
