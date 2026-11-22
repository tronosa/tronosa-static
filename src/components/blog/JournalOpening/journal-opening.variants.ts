import { cva } from "class-variance-authority";

export const journalOpeningVariants = cva([
  "relative isolate w-full overflow-hidden",
  "text-brand-forest",
]);

export const journalOpeningHeaderVariants = cva([
  "relative mx-auto flex max-w-6xl",
  "flex-col items-center gap-6",
  "text-center md:gap-8",
]);

export const journalOpeningEyebrowVariants = cva([
  "flex flex-col items-center gap-4",
  "text-xs font-semibold uppercase",
  "tracking-[0.24em] md:text-sm",
]);

export const journalOpeningAccentLineVariants = cva([
  "h-0.5 w-12 bg-brand-bronze",
]);

export const journalOpeningTitleVariants = cva([
  "flex w-full min-w-0 flex-col",
  "text-[clamp(3rem,10vw,10rem)]",
  "font-semibold leading-[0.9]",
  "tracking-[-0.065em]",
  "uppercase wrap-break-word",
]);

export const journalOpeningTitleLineVariants = cva(["block"]);

export const journalOpeningTitleAccentVariants = cva([
  "block text-brand-bronze",
]);

export const journalOpeningDescriptionVariants = cva([
  "max-w-xl text-base leading-relaxed",
  "text-brand-graphite md:text-lg",
]);

export const journalOpeningMediaVariants = cva([
  "relative mx-auto mt-10 w-full",
  "max-w-7xl md:mt-14",
]);

export const journalOpeningApertureVariants = cva([
  "relative isolate overflow-hidden",
  "aspect-4/3 w-full",
  "rounded-4xl",
  "bg-brand-forest/10",
  "sm:aspect-video",
  "lg:aspect-21/9",
]);

export const journalOpeningImageVariants = cva(["size-full object-cover"]);

export const journalOpeningCaptionVariants = cva([
  "flex items-center justify-center",
  "border-b border-brand-forest/15",
  "py-5 md:py-6",
]);

export const journalOpeningCaptionTextVariants = cva([
  "text-center text-xs font-medium uppercase",
  "tracking-[0.14em]",
]);
