import { Picture } from "@/components/media/Picture";

import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

import { IMAGE_QUALITY } from "@/lib/media/image-quality";

import type { EditorialCompositionContent } from "./editorial-composition.schema";

import {
  compositionVariants,
  compositionHeaderVariants,
  compositionEyebrowVariants,
  compositionTitleVariants,
  compositionLayoutVariants,
  compositionPrimaryVariants,
  compositionPrimaryImageVariants,
  compositionCaptionVariants,
  compositionContentVariants,
  compositionDecorationVariants,
  compositionParagraphsVariants,
  compositionSecondaryVariants,
  compositionStatementLayoutVariants,
  compositionStatementDecorationVariants,
  compositionStatementContentVariants,
  compositionStatementMarkerVariants,
  compositionStatementVariants,
} from "./editorial-composition.variants";
import { IMAGE_SIZES } from "@/lib/media/image-sizes";

const RIPPLE_RADII = [32, 52, 72, 92, 112, 132, 152, 172, 192] as const;

export function EditorialComposition({
  eyebrow,
  title,
  paragraphs,
  statement,
  primaryImage,
  secondaryImage,
  caption,
  appearance,
}: EditorialCompositionContent) {
  return (
    <Section
      data-editorial-composition
      spacing="lg"
      spacingType="padding"
      className={compositionVariants()}
      style={{
        backgroundColor: appearance.backgroundColor,
        color: appearance.accentColor,
      }}
    >
      <Container size="wide">
        <header className={compositionHeaderVariants()}>
          {eyebrow && (
            <Typography
              as="p"
              variant="caption"
              weight="semibold"
              tone={null}
              className={compositionEyebrowVariants()}
            >
              {eyebrow}
            </Typography>
          )}

          <Typography
            as="h2"
            variant="h2"
            weight="medium"
            tone={null}
            className={compositionTitleVariants()}
          >
            {title}
          </Typography>
        </header>

        <div className={compositionLayoutVariants()}>
          <figure className={compositionPrimaryVariants()}>
            <div className={compositionPrimaryImageVariants()}>
              <Picture
                {...primaryImage}
                ratio="fill"
                fit="cover"
                loading="lazy"
                quality={IMAGE_QUALITY.editorial}
                sizes={IMAGE_SIZES.editorialComposition.primary}
              />
            </div>

            {caption && (
              <Typography
                as="figcaption"
                variant="caption"
                tone={null}
                className={compositionCaptionVariants()}
              >
                {caption}
              </Typography>
            )}
          </figure>

          <div className={compositionContentVariants()}>
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 120 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              className={compositionDecorationVariants()}
            >
              <path d="M0 9C20-3 40-3 60 9S100 21 120 9" />
              <path d="M0 21C20 9 40 9 60 21S100 33 120 21" />
              <path d="M0 33C20 21 40 21 60 33S100 45 120 33" />
            </svg>

            <div className={compositionParagraphsVariants()}>
              {paragraphs.map((paragraph, index) => (
                <Typography key={index} as="p" variant="body" tone={null}>
                  {paragraph}
                </Typography>
              ))}
            </div>

            {secondaryImage && (
              <div className={compositionSecondaryVariants()}>
                <Picture
                  {...secondaryImage}
                  ratio="fill"
                  fit="cover"
                  loading="lazy"
                  quality={IMAGE_QUALITY.editorial}
                  sizes={IMAGE_SIZES.editorialComposition.secondary}
                />
              </div>
            )}
          </div>
        </div>

        {statement && (
          <div
            className={compositionStatementLayoutVariants()}
            style={{
              backgroundColor: `${appearance.accentColor}0D`,
            }}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 400 400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className={compositionStatementDecorationVariants()}
            >
              {RIPPLE_RADII.map((radius) => (
                <circle key={radius} cx="200" cy="200" r={radius} />
              ))}
            </svg>

            <div className={compositionStatementContentVariants()}>
              <span
                aria-hidden="true"
                className={compositionStatementMarkerVariants()}
              />

              <Typography
                as="p"
                variant="h3"
                weight="medium"
                tone={null}
                className={compositionStatementVariants()}
              >
                {statement}
              </Typography>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
