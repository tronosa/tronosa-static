export const statsBannerThemeNames = [
  "mosaic",
  "forest",
  "sage",
  "mineral",
  "bronze",
  "stone",
  "ivory",
  "graphite",
  "surface",
  "violet",
  "peach",
  "coral",
] as const;

export type StatsBannerTheme = (typeof statsBannerThemeNames)[number];

type ThemePalette = {
  background: string;
  foreground: string;
  border: string;
  opacity: number;
  triangles: readonly string[];
};

const lightBorder = "rgba(255, 255, 255, 0.38)";
const darkBorder = "rgba(37, 42, 40, 0.32)";

export const statsBannerThemes = {
  mosaic: {
    background: "#173f35",
    foreground: "#fffdf8",
    border: lightBorder,
    opacity: 0.3,
    triangles: [
      "#173f35",
      "#47675a",
      "#6b9692",
      "#eae5d8",
      "#ac815a",
      "#f8f6ef",
      "#7a63b3",
      "#9b88ce",
      "#c7bce6",
      "#f2a39a",
      "#e58a8a",
      "#252a28",
      "#fffdf8",
    ],
  },

  forest: {
    background: "#173f35",
    foreground: "#fffdf8",
    border: lightBorder,
    opacity: 0.3,
    triangles: [
      "#102e26",
      "#173f35",
      "#285548",
      "#376453",
      "#47675a",
      "#698777",
    ],
  },

  sage: {
    background: "#47675a",
    foreground: "#fffdf8",
    border: lightBorder,
    opacity: 0.2,
    triangles: [
      "#29483a",
      "#395749",
      "#47675a",
      "#567769",
      "#718e7e",
      "#9ab3a3",
    ],
  },

  mineral: {
    background: "#6b9692",
    foreground: "#102820",
    border: darkBorder,
    opacity: 0.27,
    triangles: [
      "#426d69",
      "#598580",
      "#6b9692",
      "#83aaa5",
      "#a6c8c3",
      "#d0e3df",
    ],
  },

  bronze: {
    background: "#ac815a",
    foreground: "#241a12",
    border: darkBorder,
    opacity: 0.27,
    triangles: [
      "#79583c",
      "#936c49",
      "#ac815a",
      "#c39c76",
      "#d4b393",
      "#ebd7c2",
    ],
  },

  stone: {
    background: "#eae5d8",
    foreground: "#252a28",
    border: darkBorder,
    opacity: 0.42,
    triangles: [
      "#bdb4a1",
      "#ccc3af",
      "#ddd6c6",
      "#eae5d8",
      "#f3eee3",
      "#fffdf8",
    ],
  },

  ivory: {
    background: "#f8f6ef",
    foreground: "#252a28",
    border: darkBorder,
    opacity: 0.5,
    triangles: [
      "#d6cdb9",
      "#e4dccb",
      "#eee8da",
      "#f8f6ef",
      "#fffdf8",
      "#ffffff",
    ],
  },

  graphite: {
    background: "#252a28",
    foreground: "#fffdf8",
    border: lightBorder,
    opacity: 0.32,
    triangles: [
      "#111614",
      "#252a28",
      "#383f3b",
      "#4e5752",
      "#67736c",
      "#89948e",
    ],
  },

  surface: {
    background: "#fffdf8",
    foreground: "#252a28",
    border: darkBorder,
    opacity: 0.45,
    triangles: [
      "#dcded8",
      "#eae5d8",
      "#efeee8",
      "#f8f6ef",
      "#fffdf8",
      "#ffffff",
    ],
  },

  violet: {
    background: "#54417f",
    foreground: "#fffdf8",
    border: lightBorder,
    opacity: 0.28,
    triangles: [
      "#46356e",
      "#675297",
      "#7a63b3",
      "#9b88ce",
      "#c7bce6",
      "#e7e1f0",
    ],
  },

  peach: {
    background: "#f2a39a",
    foreground: "#3b2535",
    border: darkBorder,
    opacity: 0.3,
    triangles: [
      "#c97971",
      "#e58a8a",
      "#f2a39a",
      "#f4b9ae",
      "#f4d1c9",
      "#fff1e9",
    ],
  },

  coral: {
    background: "#e58a8a",
    foreground: "#321d2a",
    border: darkBorder,
    opacity: 0.26,
    triangles: [
      "#b95e66",
      "#ce7378",
      "#e58a8a",
      "#efaaa7",
      "#f2c2bd",
      "#fbe4df",
    ],
  },
} satisfies Record<StatsBannerTheme, ThemePalette>;
