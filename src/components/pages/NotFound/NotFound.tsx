import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { Link } from "@/i18n/navigation";

import {
  notFoundVariants,
  notFoundContainerVariants,
  notFoundEyebrowVariants,
  notFoundNumberVariants,
  notFoundContentVariants,
  notFoundTitleVariants,
  notFoundDescriptionVariants,
  notFoundActionsVariants,
  notFoundSecondaryLinkVariants,
} from "./not-found.variants";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { hasLocale } from "next-intl";
import { getContentById } from "@/lib/content/registry";
import { routing } from "@/i18n/routing";

export async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("NotFound");

  if (!hasLocale(routing.locales, locale)) {
    return null;
  }

  function resolveHref(pageId: string): string | null {
    const entry = getContentById("page", locale, pageId);

    if (!entry || entry.kind !== "page") {
      return null;
    }

    return entry.data.slug ? `/${entry.data.slug}` : "/";
  }

  const homeHref = resolveHref("home");
  const blogHref = resolveHref("blog");

  return (
    <Section
      data-not-found-page
      aria-labelledby="not-found-heading"
      className={notFoundVariants()}
    >
      <Container size="wide">
        <div className={notFoundContainerVariants()}>
          <Typography as="p" className={notFoundEyebrowVariants()}>
            {t("eyebrow")}
          </Typography>

          <span aria-hidden="true" className={notFoundNumberVariants()}>
            404
          </span>

          <div className={notFoundContentVariants()}>
            <Typography
              as="h1"
              id="not-found-heading"
              className={notFoundTitleVariants()}
            >
              {t("title")}
            </Typography>

            <Typography as="p" className={notFoundDescriptionVariants()}>
              {t("description")}
            </Typography>

            {(homeHref || blogHref) && (
              <nav
                aria-label={t("navigationLabel")}
                className={notFoundActionsVariants()}
              >
                {homeHref && (
                  <Button asChild arrow>
                    <Link href={homeHref}>{t("home")}</Link>
                  </Button>
                )}

                {blogHref && (
                  <Link
                    href={blogHref}
                    className={notFoundSecondaryLinkVariants()}
                  >
                    {t("blog")}
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
