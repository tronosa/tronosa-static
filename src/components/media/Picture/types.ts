import type { z } from "zod";
import type { VariantProps } from "class-variance-authority";

import type { pictureSchema, pictureSourceSchema } from "./picture.schema";

import type { pictureVariants, pictureImageVariants } from "./picture.variants";

export type PictureSource = z.infer<typeof pictureSourceSchema>;

export type PictureContent = z.infer<typeof pictureSchema>;

export type PictureProps = PictureContent &
  VariantProps<typeof pictureVariants> &
  VariantProps<typeof pictureImageVariants> & {
    sizes: string;
    loading?: "eager" | "lazy";
    fetchPriority?: "high" | "low" | "auto";
    unoptimized?: boolean;
    className?: string;
    imageClassName?: string;
  };
