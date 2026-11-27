import "server-only";

import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Typography } from "@/components/ui/Typography";

import { getServerLocale } from "@/i18n/get-server-locale";
import { getEnvironment } from "@/lib/environment";

import {
  getAllProducts,
  getPublishedProducts,
} from "@/lib/content/products/product-registry";

import {
  getProductLabels,
  getProductCatalogLabels,
  getProductDialogTriggerLabel,
} from "@/lib/content/products/product-labels";

import { toProductDetails } from "@/lib/content/products/product-details-adapter";

import { formatProductVolume } from "@/lib/content/products/product-filters";

import {
  ProductCatalogClient,
  type ProductCatalogItem,
} from "./ProductCatalogClient";

import { ProductCatalogCard } from "./ProductCatalogCard";

import type { ProductCatalogContent } from "./product-catalog.schema";

import {
  catalogVariants,
  catalogHeaderVariants,
  catalogEyebrowVariants,
  catalogPreviewVariants,
} from "./product-catalog.variants";

export async function ProductCatalog({
  eyebrow,
  title,
  description,
}: ProductCatalogContent) {
  const locale = await getServerLocale();

  const { isProduction } = getEnvironment();

  const products = isProduction
    ? getPublishedProducts(locale)
    : getAllProducts(locale);

  const hasDraftProducts = products.some(
    (product) => product.status === "draft",
  );

  const [productLabels, catalogLabels] = await Promise.all([
    getProductLabels(locale),

    getProductCatalogLabels(locale, products.length),
  ]);

  const items: ProductCatalogItem[] = await Promise.all(
    products.map(async (product) => {
      const volumeLabel = formatProductVolume(product.volumeMl, locale);

      const details = toProductDetails(product, locale, productLabels);

      const triggerAccessible = await getProductDialogTriggerLabel(
        locale,
        details.title,
      );

      return {
        id: product.id,

        waterType: product.waterType,

        volumeMl: product.volumeMl,

        card: (
          <ProductCatalogCard
            product={product}
            volumeLabel={volumeLabel}
            categoryLabel={productLabels.categories[product.category]}
            details={details}
            dialogLabels={{
              ...productLabels.dialog,
              triggerAccessible,
            }}
          />
        ),
      };
    }),
  );

  return (
    <Section
      id="product-catalog"
      data-product-catalog
      spacing="lg"
      spacingType="padding"
      className={catalogVariants()}
    >
      <Container size="wide">
        <header className={catalogHeaderVariants()}>
          {eyebrow && (
            <Typography
              variant="caption"
              weight="semibold"
              tone={null}
              className={catalogEyebrowVariants()}
            >
              {eyebrow}
            </Typography>
          )}

          <Typography as="h2" variant="h2" weight="medium" tone={null}>
            {title}
          </Typography>

          {description && (
            <Typography variant="lead" tone={null}>
              {description}
            </Typography>
          )}
        </header>

        {hasDraftProducts && (
          <div className={catalogPreviewVariants()}>
            <Typography variant="small" tone={null}>
              {catalogLabels.preview}
            </Typography>
          </div>
        )}

        <ProductCatalogClient
          locale={locale}
          labels={catalogLabels}
          products={items}
        />
      </Container>
    </Section>
  );
}
