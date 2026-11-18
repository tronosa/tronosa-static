import { cva } from "class-variance-authority";

/* Root */

export const productExperienceVariants = cva([
  "relative isolate",
  "bg-(--experience-background)",
  "text-(--experience-accent)",
]);

export const experienceViewportVariants = cva([
  "group relative isolate w-full",
  "data-[animated=true]:h-(--experience-height)",
  "data-[animated=true]:overflow-hidden",
]);

export const experienceDesktopVariants = cva([
  "hidden",
  "group-data-[animated=true]:block",
  "h-full",
]);

export const experienceMobileVariants = cva([
  "relative",
  "group-data-[animated=true]:hidden",
]);

/* Desktop background */

export const experienceAmbientVariants = cva([
  "pointer-events-none absolute inset-0",
  "overflow-hidden",
  "bg-linear-to-br",
  "from-white/40 via-transparent to-black/5",
]);

export const experienceGlowVariants = cva([
  "pointer-events-none absolute top-1/2 left-1/2",
  "-translate-x-1/2 -translate-y-1/2",
  "aspect-square w-[80%] max-w-180",
  "rounded-full opacity-60",
  "bg-[radial-gradient(circle,white,transparent_70%)]",
]);

export const experienceBackgroundTextVariants = cva([
  "pointer-events-none absolute top-1/2 left-1/2",
  "-translate-x-1/2 -translate-y-1/2",
  "whitespace-nowrap select-none",
  "font-bold leading-none tracking-[-0.08em]",
  "text-white/45",
  "text-[clamp(5rem,18vw,24rem)]",
]);

/* Product stage */

export const experienceStageVariants = cva([
  "pointer-events-none absolute inset-0",
  "isolate h-full w-full",
]);

export const experienceRingVariants = cva(
  [
    "pointer-events-none absolute",
    "top-1/2 left-1/2",
    "-translate-x-1/2 -translate-y-1/2",
    "aspect-square rounded-full",
    "border border-white/50",
  ],
  {
    variants: {
      size: {
        inner: "w-[60%] max-w-90",
        outer: "w-[80%] max-w-115",
      },
    },

    defaultVariants: {
      size: "outer",
    },
  },
);

export const experienceBottleVariants = cva([
  "absolute top-1/2 left-1/2",
  "-translate-x-1/2 -translate-y-1/2",
  "m-0 flex h-[60%] w-[40%] max-w-100",
  "min-w-0 flex-col items-center justify-center",
]);

export const experienceBottleMotionVariants = cva([
  "flex h-full w-full min-w-0",
  "items-center justify-center",
]);

export const experienceBottleImageVariants = cva([
  "h-full w-auto max-w-full",
  "object-contain select-none",
]);

export const experienceBottleCaptionVariants = cva(["sr-only"]);

/* Desktop scenes */

export const experienceContentVariants = cva([
  "relative z-10",
  "mx-auto h-full w-full max-w-400",
  "px-6 sm:px-10",
]);

export const experienceSceneVariants = cva(
  [
    "relative flex w-full flex-col",
    "justify-center py-12 sm:py-16",
    "group-data-[animated=true]:absolute",
    "group-data-[animated=true]:inset-0",
    "group-data-[animated=true]:px-12",
    "group-data-[animated=true]:py-8",
    "2xl:group-data-[animated=true]:px-20",
  ],
  {
    variants: {
      alignment: {
        center: [
          "items-center text-center",
          "group-data-[animated=true]:justify-start",
        ],

        left: [
          "items-start text-left",
          "group-data-[animated=true]:justify-center",
        ],

        bottom: [
          "items-center text-center",
          "group-data-[animated=true]:justify-end",
          "group-data-[animated=true]:pb-10",
        ],
      },
    },

    defaultVariants: {
      alignment: "left",
    },
  },
);

/* Shared typography */

export const experienceEyebrowVariants = cva([
  "mb-3 text-xs font-semibold",
  "uppercase tracking-[0.18em]",
]);

export const experienceTitleVariants = cva(
  ["font-medium leading-[1.06]", "tracking-[-0.045em] text-balance"],
  {
    variants: {
      size: {
        hero: ["text-4xl sm:text-5xl", "lg:text-[clamp(2.5rem,4.5vw,5rem)]"],

        default: [
          "text-3xl sm:text-4xl",
          "lg:text-[clamp(2rem,3.2vw,3.75rem)]",
        ],
      },
    },

    defaultVariants: {
      size: "default",
    },
  },
);

export const experienceDescriptionVariants = cva([
  "mt-4 max-w-lg",
  "text-sm leading-relaxed",
  "sm:text-base",
]);

/* Individual product chapters */

export const experienceHighlightsContentVariants = cva([
  "grid w-full max-w-xl",
  "group-data-[animated=true]:max-w-[38%]",
]);

export const experienceProductDetailVariants = cva([
  "col-start-1 row-start-1",
  "flex min-w-0 flex-col",
]);

export const experienceProductVolumeVariants = cva([
  "mb-4 text-5xl font-light",
  "leading-none tracking-[-0.06em]",
  "tabular-nums",
]);

export const experienceProductDescriptionVariants = cva([
  "mt-4 text-sm leading-relaxed",
]);

export const experienceHighlightsListVariants = cva([
  "mt-6 flex flex-col gap-4",
]);

export const experienceHighlightItemVariants = cva([
  "border-t border-current/15 pt-3",
]);

