import { cva } from "class-variance-authority";

export const heritageVariants = cva(["relative isolate"]);

export const heritageHeaderVariants = cva([
  "mx-auto mb-10 flex max-w-4xl flex-col",
  "items-center gap-5",
  "md:mb-14 md:gap-6",
]);

export const heritageEyebrowVariants = cva(["uppercase"]);

export const heritageOrnamentVariants = cva(["flex items-center gap-3"]);

export const heritageOrnamentLineVariants = cva([
  "h-px w-10 bg-brand-bronze md:w-16",
]);

export const heritageOrnamentCenterVariants = cva([
  "size-2 rotate-45 border border-brand-bronze",
]);

export const heritageTitleVariants = cva(["max-w-3xl text-balance"]);

export const heritageImageVariants = cva([
  "relative aspect-4/3",
  "overflow-hidden rounded-2xl md:rounded-3xl",
  "sm:aspect-video",
  "lg:aspect-[2.15/1]",
]);

export const heritageCaptionVariants = cva(["mt-4 opacity-80"]);

export const heritageContentVariants = cva([
  "mx-auto mt-10 max-w-3xl",
  "flex flex-col gap-5",
  "border-t border-current/20 pt-8",
  "md:mt-14 md:gap-6 md:pt-10",
]);

export const heritageParagraphVariants = cva(["text-pretty"]);
