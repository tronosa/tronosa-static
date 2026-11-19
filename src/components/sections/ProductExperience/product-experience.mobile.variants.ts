import { cva } from "class-variance-authority";

export const mobileExperienceVariants = cva([
  "relative isolate",
  "group-data-[animated=true]:hidden",
]);

export const mobileExperienceShowcaseVariants = cva(
  [
    "relative isolate overflow-hidden",
    "px-5 pt-8 pb-14",
    "sm:px-10 sm:pt-12 sm:pb-20",
    "transition-colors duration-700",
  ],
  {
    variants: {
      appearance: {
        primary: "bg-(--experience-background)",
        secondary: "bg-(--experience-secondary-background)",
      },
    },
    defaultVariants: {
      appearance: "primary",
    },
  },
);

export const mobileExperienceContainerVariants = cva([
  "relative mx-auto w-full max-w-160",
]);

export const mobileExperienceHeaderVariants = cva([
  "flex items-center justify-between gap-4",
  "border-b border-current/15 pb-4",
]);

export const mobileExperienceLabelVariants = cva([
  "text-[10px] font-semibold uppercase",
  "tracking-[0.18em] sm:text-xs",
]);

export const mobileExperienceCounterVariants = cva([
  "shrink-0 text-xs font-medium tabular-nums",
  "opacity-90",
]);

/* Product visual */

export const mobileExperienceStageVariants = cva([
  "relative isolate overflow-hidden",
  "flex items-center justify-center",
  "h-[clamp(18rem,48svh,32rem)]",
  "touch-pan-y",
]);

export const mobileExperienceGlowVariants = cva([
  "pointer-events-none absolute",
  "aspect-square w-full max-w-120",
  "rounded-full opacity-80",
  "bg-[radial-gradient(circle,white,transparent_70%)]",
]);

export const mobileExperienceRingVariants = cva(
  [
    "pointer-events-none absolute",
    "aspect-square rounded-full",
    "border border-white/70",
  ],
  {
    variants: {
      size: {
        inner: "w-[65%] max-w-80",
        outer: "w-[85%] max-w-100",
      },
    },
    defaultVariants: {
      size: "outer",
    },
  },
);

export const mobileExperienceBackgroundTextVariants = cva([
  "pointer-events-none absolute inset-0",
  "flex items-center justify-center",
  "overflow-hidden whitespace-nowrap",
  "font-bold select-none leading-none",
  "tracking-[-0.08em]",
  "text-[clamp(4rem,19vw,10rem)]",
  "text-white/60",
]);

export const mobileExperienceWatermarkVariants = cva([
  "pointer-events-none absolute bottom-5 left-0",
  "text-[clamp(4rem,18vw,8rem)]",
  "font-light leading-none tracking-[-0.07em]",
  "opacity-15 tabular-nums select-none",
]);

export const mobileExperienceBottleVariants = cva([
  "relative z-10",
  "flex h-[82%] w-[65%]",
  "max-w-80 items-center justify-center",
]);

export const mobileExperienceImageVariants = cva([
  "h-full w-auto max-w-full",
  "object-contain select-none",
]);

/* Product navigation */

export const mobileExperienceNavigationVariants = cva([
  "relative z-20",
  "flex gap-2 overflow-x-auto",
  "py-2",
  "snap-x snap-mandatory",
  "scrollbar-none",
  "[&::-webkit-scrollbar]:hidden",
]);

export const mobileExperienceTabVariants = cva(
  [
    "flex min-h-11 min-w-24 flex-1",
    "shrink-0 snap-start",
    "items-center justify-center",
    "rounded-full border px-5 py-3",
    "text-sm font-medium whitespace-nowrap",
    "transition-colors duration-300",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-current",
  ],
  {
    variants: {
      active: {
        true: [
          "border-(--experience-accent)",
          "bg-(--experience-accent)",
          "text-white",
        ],
        false: [
          "border-current/20 bg-transparent",
          "text-current",
          "hover:bg-white/30",
        ],
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

/* Product content */

export const mobileExperienceContentVariants = cva(["relative pt-8 sm:pt-10"]);

export const mobileExperienceEyebrowVariants = cva([
  "mb-3 text-[10px] font-semibold",
  "uppercase tracking-[0.2em]",
  "opacity-90 sm:text-xs",
]);

export const mobileExperienceTitleVariants = cva([
  "max-w-lg text-balance",
  "text-[clamp(2.25rem,9vw,4rem)]",
  "font-medium leading-[1.04]",
  "tracking-[-0.05em]",
]);

export const mobileExperienceDescriptionVariants = cva([
  "mt-4 max-w-lg",
  "text-sm leading-relaxed opacity-80",
  "sm:text-base",
]);

export const mobileExperienceHighlightsVariants = cva(["mt-8 flex flex-col"]);

export const mobileExperienceHighlightVariants = cva([
  "grid grid-cols-[2rem_1fr] gap-3",
  "border-t border-current/15",
  "py-4 sm:py-5",
]);

export const mobileExperienceHighlightIndexVariants = cva([
  "pt-0.5 text-xs font-medium",
  "opacity-90 tabular-nums",
]);

export const mobileExperienceHighlightTitleVariants = cva([
  "text-base font-semibold leading-tight",
]);

export const mobileExperienceHighlightDescriptionVariants = cva([
  "mt-1.5 text-sm leading-relaxed opacity-90",
]);

/* Progress */

export const mobileExperienceProgressVariants = cva([
  "mt-6 flex items-center gap-1.5",
]);

export const mobileExperienceProgressItemVariants = cva(
  [
    "h-0.5 flex-1 rounded-full",
    "bg-(--experience-accent)",
    "transition-opacity duration-300",
  ],
  {
    variants: {
      active: {
        true: "opacity-100",
        false: "opacity-15",
      },
    },
  },
);

/* Mineral composition */

export const mobileExperienceCompositionVariants = cva([
  "relative",
  "border-t border-current/10",
  "bg-(--experience-secondary-background)",
  "px-5 sm:px-10",
]);

export const mobileExperienceCompositionInnerVariants = cva([
  "mx-auto w-full max-w-160",
]);
