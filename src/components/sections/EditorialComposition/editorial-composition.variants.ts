import { cva } from "class-variance-authority";

export const compositionVariants = cva(["isolate"]);

export const compositionHeaderVariants = cva([
  "mb-8 flex flex-col items-start gap-4",
  "border-b border-current/15 pb-8",
  "md:mb-12 md:pb-10",
]);

export const compositionEyebrowVariants = cva([
  "flex items-center gap-3 uppercase",
  "before:h-px before:w-8 before:bg-current",
]);

export const compositionTitleVariants = cva(["max-w-3xl text-balance"]);

export const compositionLayoutVariants = cva([
  "grid grid-cols-1 items-stretch gap-8",
  "lg:grid-cols-12 lg:gap-12",
]);

export const compositionPrimaryVariants = cva(["min-w-0 lg:col-span-7"]);

export const compositionPrimaryImageVariants = cva([
  "relative aspect-4/3",
  "overflow-hidden rounded-2xl md:rounded-3xl",
  "sm:aspect-video",
  "lg:aspect-5/4",
]);

export const compositionCaptionVariants = cva(["mt-4 opacity-80"]);

export const compositionContentVariants = cva([
  "flex min-w-0 flex-col justify-center gap-6",
  "lg:col-span-5 lg:px-4",
]);

export const compositionDecorationVariants = cva(["w-20 opacity-60 md:w-28"]);

export const compositionParagraphsVariants = cva(["flex flex-col gap-4"]);

export const compositionSecondaryVariants = cva([
  "relative aspect-video",
  "overflow-hidden rounded-2xl md:rounded-3xl",
]);

export const compositionStatementLayoutVariants = cva([
  "relative mt-8 overflow-hidden",
  "rounded-2xl md:rounded-3xl",
  "p-6 md:mt-12 md:p-10 lg:p-14",
]);

export const compositionStatementDecorationVariants = cva([
  "pointer-events-none absolute",
  "-right-20 -bottom-36",
  "w-80 opacity-10 md:w-md",
]);

export const compositionStatementContentVariants = cva([
  "relative z-10 flex max-w-3xl flex-col gap-5",
]);

export const compositionStatementMarkerVariants = cva([
  "h-0.5 w-10 bg-brand-bronze",
]);

export const compositionStatementVariants = cva(["text-pretty"]);
