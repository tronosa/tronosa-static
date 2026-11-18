import { ProductShowcaseClient } from "./ProductShowcaseClient";

import type { ProductShowcaseProps } from "./types";

export function ProductShowcase(props: ProductShowcaseProps) {
  return <ProductShowcaseClient {...props} />;
}
