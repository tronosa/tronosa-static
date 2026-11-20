import { getImageProps } from "next/image";

import { cn } from "@/lib/cn";

import { pictureVariants, pictureImageVariants } from "./picture.variants";

import type { PictureProps } from "./types";

export function Picture({
  alt,
  desktop,
  tablet,
  mobile,
  sizes,
  quality = 75,
  ratio = "auto",
  radius = "none",
  fit = "cover",
  position = "center",
  loading = "lazy",
  fetchPriority = "auto",
  unoptimized = false,
  className,
  imageClassName,
}: PictureProps) {
  const commonProps = {
    alt,
    sizes,
    quality,
    loading,
    fetchPriority,
    unoptimized,
  };

  const { props: desktopProps } = getImageProps({
    ...commonProps,
    ...desktop,
  });

  const tabletProps = tablet
    ? getImageProps({
        ...commonProps,
        ...tablet,
      }).props
    : undefined;

  const mobileProps = mobile
    ? getImageProps({
        ...commonProps,
        ...mobile,
      }).props
    : undefined;

  return (
    <picture className={cn(pictureVariants({ ratio, radius }), className)}>
      {mobileProps && (
        <source
          media="(width < 640px)"
          srcSet={mobileProps.srcSet ?? mobileProps.src}
          sizes={mobileProps.sizes}
          width={mobileProps.width}
          height={mobileProps.height}
        />
      )}

      {tabletProps && (
        <source
          media="(width < 1024px)"
          srcSet={tabletProps.srcSet ?? tabletProps.src}
          sizes={tabletProps.sizes}
          width={tabletProps.width}
          height={tabletProps.height}
        />
      )}

      <img
        {...desktopProps}
        alt={alt}
        className={cn(
          pictureImageVariants({ fit, position }),
          ratio === "auto" ? "h-auto" : "absolute inset-0",
          imageClassName,
        )}
      />
    </picture>
  );
}
