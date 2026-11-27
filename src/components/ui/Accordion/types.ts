import type { ComponentProps } from "react";
import type * as AccordionPrimitive from "@radix-ui/react-accordion";

export type AccordionProps = ComponentProps<typeof AccordionPrimitive.Root>;

export type AccordionItemProps = ComponentProps<typeof AccordionPrimitive.Item>;

export type AccordionHeaderProps = ComponentProps<
  typeof AccordionPrimitive.Header
>;

export type AccordionTriggerProps = ComponentProps<
  typeof AccordionPrimitive.Trigger
>;

export type AccordionContentProps = Omit<
  ComponentProps<typeof AccordionPrimitive.Content>,
  "forceMount"
> & {
  persistentOnDesktop?: boolean;
};
