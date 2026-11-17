import { cva } from "class-variance-authority";

export const videoHeroVariants = cva([
  "relative isolate flex w-full flex-col justify-end",
  "min-h-screen overflow-hidden",
  "bg-brand-forest text-white",
]);

export const videoHeroOverlayVariants = cva(
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

export const videoHeroContentVariants = cva(
  [
    "relative z-20",
    "flex min-w-0 flex-col",
    "gap-6 md:gap-8",
    "pt-40 pb-24 md:pt-48 md:pb-28",
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

export const videoHeroTextVariants = cva([
  "flex w-full min-w-0 max-w-3xl flex-col",
  "gap-3 md:gap-5",
  "wrap-break-word",
]);

export const videoHeroCtaVariants = cva([
  "w-full sm:w-auto",
  "min-h-11",
  "justify-between",
  "whitespace-normal sm:whitespace-nowrap",
]);
