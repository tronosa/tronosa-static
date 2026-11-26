import "server-only";

import type { ReactNode } from "react";

import type { ContentEntry } from "@/lib/content/registry";

type PageRendererKind = "standard" | "blog" | "article";

type PageRenderer = (entry: ContentEntry) => Promise<ReactNode>;

const pageRendererRegistry = {
  standard: async (entry) => {
    const { ContentPage } = await import("./ContentPage/ContentPage");

    return <ContentPage entry={entry} />;
  },

  blog: async (entry) => {
    const { BlogPage } = await import("./BlogPage/BlogPage");

    return <BlogPage entry={entry} />;
  },

  article: async (entry) => {
    const { ArticlePage } = await import("./ArticlePage/ArticlePage");

    return <ArticlePage entry={entry} />;
  },
} satisfies Record<PageRendererKind, PageRenderer>;

function getPageRendererKind(entry: ContentEntry): PageRendererKind {
  if (entry.kind === "article") {
    return "article";
  }

  return entry.data.id === "blog" ? "blog" : "standard";
}

type ContentPageRendererProps = {
  entry: ContentEntry;
};

export async function ContentPageRenderer({ entry }: ContentPageRendererProps) {
  const kind = getPageRendererKind(entry);

  return pageRendererRegistry[kind](entry);
}
