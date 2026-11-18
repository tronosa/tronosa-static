import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { SliderViewport } from "./SliderViewport";
import { SliderCard } from "./SliderCard";
import { cardSliderHeaderVariants } from "./card-slider.variants";
import type { CardSliderProps } from "./types";
import { Section } from "@/components/ui/Section";

export function CardSlider({
  title,
  description,
  cards,
  accessibility,
  className,
}: CardSliderProps) {
  return (
    <Section aria-label={title} className={className}>
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
    </Section>
  );
}
