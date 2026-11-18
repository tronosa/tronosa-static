import { Picture } from "@/components/media/Picture";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

import {
  featureMosaicHeaderVariants,
  featureMosaicGridVariants,
  featureMosaicImageVariants,
  featureMosaicCardsVariants,
  featureMosaicCardVariants,
} from "./feature-mosaic.variants";
import type { FeatureMosaicProps } from "./types";
import { Section } from "@/components/ui/Section";

export function FeatureMosaic({
  title,
  description,
  image,
  imagePosition,
  cards,
  className,
}: FeatureMosaicProps) {
  return (
    <Section aria-label={title} className={className}>
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
    </Section>
  );
}
