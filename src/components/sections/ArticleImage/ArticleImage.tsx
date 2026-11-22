import Image from "next/image";

import { Container } from "@/components/ui/Container";

import {
  articleImageCaptionVariants,
  articleImageFigureVariants,
  articleImageMediaVariants,
  articleImageSectionVariants,
} from "./article-image.variants";

import type { ArticleImageProps } from "./types";
import { Section } from "@/components/ui/Section";

export function ArticleImage({
  src,
  alt,
  width,
  height,
  caption,
  layout,
  priority,
}: ArticleImageProps) {
  const sizes = {
    reading: "(min-width: 768px) 672px, 100vw",
    medium: "(min-width: 1024px) 896px, 100vw",
    wide: "(min-width: 1440px) 1280px, 100vw",
  }[layout];

  return (
    <Section className={articleImageSectionVariants()}>
      <Container size="wide">
        <figure
          className={articleImageFigureVariants({
            layout,
          })}
        >
          <div
            className={articleImageMediaVariants({
              layout,
            })}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes={sizes}
              priority={priority}
              className="block size-full object-cover"
            />
          </div>

          {caption && (
            <figcaption className={articleImageCaptionVariants()}>
              {caption}
            </figcaption>
          )}
        </figure>
      </Container>
    </Section>
  );
}
