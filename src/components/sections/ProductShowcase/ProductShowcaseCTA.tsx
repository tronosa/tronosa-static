import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

import {
  productShowcaseCTAButtonVariants,
  productShowcaseCTAVariants,
} from "./product-showcase-cta.variants";

import type { ResolvedProductShowcaseCTA } from "./types";

export function ProductShowcaseCTA({
  label,
  href,
}: ResolvedProductShowcaseCTA) {
  return (
    <div className={productShowcaseCTAVariants()}>
      <Button
        asChild
        variant="outline"
        size="lg"
        arrow
        className={productShowcaseCTAButtonVariants()}
      >
        <Link href={href}>{label}</Link>
      </Button>
    </div>
  );
}
