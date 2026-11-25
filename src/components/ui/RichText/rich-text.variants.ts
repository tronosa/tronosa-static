import { cva } from "class-variance-authority";

export const richTextInlineVariants = cva("", {
  variants: {
    color: {
      default: "",
      primary: "text-primary",
      secondary: "text-secondary",
      accent: "text-accent",
      bronze: "text-foreground-bronze",
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

export const richTextLinkVariants = cva([
  "font-medium underline underline-offset-4",
  "decoration-current/60",
  "transition-colors hover:decoration-current",
  "focus-visible:rounded-sm",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
]);
