import { getLocale } from "next-intl/server";

import { Picture } from "@/components/media/Picture";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";

import { locales } from "@/i18n/config";
import { Link } from "@/i18n/navigation";

import { cn } from "@/lib/cn";
import { getContentById } from "@/lib/content/registry";

import { EditorialMediaGallery } from "./EditorialMediaGallery";

import {
  editorialMediaVariants,
  editorialMediaLayoutVariants,
  editorialMediaTextVariants,
  editorialMediaEyebrowVariants,
  editorialMediaTitleVariants,
  editorialMediaParagraphsVariants,
  editorialMediaParagraphVariants,
  editorialMediaPlacementVariants,
  editorialMediaVisualVariants,
  editorialMediaVideoVariants,
  editorialMediaCtaVariants,
} from "./editorial-media.variants";

import type { EditorialMediaProps } from "./types";

const IMAGE_SIZES = [
  "(min-width: 1024px) 420px",
  "(min-width: 640px) calc(100vw - 4rem)",
  "calc(100vw - 2.5rem)",
].join(", ");

export async function EditorialMedia({
  eyebrow,
  title,
  paragraphs,
  media,
  mediaPosition = "right",
  cta,
  className,
}: EditorialMediaProps) {
  let ctaHref: string | undefined;

  if (cta) {
    const currentLocale = await getLocale();

    const locale = locales.find(
      (supportedLocale) => supportedLocale === currentLocale,
    );

    if (!locale) {
      throw new Error(`Unsupported locale: ${currentLocale}`);
    }

    const entry = getContentById("page", locale, cta.pageId);

    if (!entry) {
      throw new Error(
        `EditorialMedia CTA target "${cta.pageId}" does not exist for locale "${locale}".`,
      );
    }

    ctaHref = entry.data.slug ? `/${entry.data.slug}` : "/";
  }

  return (
    <Section
      spacing="none"
      data-editorial-media
      className={cn(editorialMediaVariants(), className)}
    >
      <Container size="wide">
        <div className={editorialMediaLayoutVariants()}>
          <div className={editorialMediaTextVariants({ mediaPosition })}>
            {eyebrow && (
              <p className={editorialMediaEyebrowVariants()}>{eyebrow}</p>
            )}

            <Typography
              as="h2"
              variant="h2"
              weight="medium"
              className={editorialMediaTitleVariants()}
            >
              {title}
            </Typography>

            <div className={editorialMediaParagraphsVariants()}>
              {paragraphs.map((paragraph, index) => (
                <Typography
                  key={index}
                  as="p"
                  className={editorialMediaParagraphVariants()}
                >
                  {paragraph}
                </Typography>
              ))}
            </div>

            {cta && ctaHref && (
              <Button
                asChild
                variant="outline"
                size="md"
                arrow
                className={editorialMediaCtaVariants()}
              >
                <Link href={ctaHref}>{cta.label}</Link>
              </Button>
            )}
          </div>

          <div
            className={editorialMediaPlacementVariants({
              mediaPosition,
            })}
          >
            {media.kind === "gallery" ? (
              <EditorialMediaGallery media={media} />
            ) : (
              <div className={editorialMediaVisualVariants()}>
                {media.kind === "image" ? (
                  <Picture
                    {...media.image}
                    ratio="fill"
                    fit="cover"
                    sizes={IMAGE_SIZES}
                    quality={80}
                    loading="lazy"
                  />
                ) : (
                  <video
                    aria-label={media.accessibility.label}
                    className={editorialMediaVideoVariants()}
                    controls
                    playsInline
                    preload="none"
                    poster={media.poster}
                  >
                    <source src={media.src} type={media.type} />
                  </video>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
