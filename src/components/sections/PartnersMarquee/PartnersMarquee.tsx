import { Picture } from "@/components/media/Picture";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import { MarqueeViewport } from "./MarqueeViewport";
import {
  partnersMarqueeVariants,
  partnersMarqueeHeaderVariants,
  partnerLogoVariants,
} from "./partners-marquee.variants";
import type { PartnersMarqueeProps } from "./types";
import "./partners-marquee.css";
import { Section } from "@/components/ui/Section";

export function PartnersMarquee({
  title,
  description,
  partners,
  accessibility,
  className,
}: PartnersMarqueeProps) {
  const renderLogos = (decorative: boolean) =>
    partners.map((partner, index) => (
      <li key={index} className={partnerLogoVariants()}>
        <Picture
          alt={decorative ? "" : partner.name}
          desktop={partner.logo}
          ratio="landscape"
          fit="contain"
          sizes="160px"
          className="w-32 sm:w-40"
        />
      </li>
    ));
  return (
    <Section
      spacingType="padding"
      aria-label={title}
      className={cn(partnersMarqueeVariants(), className)}
    >
      <Container size="wide">
        <div className={partnersMarqueeHeaderVariants()}>
          <Typography as="h2" variant="h2">
            {title}
          </Typography>
          {description && <Typography as="p">{description}</Typography>}
        </div>
        <MarqueeViewport
          accessibility={accessibility}
          animated={partners.length >= 6}
        >
          <ul data-partners-list="original">{renderLogos(false)}</ul>
          {partners.length >= 6 && (
            <ul data-partners-list="duplicate" aria-hidden="true">
              {renderLogos(true)}
            </ul>
          )}
        </MarqueeViewport>
      </Container>
    </Section>
  );
}
