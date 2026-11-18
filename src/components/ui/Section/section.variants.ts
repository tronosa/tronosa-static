import { cva } from "class-variance-authority";

export const sectionVariants = cva("relative w-full", {
  variants: {
    spacing: {
      none: "",
      sm: "",
      md: "",
      lg: "",
    },

    spacingType: {
      margin: "",
      padding: "",
    },
  },

  compoundVariants: [
    {
      spacing: "sm",
      spacingType: "margin",
      className: "my-8 md:my-12 lg:my-16",
    },
    {
      spacing: "md",
      spacingType: "margin",
      className: "my-12 md:my-16 lg:my-24",
    },
    {
      spacing: "lg",
      spacingType: "margin",
      className: "my-16 md:my-24 lg:my-32",
    },
    {
      spacing: "sm",
      spacingType: "padding",
      className: "py-8 md:py-12 lg:py-16",
    },
    {
      spacing: "md",
      spacingType: "padding",
      className: "py-12 md:py-16 lg:py-24",
    },
    {
      spacing: "lg",
      spacingType: "padding",
      className: "py-16 md:py-24 lg:py-32",
    },
  ],

  defaultVariants: {
    spacing: "md",
    spacingType: "margin",
  },
});
