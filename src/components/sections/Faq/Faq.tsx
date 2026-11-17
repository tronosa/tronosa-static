import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

import { cn } from "@/lib/cn";

import { FaqAccordion } from "./FaqAccordion";

import { faqVariants, faqLayoutVariants } from "./faq.variants";

import type { FaqProps } from "./types";

export function Faq({ title, description, items, className }: FaqProps) {
  return (
    <section aria-label={title} className={cn(faqVariants(), className)}>
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
    </section>
  );
}
