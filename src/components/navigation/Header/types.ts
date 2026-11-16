import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

import type { headerInnerVariants } from "./header.variants";

export type HeaderProps = Omit<ComponentPropsWithoutRef<"header">, "children"> &
  VariantProps<typeof headerInnerVariants>;
