import type { ContentEntry } from "@/lib/content/registry";

import { createBlogPostingSchema } from "./blog-posting";
import { createBreadcrumbSchema } from "./breadcrumb";
import { createOrganizationSchema } from "./organization";
import { createWebPageSchema } from "./webpage";
import { createWebsiteSchema } from "./website";

export async function createStructuredData(entry: ContentEntry) {
  const graph: Record<string, unknown>[] = [
    createOrganizationSchema(),
    createWebsiteSchema(),
    createWebPageSchema(entry),
  ];

  const breadcrumb = await createBreadcrumbSchema(entry);

  if (breadcrumb) {
    graph.push(breadcrumb);
  }

  if (entry.kind === "article" && entry.data.status === "published") {
    graph.push(createBlogPostingSchema(entry));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
