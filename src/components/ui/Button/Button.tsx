import { Slot, Slottable } from "@radix-ui/react-slot";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

import { ButtonArrow } from "./ButtonArrow";
import { buttonVariants } from "./button.variants";

import type { ButtonProps } from "./types";

export function Button({
  asChild = false,
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, arrow }), className);

  if (asChild) {
    return (
      <Slot {...(props as ComponentPropsWithoutRef<"a">)} className={classes}>
        <Slottable>{children}</Slottable>

        {arrow && <ButtonArrow variant={variant} size={size} />}
      </Slot>
    );
  }

  return (
    <button
      type="button"
      {...(props as ComponentPropsWithoutRef<"button">)}
      className={classes}
    >
      {children}

      {arrow && <ButtonArrow variant={variant} size={size} />}
    </button>
  );
}
