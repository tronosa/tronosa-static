import { cva } from "class-variance-authority";

export const contactFormVariants = cva(["relative isolate", "text-foreground"]);

export const contactFormLayoutVariants = cva(
  ["grid min-w-0 grid-cols-1", "gap-8 md:gap-10"],
  {
    variants: {
      layout: {
        default: [
          "items-start",
          "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]",
          "lg:gap-20",
        ],

        editorial: ["items-stretch", "lg:grid-cols-12", "lg:gap-12 xl:gap-20"],
      },
    },

    defaultVariants: {
      layout: "default",
    },
  },
);

export const contactFormHeaderVariants = cva(
  ["relative isolate", "flex min-w-0 flex-col"],
  {
    variants: {
      layout: {
        default: ["gap-5"],

        editorial: [
          "overflow-hidden",
          "rounded-2xl md:rounded-3xl",
          "bg-primary text-primary-foreground",
          "p-6 sm:p-8 lg:p-10 xl:p-12",
          "lg:col-span-5",
        ],
      },
    },

    defaultVariants: {
      layout: "default",
    },
  },
);

export const contactFormHeaderContentVariants = cva([
  "relative z-10",
  "flex min-w-0 flex-col",
  "gap-3 md:gap-5",
]);

export const contactFormEyebrowVariants = cva([
  "flex items-center gap-3",
  "uppercase tracking-widest",
  "before:h-px before:w-6",
  "before:shrink-0 before:bg-current",
]);

export const contactFormTitleVariants = cva(["max-w-xl text-balance"]);

export const contactFormDescriptionVariants = cva([
  "max-w-md text-pretty",
  "wrap-break-word",
]);

export const contactFormTopicsVariants = cva([
  "relative z-10",
  "hidden lg:flex lg:flex-col",
  "mt-10 xl:mt-14",
]);

export const contactFormTopicVariants = cva([
  "flex min-w-0 items-center gap-4",
  "border-t border-current/20",
  "py-4 xl:py-5",
  "last:border-b",
]);

export const contactFormTopicMarkerVariants = cva([
  "size-1.5 shrink-0",
  "rounded-full bg-current",
]);

export const contactFormDecorationVariants = cva([
  "pointer-events-none",
  "absolute inset-x-0 bottom-0",
  "-z-10",
  "hidden lg:block",
  "h-auto w-full",
  "opacity-20",
]);

export const contactFormDecorationSpaceVariants = cva([
  "hidden lg:block",
  "mt-auto min-h-32 xl:min-h-44",
]);

export const contactFormBodyVariants = cva("min-w-0", {
  variants: {
    layout: {
      default: "",

      editorial: ["lg:col-span-7", "lg:self-start"],
    },
  },

  defaultVariants: {
    layout: "default",
  },
});

export const contactFormPanelVariants = cva([
  "flex min-w-0 flex-col gap-6",
  "rounded-2xl md:rounded-3xl",
  "border border-current/15",
  "bg-background",
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
    "placeholder:text-foreground-muted",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-focus-ring",
    "disabled:cursor-not-allowed disabled:opacity-60",
    "transition-colors duration-200",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      invalid: {
        true: "border-red-600",
        false: "border-foreground/60",
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
