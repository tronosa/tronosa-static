import type { z } from "zod";
import type {
  partnersMarqueeContentSchema,
  partnersMarqueeSectionSchema,
} from "./partners-marquee.schema";

export type PartnersMarqueeContent = z.infer<
  typeof partnersMarqueeContentSchema
>;
export type PartnersMarqueeSection = z.infer<
  typeof partnersMarqueeSectionSchema
>;
export type PartnersMarqueeProps = PartnersMarqueeContent & {
  className?: string;
};
export type PartnersAccessibility = PartnersMarqueeContent["accessibility"];
