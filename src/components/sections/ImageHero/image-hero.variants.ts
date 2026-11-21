import { cva } from "class-variance-authority";

export const imageHeroVariants = cva(
  [
    "relative isolate flex w-full",
    "flex-col justify-end overflow-hidden",
    "bg-brand-forest text-white",
  ],
  {
    variants: {
      size: {
        sm: "min-h-96",
        md: "min-h-[60vh]",
        lg: "min-h-[80vh]",
        full: "min-h-screen",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const imageHeroOverlayVariants = cva(
  "pointer-events-none absolute inset-0 z-10",
  {
    variants: {
      overlay: {
        subtle: "bg-black/25",
        gradient: ["bg-linear-to-t", "from-black/85 via-black/35 to-black/15"],
        dark: "bg-black/50",
        none: "",
      },
    },
    defaultVariants: {
      overlay: "gradient",
    },
  },
);

export const imageHeroContentVariants = cva(
  [
    "relative z-20",
    "flex min-w-0 flex-col",
    "gap-6 md:gap-8",
    "pt-[var(--hero-content-offset)]",
    "pb-12 md:pb-20",
  ],
  {
    variants: {
      align: {
        left: "items-start text-left",
        center: "items-center text-center",
        right: "items-end text-right",
      },
    },
    defaultVariants: {
      align: "left",
    },
  },
);

export const imageHeroTextVariants = cva([
  "flex w-full min-w-0 max-w-3xl flex-col",
  "gap-3 md:gap-5",
  "wrap-break-word",
]);

export const imageHeroEyebrowVariants = cva([
  "text-xs font-medium uppercase",
  "tracking-[0.2em] text-white/95",
  "md:text-sm",
]);

export const imageHeroCtaVariants = cva([
  "w-full sm:w-auto",
  "min-h-11 justify-between",
  "whitespace-normal sm:whitespace-nowrap",
]);
