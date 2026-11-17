import { Picture } from "@/components/media/Picture";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import {
  featureMosaicVariants,
  featureMosaicHeaderVariants,
  featureMosaicGridVariants,
  featureMosaicImageVariants,
  featureMosaicCardsVariants,
  featureMosaicCardVariants,
} from "./feature-mosaic.variants";
import type { FeatureMosaicProps } from "./types";

export function FeatureMosaic({
  title,
  description,
  image,
  imagePosition,
  cards,
  className,
}: FeatureMosaicProps) {
  return (
    <section
      aria-label={title}
      className={cn(featureMosaicVariants(), className)}
    >
      <Container size="wide">
        <div className={featureMosaicHeaderVariants()}>
          <Typography as="h2" variant="h2" className="max-w-xl">
            {title}
          </Typography>
          <Typography as="p" className="max-w-lg">
            {description}
          </Typography>
        </div>
        <div className={featureMosaicGridVariants()}>
          <div className={featureMosaicImageVariants({ imagePosition })}>
            <Picture
              {...image}
              ratio="fill"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <ul className={featureMosaicCardsVariants()}>
            {cards.map((card, index) => (
              <li key={index} className={featureMosaicCardVariants()}>
                <Typography
                  as="h3"
                  className="text-xl font-medium text-inherit"
                >
                  {card.title}
                </Typography>
                <Typography as="p" className="text-inherit">
                  {card.description}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
