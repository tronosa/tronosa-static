import { Picture } from "@/components/media/Picture";

import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

import { IMAGE_QUALITY } from "@/lib/media/image-quality";

import type { HeritageStoryContent } from "./heritage-story.schema";

import {
  heritageVariants,
  heritageHeaderVariants,
  heritageEyebrowVariants,
  heritageOrnamentVariants,
  heritageOrnamentLineVariants,
  heritageOrnamentCenterVariants,
  heritageTitleVariants,
  heritageImageVariants,
  heritageCaptionVariants,
  heritageContentVariants,
  heritageParagraphVariants,
} from "./heritage-story.variants";
import { Section } from "@/components/ui/Section";
import { IMAGE_SIZES } from "@/lib/media/image-sizes";

export function HeritageStory({
  eyebrow,
  title,
  image,
  paragraphs,
  caption,
  appearance,
}: HeritageStoryContent) {
  return (
    <Section
      spacingType="padding"
      data-heritage-story
      className={heritageVariants()}
      style={{
        backgroundColor: appearance.backgroundColor,
        color: appearance.accentColor,
      }}
    >
      <Container size="wide">
        <header className={heritageHeaderVariants()}>
          <div aria-hidden="true" className={heritageOrnamentVariants()}>
            <span className={heritageOrnamentLineVariants()} />

            <span className={heritageOrnamentCenterVariants()} />

            <span className={heritageOrnamentLineVariants()} />
          </div>

          {eyebrow && (
            <Typography
              as="p"
              variant="caption"
              weight="semibold"
              align="center"
              tone={null}
              className={heritageEyebrowVariants()}
            >
              {eyebrow}
            </Typography>
          )}

          <Typography
            as="h2"
            variant="h2"
            weight="medium"
            align="center"
            tone={null}
            className={heritageTitleVariants()}
          >
            {title}
          </Typography>
        </header>

        <figure>
          <div className={heritageImageVariants()}>
            <Picture
              {...image}
              ratio="fill"
              fit="cover"
              quality={IMAGE_QUALITY.editorial}
              loading="lazy"
              sizes={IMAGE_SIZES.heritage}
            />
          </div>

          {caption && (
            <Typography
              as="figcaption"
              variant="caption"
              align="center"
              tone={null}
              className={heritageCaptionVariants()}
            >
              {caption}
            </Typography>
          )}
        </figure>

        <div className={heritageContentVariants()}>
          {paragraphs.map((paragraph, index) => (
            <Typography
              key={index}
              as="p"
              variant="body"
              tone={null}
              className={heritageParagraphVariants()}
            >
              {paragraph}
            </Typography>
          ))}
        </div>
      </Container>
    </Section>
  );
}
