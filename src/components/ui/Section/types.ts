import type { ComponentPropsWithRef } from "react";
import type { VariantProps } from "class-variance-authority";

import type { sectionVariants } from "./section.variants";

export type SectionProps = ComponentPropsWithRef<"section"> &
  VariantProps<typeof sectionVariants>;
