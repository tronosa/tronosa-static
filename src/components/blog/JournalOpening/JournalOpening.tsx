import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { JournalOpeningClient } from "./JournalOpeningClient";

import {
  journalOpeningVariants,
  journalOpeningHeaderVariants,
  journalOpeningEyebrowVariants,
  journalOpeningAccentLineVariants,
  journalOpeningTitleVariants,
  journalOpeningTitleLineVariants,
  journalOpeningTitleAccentVariants,
  journalOpeningDescriptionVariants,
  journalOpeningMediaVariants,
  journalOpeningApertureVariants,
  journalOpeningImageVariants,
  journalOpeningCaptionVariants,
  journalOpeningCaptionTextVariants,
} from "./journal-opening.variants";

export async function JournalOpening() {
  const t = await getTranslations("Blog.index.opening");

  const image = {
    src: t("image.src"),
    alt: t("image.alt"),
  };

  return (
    <Section
      aria-labelledby="journal-opening-heading"
      className={journalOpeningVariants()}
    >
      <Container size="wide">
        <header className={journalOpeningHeaderVariants()}>
          <p className={journalOpeningEyebrowVariants()}>
            {t("eyebrow")}

            <span
              aria-hidden="true"
              className={journalOpeningAccentLineVariants()}
            />
          </p>

          <h1
            id="journal-opening-heading"
            className={journalOpeningTitleVariants()}
          >
            {t.rich("title", {
              line: (chunks) => (
                <span className={journalOpeningTitleLineVariants()}>
                  {chunks}
                </span>
              ),
              accent: (chunks) => (
                <span className={journalOpeningTitleAccentVariants()}>
                  {chunks}
                </span>
              ),
            })}
          </h1>

          <p className={journalOpeningDescriptionVariants()}>
            {t("description")}
          </p>
        </header>

        <JournalOpeningClient className={journalOpeningMediaVariants()}>
          <div
            data-journal-aperture
            className={journalOpeningApertureVariants()}
          >
            <Image
              data-journal-opening-image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1440px) 1280px, 100vw"
              loading="eager"
              fetchPriority="high"
              className={journalOpeningImageVariants()}
            />
          </div>
        </JournalOpeningClient>

        <div className={journalOpeningCaptionVariants()}>
          <p className={journalOpeningCaptionTextVariants()}>{t("caption")}</p>
        </div>
      </Container>
    </Section>
  );
}
