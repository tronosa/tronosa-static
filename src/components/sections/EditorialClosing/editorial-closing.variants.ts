import { cva } from "class-variance-authority";

export const editorialClosingVariants = cva([
  "relative isolate overflow-hidden",
]);

export const editorialClosingLayoutVariants = cva([
  "relative z-10",
  "grid grid-cols-1 items-end",
  "gap-8 md:gap-12",
  "lg:grid-cols-12",
]);

export const editorialClosingContentVariants = cva([
  "flex min-w-0 flex-col items-start gap-5",
  "lg:col-span-8",
]);

export const editorialClosingEyebrowVariants = cva([
  "flex items-center gap-3 uppercase",
  "before:h-px before:w-8 before:bg-current",
]);

export const editorialClosingTitleVariants = cva(["max-w-4xl text-balance"]);

export const editorialClosingDescriptionVariants = cva([
  "max-w-xl text-pretty",
]);

export const editorialClosingActionVariants = cva([
  "flex items-center justify-start",
  "lg:col-span-4 lg:justify-end",
]);

export const editorialClosingLinkVariants = cva([
  "w-full max-w-full justify-between",
  "sm:w-auto",
  "whitespace-normal",
]);

export const editorialClosingDecorationVariants = cva([
  "pointer-events-none absolute",
  "right-[-25%] bottom-[-55%]",
  "w-full max-w-300",
  "opacity-[0.12]",
  "md:right-[-15%] md:w-[75%]",
  "lg:right-[-10%] lg:w-[65%]",
]);
