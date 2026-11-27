import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

import type { ProductIntroductionContent } from "./product-introduction.schema";

import {
  productIntroductionVariants,
  productIntroductionLayoutVariants,
  productIntroductionHeadingVariants,
  productIntroductionEyebrowVariants,
  productIntroductionTitleVariants,
  productIntroductionDescriptionVariants,
  productIntroductionDividerVariants,
  productIntroductionLineVariants,
  productIntroductionIconVariants,
} from "./product-introduction.variants";

export function ProductIntroduction({
  eyebrow,
  title,
  description,
}: ProductIntroductionContent) {
  return (
    <Section
      spacing="lg"
      spacingType="padding"
      className={productIntroductionVariants()}
    >
      <Container size="wide">
        <div className={productIntroductionLayoutVariants()}>
          <div className={productIntroductionHeadingVariants()}>
            {eyebrow && (
              <Typography
                as="p"
                variant="caption"
                weight="semibold"
                tone={null}
                className={productIntroductionEyebrowVariants()}
              >
                {eyebrow}
              </Typography>
            )}

            <Typography
              as="h2"
              variant="h2"
              weight="medium"
              tone={null}
              className={productIntroductionTitleVariants()}
            >
              {title}
            </Typography>
          </div>

          <Typography
            as="p"
            variant="lead"
            tone={null}
            className={productIntroductionDescriptionVariants()}
          >
            {description}
          </Typography>
        </div>

        <div
          aria-hidden="true"
          className={productIntroductionDividerVariants()}
        >
          <span className={productIntroductionLineVariants()} />

          <svg
            focusable="false"
            viewBox="0 0 24 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            className={productIntroductionIconVariants()}
          >
            <path d="M12 2C8 9 2 15 2 21a10 10 0 0 0 20 0C22 15 16 9 12 2Z" />
          </svg>

          <span className={productIntroductionLineVariants()} />
        </div>
      </Container>
    </Section>
  );
}
