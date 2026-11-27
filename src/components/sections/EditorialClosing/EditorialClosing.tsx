import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

import { getServerLocale } from "@/i18n/get-server-locale";
import { Link } from "@/i18n/navigation";

import { getContentById } from "@/lib/content/registry";
import { getContentHref } from "@/lib/content/content-paths";

import type { EditorialClosingContent } from "./editorial-closing.schema";

import {
  editorialClosingVariants,
  editorialClosingLayoutVariants,
  editorialClosingContentVariants,
  editorialClosingEyebrowVariants,
  editorialClosingTitleVariants,
  editorialClosingDescriptionVariants,
  editorialClosingActionVariants,
  editorialClosingLinkVariants,
  editorialClosingDecorationVariants,
} from "./editorial-closing.variants";
import { Section } from "@/components/ui/Section";

const WAVE_RADII = [100, 145, 190, 235, 280, 325, 370, 415, 460, 500] as const;

export async function EditorialClosing({
  eyebrow,
  title,
  description,
  cta,
  appearance,
}: EditorialClosingContent) {
  const locale = await getServerLocale();

  const target = getContentById("page", locale, cta.pageId);

  if (!target) {
    throw new Error(
      `[EditorialClosing] Page "${cta.pageId}" does not exist for locale "${locale}".`,
    );
  }

  const href = getContentHref(target);

  return (
    <Section
      spacingType="padding"
      data-editorial-closing
      className={editorialClosingVariants()}
      style={{
        backgroundColor: appearance.backgroundColor,
        color: appearance.accentColor,
      }}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1000 1000"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={editorialClosingDecorationVariants()}
      >
        {WAVE_RADII.map((radius) => (
          <circle key={radius} cx="500" cy="500" r={radius} />
        ))}
      </svg>

      <Container size="wide">
        <div className={editorialClosingLayoutVariants()}>
          <div className={editorialClosingContentVariants()}>
            {eyebrow && (
              <Typography
                as="p"
                variant="caption"
                weight="semibold"
                tone={null}
                className={editorialClosingEyebrowVariants()}
              >
                {eyebrow}
              </Typography>
            )}

            <Typography
              as="h2"
              variant="display"
              weight="medium"
              tone={null}
              className={editorialClosingTitleVariants()}
            >
              {title}
            </Typography>

            {description && (
              <Typography
                as="p"
                variant="body"
                tone={null}
                className={editorialClosingDescriptionVariants()}
              >
                {description}
              </Typography>
            )}
          </div>

          <div className={editorialClosingActionVariants()}>
            <Button
              asChild
              variant="glass"
              size="lg"
              arrow
              className={editorialClosingLinkVariants()}
            >
              <Link href={href} prefetch={false}>
                {cta.label}
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
