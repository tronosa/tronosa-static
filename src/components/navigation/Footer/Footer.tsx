import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

import { getFooterNavigation } from "./footer.server";
import { FooterNavigation } from "./FooterNavigation";

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
  footerLinkVariants,
  footerWordmarkVariants,
  footerWordmarkSvgVariants,
  footerBottomVariants,
  footerLegalLinksVariants,
} from "./footer.variants";

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

  const { groups, legalLinks } = getFooterNavigation(locale);

  const navigationGroups = groups.map((group) => ({
    id: group.id,
    label: t(`groups.${group.translationKey}`),
    links: group.links.map((item) => ({
      id: item.id,
      href: item.href,
      label: t(`links.${item.translationKey}`),
    })),
  }));

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
          </div>

          <FooterNavigation
            label={t("navigationLabel")}
            groups={navigationGroups}
          />

          <div aria-hidden="true" className={footerWordmarkVariants()}>
            <svg
              viewBox="0 0 1000 220"
              aria-hidden="true"
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              overflow="visible"
              className={footerWordmarkSvgVariants()}
            >
              <text
                x="500"
                y="180"
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

            {legalLinks.length > 0 && (
              <nav aria-label={t("legalNavigationLabel")}>
                <ul role="list" className={footerLegalLinksVariants()}>
                  {legalLinks.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className={footerLinkVariants()}
                      >
                        {t(`links.${item.translationKey}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
