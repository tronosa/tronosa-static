import type { CSSProperties } from "react";

import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

import { StatsBannerMosaic } from "./StatsBannerMosaic";
import { statsBannerThemes } from "./stats-banner.theme";

import {
  statsBannerVariants,
  statsBannerContentVariants,
  statsBannerGridVariants,
  statsBannerItemVariants,
  statsBannerValueVariants,
} from "./stats-banner.variants";

import type { StatsBannerProps } from "./types";
import { Section } from "@/components/ui/Section";

export function StatsBanner({
  title,
  description,
  statistics,
  theme = "forest",
  className,
}: StatsBannerProps) {
  const palette = statsBannerThemes[theme];

  const style = {
    "--stats-bg": palette.background,
    "--stats-fg": palette.foreground,
    "--stats-border": palette.border,
  } as CSSProperties;

  return (
    <Section
      spacingType="padding"
      aria-label={title}
      data-stats-theme={theme}
      style={style}
      className={cn(statsBannerVariants(), className)}
    >
      <StatsBannerMosaic theme={theme} />

      <Container size="wide">
        <div className={statsBannerContentVariants()}>
          <div className="max-w-xl space-y-4">
            <Typography
              as="h2"
              variant="h2"
              weight="medium"
              className="text-(--stats-fg)"
            >
              {title}
            </Typography>

            {description && (
              <Typography as="p" className="text-(--stats-fg)">
                {description}
              </Typography>
            )}
          </div>

          <dl className={statsBannerGridVariants()}>
            {statistics.map((statistic, index) => (
              <div key={index} className={statsBannerItemVariants()}>
                <dt className="order-2 text-sm md:text-base">
                  {statistic.label}
                </dt>

                <dd className={cn(statsBannerValueVariants(), "order-1")}>
                  {statistic.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </Section>
  );
}
