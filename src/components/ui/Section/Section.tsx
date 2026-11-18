import { cn } from "@/lib/cn";

import { sectionVariants } from "./section.variants";

import type { SectionProps } from "./types";

export function Section({
  spacing,
  spacingType,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(sectionVariants({ spacing, spacingType }), className)}
      {...props}
    >
      {children}
    </section>
  );
}
