import { describe, expect, it } from "vitest";

import { articleSpecificSectionSchema } from "@/content/schemas/article-section.schema";

describe("Article section architecture", () => {
  it("rejects standalone share article sections", () => {
    const result = articleSpecificSectionSchema.safeParse({
      id: "share-article",
      type: "share-article",
    });

    expect(result.success).toBe(false);
  });

  it("accepts article metadata sections", () => {
    const result = articleSpecificSectionSchema.safeParse({
      id: "article-metadata",
      type: "article-metadata",
    });

    expect(result.success).toBe(true);
  });

  it("accepts related posts sections", () => {
    const result = articleSpecificSectionSchema.safeParse({
      id: "related-posts",
      type: "related-posts",
      content: {
        limit: 3,
      },
    });

    expect(result.success).toBe(true);
  });
});
