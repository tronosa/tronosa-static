import { getLocale } from "next-intl/server";

import { BackgroundVideo } from "@/components/media/BackgroundVideo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Typography } from "@/components/ui/Typography";

import { locales } from "@/i18n/config";
import { Link } from "@/i18n/navigation";

import { getContentById } from "@/lib/content/registry";
import { cn } from "@/lib/cn";

import {
  videoHeroVariants,
  videoHeroOverlayVariants,
  videoHeroContentVariants,
  videoHeroTextVariants,
  videoHeroCtaVariants,
} from "./video-hero.variants";

import type { VideoHeroProps } from "./types";

export async function VideoHero({
  eyebrow,
  title,
  description,
  video,
  cta,
  accessibility,
  align = "left",
  overlay = "gradient",
  className,
}: VideoHeroProps) {
  const currentLocale = await getLocale();

  const locale = locales.find(
    (supportedLocale) => supportedLocale === currentLocale,
  );

  if (!locale) {
    throw new Error(`Unsupported locale: ${currentLocale}`);
  }

  let ctaHref: string | undefined;

  if (cta) {
    const entry = getContentById("page", locale, cta.pageId);

    if (!entry) {
      throw new Error(
        `VideoHero CTA target "${cta.pageId}" does not exist for locale "${locale}".`,
      );
    }

    ctaHref = entry.data.slug ? `/${entry.data.slug}` : "/";
  }

  return (
    <Section
      spacing="none"
      data-video-hero
      className={cn(videoHeroVariants(), className)}
    >
      <BackgroundVideo video={video} accessibility={accessibility} />

      <div
        aria-hidden="true"
        className={videoHeroOverlayVariants({ overlay })}
      />

      <Container size="wide">
        <div className={videoHeroContentVariants({ align })}>
          <div className={videoHeroTextVariants()}>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/90 md:text-sm">
                {eyebrow}
              </p>
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
              className={videoHeroCtaVariants()}
            >
              <Link href={ctaHref} prefetch={false}>
                {cta.label}
              </Link>
            </Button>
          )}
        </div>
      </Container>
    </Section>
  );
}
