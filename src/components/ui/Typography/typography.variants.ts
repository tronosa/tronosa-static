import { cva } from "class-variance-authority";

export const typographyVariants = cva("font-sans", {
  variants: {
    variant: {
      display:
        "text-[length:var(--type-display)] leading-[1.08] tracking-[-0.035em]",
      h1: "text-[length:var(--type-h1)] leading-[1.12] tracking-[-0.03em]",
      h2: "text-[length:var(--type-h2)] leading-[1.2] tracking-[-0.025em]",
      h3: "text-[length:var(--type-h3)] leading-[1.3] tracking-[-0.02em]",
      h4: "text-[length:var(--type-h4)] leading-[1.35]",
      lead: "text-[length:var(--type-lead)] leading-[1.65]",
      body: "text-base leading-[1.7]",
      small: "text-sm leading-[1.55]",
      caption: "text-xs leading-[1.5]",
    },

    tone: {
      default: "text-foreground",
      muted: "text-foreground-muted",
      primary: "text-primary",
      accent: "text-brand-forest",
      bronze: "text-foreground-bronze",
      inverse: "text-primary-foreground",
    },

    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },

    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },

  defaultVariants: {
    variant: "body",
    tone: "default",
    weight: "normal",
    align: "left",
  },
});
