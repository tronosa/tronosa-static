import { Picture } from "@/components/media/Picture";
import { Typography } from "@/components/ui/Typography";

import {
  ProductDetailsDialog,
  type ProductDetails,
  type ProductDetailsDialogLabels,
} from "@/components/products/ProductDetailsDialog";

import { IMAGE_SIZES } from "@/lib/media/image-sizes";
import { IMAGE_QUALITY } from "@/lib/media/image-quality";

import type { LocalizedProduct } from "@/content/schemas/product.schema";

import {
  catalogCardVariants,
  catalogCardMediaVariants,
  catalogCardImageVariants,
  catalogCardCategoryVariants,
  catalogCardVolumeVariants,
  catalogCardContentVariants,
  catalogCardActionVariants,
} from "./product-catalog.variants";

type ProductCatalogCardProps = {
  product: LocalizedProduct;

  categoryLabel: string;

  volumeLabel: string;

  details: ProductDetails;

  dialogLabels: ProductDetailsDialogLabels;
};

export function ProductCatalogCard({
  product,
  categoryLabel,
  volumeLabel,
  details,
  dialogLabels,
}: ProductCatalogCardProps) {
  const { alt, ...image } = product.image;

  return (
    <article data-product-id={product.id} className={catalogCardVariants()}>
      <div className={catalogCardMediaVariants()}>
        <Typography
          variant="caption"
          weight="semibold"
          tone={null}
          className={catalogCardCategoryVariants()}
        >
          {categoryLabel}
        </Typography>

        <div className={catalogCardImageVariants()}>
          <Picture
            alt={alt}
            desktop={image}
            ratio="fill"
            fit="contain"
            loading="lazy"
            quality={IMAGE_QUALITY.product}
            sizes={IMAGE_SIZES.productCatalog}
          />
        </div>

        <Typography
          as="p"
          variant="h2"
          weight="medium"
          tone={null}
          className={catalogCardVolumeVariants()}
        >
          {volumeLabel}
        </Typography>
      </div>

      <div className={catalogCardContentVariants()}>
        <Typography as="h3" variant="h3" weight="semibold" tone={null}>
          {product.title}
        </Typography>

        <Typography variant="body" tone={null}>
          {product.description}
        </Typography>

        <div className={catalogCardActionVariants()}>
          <ProductDetailsDialog product={details} labels={dialogLabels} />
        </div>
      </div>
    </article>
  );
}
