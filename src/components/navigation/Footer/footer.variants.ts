import { cva } from "class-variance-authority";

export const footerVariants = cva([
  "relative isolate w-full",
  "bg-brand-ivory text-brand-mineral-deep",
]);

export const footerInnerVariants = cva([
  "pt-16 pb-6 md:pt-24 md:pb-8 lg:pt-28",
]);

export const footerBrandRowVariants = cva([
  "flex flex-wrap items-center justify-between gap-4",
  "border-b border-brand-mineral-deep/25 pb-6",
]);

export const footerBrandIdentityVariants = cva([
  "inline-flex items-center gap-3",
  "text-xs font-semibold uppercase tracking-[0.15em]",
]);

export const footerBrandMarkVariants = cva([
  "flex size-9 items-center justify-center",
  "rounded-full border border-brand-mineral-deep/40",
]);

export const footerBrandDescriptionVariants = cva([
  "text-xs font-medium uppercase tracking-[0.15em]",
]);

export const footerHeroVariants = cva([
  "grid min-w-0 gap-10 py-16",
  "md:py-20",
  "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]",
  "lg:items-end lg:gap-20",
]);

export const footerHeroContentVariants = cva([
  "flex min-w-0 flex-col items-start gap-6",
]);

export const footerTitleVariants = cva([
  "max-w-4xl text-balance",
  "text-[clamp(3.25rem,7vw,7rem)]",
  "font-medium leading-[1.02] tracking-[-0.06em]",
]);

export const footerDescriptionVariants = cva([
  "max-w-lg text-base leading-[1.8]",
  "md:text-lg",
]);

export const footerLinkVariants = cva([
  "group inline-flex min-h-11 w-fit max-w-full",
  "items-center gap-2",
  "text-sm font-medium leading-relaxed",
  "wrap-break-word",
  "underline decoration-transparent",
  "underline-offset-4",
  "transition-[color,text-decoration-color] duration-200",
  "hover:underline hover:decoration-current",
  "focus-visible:rounded-sm",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-brand-mineral-deep",
  "motion-reduce:transition-none",
]);

export const footerLinkArrowVariants = cva([
  "size-3.5 shrink-0 opacity-0",
  "-translate-x-1",
  "transition-[opacity,transform] duration-200",
  "group-hover:translate-x-0 group-hover:opacity-100",
  "group-focus-visible:translate-x-0",
  "group-focus-visible:opacity-100",
  "motion-reduce:transition-none",
]);

export const footerWordmarkVariants = cva([
  "w-full border-t border-brand-mineral-deep/25",
  "pt-8 md:pt-12",
]);

export const footerWordmarkSvgVariants = cva([
  "block h-auto w-full",
  "fill-brand-mineral-deep",
]);

export const footerBottomVariants = cva([
  "flex flex-col gap-4 pt-8",
  "text-xs font-medium",
  "sm:flex-row sm:items-center sm:justify-between",
]);

export const footerLegalLinksVariants = cva([
  "flex flex-wrap items-center gap-x-6 gap-y-2",
]);
