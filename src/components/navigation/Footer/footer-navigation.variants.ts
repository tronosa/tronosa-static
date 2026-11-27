import { cva } from "class-variance-authority";

export const footerAccordionVariants = cva([
  "grid min-w-0 grid-cols-1",
  "border-t border-brand-mineral-deep/25",
  "lg:grid-cols-4",
  "lg:gap-x-10 lg:gap-y-12",
  "lg:py-14",
]);

export const footerAccordionItemVariants = cva([
  "min-w-0",
  "border-b border-brand-mineral-deep/25",
  "last:border-b-0",
  "lg:border-b-0",
]);

export const footerAccordionHeadingVariants = cva(["min-w-0"]);

export const footerAccordionDesktopHeadingVariants = cva([
  "hidden min-w-0 items-center gap-4",
  "lg:mb-4 lg:flex",
]);

export const footerAccordionTriggerVariants = cva([
  "min-h-16 gap-4",
  "py-4",
  "lg:hidden",
]);

export const footerAccordionNumberVariants = cva([
  "shrink-0",
  "text-xs font-medium tabular-nums",
]);

export const footerAccordionTitleVariants = cva([
  "min-w-0 flex-1",
  "text-xs font-bold uppercase tracking-[0.14em]",
  "wrap-break-word",
]);

export const footerAccordionLinksVariants = cva([
  "flex min-w-0 flex-col gap-1",
  "pb-6 lg:pb-0",
]);
