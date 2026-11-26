import { cva } from "class-variance-authority";

export const sliderViewportVariants = cva(["min-w-0"]);

export const sliderFallbackViewportVariants = cva([
  "grid min-w-0",
  "grid-flow-col auto-cols-[100%]",
  "gap-4",
  "overflow-x-auto",
  "snap-x snap-mandatory",
  "scrollbar-none",
  "[&::-webkit-scrollbar]:hidden",
  "sm:auto-cols-[calc((100%-20px)/2)] sm:gap-5",
  "lg:auto-cols-[calc((100%-48px)/3)] lg:gap-6",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-focus-ring",
]);

export const sliderFallbackSlideVariants = cva(["min-w-0", "snap-start"]);

export const sliderFallbackControlsVariants = cva("mt-6 h-12", {
  variants: {
    count: {
      one: "hidden",
      two: "sm:hidden",
      three: "lg:hidden",
      multiple: "",
    },
  },
});
