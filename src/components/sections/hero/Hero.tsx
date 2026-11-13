import Image from "next/image";

import type { HeroProps } from "./hero.schema";

export function Hero({ title, subtitle, description, image }: HeroProps) {
  return (
    <section aria-labelledby="hero-heading">
      <div>
        <div>
          {subtitle && <p>{subtitle}</p>}

          <h1 id="hero-heading">{title}</h1>

          {description && <p>{description}</p>}
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
      </div>
    </section>
  );
}
