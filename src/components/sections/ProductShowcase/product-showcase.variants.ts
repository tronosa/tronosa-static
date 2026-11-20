import { cva } from "class-variance-authority";

export const productShowcaseVariants = cva([
  "relative isolate overflow-hidden",
  "text-(--product-accent)",
  "transition-colors duration-700",
  "motion-reduce:transition-none",
]);

export const productShowcaseBackgroundVariants = cva([
  "pointer-events-none absolute inset-0 -z-10",
  "bg-(--product-background)",
  "transition-colors duration-700 ease-in-out",
  "motion-reduce:transition-none",
]);

export const productShowcaseBackgroundTextContainerVariants = cva([
  "pointer-events-none absolute inset-0 -z-10",
  "flex items-center justify-center",
  "overflow-hidden",
]);

export const productShowcaseBackgroundTextVariants = cva([
  "select-none whitespace-nowrap",
  "text-[clamp(3rem,19vw,24rem)]",
  "font-bold leading-none",
  "tracking-[-0.08em]",
  "text-white/45",
]);

export const productShowcaseLayoutVariants = cva([
  "relative z-10",
  "grid w-full min-w-0",
  "grid-cols-1 items-center",
  "gap-x-8 gap-y-8",
  "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)]",
]);

export const productShowcaseHeaderVariants = cva([
  "flex min-w-0 flex-col",
  "items-center text-center",
  "lg:col-start-1 lg:row-start-1",
  "lg:items-start lg:text-left",
]);

export const productShowcaseEyebrowVariants = cva([
  "mb-4 text-xs font-semibold",
  "uppercase tracking-[0.18em]",
]);

export const productShowcaseTitleVariants = cva([
  "text-balance",
  "text-[clamp(2rem,4vw,4.5rem)]",
  "font-medium leading-[1.06]",
  "tracking-[-0.045em]",
]);

export const productShowcaseDescriptionVariants = cva([
  "mt-5 max-w-md",
  "text-sm leading-relaxed",
  "sm:text-base",
]);

export const productShowcaseDisplayContainerVariants = cva([
  "relative w-full min-w-0",
  "flex items-center justify-center",
  "lg:col-start-2",
  "lg:row-start-1 lg:row-span-2",
]);

export const productDisplayVariants = cva([
  "relative isolate",
  "flex w-full min-w-0",
  "h-[clamp(20rem,45vw,36rem)]",
  "items-center justify-center",
]);

export const productDisplayHaloVariants = cva([
  "pointer-events-none absolute",
  "aspect-square w-full max-w-120",
  "rounded-full",
  "bg-[radial-gradient(circle,white,transparent_70%)]",
  "opacity-70",
]);

export const productDisplayRingVariants = cva(
  [
    "pointer-events-none absolute",
    "aspect-square rounded-full",
    "border border-white/60",
  ],
  {
    variants: {
      size: {
        outer: "w-[95%] max-w-115",
        inner: "w-[75%] max-w-90",
      },
    },
    defaultVariants: {
      size: "outer",
    },
  },
);

export const productDisplayShadowVariants = cva([
  "pointer-events-none absolute",
  "bottom-[5%] left-1/2",
  "-translate-x-1/2",
  "h-5 w-1/2 rounded-full",
  "bg-black/15 blur-xl",
]);

export const productDisplayItemVariants = cva(
  ["absolute inset-0", "flex items-center justify-center"],
  {
    variants: {
      active: {
        true: ["z-10 visible opacity-100"],
        false: ["z-0 invisible opacity-0", "pointer-events-none"],
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const productDisplayImageVariants = cva([
  "h-[90%] w-auto max-w-full",
  "object-contain select-none",
]);

export const productShowcaseSelectorContainerVariants = cva([
  "relative z-20",
  "flex w-full min-w-0",
  "items-center justify-center",
  "lg:col-start-3",
  "lg:row-start-1 lg:row-span-2",
  "lg:justify-end",
]);

export const productShowcaseInformationContainerVariants = cva([
  "relative min-w-0",
  "flex flex-col items-center",
  "text-center",
  "lg:col-start-1 lg:row-start-2",
  "lg:items-start lg:text-left",
]);

export const productShowcaseVolumeVariants = cva([
  "text-[clamp(3rem,6vw,6rem)]",
  "font-light leading-none",
  "tracking-[-0.06em]",
  "tabular-nums",
]);

export const productShowcaseInformationVariants = cva([
  "mt-5 flex min-w-0 flex-col",
  "gap-3",
]);

export const productShowcaseProductTitleVariants = cva([
  "text-xl font-medium",
  "leading-tight tracking-tight",
  "sm:text-2xl",
]);

export const productShowcaseProductDescriptionVariants = cva([
  "max-w-sm",
  "text-sm leading-relaxed",
  "sm:text-base",
]);
