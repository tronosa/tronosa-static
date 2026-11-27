export type ProductDetailFact = {
  id: string;
  label: string;
  value: string;
};

export type ProductDetailSection = {
  id: string;
  title: string;
  description: string;
};

export type ProductDetails = {
  title: string;
  description?: string;
  facts: readonly ProductDetailFact[];
  sections: readonly ProductDetailSection[];
};

export type ProductDetailsDialogLabels = {
  eyebrow: string;
  trigger: string;
  triggerAccessible: string;
  close: string;
};

export type ProductDetailsDialogProps = {
  product: ProductDetails;
  labels: ProductDetailsDialogLabels;
};
