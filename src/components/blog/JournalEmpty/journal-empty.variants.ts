import { cva } from "class-variance-authority";

export const journalEmptyVariants = cva(["text-brand-forest"]);

export const journalEmptyContentVariants = cva([
  "flex max-w-2xl flex-col gap-4",
]);

export const journalEmptyTitleVariants = cva([
  "text-3xl font-semibold tracking-tight",
]);

export const journalEmptyDescriptionVariants = cva([
  "leading-relaxed text-brand-graphite",
]);
