import { cva } from "class-variance-authority";
export const statsBannerVariants = cva(
  "relative isolate overflow-hidden bg-brand-forest py-14 text-white md:py-20",
);
export const statsBannerContentVariants = cva(
  "relative z-10 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16",
);
export const statsBannerGridVariants = cva("grid min-w-0 gap-6 sm:grid-cols-2");
export const statsBannerValueVariants = cva(
  "text-[clamp(2.5rem,5vw,5rem)] leading-none font-medium tracking-tight tabular-nums wrap-break-word",
);
