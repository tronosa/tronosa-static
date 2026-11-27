"use client";

import { createContext, useContext, useId } from "react";

import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/cn";

import {
  accordionVariants,
  accordionItemVariants,
  accordionHeaderVariants,
  accordionTriggerVariants,
  accordionContentVariants,
  accordionContentInnerVariants,
  accordionIndicatorVariants,
} from "./accordion.variants";

import type {
  AccordionProps,
  AccordionItemProps,
  AccordionHeaderProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "./types";

import "./accordion.css";

const AccordionContentIdContext = createContext<string | undefined>(undefined);

export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      {...props}
      className={cn(accordionVariants(), className)}
    />
  );
}

export function AccordionItem({
  children,
  className,
  ...props
}: AccordionItemProps) {
  const id = useId();
  const contentId = `accordion-content-${id}`;

  return (
    <AccordionContentIdContext.Provider value={contentId}>
      <AccordionPrimitive.Item
        {...props}
        className={cn(accordionItemVariants(), className)}
      >
        {children}
      </AccordionPrimitive.Item>
    </AccordionContentIdContext.Provider>
  );
}

export function AccordionHeader({ className, ...props }: AccordionHeaderProps) {
  return (
    <AccordionPrimitive.Header
      {...props}
      className={cn(accordionHeaderVariants(), className)}
    />
  );
}

export function AccordionTrigger({
  className,
  ...props
}: AccordionTriggerProps) {
  const contentId = useContext(AccordionContentIdContext);

  return (
    <AccordionPrimitive.Trigger
      {...props}
      aria-controls={contentId}
      className={cn(accordionTriggerVariants(), className)}
    />
  );
}

export function AccordionContent({
  children,
  className,
  persistentOnDesktop = false,
  ...props
}: AccordionContentProps) {
  const contentId = useContext(AccordionContentIdContext);

  return (
    <AccordionPrimitive.Content
      {...props}
      id={contentId}
      forceMount
      className={cn(
        accordionContentVariants({
          persistentOnDesktop,
        }),
        className,
      )}
    >
      <div className={accordionContentInnerVariants()}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export function AccordionIndicator({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      className={cn(accordionIndicatorVariants(), className)}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
