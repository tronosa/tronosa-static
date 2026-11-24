import { cva } from "class-variance-authority";

export const articleHeroVariants = cva([
  "relative isolate overflow-hidden",
  "bg-brand-mineral-deep text-white",
]);

export const articleHeroContentVariants = cva([
  "relative z-10 flex flex-col justify-end",
  "min-h-[40svh] lg:min-h-[50svh]",
  "pt-[var(--hero-content-offset)]",
  "pb-10 md:pb-12 lg:pb-16",
]);

export const articleHeroHeaderVariants = cva([
  "flex w-full min-w-0 flex-col gap-6 md:gap-8",
]);

export const articleHeroTextVariants = cva([
  "flex w-full max-w-4xl flex-col gap-4 md:gap-5",
]);

export const articleHeroCategoryVariants = cva([
  "text-xs font-semibold uppercase tracking-widest",
  "md:text-sm",
]);

export const articleHeroTitleVariants = cva([
  "text-[clamp(2.5rem,5vw,5rem)]",
  "font-semibold leading-[1.05] tracking-tight",
  "text-balance",
]);

export const articleHeroDescriptionVariants = cva([
  "max-w-2xl text-base leading-relaxed md:text-lg",
]);

export const articleHeroMetaVariants = cva([
  "flex w-full flex-wrap items-center",
  "justify-between gap-x-8 gap-y-4",
  "border-t border-white/20 pt-5",
]);

export const articleHeroMetaDetailsVariants = cva([
  "flex flex-wrap items-center",
  "gap-x-4 gap-y-2 text-sm",
]);

export const articleHeroMetaSeparatorVariants = cva([
  "size-1 shrink-0 rounded-full bg-current",
]);

export const articleHeroBackgroundVariants = cva([
  "pointer-events-none absolute inset-0",
  "overflow-hidden select-none",
]);

export const articleHeroRingVariants = cva([
  "absolute left-1/2 top-1/2",
  "-translate-x-1/2 -translate-y-1/2",
  "rounded-full border",
  "border-brand-mineral opacity-20",
]);

export const articleHeroBackgroundTextContainerVariants = cva([
  "pointer-events-none absolute inset-0",
  "flex items-center justify-center overflow-hidden",
]);

export const articleHeroBackgroundTextVariants = cva([
  "select-none whitespace-nowrap",
  "text-[clamp(3rem,19vw,24rem)]",
  "font-bold leading-none tracking-[-0.08em]",
  "text-white/2",
]);
