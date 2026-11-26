import { getContentHref } from "@/lib/content/content-paths";
import { getLocale } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";

import { locales } from "@/i18n/config";
import { getContentById } from "@/lib/content/registry";

import { SliderViewport } from "./SliderViewport";
import { SliderCard } from "./SliderCard";

import {
  cardSliderHeaderVariants,
  cardSliderEyebrowVariants,
} from "./card-slider.variants";

import type { CardSliderProps } from "./types";

export async function CardSlider({
  eyebrow,
  title,
  description,
  cards,
  accessibility,
  className,
}: CardSliderProps) {
  const currentLocale = await getLocale();

  const locale = locales.find(
    (supportedLocale) => supportedLocale === currentLocale,
  );

  if (!locale) {
    throw new Error(`Unsupported locale: ${currentLocale}`);
  }

  const resolvedCards = cards.map((card) => {
    if (!card.cta) {
      return {
        card,
        ctaHref: undefined,
      };
    }

    const entry = getContentById("page", locale, card.cta.pageId);

    if (!entry) {
      throw new Error(
        `CardSlider CTA target "${card.cta.pageId}" does not exist for locale "${locale}".`,
      );
    }

    return {
      card,
      ctaHref: getContentHref(entry),
    };
  });

  return (
    <Section aria-label={title} className={className}>
      <Container size="wide">
        <div className={cardSliderHeaderVariants()}>
          {eyebrow && <p className={cardSliderEyebrowVariants()}>{eyebrow}</p>}

          <Typography as="h2" variant="h2">
            {title}
          </Typography>

          {description && <Typography as="p">{description}</Typography>}
        </div>

        <SliderViewport
          accessibility={accessibility}
          count={resolvedCards.length}
        >
          {resolvedCards.map(({ card, ctaHref }, index) => (
            <SliderCard key={index} card={card} ctaHref={ctaHref} />
          ))}
        </SliderViewport>
      </Container>
    </Section>
  );
}
