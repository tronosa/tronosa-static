"use client";

import { useId, useState, type ReactNode } from "react";

import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";

import { Select, type SelectOption } from "@/components/ui/Select";

import type { ProductCatalogLabels } from "@/lib/content/products/product-labels";

import type { Locale } from "@/i18n/config";

import type { ProductWaterType } from "@/lib/content/products/product.config";

import {
  DEFAULT_CATALOG_FILTERS,
  filterCatalogProducts,
  getCatalogVolumes,
  getCatalogWaterTypes,
  formatProductVolume,
  type CatalogFilters,
  type FilterableProduct,
} from "@/lib/content/products/product-filters";

import {
  catalogFiltersVariants,
  catalogFilterFieldVariants,
  catalogResultsVariants,
  catalogGridVariants,
  catalogEmptyVariants,
} from "./product-catalog.variants";

export type ProductCatalogItem = FilterableProduct & {
  id: string;
  card: ReactNode;
};

type ProductCatalogClientProps = {
  locale: Locale;

  labels: ProductCatalogLabels;

  products: ProductCatalogItem[];
};

export function ProductCatalogClient({
  locale,
  labels,
  products,
}: ProductCatalogClientProps) {
  const id = useId();

  const [filters, setFilters] = useState<CatalogFilters>(
    DEFAULT_CATALOG_FILTERS,
  );

  const waterTypes = getCatalogWaterTypes(products);

  const volumes = getCatalogVolumes(products);

  const filteredProducts = filterCatalogProducts(products, filters);

  const hasFilters = filters.waterType !== "all" || filters.volumeMl !== "all";

  const waterTypeOptions: SelectOption[] = [
    {
      value: "all",
      label: labels.allWaterTypes,
    },
    ...waterTypes.map((waterType) => ({
      value: waterType,
      label: labels.waterTypes[waterType],
    })),
  ];

  const volumeOptions: SelectOption[] = [
    {
      value: "all",
      label: labels.allVolumes,
    },
    ...volumes.map((volume) => ({
      value: String(volume),

      label: formatProductVolume(volume, locale),
    })),
  ];

  function resetFilters() {
    setFilters(DEFAULT_CATALOG_FILTERS);
  }

  function changeWaterType(value: string) {
    const waterType = value as ProductWaterType | "all";

    setFilters((current) => ({
      ...current,
      waterType,
    }));
  }

  function changeVolume(value: string) {
    setFilters((current) => ({
      ...current,

      volumeMl: value === "all" ? "all" : Number(value),
    }));
  }

  return (
    <>
      {products.length > 0 && (
        <div className={catalogFiltersVariants()}>
          <div className={catalogFilterFieldVariants()}>
            <Typography asChild variant="small" weight="medium" tone={null}>
              <label id={`${id}-water-type-label`} htmlFor={`${id}-water-type`}>
                {labels.waterType}
              </label>
            </Typography>

            <Select
              id={`${id}-water-type`}
              aria-labelledby={`${id}-water-type-label`}
              value={filters.waterType}
              options={waterTypeOptions}
              onValueChange={changeWaterType}
            />
          </div>

          <div className={catalogFilterFieldVariants()}>
            <Typography asChild variant="small" weight="medium" tone={null}>
              <label id={`${id}-volume-label`} htmlFor={`${id}-volume`}>
                {labels.volume}
              </label>
            </Typography>

            <Select
              id={`${id}-volume`}
              aria-labelledby={`${id}-volume-label`}
              value={String(filters.volumeMl)}
              options={volumeOptions}
              onValueChange={changeVolume}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={!hasFilters}
            onClick={resetFilters}
          >
            {labels.reset}
          </Button>
        </div>
      )}

      <Typography
        variant="small"
        weight="medium"
        tone={null}
        role="status"
        className={catalogResultsVariants()}
      >
        {labels.resultsByCount[filteredProducts.length]}
      </Typography>

      {filteredProducts.length === 0 ? (
        <div className={catalogEmptyVariants()}>
          <Typography variant="body" tone={null}>
            {labels.empty}
          </Typography>
        </div>
      ) : (
        <div data-product-catalog-results className={catalogGridVariants()}>
          {filteredProducts.map((product) => (
            <div key={product.id}>{product.card}</div>
          ))}
        </div>
      )}
    </>
  );
}
