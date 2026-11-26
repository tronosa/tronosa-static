import "server-only";

import { SectionRenderer } from "@/components/sections/section-renderer";

import type { ContentEntry } from "@/lib/content/registry";

type ArticlePageProps = {
  entry: ContentEntry;
};

export function ArticlePage({ entry }: ArticlePageProps) {
  return (
    <article>
      <SectionRenderer sections={entry.data.content.sections} context={entry} />
    </article>
  );
}
