import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

import {
  getContentById,
  getPublishedContent,
  type Locale,
} from "@/lib/content/registry";

import { createSeoMetadata } from "@/lib/seo/metadata";
import { createStructuredData } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionRenderer } from "@/components/sections/section-renderer";

type Props = {
  params: Promise<{ locale: string }>;
};

function getBlog(locale: Locale) {
  const entry = getContentById("page", locale, "blog");

  if (!entry || entry.kind !== "page") {
    notFound();
  }

  return entry;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return createSeoMetadata(getBlog(locale));
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const entry = getBlog(locale);

  const articles = getPublishedContent()
    .filter((item) => item.kind === "article" && item.locale === locale)
    .sort((a, b) => {
      if (a.kind !== "article" || b.kind !== "article") {
        return 0;
      }

      return b.data.publishedAt.localeCompare(a.data.publishedAt);
    });

  return (
    <>
      <JsonLd data={await createStructuredData(entry)} />

      <main>
        <h1>{entry.data.seo.title}</h1>

        <SectionRenderer sections={entry.data.content.sections} />

        <ul>
          {articles.map((article) => {
            if (article.kind !== "article") return null;

            return (
              <li key={article.data.id}>
                <Link href={`/blog/${article.data.slug}`}>
                  {article.data.preview.title}
                </Link>

                <p>{article.data.preview.description}</p>

                <time dateTime={article.data.publishedAt}>
                  {article.data.publishedAt.slice(0, 10)}
                </time>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
