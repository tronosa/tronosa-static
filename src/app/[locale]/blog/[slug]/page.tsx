import type { Metadata } from "next";

import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { SectionRenderer } from "@/components/sections/section-renderer";

import { routing } from "@/i18n/routing";

import {
  getPublishedPosts,
  getPublishedPostBySlug,
  type Locale,
} from "@/lib/content/registry";

import { createSeoMetadata } from "@/lib/seo/metadata";
import { createStructuredData } from "@/lib/seo/structured-data";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getPublishedPosts()
    .filter(({ data }) => !data.slug.includes("/"))
    .map(({ locale, data }) => ({
      locale,
      slug: data.slug,
    }));
}

function getArticle(locale: Locale, slug: string) {
  const entry = getPublishedPostBySlug(locale, slug);

  if (!entry) {
    notFound();
  }

  return entry;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return createSeoMetadata(getArticle(locale, slug));
}

export default async function BlogArticle({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const entry = getArticle(locale, slug);

  return (
    <>
      <JsonLd data={await createStructuredData(entry)} />

      <main>
        <article>
          <SectionRenderer
            sections={entry.data.content.sections}
            context={entry}
          />
        </article>
      </main>
    </>
  );
}
