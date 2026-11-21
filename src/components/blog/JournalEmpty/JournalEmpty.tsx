import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";

import {
  journalEmptyVariants,
  journalEmptyContentVariants,
  journalEmptyTitleVariants,
  journalEmptyDescriptionVariants,
} from "./journal-empty.variants";
import { Section } from "@/components/ui/Section";

export async function JournalEmpty() {
  const t = await getTranslations("Blog.index.empty");

  return (
    <Section
      aria-labelledby="journal-empty-heading"
      className={journalEmptyVariants()}
    >
      <Container size="wide">
        <div className={journalEmptyContentVariants()}>
          <h2
            id="journal-empty-heading"
            className={journalEmptyTitleVariants()}
          >
            {t("title")}
          </h2>

          <p className={journalEmptyDescriptionVariants()}>
            {t("description")}
          </p>
        </div>
      </Container>
    </Section>
  );
}
