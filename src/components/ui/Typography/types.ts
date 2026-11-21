import type { VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";

import type { typographyVariants } from "./typography.variants";

export type TypographyElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "li"
  | "span"
  | "div"
  | "blockquote"
  | "figcaption";

type TypographyBaseProps = Omit<HTMLAttributes<HTMLElement>, "children"> &
  VariantProps<typeof typographyVariants>;

export type TypographyProps = TypographyBaseProps &
  (
    | {
        asChild: true;
        as?: never;
        children: ReactElement;
      }
    | {
        asChild?: false;
        as?: TypographyElement;
        children?: ReactNode;
      }
  );
