import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { routing } from "@/i18n/routing";
import { pageSchema } from "@/content/schemas/page.schema";

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
