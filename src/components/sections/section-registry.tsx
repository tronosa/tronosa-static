import "server-only";

import { sharedSectionRegistry } from "./registries/shared.registry";
import { blogSectionRegistry } from "./registries/blog.registry";
import { articleSectionRegistry } from "./registries/article.registry";

import type { SectionRegistry } from "./registries/types";

export type { SectionRegistry } from "./registries/types";

export const sectionRegistry: SectionRegistry = {
  ...sharedSectionRegistry,
  ...blogSectionRegistry,
  ...articleSectionRegistry,
};
