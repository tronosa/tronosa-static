import { cva } from "class-variance-authority";

export const articleMetadataVariants = cva([
  "relative w-full",
  "text-brand-forest",
  "py-6 md:py-8",
]);

export const articleMetadataLayoutVariants = cva([
  "flex min-w-0 flex-col",
  "gap-6 py-6",
  "border-y border-brand-forest/15",
  "md:flex-row md:flex-wrap md:items-center",
  "md:justify-between md:gap-8 md:py-8",
]);

export const articleAuthorVariants = cva(["flex min-w-0 items-center gap-4"]);

export const articleAuthorAvatarVariants = cva([
  "relative isolate flex size-14 shrink-0",
  "items-center justify-center",
  "overflow-hidden rounded-full",
  "bg-brand-forest text-brand-ivory",
  "ring-1 ring-brand-bronze/30",
  "ring-offset-4 ring-offset-brand-ivory",
  "md:size-16",
]);

export const articleAuthorImageVariants = cva(["size-full object-cover"]);

export const articleAuthorInitialsVariants = cva([
  "text-xl font-medium uppercase",
  "tracking-tight md:text-2xl",
]);

export const articleAuthorContentVariants = cva([
  "flex min-w-0 flex-col gap-1",
]);

export const articleAuthorNameVariants = cva([
  "text-base font-semibold",
  "leading-snug wrap-break-word",
  "md:text-lg",
]);

export const articleAuthorLinkVariants = cva([
  "wrap-break-word rounded-sm",
  "underline-offset-4",
  "hover:underline",
  "decoration-brand-bronze",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-4",
  "focus-visible:outline-focus-ring",
]);

export const articleMetadataDetailsVariants = cva([
  "grid min-w-0 grid-cols-2",
  "items-start gap-x-6 gap-y-5",
  "border-t border-brand-forest/10 pt-6",
  "md:flex md:flex-wrap md:items-center",
  "md:gap-x-8 md:gap-y-5",
  "md:border-0 md:pt-0",
  "xl:gap-x-12",
]);

export const articleMetadataItemVariants = cva([
  "flex min-w-0 flex-col gap-2",
  "md:border-l md:border-brand-forest/15",
  "md:pl-8 xl:pl-12",
]);

export const articleMetadataLabelVariants = cva([
  "text-[0.625rem] font-semibold uppercase",
  "tracking-[0.14em]",
  "text-brand-graphite",
  "sm:text-xs",
]);

export const articleMetadataValueVariants = cva([
  "text-sm font-medium",
  "leading-snug",
  "tabular-nums md:text-base",
]);

export const articleMetadataReadingValueVariants = cva([
  "flex items-center gap-2",
]);

export const articleMetadataReadingIconVariants = cva([
  "size-4 shrink-0",
  "text-brand-bronze",
  "md:size-5",
]);
