import { z } from "zod";

import { heroSchema } from "@/components/sections/hero/hero.schema";
import { textSchema } from "@/components/sections/text/text.schema";

export const sectionSchema = z.discriminatedUnion("type", [
  heroSchema,
  textSchema,
]);

export type Section = z.infer<typeof sectionSchema>;
export type SectionType = Section["type"];
