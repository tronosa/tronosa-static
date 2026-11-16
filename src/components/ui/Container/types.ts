import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

import type { containerVariants } from "./container.variants";

type ContainerBaseProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof containerVariants>;

export type ContainerProps = ContainerBaseProps &
  (
    | {
        asChild: true;
        children: ReactElement;
      }
    | {
        asChild?: false;
        children?: ReactNode;
      }
  );
