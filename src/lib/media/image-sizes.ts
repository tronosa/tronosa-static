export const IMAGE_SIZES = {
  hero: [
    "(min-width: 1024px) calc(100vw - 5rem)",
    "(min-width: 768px) calc(100vw - 3rem)",
    "calc(100vw - 1.5rem)",
  ].join(", "),

  fullViewport: "100vw",
} as const;
