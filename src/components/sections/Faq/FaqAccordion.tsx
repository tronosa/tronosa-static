"use client";

import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  AccordionIndicator,
} from "@/components/ui/Accordion";

import {
  faqAccordionVariants,
  faqItemVariants,
  faqTriggerVariants,
  faqIconContainerVariants,
  faqAnswerVariants,
} from "./faq.variants";

import type { FaqAccordionProps } from "./types";

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className={faqAccordionVariants()}
      data-faq-accordion
    >
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`faq-item-${index}`}
          className={faqItemVariants()}
        >
          <AccordionHeader asChild>
            <h3>
              <AccordionTrigger className={faqTriggerVariants()}>
                <span className="min-w-0 wrap-break-word">{item.question}</span>

                <span aria-hidden="true" className={faqIconContainerVariants()}>
                  <AccordionIndicator />
                </span>
              </AccordionTrigger>
            </h3>
          </AccordionHeader>

          <AccordionContent>
            <p className={faqAnswerVariants()}>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
