"use client";

import * as Accordion from "@radix-ui/react-accordion";

import {
  faqAccordionVariants,
  faqItemVariants,
  faqTriggerVariants,
  faqIconContainerVariants,
  faqIconVariants,
  faqAnswerVariants,
} from "./faq.variants";

import type { FaqAccordionProps } from "./types";

import "./faq.css";

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className={faqAccordionVariants()}
    >
      {items.map((item, index) => (
        <Accordion.Item
          key={index}
          value={`faq-item-${index}`}
          className={faqItemVariants()}
        >
          <Accordion.Header asChild>
            <h3>
              <Accordion.Trigger className={faqTriggerVariants()}>
                <span className="min-w-0 wrap-break-word">{item.question}</span>

                <span aria-hidden="true" className={faqIconContainerVariants()}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    className={faqIconVariants()}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </Accordion.Trigger>
            </h3>
          </Accordion.Header>

          <Accordion.Content forceMount className="tronosa-faq-content">
            <div className="tronosa-faq-content-inner">
              <p className={faqAnswerVariants()}>{item.answer}</p>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
