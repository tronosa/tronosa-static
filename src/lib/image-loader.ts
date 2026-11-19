import type { ImageLoaderProps } from "next/image";

import { resolveImageUrl } from "./media/resolve-image-url";

export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  return resolveImageUrl(src, {
    width,
    quality,
  });
}
