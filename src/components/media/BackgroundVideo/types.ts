import type { z } from "zod";

import type {
  backgroundVideoSchema,
  backgroundVideoAccessibilitySchema,
} from "./background-video.schema";

export type BackgroundVideoSource = z.infer<typeof backgroundVideoSchema>;

export type BackgroundVideoAccessibility = z.infer<
  typeof backgroundVideoAccessibilitySchema
>;

export type BackgroundVideoProps = {
  video: BackgroundVideoSource;
  accessibility: BackgroundVideoAccessibility;
  className?: string;
};

export type BackgroundVideoControlsProps = {
  playing: boolean;
  accessibility: BackgroundVideoAccessibility;
  onToggle: () => void;
};
