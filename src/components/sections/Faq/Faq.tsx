import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

import { FaqAccordion } from "./FaqAccordion";

import { faqLayoutVariants } from "./faq.variants";

import type { FaqProps } from "./types";
import { Section } from "@/components/ui/Section";

export function Faq({ title, description, items, className }: FaqProps) {
  return (
    <Section aria-label={title} className={className}>
      <Container size="wide">
        <div className={faqLayoutVariants()}>
          <div className="max-w-xl space-y-4">
            <Typography as="h2" variant="h2">
              {title}
            </Typography>

            {description && (
              <Typography as="p" tone="muted">
                {description}
              </Typography>
            )}
          </div>

          <FaqAccordion items={items} />
        </div>
      </Container>
    </Section>
  );
}
