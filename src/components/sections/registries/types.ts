import type { ReactNode } from "react";

import type { Section, SectionType } from "@/content/schemas/section.schema";

import type { SectionRenderContext } from "../section-context";

export type SectionRegistry<TSection extends Section = Section> = {
  [Type in TSection["type"]]: (
    section: Extract<TSection, { type: Type }>,
    context: SectionRenderContext,
  ) => Promise<ReactNode>;
};

export type SectionHandler<Type extends SectionType> = SectionRegistry[Type];
