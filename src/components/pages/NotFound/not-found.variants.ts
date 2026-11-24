import { cva } from "class-variance-authority";

export const notFoundVariants = cva([
  "relative isolate flex min-h-[75svh] items-center",
  "overflow-hidden bg-brand-ivory",
  "text-brand-deep-mineral",
]);

export const notFoundContainerVariants = cva([
  "relative mx-auto flex max-w-4xl",
  "flex-col items-center text-center",
]);

export const notFoundEyebrowVariants = cva([
  "mb-6 text-xs font-semibold uppercase",
  "tracking-[0.2em]",
  "text-brand-deep-mineral",
]);

export const notFoundNumberVariants = cva([
  "pointer-events-none select-none",
  "text-[clamp(7rem,23vw,18rem)]",
  "font-semibold leading-[0.85]",
  "tracking-[-0.09em]",
  "text-brand-deep-mineral/15",
]);

export const notFoundContentVariants = cva([
  "relative z-10 mt-8 flex max-w-2xl",
  "flex-col items-center gap-6",
  "md:mt-12",
]);

export const notFoundTitleVariants = cva([
  "max-w-2xl text-balance",
  "text-[clamp(2rem,4.5vw,4rem)]",
  "font-medium leading-[1.1]",
  "tracking-[-0.045em] text-center",
]);

export const notFoundDescriptionVariants = cva([
  "max-w-lg text-pretty",
  "text-base leading-relaxed",
  "text-brand-deep-mineral",
  "md:text-lg text-center",
]);

export const notFoundActionsVariants = cva([
  "mt-4 flex flex-wrap",
  "items-center justify-center gap-4",
]);

export const notFoundSecondaryLinkVariants = cva([
  "inline-flex min-h-12 items-center",
  "text-sm font-semibold",
  "underline underline-offset-4",
  "transition-colors duration-200",
  "hover:text-brand-forest",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-brand-deep-mineral",
  "motion-reduce:transition-none",
]);

export const notFoundArrowVariants = cva([
  "size-4 shrink-0",
  "transition-transform duration-200",
  "group-hover:translate-x-1",
  "motion-reduce:transform-none",
]);
