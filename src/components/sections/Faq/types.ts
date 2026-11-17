import type { z } from "zod";

import type { faqContentSchema, faqSectionSchema } from "./faq.schema";

export type FaqContent = z.infer<typeof faqContentSchema>;

export type FaqSection = z.infer<typeof faqSectionSchema>;

export type FaqProps = FaqContent & {
  className?: string;
};

export type FaqAccordionProps = Pick<FaqContent, "items">;
