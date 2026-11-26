import type { ReactNode } from "react";
import type { z } from "zod";

import type {
  cardSliderContentSchema,
  cardSliderSectionSchema,
} from "./card-slider.schema";

export type CardSliderContent = z.infer<typeof cardSliderContentSchema>;

export type CardSliderSection = z.infer<typeof cardSliderSectionSchema>;

export type CardSliderProps = CardSliderContent & {
  className?: string;
};

export type SliderCardContent = CardSliderContent["cards"][number];

export type SliderAccessibility = CardSliderContent["accessibility"];

export type SliderViewportProps = {
  children: ReactNode;
  accessibility: SliderAccessibility;
  count: number;
};
