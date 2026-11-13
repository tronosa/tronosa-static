import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { z } from "zod";

import { routing } from "@/i18n/routing";

const pageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  seo: z.object({
    title: z.string(),
    description: z.string(),
    index: z.boolean(),
    follow: z.boolean(),
  }),
  content: z.object({
    sections: z.array(
      z.object({
        type: z.string(),
        content: z.object({
          title: z.string(),
          description: z.string(),
        }),
      }),
    ),
  }),
});

type Locale = (typeof routing.locales)[number];

export async function getPage(locale: Locale, pageId: string) {
  if (!/^[a-z0-9-]+$/.test(pageId)) {
    throw new Error(`Invalid page ID: ${pageId}`);
  }

  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "pages",
    locale,
    `${pageId}.json`,
  );

  const content = await readFile(filePath, "utf8");

  return pageSchema.parse(JSON.parse(content));
}
