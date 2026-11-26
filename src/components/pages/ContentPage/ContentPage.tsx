import "server-only";

import { SectionRenderer } from "@/components/sections/section-renderer";

import type { ContentEntry } from "@/lib/content/registry";

type ContentPageProps = {
  entry: ContentEntry;
};

export function ContentPage({ entry }: ContentPageProps) {
  return <SectionRenderer sections={entry.data.content.sections} />;
}
