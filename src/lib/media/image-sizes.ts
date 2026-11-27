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

  editorialComposition: {
    primary: [
      "(min-width: 1536px) 800px",
      "(min-width: 1024px) 58vw",
      "(min-width: 640px) calc(100vw - 4rem)",
      "calc(100vw - 2.5rem)",
    ].join(", "),

    secondary: [
      "(min-width: 1536px) 560px",
      "(min-width: 1024px) 42vw",
      "(min-width: 640px) calc(100vw - 4rem)",
      "calc(100vw - 2.5rem)",
    ].join(", "),
  },

  heritage: [
    "(min-width: 1536px) 1440px",
    "(min-width: 1024px) calc(100vw - 5rem)",
    "(min-width: 640px) calc(100vw - 4rem)",
    "calc(100vw - 2.5rem)",
  ].join(", "),

  peopleGallery: {
    1: [
      "(min-width: 1280px) 1024px",
      "(min-width: 640px) calc(100vw - 4rem)",
      "calc(100vw - 2.5rem)",
    ].join(", "),

    2: [
      "(min-width: 1536px) 700px",
      "(min-width: 768px) 50vw",
      "(min-width: 640px) calc(100vw - 4rem)",
      "calc(100vw - 2.5rem)",
    ].join(", "),

    3: [
      "(min-width: 1536px) 460px",
      "(min-width: 768px) 33vw",
      "(min-width: 640px) calc(100vw - 4rem)",
      "calc(100vw - 2.5rem)",
    ].join(", "),
  },
  productCatalog: [
    "(min-width: 1280px) 400px",
    "(min-width: 1024px) 30vw",
    "(min-width: 640px) 45vw",
    "calc(100vw - 4rem)",
  ].join(", "),

  fullViewport: "100vw",
} as const;

export type PeopleGalleryImageCount = keyof typeof IMAGE_SIZES.peopleGallery;