export const experienceHighlightTitleVariants = cva([
  "text-lg font-semibold leading-tight",
]);

export const experienceHighlightDescriptionVariants = cva([
  "mt-1.5 text-sm leading-relaxed",
]);

/* Composition */

export const experienceCompositionContentVariants = cva([
  "w-full max-w-lg",
  "group-data-[animated=true]:max-w-[30%]",
]);

export const experienceMineralsVariants = cva([
  "mt-8 grid w-full grid-cols-2 gap-4",
  "sm:grid-cols-4",
  "group-data-[animated=true]:absolute",
  "group-data-[animated=true]:top-1/2",
  "group-data-[animated=true]:right-6",
  "group-data-[animated=true]:w-[28%]",
  "group-data-[animated=true]:-translate-y-1/2",
  "group-data-[animated=true]:grid-cols-2",
  "group-data-[animated=true]:mt-0",
]);

export const experienceMineralVariants = cva([
  "flex min-h-24 flex-col",
  "items-center justify-center",
  "rounded-3xl border border-white/70",
  "bg-white/40 p-3 text-center",
]);

export const experienceMineralSymbolVariants = cva([
  "text-2xl font-light",
  "tracking-tight sm:text-3xl",
]);

export const experienceMineralNameVariants = cva(["mt-1 text-sm font-medium"]);

export const experienceMineralValueVariants = cva([
  "mt-1 text-xs tabular-nums",
]);

/* Collection */

export const experienceCollectionContentVariants = cva([
  "flex max-w-xl flex-col items-center",
]);

/* Indicators */

export const experienceScrollIndicatorVariants = cva([
  "hidden",
  "group-data-[animated=true]:flex",
  "absolute bottom-5 left-1/2",
  "-translate-x-1/2",
  "flex-col items-center gap-2",
  "text-xs uppercase tracking-widest",
]);

export const experienceScrollIndicatorLineVariants = cva([
  "h-7 w-px bg-current/40",
]);

export const experienceProgressVariants = cva([
  "pointer-events-none absolute",
  "inset-x-0 bottom-0 z-20",
  "h-0.5 bg-black/10",
]);

export const experienceProgressBarVariants = cva([
  "h-full w-full origin-left",
  "scale-x-0 bg-current",
]);

/* Mobile experience */

export const mobileExperienceIntroVariants = cva([
  "relative isolate overflow-hidden",
  "px-6 pt-14 pb-12",
  "text-center sm:px-10 sm:pt-20",
]);

export const mobileExperienceIntroHeaderVariants = cva([
  "relative z-10 mx-auto max-w-xl",
]);

export const mobileExperienceCollectionVariants = cva([
  "relative isolate mx-auto",
  "flex flex-wrap items-end justify-center",
  "max-w-160 gap-4 py-10",
]);

export const mobileExperienceCollectionItemVariants = cva([
  "relative flex min-w-0",
  "h-[clamp(10rem,55vw,22rem)]",
  "w-[min(40%,10rem)]",
  "items-end justify-center",
]);

export const mobileExperienceProductVariants = cva([
  "relative isolate overflow-hidden",
  "px-6 py-14 sm:px-10 sm:py-20",
]);

export const mobileExperienceProductHeaderVariants = cva([
  "relative z-10 mx-auto max-w-xl",
  "text-center",
]);

export const mobileExperienceProductVolumeVariants = cva([
  "mb-3 text-sm font-semibold",
  "tracking-[0.15em] tabular-nums",
]);

export const mobileExperienceVisualVariants = cva([
  "relative isolate mx-auto flex",
  "h-[clamp(16rem,75vw,28rem)]",
  "w-full max-w-xl",
  "items-center justify-center",
  "my-8",
]);

export const mobileExperienceHaloVariants = cva([
  "pointer-events-none absolute",
  "aspect-square w-[85%] max-w-100",
  "rounded-full",
  "bg-[radial-gradient(circle,white,transparent_70%)]",
  "opacity-70",
]);

export const mobileExperienceRingVariants = cva([
  "pointer-events-none absolute",
  "aspect-square w-[85%] max-w-100",
  "rounded-full border border-white/70",
]);

export const mobileExperienceImageVariants = cva([
  "relative h-full w-auto max-w-full",
  "object-contain select-none",
]);

export const mobileExperienceBackgroundTextVariants = cva([
  "pointer-events-none absolute inset-0",
  "flex items-center justify-center",
  "overflow-hidden whitespace-nowrap",
  "font-bold tracking-[-0.07em]",
  "text-[clamp(3rem,15vw,10rem)]",
  "text-white/55 select-none",
]);

export const mobileExperienceDetailsVariants = cva([
  "relative z-10 mx-auto max-w-xl",
  "rounded-3xl border border-white/70",
  "bg-white/50 p-6 sm:p-8",
]);

export const mobileExperienceDescriptionVariants = cva([
  "text-base leading-relaxed",
]);

export const mobileExperienceHighlightsVariants = cva(["flex flex-col gap-4"]);

export const mobileExperienceHighlightVariants = cva([
  "border-b border-current/10 pb-4",
  "last:border-b-0 last:pb-0",
]);

export const mobileExperienceCompositionVariants = cva([
  "px-6 sm:px-10",
  "bg-(--experience-secondary-background)",
]);

export const mobileExperienceEndingVariants = cva(["px-6 sm:px-10"]);
