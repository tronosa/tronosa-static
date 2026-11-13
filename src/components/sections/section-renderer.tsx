import { Fragment } from "react";

import type { Section } from "@/content/schemas/section.schema";

import { sectionRegistry } from "./section-registry";

type SectionRendererProps = {
  sections: readonly Section[];
};

export function SectionRenderer({ sections }: SectionRendererProps) {
  return sections.map((section) => {
    // TypeScript loses the discriminated relationship
    // when indexing a registry with a union key.
    const render = sectionRegistry[section.type] as (
      section: Section,
    ) => React.ReactNode;

    return <Fragment key={section.id}>{render(section)}</Fragment>;
  });
}
