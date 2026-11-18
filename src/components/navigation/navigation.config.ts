export const navigationItems = [
  {
    id: "home",
    translationKey: "home",
  },
  {
    id: "about",
    translationKey: "about",
  },
  {
    id: "blog",
    translationKey: "blog",
  },
  {
    id: "products",
    translationKey: "products",
  },
  {
    id: "contact",
    translationKey: "contact",
  },
] as const;

export type NavigationItem = (typeof navigationItems)[number];

export type NavigationItemId = NavigationItem["id"];
