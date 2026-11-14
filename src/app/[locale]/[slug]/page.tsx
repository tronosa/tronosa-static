import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { SectionRenderer } from "@/components/sections/section-renderer";
import { JsonLd } from "@/components/seo/json-ld";

import {
  getContentBySlug,
  getPublishedContent,
  type Locale,
} from "@/lib/content/registry";

import { routing } from "@/i18n/routing";
import { createSeoMetadata } from "@/lib/seo/metadata";
import { createStructuredData } from "@/lib/seo/structured-data";

type Props = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getPublishedContent()
    .filter(
      (entry) =>
        entry.kind === "page" &&
        entry.data.id !== "home" &&
        !entry.data.slug.includes("/"),
    )
    .map((entry) => ({
      locale: entry.locale,
      slug: entry.data.slug,
    }));
}

function getPage(locale: Locale, slug: string) {
  const entry = getContentBySlug("page", locale, slug);

  if (!entry || entry.kind !== "page") {
    notFound();
  }

  return entry;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return createSeoMetadata(getPage(locale, slug));
}

export default async function ContentPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const entry = getPage(locale, slug);

  return (
    <>
      <JsonLd data={await createStructuredData(entry)} />

      <main>
        <SectionRenderer sections={entry.data.content.sections} />
      </main>
    </>
  );
}
