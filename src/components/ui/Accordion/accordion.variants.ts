import { cva } from "class-variance-authority";

export const accordionVariants = cva(["min-w-0"]);

export const accordionItemVariants = cva(["min-w-0"]);

export const accordionHeaderVariants = cva(["min-w-0"]);

export const accordionTriggerVariants = cva([
  "group/accordion",
  "flex min-h-12 w-full min-w-0",
  "cursor-pointer items-center justify-between",
  "gap-4 text-left",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-focus-ring",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",
]);

export const accordionContentVariants = cva("tronosa-accordion-content", {
  variants: {
    persistentOnDesktop: {
      true: "tronosa-accordion-content-persistent",
      false: "",
    },
  },

  defaultVariants: {
    persistentOnDesktop: false,
  },
});

export const accordionContentInnerVariants = cva([
  "tronosa-accordion-content-inner",
  "min-w-0",
]);

export const accordionIndicatorVariants = cva([
  "size-5 shrink-0",
  "transition-transform duration-200 ease-out",
  "group-data-[state=open]/accordion:rotate-45",
  "motion-reduce:transition-none",
]);
