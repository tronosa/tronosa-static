"use client";

import * as Dialog from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

import type { ProductDetailsDialogProps } from "./types";

import {
  productDialogTriggerVariants,
  productDialogOverlayVariants,
  productDialogContentVariants,
  productDialogHeaderVariants,
  productDialogCloseVariants,
  productDialogIntroVariants,
  productDialogFactsVariants,
  productDialogFactVariants,
  productDialogSectionsVariants,
  productDialogSectionVariants,
  productDialogFooterVariants,
} from "./product-details-dialog.variants";

export function ProductDetailsDialog({
  product,
  labels,
}: ProductDetailsDialogProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          size="md"
          className={productDialogTriggerVariants()}
          aria-label={labels.triggerAccessible}
        >
          {labels.trigger}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={productDialogOverlayVariants()} />

        <Dialog.Content className={productDialogContentVariants()}>
          <header className={productDialogHeaderVariants()}>
            <Typography
              variant="caption"
              weight="semibold"
              tone={null}
              className="uppercase"
            >
              {labels.eyebrow}
            </Typography>

            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={labels.close}
                className={productDialogCloseVariants()}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="size-5"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </Dialog.Close>
          </header>

          <div className={productDialogIntroVariants()}>
            <Dialog.Title asChild>
              <Typography as="h2" variant="h2" weight="medium" tone={null}>
                {product.title}
              </Typography>
            </Dialog.Title>

            <Dialog.Description asChild>
              <Typography
                as="p"
                variant="body"
                tone={null}
                className={product.description ? undefined : "sr-only"}
              >
                {product.description ?? product.title}
              </Typography>
            </Dialog.Description>
          </div>

          {product.facts.length > 0 && (
            <dl className={productDialogFactsVariants()}>
              {product.facts.map((fact) => (
                <div key={fact.id} className={productDialogFactVariants()}>
                  <Typography
                    asChild
                    variant="caption"
                    weight="medium"
                    tone={null}
                  >
                    <dt>{fact.label}</dt>
                  </Typography>

                  <Typography
                    asChild
                    variant="h4"
                    weight="semibold"
                    tone={null}
                  >
                    <dd>{fact.value}</dd>
                  </Typography>
                </div>
              ))}
            </dl>
          )}

          {product.sections.length > 0 && (
            <div className={productDialogSectionsVariants()}>
              {product.sections.map((section) => (
                <div
                  key={section.id}
                  className={productDialogSectionVariants()}
                >
                  <Typography
                    as="h3"
                    variant="h4"
                    weight="semibold"
                    tone={null}
                  >
                    {section.title}
                  </Typography>

                  <Typography variant="body" tone={null}>
                    {section.description}
                  </Typography>
                </div>
              ))}
            </div>
          )}

          <footer className={productDialogFooterVariants()}>
            <Dialog.Close asChild>
              <Button type="button" variant="primary" size="md">
                {labels.close}
              </Button>
            </Dialog.Close>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
