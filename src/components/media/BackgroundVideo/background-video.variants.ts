import { cva } from "class-variance-authority";

export const backgroundVideoVariants = cva([
  "pointer-events-none absolute inset-0",
  "overflow-hidden",
]);

export const backgroundVideoMediaVariants = cva([
  "absolute inset-0 size-full",
  "object-cover object-center",
]);

export const backgroundVideoControlsVariants = cva([
  "pointer-events-auto absolute z-30",
  "bottom-6 right-6 md:bottom-8 md:right-8",
]);

export const backgroundVideoControlButtonVariants = cva([
  "inline-flex size-11 md:size-12",
  "items-center justify-center",
  "rounded-full border border-white/30",
  "bg-black/30 text-white",
  "backdrop-blur-md",
  "cursor-pointer",
  "transition-[background-color,border-color]",
  "duration-300 ease-out",
  "hover:border-white/70 hover:bg-black/50",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-white",
  "motion-reduce:transition-none",
]);
