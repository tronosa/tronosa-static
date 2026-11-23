import { cva } from "class-variance-authority";

export const contactFormVariants = cva([
  "relative isolate overflow-hidden",
  "bg-background text-foreground",
]);

export const contactFormLayoutVariants = cva([
  "grid min-w-0 grid-cols-1",
  "items-start gap-10",
  "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]",
  "lg:gap-20",
]);

export const contactFormHeaderVariants = cva([
  "flex min-w-0 flex-col",
  "gap-5",
]);

export const contactFormEyebrowVariants = cva([
  "text-xs font-semibold",
  "uppercase tracking-[0.18em]",
]);

export const contactFormTitleVariants = cva([
  "max-w-xl text-balance",
  "text-[clamp(2.5rem,5vw,5rem)]",
  "font-medium leading-[1.06]",
  "tracking-[-0.045em]",
]);

export const contactFormDescriptionVariants = cva([
  "max-w-md text-base leading-relaxed",
  "opacity-80",
]);

export const contactFormPanelVariants = cva([
  "flex min-w-0 flex-col gap-6",
  "rounded-3xl",
  "border border-current/10",
  "p-5 sm:p-8 lg:p-10",
]);

export const contactFormFieldGridVariants = cva([
  "grid min-w-0 grid-cols-1 gap-5",
  "sm:grid-cols-2",
]);

export const contactFormFieldVariants = cva(["flex min-w-0 flex-col gap-2"]);

export const contactFormLabelVariants = cva(["text-sm font-medium"]);

export const contactFormControlVariants = cva(
  [
    "w-full min-w-0 rounded-xl",
    "border bg-transparent",
    "px-4 py-3 text-base",
    "placeholder:text-current/50",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-60",
    "transition-colors duration-200",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      invalid: {
        true: "border-red-600",
        false: "border-current/20",
      },
    },
    defaultVariants: {
      invalid: false,
    },
  },
);

export const contactFormTextareaVariants = cva(["min-h-40 resize-y"]);

export const contactFormErrorVariants = cva(["text-sm text-red-700"]);

export const contactFormHintVariants = cva([
  "text-xs leading-relaxed opacity-80",
]);

export const contactFormStatusVariants = cva(
  ["text-sm font-medium leading-relaxed"],
  {
    variants: {
      status: {
        idle: "",
        submitting: "",
        success: "text-green-700",
        error: "text-red-700",
      },
    },
    defaultVariants: {
      status: "idle",
    },
  },
);
