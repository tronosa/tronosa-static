import type { ImageLoaderProps } from "next/image";

export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  // External URLs and static assets outside /assets/
  // are returned without CDN transformations.
  if (!src.startsWith("/assets/")) {
    return src;
  }

  // Local development uses original files.
  if (process.env.NEXT_PUBLIC_IMAGE_CDN !== "netlify") {
    return src;
  }

  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(quality ?? 75),
  });

  return `/.netlify/images?${params.toString()}`;
}
