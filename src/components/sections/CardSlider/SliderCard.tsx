import { Picture } from "@/components/media/Picture";
import { Typography } from "@/components/ui/Typography";

import { Link } from "@/i18n/navigation";

import {
  sliderCardVariants,
  sliderCardBodyVariants,
  sliderCardContentVariants,
  sliderCardCtaVariants,
} from "./card-slider.variants";

import type { SliderCardContent } from "./types";

const CARD_IMAGE_SIZES = [
  "(min-width: 90rem) calc((90rem - 8rem) / 3)",
  "(min-width: 1024px) calc((100vw - 8rem) / 3)",
  "(min-width: 640px) calc((100vw - 5.25rem) / 2)",
  "calc(100vw - 2.5rem)",
].join(", ");

type SliderCardProps = {
  card: SliderCardContent;
  ctaHref?: string;
};

export function SliderCard({ card, ctaHref }: SliderCardProps) {
  return (
    <article className={sliderCardVariants({ kind: card.kind })}>
      {card.kind === "image" && (
        <>
          <Picture
            {...card.image}
            ratio="fill"
            sizes={CARD_IMAGE_SIZES}
            quality={75}
            loading="lazy"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/60 to-black/55"
          />
        </>
      )}

      <div className={sliderCardBodyVariants()}>
        <Typography
          as="h3"
          weight="medium"
          className="shrink-0 text-inherit wrap-break-word"
        >
          {card.title}
        </Typography>

        <div className={sliderCardContentVariants()}>
          <Typography
            as="p"
            weight="medium"
            variant="h3"
            className="text-inherit"
          >
            {card.headline}
          </Typography>

          {card.description && (
            <Typography
              as="p"
              variant="small"
              className="text-inherit opacity-90"
            >
              {card.description}
            </Typography>
          )}

          {card.cta && ctaHref && (
            <Link href={ctaHref} className={sliderCardCtaVariants()}>
              {card.cta.label}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
