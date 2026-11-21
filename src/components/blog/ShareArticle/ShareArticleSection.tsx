import "server-only";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import type { ArticleEntry } from "@/lib/content/registry";

import { createSeoMetadata } from "@/lib/seo/metadata";

import { ShareArticle } from "./ShareArticle";
import { shareArticleSectionVariants } from "./share-article.variants";

type ShareArticleSectionProps = {
  entry: ArticleEntry;
};

export async function ShareArticleSection({ entry }: ShareArticleSectionProps) {
  const metadata = createSeoMetadata(entry);
  const canonical = metadata.alternates?.canonical;

  if (!canonical) {
    throw new Error(`Missing canonical URL for article "${entry.data.id}".`);
  }

  const shareUrl = String(canonical);
  const parsedUrl = URL.parse(shareUrl);

  if (!parsedUrl || !["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error(`Invalid share URL for article "${entry.data.id}".`);
  }

  const t = await getTranslations({
    locale: entry.locale,
    namespace: "Blog.share",
  });

  return (
    <Section spacingType="padding">
      <Container size="wide">
        <div className={shareArticleSectionVariants()}>
          <ShareArticle
            url={shareUrl}
            title={entry.data.preview.title}
            labels={{
              heading: t("heading"),
              share: t("share"),
              copyLink: t("copyLink"),
              copied: t("copied"),
              copyFailed: t("copyFailed"),
              linkedin: t("linkedin"),
              facebook: t("facebook"),
              more: t("more"),
            }}
          />
        </div>
      </Container>
    </Section>
  );
}
