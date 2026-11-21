import { cva } from "class-variance-authority";

export const sourceClosingVariants = cva([
  "relative isolate w-full overflow-hidden",
  "bg-brand-forest text-brand-ivory",
]);

export const sourceClosingLayoutVariants = cva([
  "relative z-10 grid min-w-0",
  "items-center gap-8",
  "lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]",
  "lg:gap-12",
]);

export const sourceClosingContentVariants = cva([
  "flex min-w-0 flex-col items-start",
  "gap-6 md:gap-8",
]);

export const sourceClosingEyebrowVariants = cva([
  "flex items-center gap-3",
  "text-xs font-semibold uppercase",
  "tracking-[0.18em]",
]);

export const sourceClosingAccentVariants = cva([
  "h-0.5 w-6 shrink-0 bg-brand-bronze",
]);

export const sourceClosingTitleVariants = cva([
  "max-w-3xl text-balance",
  "text-[clamp(2.5rem,5.5vw,5.5rem)]",
  "font-semibold leading-[1.02]",
  "tracking-[-0.05em]",
]);

export const sourceClosingDescriptionVariants = cva([
  "max-w-xl text-base leading-relaxed",
  "text-brand-ivory/85 md:text-lg",
]);

export const sourceClosingDecorationVariants = cva([
  "pointer-events-none select-none",
  "relative mx-auto w-full",
  "max-w-56 md:max-w-72",
  "lg:max-w-sm",
  "text-brand-bronze",
]);

export const sourceClosingCtaVariants = cva([
  "w-full sm:w-auto",
  "min-h-11",
  "justify-between",
  "whitespace-normal sm:whitespace-nowrap",
]);
