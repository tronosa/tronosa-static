import { cn } from "@/lib/cn";

import {
  buttonArrowVariants,
  buttonArrowIconVariants,
} from "./button.variants";

import type { ButtonArrowProps } from "./types";

export function ButtonArrow({ variant, size }: ButtonArrowProps) {
  return (
    <span aria-hidden="true" className={buttonArrowVariants({ variant, size })}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          buttonArrowIconVariants({
            position: "outgoing",
            size,
          }),
        )}
      >
        <path d="M6 18 18 6M7 6h11v11" />
      </svg>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          buttonArrowIconVariants({
            position: "incoming",
            size,
          }),
        )}
      >
        <path d="M6 18 18 6M7 6h11v11" />
      </svg>
    </span>
  );
}
