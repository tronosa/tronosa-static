import "server-only";

import { Fragment, type ReactNode } from "react";

import type { Section } from "@/content/schemas/section.schema";

import type { ContentEntry } from "@/lib/content/registry";

import {
  createSectionContext,
  type SectionRenderContext,
} from "./section-context";

import { sectionRegistry } from "./section-registry";

interface SectionRendererProps {
  sections: readonly Section[];
  context?: ContentEntry;
}

export async function SectionRenderer({
  sections,
  context,
}: SectionRendererProps) {
  const renderContext = createSectionContext(sections, context);

  const renderedSections = await Promise.all(
    sections.map(async (section) => {
      const render = sectionRegistry[section.type] as (
        section: Section,
        context: SectionRenderContext,
      ) => Promise<ReactNode>;

      return (
        <Fragment key={section.id}>
          {await render(section, renderContext)}
        </Fragment>
      );
    }),
  );

  return <>{renderedSections}</>;
}
