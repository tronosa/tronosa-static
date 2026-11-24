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
  "md:py-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]",
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

export const footerContactVariants = cva([
  "flex flex-col items-start gap-5",
  "lg:items-end lg:pb-2",
]);

export const footerContactLabelVariants = cva([
  "text-xs font-bold uppercase tracking-[0.18em]",
]);

export const footerContactLinkVariants = cva([
  "group inline-flex min-h-13 items-center gap-5",
  "rounded-full bg-brand-mineral-deep",
  "px-7 py-3 text-sm font-semibold text-white",
  "transition-[background-color,transform] duration-200",
  "hover:bg-brand-forest",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-brand-mineral-deep",
  "motion-reduce:transition-none",
]);

export const footerContactArrowVariants = cva([
  "size-4 shrink-0",
  "transition-transform duration-200",
  "group-hover:translate-x-1",
  "motion-reduce:transform-none",
]);

export const footerNavigationVariants = cva([
  "grid gap-10",
  "border-t border-brand-mineral-deep/25",
  "py-10 md:grid-cols-2 md:py-14",
]);

export const footerColumnVariants = cva(["min-w-0"]);

export const footerColumnHeaderVariants = cva(["mb-6 flex items-center gap-4"]);

export const footerColumnNumberVariants = cva([
  "text-xs font-medium tabular-nums",
]);

export const footerColumnTitleVariants = cva([
  "text-xs font-bold uppercase tracking-[0.18em]",
]);

export const footerLinksVariants = cva(["grid gap-x-8 gap-y-1 sm:grid-cols-2"]);

export const footerLinkVariants = cva([
  "group inline-flex min-h-12 w-fit",
  "items-center gap-3",
  "text-base font-medium",
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
