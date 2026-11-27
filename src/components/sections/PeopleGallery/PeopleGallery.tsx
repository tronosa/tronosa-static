import { Picture } from "@/components/media/Picture";

import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

import { cn } from "@/lib/cn";
import { IMAGE_QUALITY } from "@/lib/media/image-quality";

import type { PeopleGalleryContent } from "./people-gallery.schema";

import {
  peopleGalleryVariants,
  peopleGalleryHeaderVariants,
  peopleGalleryHeadingVariants,
  peopleGalleryEyebrowVariants,
  peopleGalleryTitleVariants,
  peopleGalleryDescriptionVariants,
  peopleGalleryGridVariants,
  peopleGalleryItemVariants,
  peopleGalleryImageVariants,
} from "./people-gallery.variants";

import styles from "./people-gallery.module.css";
import { IMAGE_SIZES } from "@/lib/media/image-sizes";

const IMAGE_POSITIONS = [0, 1, 2] as const;

type GalleryCount = keyof typeof IMAGE_SIZES.peopleGallery;

export function PeopleGallery({
  eyebrow,
  title,
  paragraphs,
  images,
  appearance,
}: PeopleGalleryContent) {
  const count = images.length as GalleryCount;

  return (
    <Section
      data-people-gallery
      spacing="lg"
      spacingType="padding"
      className={peopleGalleryVariants()}
      style={{
        backgroundColor: appearance.backgroundColor,
        color: appearance.accentColor,
      }}
    >
      <Container size="wide">
        <header className={peopleGalleryHeaderVariants()}>
          <div className={peopleGalleryHeadingVariants()}>
            {eyebrow && (
              <Typography
                as="p"
                variant="caption"
                weight="semibold"
                tone={null}
                className={peopleGalleryEyebrowVariants()}
              >
                {eyebrow}
              </Typography>
            )}

            <Typography
              as="h2"
              variant="h2"
              weight="medium"
              tone={null}
              className={peopleGalleryTitleVariants()}
            >
              {title}
            </Typography>
          </div>

          <div className={peopleGalleryDescriptionVariants()}>
            {paragraphs.map((paragraph, index) => (
              <Typography key={index} as="p" variant="body" tone={null}>
                {paragraph}
              </Typography>
            ))}
          </div>
        </header>

        <div
          data-count={count}
          className={cn(peopleGalleryGridVariants({ count }), styles.gallery)}
        >
          {images.map((image, index) => {
            const position = IMAGE_POSITIONS[index];

            return (
              <figure
                key={`${image.desktop.src}-${index}`}
                data-position={position}
                className={cn(
                  peopleGalleryItemVariants({
                    position,
                  }),
                  styles.item,
                )}
              >
                <div
                  className={peopleGalleryImageVariants({
                    count,
                  })}
                >
                  <Picture
                    {...image}
                    ratio="fill"
                    fit="cover"
                    loading="lazy"
                    quality={IMAGE_QUALITY.editorial}
                    sizes={IMAGE_SIZES.peopleGallery[count]}
                  />
                </div>
              </figure>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
