import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

import { getContentById } from "@/lib/content/registry";
import { getContentHref } from "@/lib/content/content-paths";

import { SourceClosingDecoration } from "./SourceClosingDecoration";

import {
  sourceClosingVariants,
  sourceClosingLayoutVariants,
  sourceClosingContentVariants,
  sourceClosingEyebrowVariants,
  sourceClosingAccentVariants,
  sourceClosingTitleVariants,
  sourceClosingDescriptionVariants,
  sourceClosingCtaVariants,
} from "./source-closing.variants";

type SourceClosingProps = {
  pageId: string;
};

export async function SourceClosing({ pageId }: SourceClosingProps) {
  const locale = await getLocale();
  const t = await getTranslations("Blog.index.closing");

  if (!hasLocale(routing.locales, locale)) {
    return null;
  }

  const entry = getContentById("page", locale, pageId);

  const ctaHref = entry?.kind === "page" ? getContentHref(entry) : null;

  return (
    <Section
      spacingType="padding"
      aria-labelledby="source-closing-heading"
      className={sourceClosingVariants()}
    >
      <Container size="wide">
        <div className={sourceClosingLayoutVariants()}>
          <div className={sourceClosingContentVariants()}>
            <p className={sourceClosingEyebrowVariants()}>
              <span
                aria-hidden="true"
                className={sourceClosingAccentVariants()}
              />

              {t("eyebrow")}
            </p>

            <h2
              id="source-closing-heading"
              className={sourceClosingTitleVariants()}
            >
              {t("title")}
            </h2>

            <p className={sourceClosingDescriptionVariants()}>
              {t("description")}
            </p>

            {ctaHref && (
              <Button
                asChild
                variant="glass"
                size="lg"
                arrow
                className={sourceClosingCtaVariants()}
              >
                <Link href={ctaHref} prefetch={false}>
                  {t("cta")}
                </Link>
              </Button>
            )}
          </div>

          <SourceClosingDecoration />
        </div>
      </Container>
    </Section>
  );
}
