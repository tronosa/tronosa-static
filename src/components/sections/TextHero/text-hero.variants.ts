import { cva } from "class-variance-authority";

export const textHeroVariants = cva(["relative isolate"]);

export const textHeroLayoutVariants = cva([
  "flex min-w-0 flex-col",
  "gap-10 md:gap-14 lg:gap-20",
]);

export const textHeroContentVariants = cva(
  ["flex min-w-0 flex-col", "gap-5 md:gap-7"],
  {
    variants: {
      alignment: {
        left: "items-start text-left",
        center: "items-center text-center",
      },
    },

    defaultVariants: {
      alignment: "left",
    },
  },
);

export const textHeroEyebrowVariants = cva([
  "flex items-center gap-3 uppercase",
  "tracking-widest",
  "before:h-px before:w-8 before:bg-current",
]);

export const textHeroTitleVariants = cva(["max-w-5xl text-balance"]);

export const textHeroDescriptionVariants = cva(["max-w-2xl text-pretty"]);

export const textHeroDividerVariants = cva([
  "h-px w-full shrink-0",
  "bg-current/15",
]);
