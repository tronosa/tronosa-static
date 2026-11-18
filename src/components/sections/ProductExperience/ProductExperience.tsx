import { ProductExperienceClient } from "./ProductExperienceClient";

import type { ProductExperienceProps } from "./types";

export function ProductExperience(props: ProductExperienceProps) {
  return <ProductExperienceClient {...props} />;
}
