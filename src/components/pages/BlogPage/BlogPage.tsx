import "server-only";

import { SectionRenderer } from "@/components/sections/section-renderer";

import type { ContentEntry } from "@/lib/content/registry";

type BlogPageProps = {
  entry: ContentEntry;
};

export function BlogPage({ entry }: BlogPageProps) {
  return (
    <SectionRenderer sections={entry.data.content.sections} context={entry} />
  );
}
