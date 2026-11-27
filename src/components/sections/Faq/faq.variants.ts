import { cva } from "class-variance-authority";

export const faqLayoutVariants = cva([
  "grid gap-8",
  "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]",
  "lg:gap-16",
]);

export const faqAccordionVariants = cva(["flex min-w-0 flex-col gap-3"]);

export const faqItemVariants = cva([
  "overflow-hidden rounded-2xl",
  "border border-border bg-surface",
  "transition-colors duration-300",
  "data-[state=open]:border-primary/30",
  "motion-reduce:transition-none",
]);

export const faqTriggerVariants = cva([
  "min-h-16 gap-6",
  "px-5 py-5 sm:px-7",
  "text-base font-medium text-primary",
  "md:text-lg",
  "transition-colors duration-200",
  "data-[state=closed]:hover:bg-surface-muted/40",
  "focus-visible:-outline-offset-4",
  "motion-reduce:transition-none",
]);

export const faqIconContainerVariants = cva([
  "inline-flex size-10 shrink-0",
  "items-center justify-center",
  "rounded-full border border-primary/20",
  "text-primary",
  "transition-[background-color,border-color,color]",
  "duration-200 ease-out",
  "group-hover/accordion:bg-primary",
  "group-hover/accordion:text-primary-foreground",
  "motion-reduce:transition-none",
]);

export const faqAnswerVariants = cva([
  "px-5 pb-6 sm:px-7",
  "leading-relaxed text-foreground-muted",
  "whitespace-pre-line wrap-break-word",
]);
