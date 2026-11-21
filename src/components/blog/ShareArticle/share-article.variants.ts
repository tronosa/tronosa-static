import { cva } from "class-variance-authority";

export const shareArticleTriggerVariants = cva([
  "inline-flex min-h-11 items-center justify-center gap-2",
  "rounded-full border border-white/40 px-4 py-2",
  "text-sm font-medium text-white",
  "cursor-pointer",
  "transition-colors duration-200",
  "hover:border-white/70 hover:bg-white/10",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-white",
  "motion-reduce:transition-none",
]);

export const shareArticlePopoverVariants = cva([
  "fixed inset-auto m-0",
  "w-72 max-w-[calc(100vw-1.5rem)]",
  "max-h-[calc(100dvh-1.5rem)] overflow-y-auto",
  "rounded-2xl border border-border",
  "bg-surface p-3 text-foreground",
  "shadow-[0_20px_60px_rgba(0,0,0,0.22)]",
]);

export const shareArticleActionVariants = cva([
  "group flex min-h-12 w-full items-center gap-3",
  "rounded-xl px-3 py-2",
  "text-left text-sm font-medium text-foreground",
  "cursor-pointer",
  "transition-colors duration-200",
  "hover:bg-brand-forest/10",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-focus-ring",
  "motion-reduce:transition-none",
]);

export const shareArticleIconVariants = cva([
  "flex size-9 shrink-0 items-center justify-center",
  "rounded-lg bg-brand-forest/10",
  "text-brand-forest",
]);

export const shareArticleSectionVariants = cva([
  "flex w-full items-center justify-end",
]);
