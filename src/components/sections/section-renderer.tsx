import "server-only";

import { Fragment, type ReactNode } from "react";

import type { Section } from "@/content/schemas/section.schema";

import { sectionRegistry } from "./section-registry";

type SectionRendererProps = {
  sections: readonly Section[];
};

export async function SectionRenderer({ sections }: SectionRendererProps) {
  return Promise.all(
    sections.map(async (section) => {
      const render = sectionRegistry[section.type] as (
        section: Section,
      ) => Promise<ReactNode>;

      return <Fragment key={section.id}>{await render(section)}</Fragment>;
    }),
  );
}
