import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/cn";

import { containerVariants } from "./container.variants";
import type { ContainerProps } from "./types";

export function Container({
  asChild = false,
  size,
  gutter,
  className,
  children,
  ...props
}: ContainerProps) {
  const Component = asChild ? Slot : "div";

  return (
    <Component
      {...props}
      className={cn(containerVariants({ size, gutter }), className)}
    >
      {children}
    </Component>
  );
}
