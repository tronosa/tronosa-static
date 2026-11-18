import { cva } from "class-variance-authority";

export const productShowcaseVariants = cva([
  "relative isolate overflow-hidden",
  "bg-(--product-background) text-(--product-accent)",
  "transition-colors duration-700",
  "motion-reduce:transition-none",
]);

export const productShowcaseBackgroundVariants = cva([
  "pointer-events-none absolute inset-0",
  "bg-linear-to-br from-white/45 via-transparent to-black/5",
]);

export const productShowcaseBackgroundTextContainerVariants = cva([
  "pointer-events-none absolute inset-0",
  "flex items-center justify-center",
  "overflow-hidden select-none",
]);

export const productShowcaseBackgroundTextVariants = cva([
  "whitespace-nowrap font-bold",
  "leading-none tracking-[-0.075em]",
  "text-white/55",
  "text-[clamp(6rem,19vw,24rem)]",
]);

export const productShowcaseLayoutVariants = cva([
  "relative mx-auto grid w-full max-w-400",
  "grid-cols-1 items-center",
  "gap-x-6 px-6",
  "sm:px-10",
  "lg:min-h-190",
  "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,0.65fr)]",
  "lg:px-16",
  "xl:gap-x-10",
]);

export const productShowcaseHeaderVariants = cva([
  "relative z-10 min-w-0",
  "lg:col-start-1 lg:row-start-1",
  "lg:self-start lg:pt-12",
]);

export const productShowcaseEyebrowVariants = cva([
  "mb-5 text-xs font-semibold",
  "uppercase tracking-[0.2em]",
]);

export const productShowcaseTitleVariants = cva([
  "max-w-xl text-4xl font-medium",
  "leading-[1.05] tracking-[-0.045em]",
  "sm:text-5xl",
  "xl:text-6xl",
  "2xl:text-7xl",
]);

export const productShowcaseDescriptionVariants = cva([
  "mt-6 max-w-sm text-base",
  "leading-relaxed",
]);

export const productShowcaseDisplayContainerVariants = cva([
  "relative min-w-0",
  "lg:col-start-2 lg:row-span-2 lg:row-start-1",
]);

export const productShowcaseSelectorContainerVariants = cva([
  "relative z-10 mb-10 min-w-0",
  "lg:col-start-3 lg:row-start-1",
  "lg:row-span-2 lg:mb-0",
]);

export const productShowcaseInformationContainerVariants = cva([
  "relative z-10 min-w-0",
  "border-t border-current/15 pt-6",
  "lg:col-start-1 lg:row-start-2",
  "lg:self-end lg:pb-8",
]);

export const productShowcaseVolumeVariants = cva([
  "mb-5 text-5xl font-light",
  "leading-none tracking-tighter",
  "tabular-nums sm:text-6xl",
]);

export const productShowcaseInformationVariants = cva(["min-w-0"]);

export const productShowcaseProductTitleVariants = cva([
  "text-xl font-semibold",
  "leading-tight tracking-tight",
]);

export const productShowcaseProductDescriptionVariants = cva([
  "mt-3 max-w-sm text-sm",
  "leading-relaxed sm:text-base",
]);

/* Product display */

export const productDisplayVariants = cva([
  "relative isolate flex h-100 w-full",
  "min-w-0 items-center justify-center",
  "sm:h-125 lg:h-155 xl:h-175",
]);

export const productDisplayHaloVariants = cva([
  "pointer-events-none absolute",
  "aspect-square w-[85%] max-w-125",
  "rounded-full bg-white/60 blur-3xl",
]);

export const productDisplayRingVariants = cva(
  ["pointer-events-none absolute", "aspect-square rounded-full border"],
  {
    variants: {
      size: {
        outer: ["w-[90%] max-w-130", "border-white/60"],
        inner: ["w-[75%] max-w-105", "border-white/80"],
      },
    },
    defaultVariants: {
      size: "outer",
    },
  },
);

export const productDisplayShadowVariants = cva([
  "pointer-events-none absolute bottom-[6%]",
  "h-6 w-[45%] max-w-65",
  "rounded-[50%] bg-black/15 blur-xl",
]);

export const productDisplayItemVariants = cva(
  ["pointer-events-none absolute inset-0", "flex items-center justify-center"],
  {
    variants: {
      active: {
        true: "visible opacity-100",
        false: "invisible opacity-0",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const productDisplayImageVariants = cva([
  "h-[85%] w-auto max-w-[85%]",
  "object-contain select-none",
]);

/* Product selector */

export const productSelectorVariants = cva(["m-0 min-w-0 border-0 p-0"]);

export const productSelectorLegendVariants = cva([
  "mb-4 text-xs font-semibold uppercase",
  "tracking-[0.15em] text-(--product-accent)",
]);

export const productSelectorOptionsVariants = cva(["flex flex-wrap gap-3"]);

export const productSelectorOptionVariants = cva([
  "relative block cursor-pointer",
]);

export const productSelectorInputVariants = cva(["peer sr-only"]);

export const productSelectorCardVariants = cva(
  [
    "flex w-23 flex-col items-center",
    "justify-center gap-3 rounded-2xl",
    "border p-3 text-(--product-accent)",
    "transition-colors duration-300",
    "peer-focus-visible:outline-2",
    "peer-focus-visible:outline-offset-4",
    "peer-focus-visible:outline-(--product-accent)",
    "motion-reduce:transition-none",
    "sm:w-27",
  ],
  {
    variants: {
      active: {
        true: ["border-(--product-accent)", "bg-white/80"],
        false: ["border-black/15", "bg-white/30 hover:bg-white/60"],
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const productSelectorImageVariants = cva([
  "h-20 w-16 object-contain",
  "select-none sm:h-24",
]);

export const productSelectorVolumeVariants = cva(["text-sm font-semibold"]);
