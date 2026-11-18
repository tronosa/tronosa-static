import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

import type { buttonVariants, buttonArrowVariants } from "./button.variants";

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonBaseProps = ButtonVariantProps & {
  className?: string;
};

export type ButtonProps = ButtonBaseProps &
  (
    | ({
        asChild: true;
        children: ReactElement;
      } & ComponentPropsWithoutRef<"a">)
    | ({
        asChild?: false;
        children: ReactNode;
      } & ComponentPropsWithoutRef<"button">)
  );

export type ButtonArrowProps = VariantProps<typeof buttonArrowVariants>;
