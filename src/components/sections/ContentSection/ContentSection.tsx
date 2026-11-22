import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { Section } from "@/components/ui/Section";

import {
  contentSectionVariants,
  contentSectionContainerVariants,
  contentSectionBodyVariants,
} from "./content-section.variants";

import type { ContentSectionProps } from "./types";

export function ContentSection({ width, blocks }: ContentSectionProps) {
  return (
    <Section className={contentSectionVariants()}>
      <Container size="wide">
        <div
          className={contentSectionContainerVariants({
            width,
          })}
        >
          <RichText content={blocks} className={contentSectionBodyVariants()} />
        </div>
      </Container>
    </Section>
  );
}
