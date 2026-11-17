import { cva } from "class-variance-authority";
export const partnersMarqueeVariants = cva(
  "overflow-hidden bg-surface-muted py-16 md:py-24",
);
export const partnersMarqueeHeaderVariants = cva(
  "mx-auto mb-10 max-w-2xl space-y-4 text-center md:mb-14",
);
export const partnerLogoVariants = cva(
  "flex min-w-0 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface px-6 py-5",
);
export const partnersControlVariants = cva(
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-primary px-4 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring motion-reduce:transition-none",
);
