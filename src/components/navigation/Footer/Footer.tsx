import { getContentHref } from "@/lib/content/content-paths";
import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

import { getContentById } from "@/lib/content/registry";

import {
  footerVariants,
  footerInnerVariants,
  footerBrandRowVariants,
  footerBrandIdentityVariants,
  footerBrandMarkVariants,
  footerBrandDescriptionVariants,
  footerHeroVariants,
  footerHeroContentVariants,
  footerTitleVariants,
  footerDescriptionVariants,
  footerContactVariants,
  footerContactLabelVariants,
  footerContactLinkVariants,
  footerContactArrowVariants,
  footerNavigationVariants,
  footerColumnVariants,
  footerColumnHeaderVariants,
  footerColumnNumberVariants,
  footerColumnTitleVariants,
  footerLinksVariants,
  footerLinkVariants,
  footerLinkArrowVariants,
  footerWordmarkVariants,
  footerWordmarkSvgVariants,
  footerBottomVariants,
} from "./footer.variants";

const PRIMARY_PAGES = ["home", "about", "products", "blog"] as const;

const SECONDARY_PAGES = ["contact"] as const;

type FooterPageId =
  (typeof PRIMARY_PAGES)[number] | (typeof SECONDARY_PAGES)[number];

function ArrowIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="18"
      height="22"
      viewBox="0 0 24 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 2C9 7 3 13 3 18a9 9 0 0 0 18 0c0-5-6-11-9-16Z" />
      <path d="M7.5 18a4.5 4.5 0 0 0 4.5 4.5" strokeLinecap="round" />
    </svg>
  );
}

export async function Footer() {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) {
    return null;
  }

  const t = await getTranslations("Footer");

  function resolveHref(pageId: FooterPageId) {
    const entry = getContentById("page", locale, pageId);

    if (!entry || entry.kind !== "page") {
      return null;
    }

    return getContentHref(entry);
  }

  function renderLinks(pages: readonly FooterPageId[]) {
    return pages.map((pageId) => {
      const href = resolveHref(pageId);

      if (!href) {
        return null;
      }

      return (
        <li key={pageId}>
          <Link href={href} prefetch={false} className={footerLinkVariants()}>
            <span>{t(pageId)}</span>
            <ArrowIcon className={footerLinkArrowVariants()} />
          </Link>
        </li>
      );
    });
  }

  const contactHref = resolveHref("contact");

  return (
    <footer className={footerVariants()}>
      <Container size="wide">
        <div className={footerInnerVariants()}>
          <div className={footerBrandRowVariants()}>
            <div className={footerBrandIdentityVariants()}>
              <span className={footerBrandMarkVariants()}>
                <WaterIcon />
              </span>
              <span>{t("brand")}</span>
            </div>

            <span className={footerBrandDescriptionVariants()}>
              {t("eyebrow")}
            </span>
          </div>

          <div className={footerHeroVariants()}>
            <div className={footerHeroContentVariants()}>
              <Typography as="p" className={footerTitleVariants()}>
                {t("title")}
              </Typography>

              <Typography as="p" className={footerDescriptionVariants()}>
                {t("description")}
              </Typography>
            </div>

            {contactHref && (
              <div className={footerContactVariants()}>
                <Typography as="p" className={footerContactLabelVariants()}>
                  {t("ctaEyebrow")}
                </Typography>

                <Link
                  href={contactHref}
                  prefetch={false}
                  className={footerContactLinkVariants()}
                >
                  <span>{t("ctaLabel")}</span>
                  <ArrowIcon className={footerContactArrowVariants()} />
                </Link>
              </div>
            )}
          </div>

          <div className={footerNavigationVariants()}>
            <nav
              aria-labelledby="footer-explore-title"
              className={footerColumnVariants()}
            >
              <div className={footerColumnHeaderVariants()}>
                <span
                  aria-hidden="true"
                  className={footerColumnNumberVariants()}
                >
                  01
                </span>

                <Typography
                  as="h2"
                  id="footer-explore-title"
                  className={footerColumnTitleVariants()}
                >
                  {t("explore")}
                </Typography>
              </div>

              <ul className={footerLinksVariants()}>
                {renderLinks(PRIMARY_PAGES)}
              </ul>
            </nav>

            <nav
              aria-labelledby="footer-more-title"
              className={footerColumnVariants()}
            >
              <div className={footerColumnHeaderVariants()}>
                <span
                  aria-hidden="true"
                  className={footerColumnNumberVariants()}
                >
                  02
                </span>

                <Typography
                  as="h2"
                  id="footer-more-title"
                  className={footerColumnTitleVariants()}
                >
                  {t("more")}
                </Typography>
              </div>

              <ul className={footerLinksVariants()}>
                {renderLinks(SECONDARY_PAGES)}
              </ul>
            </nav>
          </div>

          <div className={footerWordmarkVariants()}>
            <svg
              viewBox="0 0 1000 180"
              role="presentation"
              aria-hidden="true"
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              className={footerWordmarkSvgVariants()}
            >
              <text
                x="500"
                y="135"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontSize="174"
                fontWeight="800"
                letterSpacing="-8"
                textLength="940"
                lengthAdjust="spacingAndGlyphs"
              >
                {t("brand")}
              </text>
            </svg>
          </div>

          <div className={footerBottomVariants()}>
            <span>
              {t("copyright", {
                year: new Date().getFullYear(),
                rights: t("rights"),
              })}
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
