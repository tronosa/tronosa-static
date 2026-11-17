import { cva } from "class-variance-authority";

export const pictureVariants = cva(
  ["relative block w-full", "overflow-hidden"],
  {
    variants: {
      ratio: {
        auto: "",
        square: "aspect-square",
        landscape: "aspect-video",
        portrait: "aspect-3/4",
        wide: "aspect-21/9",
        fill: "absolute inset-0 size-full",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-lg",
        md: "rounded-2xl",
        lg: "rounded-3xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      ratio: "auto",
      radius: "none",
    },
  },
);

export const pictureImageVariants = cva("block size-full", {
  variants: {
    fit: {
      cover: "object-cover",
      contain: "object-contain",
      fill: "object-fill",
    },
    position: {
      center: "object-center",
      top: "object-top",
      bottom: "object-bottom",
      left: "object-left",
      right: "object-right",
    },
  },
  defaultVariants: {
    fit: "cover",
    position: "center",
  },
});
