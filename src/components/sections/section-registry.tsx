import type { ReactNode } from "react";

import type { Section, SectionType } from "@/content/schemas/section.schema";

import { Hero } from "./hero";
import { Text } from "./text";

type SectionByType<T extends SectionType> = Extract<Section, { type: T }>;

type SectionRegistry = {
  [T in SectionType]: (section: SectionByType<T>) => ReactNode;
};

export const sectionRegistry = {
  hero: ({ content }) => <Hero {...content} />,
  text: ({ content }) => <Text {...content} />,
} satisfies SectionRegistry;
