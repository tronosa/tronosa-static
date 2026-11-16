import Image from "next/image";

import type { HeroProps } from "./hero.schema";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

export function Hero({ title, subtitle, description, image }: HeroProps) {
  return (
    <section aria-labelledby="hero-heading">
      <Container size="default" gutter="default">
        <div>
          {subtitle && <Typography>{subtitle}</Typography>}

          <Typography as="h1" variant="h1" id="hero-heading">
            {title}
          </Typography>

          {description && <Typography>{description}</Typography>}
        </div>

        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            width={1200}
            height={800}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </Container>
    </section>
  );
}
