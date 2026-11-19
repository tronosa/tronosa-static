interface ImageTransformations {
  width: number;
  quality?: number;
}

export function resolveImageUrl(
  src: string,
  transformations?: ImageTransformations,
): string {
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.trim();

  const isAbsoluteUrl = /^https?:\/\//i.test(src);

  const normalizedSrc = src.replace(/^\/+/, "").replace(/^assets\//, "");

  if (!endpoint) {
    return isAbsoluteUrl ? src : `/assets/${normalizedSrc}`;
  }

  const baseUrl = new URL(`${endpoint.replace(/\/+$/, "")}/`);

  const url = isAbsoluteUrl ? new URL(src) : new URL(normalizedSrc, baseUrl);

  if (
    url.origin !== baseUrl.origin ||
    !url.pathname.startsWith(baseUrl.pathname)
  ) {
    throw new Error(`Unsupported image source: ${src}`);
  }

  if (transformations) {
    const { width, quality = 75 } = transformations;

    url.searchParams.set("tr", `w-${width},q-${quality}`);
  }

  return url.toString();
}
