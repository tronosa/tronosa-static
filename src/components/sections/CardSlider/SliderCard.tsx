import { Picture } from "@/components/media/Picture";
import { Typography } from "@/components/ui/Typography";

import {
  sliderCardVariants,
  sliderCardContentVariants,
  sliderCardScrollVariants,
} from "./card-slider.variants";

import type { SliderCardContent } from "./types";

const CARD_IMAGE_SIZES = [
  "(min-width: 90rem) calc((90rem - 8rem) / 3)",
  "(min-width: 1024px) calc((100vw - 8rem) / 3)",
  "(min-width: 640px) calc((100vw - 5.25rem) / 2)",
  "calc(100vw - 2.5rem)",
].join(", ");

export function SliderCard({ card }: { card: SliderCardContent }) {
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

      <div
        tabIndex={0}
        className={`relative z-10 ${sliderCardScrollVariants()}`}
      >
        <div className="flex min-h-full flex-col justify-between gap-4">
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
              className="text-2xl leading-tight text-inherit sm:text-3xl md:text-4xl"
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
          </div>
        </div>
      </div>
    </article>
  );
}
