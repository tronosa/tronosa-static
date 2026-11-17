import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import {
  statsBannerVariants,
  statsBannerContentVariants,
  statsBannerGridVariants,
  statsBannerValueVariants,
} from "./stats-banner.variants";
import type { StatsBannerProps } from "./types";

export function StatsBanner({
  title,
  description,
  statistics,
  className,
}: StatsBannerProps) {
  return (
    <section
      aria-label={title}
      className={cn(statsBannerVariants(), className)}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 size-full opacity-25"
      >
        <path d="M0 400 250 0 500 400Z" className="fill-brand-sage" />
        <path d="M250 0 750 0 500 400Z" className="fill-brand-mineral" />
        <path d="M500 400 750 0 1000 400Z" className="fill-brand-sage" />
        <path d="M750 0 1000 0 1000 400Z" className="fill-brand-bronze" />
        <path d="M0 0 250 0 0 400Z" className="fill-brand-forest" />
      </svg>
      <div aria-hidden="true" className="absolute inset-0 bg-brand-forest/45" />
      <Container size="wide">
        <div className={statsBannerContentVariants()}>
          <div className="max-w-xl space-y-4">
            <Typography as="h2" variant="h2" className="text-white">
              {title}
            </Typography>
            {description && (
              <Typography as="p" className="text-white/90">
                {description}
              </Typography>
            )}
          </div>
          <dl className={statsBannerGridVariants()}>
            {statistics.map((statistic, index) => (
              <div
                key={index}
                className="flex min-w-0 flex-col gap-3 border-t border-white/30 pt-5"
              >
                <dt className="order-2 text-sm text-white/90 md:text-base">
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
    </section>
  );
}
