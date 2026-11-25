export const IMAGE_SIZES = {
  hero: [
    "(min-width: 1024px) calc(100vw - 5rem)",
    "(min-width: 768px) calc(100vw - 3rem)",
    "calc(100vw - 1.5rem)",
  ].join(", "),

  editorial: [
    "(min-width: 1024px) 420px",
    "(min-width: 640px) calc(100vw - 4rem)",
    "calc(100vw - 2.5rem)",
  ].join(", "),

  fullViewport: "100vw",
} as const;
