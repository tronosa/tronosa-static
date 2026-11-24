"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { ProductDisplay } from "./ProductDisplay";
import { ProductSelector } from "./ProductSelector";
import { ProductShowcaseCTA } from "./ProductShowcaseCTA";

import type { ProductShowcaseClientProps } from "./types";
import type { ProductShowcaseDirection } from "./product-showcase.animations";

import {
  productCategorySelectorVariants,
  productCategoryButtonVariants,
} from "./product-category-selector.variants";

import {
  productShowcaseVariants,
  productShowcaseBackgroundVariants,
  productShowcaseBackgroundTextContainerVariants,
  productShowcaseBackgroundTextVariants,
  productShowcaseLayoutVariants,
  productShowcaseHeaderVariants,
  productShowcaseEyebrowVariants,
  productShowcaseTitleVariants,
  productShowcaseDescriptionVariants,
  productShowcaseDisplayContainerVariants,
  productShowcaseSelectorContainerVariants,
  productShowcaseInformationContainerVariants,
  productShowcaseVolumeVariants,
  productShowcaseInformationVariants,
  productShowcaseProductTitleVariants,
  productShowcaseProductDescriptionVariants,
} from "./product-showcase.variants";

const PRODUCT_CHANGE_INTERVAL = 450;
const PRELOAD_MARGIN = "350px 0px";

const ProductShowcaseAnimation = dynamic(
  () =>
    import("./ProductShowcaseAnimation").then(
      (module) => module.ProductShowcaseAnimation,
    ),
  {
    ssr: false,
  },
);

type ProductSelection = {
  categoryId: string;
  productId: string;
};

function isReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ProductShowcaseClient({
  eyebrow,
  title,
  description,
  backgroundText,
  accessibility,
  cta,
  categories,
}: ProductShowcaseClientProps) {
  const headingId = useId();
  const containerRef = useRef<HTMLElement>(null);

  const directionRef = useRef<ProductShowcaseDirection>(1);
  const lastChangeRef = useRef(-Infinity);

  const firstCategory = categories[0];
  const firstProduct = firstCategory?.products[0];

  const initialCategoryId = firstCategory?.id ?? "";
  const initialProductId = firstProduct?.id ?? "";

  const [activeCategoryId, setActiveCategoryId] = useState(initialCategoryId);

  const [activeProductId, setActiveProductId] = useState(initialProductId);

  const [shouldLoadAnimation, setShouldLoadAnimation] = useState(false);

  const [hasInteracted, setHasInteracted] = useState(false);

  const animationReadyRef = useRef(false);

  const currentSelectionRef = useRef<ProductSelection>({
    categoryId: initialCategoryId,
    productId: initialProductId,
  });

  const pendingSelectionRef = useRef<ProductSelection | null>(null);

  const activeCategory =
    categories.find((category) => category.id === activeCategoryId) ??
    firstCategory;

  const products = activeCategory?.products ?? [];

  const activeProduct =
    products.find((product) => product.id === activeProductId) ?? products[0];

  useEffect(() => {
    const container = containerRef.current;

    if (
      !container ||
      isReducedMotion() ||
      !("IntersectionObserver" in window)
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setShouldLoadAnimation(true);
        observer.disconnect();
      },
      {
        rootMargin: PRELOAD_MARGIN,
        threshold: 0,
      },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const commitSelection = useCallback(
    (nextSelection: ProductSelection) => {
      const nextCategory = categories.find(
        (category) => category.id === nextSelection.categoryId,
      );

      if (!nextCategory) {
        return;
      }

      const nextProduct = nextCategory.products.find(
        (product) => product.id === nextSelection.productId,
      );

      if (!nextProduct) {
        return;
      }

      const previous = currentSelectionRef.current;

      if (
        previous.categoryId === nextSelection.categoryId &&
        previous.productId === nextSelection.productId
      ) {
        return;
      }

      if (previous.categoryId !== nextSelection.categoryId) {
        const previousIndex = categories.findIndex(
          (category) => category.id === previous.categoryId,
        );

        const nextIndex = categories.findIndex(
          (category) => category.id === nextSelection.categoryId,
        );

        directionRef.current = nextIndex > previousIndex ? 1 : -1;
      } else {
        const previousIndex = nextCategory.products.findIndex(
          (product) => product.id === previous.productId,
        );

        const nextIndex = nextCategory.products.findIndex(
          (product) => product.id === nextSelection.productId,
        );

        directionRef.current = nextIndex > previousIndex ? 1 : -1;
      }

      currentSelectionRef.current = nextSelection;

      setHasInteracted(true);
      setActiveCategoryId(nextSelection.categoryId);
      setActiveProductId(nextSelection.productId);
    },
    [categories],
  );

  const requestSelection = useCallback(
    (nextSelection: ProductSelection) => {
      const current = currentSelectionRef.current;

      if (
        current.categoryId === nextSelection.categoryId &&
        current.productId === nextSelection.productId
      ) {
        pendingSelectionRef.current = null;
        return;
      }

      const category = categories.find(
        (item) => item.id === nextSelection.categoryId,
      );

      if (
        !category?.products.some(
          (product) => product.id === nextSelection.productId,
        )
      ) {
        return;
      }

      const now = performance.now();

      if (now - lastChangeRef.current < PRODUCT_CHANGE_INTERVAL) {
        return;
      }

      lastChangeRef.current = now;

      if (isReducedMotion()) {
        pendingSelectionRef.current = null;
        commitSelection(nextSelection);
        return;
      }

      if (!animationReadyRef.current) {
        pendingSelectionRef.current = nextSelection;
        setShouldLoadAnimation(true);
        return;
      }

      pendingSelectionRef.current = null;
      commitSelection(nextSelection);
    },
    [categories, commitSelection],
  );

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      const category = categories.find((item) => item.id === categoryId);

      const product = category?.products[0];

      if (!category || !product) {
        return;
      }

      requestSelection({
        categoryId: category.id,
        productId: product.id,
      });
    },
    [categories, requestSelection],
  );

  const handleProductChange = useCallback(
    (productId: string) => {
      requestSelection({
        categoryId: currentSelectionRef.current.categoryId,
        productId,
      });
    },
    [requestSelection],
  );

  const handleAnimationReady = useCallback(() => {
    if (animationReadyRef.current) {
      return;
    }

    animationReadyRef.current = true;

    const pending = pendingSelectionRef.current;
    pendingSelectionRef.current = null;

    if (pending) {
      commitSelection(pending);
    }
  }, [commitSelection]);

  if (!activeCategory || !activeProduct) {
    return null;
  }

  const appearance = {
    "--product-background": activeProduct.appearance.backgroundColor,
    "--product-accent": activeProduct.appearance.accentColor,
  } as CSSProperties;

  return (
    <Section
      spacingType="padding"
      ref={containerRef}
      aria-labelledby={headingId}
      style={appearance}
      className={productShowcaseVariants()}
    >
      {shouldLoadAnimation && (
        <ProductShowcaseAnimation
          containerRef={containerRef}
          activeProductId={activeProduct.id}
          directionRef={directionRef}
          enabled={hasInteracted}
          onReady={handleAnimationReady}
        />
      )}

      <div aria-hidden="true" className={productShowcaseBackgroundVariants()} />

      {backgroundText && (
        <div
          aria-hidden="true"
          className={productShowcaseBackgroundTextContainerVariants()}
        >
          <span className={productShowcaseBackgroundTextVariants()}>
            {backgroundText}
          </span>
        </div>
      )}

      <Container size="wide">
        <div
          role="group"
          aria-label={accessibility.categorySelectorLabel}
          className={productCategorySelectorVariants()}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={category.id === activeCategory.id}
              onClick={() => handleCategoryChange(category.id)}
              className={productCategoryButtonVariants({
                active: category.id === activeCategory.id,
              })}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className={productShowcaseLayoutVariants()}>
          <header className={productShowcaseHeaderVariants()}>
            {eyebrow && (
              <p className={productShowcaseEyebrowVariants()}>{eyebrow}</p>
            )}

            <h2 id={headingId} className={productShowcaseTitleVariants()}>
              {title}
            </h2>

            {description && (
              <p className={productShowcaseDescriptionVariants()}>
                {description}
              </p>
            )}
          </header>

          <div className={productShowcaseDisplayContainerVariants()}>
            <ProductDisplay
              products={products}
              activeProductId={activeProduct.id}
            />
          </div>

          <div className={productShowcaseSelectorContainerVariants()}>
            <ProductSelector
              products={products}
              activeProductId={activeProduct.id}
              label={accessibility.selectorLabel}
              onChange={handleProductChange}
            />
          </div>

          <div
            aria-live="polite"
            aria-atomic="true"
            className={productShowcaseInformationContainerVariants()}
          >
            <div
              data-product-volume
              className={productShowcaseVolumeVariants()}
            >
              {activeProduct.volume}
            </div>

            <div
              data-product-information
              className={productShowcaseInformationVariants()}
            >
              <h3 className={productShowcaseProductTitleVariants()}>
                {activeProduct.title}
              </h3>

              <p className={productShowcaseProductDescriptionVariants()}>
                {activeProduct.description}
              </p>
            </div>
          </div>
        </div>

        {cta && <ProductShowcaseCTA {...cta} />}
      </Container>
    </Section>
  );
}
