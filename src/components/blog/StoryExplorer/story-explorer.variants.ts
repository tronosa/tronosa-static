import { cva } from "class-variance-authority";

export const storyExplorerVariants = cva(["relative w-full text-brand-forest"]);

export const storyExplorerHeaderVariants = cva([
  "mb-10 flex max-w-4xl",
  "flex-col items-start gap-5",
  "md:mb-14 md:gap-6",
]);

export const storyExplorerEyebrowVariants = cva([
  "flex items-center gap-3",
  "text-xs font-semibold uppercase",
  "tracking-[0.18em]",
]);

export const storyExplorerAccentVariants = cva([
  "h-0.5 w-6 shrink-0",
  "bg-brand-bronze",
]);

export const storyExplorerTitleVariants = cva([
  "max-w-4xl text-balance",
  "text-[clamp(2.25rem,5vw,5rem)]",
  "font-semibold leading-[1.04]",
  "tracking-[-0.05em]",
]);

export const storyExplorerDescriptionVariants = cva([
  "max-w-xl text-base leading-relaxed",
  "text-brand-graphite md:text-lg",
]);

export const storyExplorerLayoutVariants = cva([
  "grid min-w-0 items-start",
  "gap-10 lg:grid-cols-2",
  "lg:gap-12 xl:gap-20",
]);

export const storyExplorerListVariants = cva([
  "min-w-0 border-t border-brand-forest/20",
]);

export const storyExplorerItemVariants = cva([
  "relative min-w-0",
  "border-b border-brand-forest/15",
  "story-explorer-item",
]);

export const storyExplorerItemLinkVariants = cva([
  "group relative grid min-w-0",
  "grid-cols-[auto_minmax(0,1fr)]",
  "items-start gap-4 py-8",
  "md:gap-6 md:py-10",
  "lg:py-12",
  "rounded-sm",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-focus-ring",
]);

export const storyExplorerItemNumberVariants = cva([
  "pt-1.5 text-xs font-semibold tabular-nums",
  "text-brand-forest",
  "md:text-sm",
  "story-explorer-number",
  "transition-colors duration-300",
  "motion-reduce:transition-none",
]);

export const storyExplorerItemContentVariants = cva([
  "flex min-w-0 flex-col",
  "items-start gap-4",
]);

export const storyExplorerItemMetaVariants = cva([
  "flex flex-wrap items-center",
  "gap-x-3 gap-y-1",
  "text-xs font-medium uppercase",
  "tracking-wider",
]);

export const storyExplorerItemTitleVariants = cva([
  "max-w-xl text-balance",
  "text-[clamp(1.75rem,3vw,3rem)]",
  "font-semibold leading-[1.12]",
  "tracking-[-0.04em]",
  "transition-colors duration-300",
  "motion-reduce:transition-none",
  "story-explorer-title",
]);

export const storyExplorerItemDescriptionVariants = cva([
  "max-w-lg text-sm leading-relaxed",
  "text-brand-graphite md:text-base",
]);

export const storyExplorerItemCtaVariants = cva([
  "flex min-h-11 items-center gap-3",
  "text-sm font-semibold",
]);

export const storyExplorerItemArrowVariants = cva([
  "flex size-10 shrink-0",
  "items-center justify-center rounded-full",
  "border border-brand-bronze",
  "transition-colors duration-300",
  "group-hover:bg-brand-forest",
  "group-hover:text-brand-ivory",
  "group-focus-visible:bg-brand-forest",
  "group-focus-visible:text-brand-ivory",
  "motion-reduce:transition-none",
]);

export const storyExplorerMobileMediaVariants = cva([
  "relative aspect-16/10 w-full",
  "overflow-hidden rounded-xl",
  "bg-brand-forest/10",
  "lg:hidden",
]);

export const storyExplorerPanelVariants = cva([
  "sticky hidden min-w-0 self-start",
  "top-[clamp(1.5rem,5vh,4rem)]",
  "lg:block",
]);

export const storyExplorerMediaVariants = cva([
  "relative isolate w-full",
  "aspect-[4/5] max-h-[min(68svh,42rem)]",
  "overflow-hidden rounded-2xl",
  "bg-brand-forest/5",
]);

export const storyExplorerMediaImageVariants = cva(["size-full object-cover"]);

export const storyExplorerMediaLayerVariants = cva(
  [
    "absolute inset-0",
    "transition-opacity duration-500",
    "ease-in-out",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      active: {
        true: "z-10 opacity-100",
        false: "z-0 opacity-0",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const storyExplorerMediaFallbackVariants = cva([
  "absolute inset-0 flex items-center",
  "justify-center p-8 text-center",
  "bg-brand-forest/5",
]);

export const storyExplorerMediaCaptionVariants = cva([
  "flex items-center justify-between",
  "gap-4 border-b border-brand-forest/15",
  "py-5 text-xs font-medium uppercase",
  "tracking-wider",
]);

export const storyExplorerMediaCountVariants = cva([
  "shrink-0 font-semibold tabular-nums",
]);
