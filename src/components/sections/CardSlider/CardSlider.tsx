import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { SliderViewport } from "./SliderViewport";
import { SliderCard } from "./SliderCard";
import {
  cardSliderVariants,
  cardSliderHeaderVariants,
} from "./card-slider.variants";
import type { CardSliderProps } from "./types";

export function CardSlider({
  title,
  description,
  cards,
  accessibility,
  className,
}: CardSliderProps) {
  return (
    <section aria-label={title} className={cn(cardSliderVariants(), className)}>
      <Container size="wide">
        <div className={cardSliderHeaderVariants()}>
          <Typography as="h2" variant="h2">
            {title}
          </Typography>
          {description && <Typography as="p">{description}</Typography>}
        </div>
        <SliderViewport accessibility={accessibility} count={cards.length}>
          {cards.map((card, index) => (
            <SliderCard key={index} card={card} />
          ))}
        </SliderViewport>
      </Container>
    </section>
  );
}
