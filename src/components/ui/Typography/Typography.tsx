import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/cn";

import { typographyVariants } from "./typography.variants";
import type { TypographyProps } from "./types";

export function Typography({
  as = "p",
  asChild = false,
  variant,
  tone,
  weight,
  align,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = asChild ? Slot : as;

  return (
    <Component
      {...props}
      className={cn(
        typographyVariants({
          variant,
          tone,
          weight,
          align,
        }),
        className,
      )}
    >
      {children}
    </Component>
  );
}
