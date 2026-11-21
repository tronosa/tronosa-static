import { cva } from "class-variance-authority";

export const richTextInlineVariants = cva("", {
  variants: {
    color: {
      default: "",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
    },
    underline: {
      true: "underline underline-offset-4",
      false: "",
    },
  },
  defaultVariants: {
    color: "default",
    underline: false,
  },
});
