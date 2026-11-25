import { getLocale } from "next-intl/server";

import { Picture } from "@/components/media/Picture";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";

import { locales } from "@/i18n/config";
import { Link } from "@/i18n/navigation";

import { getContentById } from "@/lib/content/registry";
import { cn } from "@/lib/cn";
import { IMAGE_SIZES } from "@/lib/media/image-sizes";

import {
  imageHeroVariants,
  imageHeroOverlayVariants,
  imageHeroContentVariants,
  imageHeroTextVariants,
  imageHeroEyebrowVariants,
  imageHeroCtaVariants,
} from "./image-hero.variants";

import type { ImageHeroProps } from "./types";

export async function ImageHero({
  eyebrow,
  title,
  description,
  image,
  cta,
  size = "md",
  align = "left",
  overlay = "gradient",
  className,
}: ImageHeroProps) {
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
        `ImageHero CTA target "${cta.pageId}" does not exist for locale "${locale}".`,
      );
    }

    ctaHref = entry.data.slug ? `/${entry.data.slug}` : "/";
  }

  return (
    <Section
      spacing="none"
      data-image-hero
      className={cn(imageHeroVariants({ size }), className)}
    >
      <Picture
        {...image}
        ratio="fill"
        fit="cover"
        sizes={IMAGE_SIZES.hero}
        quality={65}
        loading="eager"
        fetchPriority="high"
      />

      <div
        aria-hidden="true"
        className={imageHeroOverlayVariants({ overlay })}
      />

      <Container size="wide">
        <div className={imageHeroContentVariants({ align })}>
          <div className={imageHeroTextVariants()}>
            {eyebrow && (
              <Typography as="span" className={imageHeroEyebrowVariants()}>
                {eyebrow}
              </Typography>
            )}

            <Typography
              as="h1"
              variant="display"
              weight="medium"
              align={align}
              className="text-white"
            >
              {title}
            </Typography>

            {description && (
              <Typography
                as="p"
                variant="lead"
                align={align}
                className="text-white/90"
              >
                {description}
              </Typography>
            )}
          </div>

          {cta && ctaHref && (
            <Button
              asChild
              variant="secondary"
              size="md"
              arrow
              className={imageHeroCtaVariants()}
            >
              <Link href={ctaHref}>{cta.label}</Link>
            </Button>
          )}
        </div>
      </Container>
    </Section>
  );
}
