import type { ImageLoaderProps } from "next/image";

export default function imageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.trim();

  const isAbsoluteUrl = /^https?:\/\//i.test(src);

  const normalizedSrc = src.replace(/^\/+/, "").replace(/^assets\//, "");

  // Use local assets when ImageKit is not configured.
  if (!endpoint) {
    if (isAbsoluteUrl) {
      return src;
    }

    return `/assets/${normalizedSrc}`;
  }

  const baseUrl = new URL(`${endpoint.replace(/\/+$/, "")}/`);

  const url = isAbsoluteUrl ? new URL(src) : new URL(normalizedSrc, baseUrl);

  if (
    url.origin !== baseUrl.origin ||
    !url.pathname.startsWith(baseUrl.pathname)
  ) {
    throw new Error(`Unsupported image source: ${src}`);
  }

  url.searchParams.set("tr", `w-${width},q-${quality ?? 75}`);

  return url.toString();
}
