import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";

import type { TextHeroProps } from "./types";

import {
  textHeroVariants,
  textHeroLayoutVariants,
  textHeroContentVariants,
  textHeroEyebrowVariants,
  textHeroTitleVariants,
  textHeroDescriptionVariants,
  textHeroDividerVariants,
} from "./text-hero.variants";

export function TextHero({
  eyebrow,
  title,
  description,
  alignment = "left",
}: TextHeroProps) {
  return (
    <Section className={textHeroVariants()} data-text-hero>
      <Container size="wide">
        <div className={textHeroLayoutVariants()}>
          <header
            className={textHeroContentVariants({
              alignment,
            })}
          >
            {eyebrow && (
              <Typography
                variant="caption"
                weight="semibold"
                tone="accent"
                className={textHeroEyebrowVariants()}
              >
                {eyebrow}
              </Typography>
            )}

            <Typography
              as="h1"
              variant="display"
              weight="medium"
              tone="accent"
              className={textHeroTitleVariants()}
            >
              {title}
            </Typography>

            {description && (
              <Typography
                as="p"
                variant="lead"
                tone="muted"
                className={textHeroDescriptionVariants()}
              >
                {description}
              </Typography>
            )}
          </header>

          <div aria-hidden="true" className={textHeroDividerVariants()} />
        </div>
      </Container>
    </Section>
  );
}
