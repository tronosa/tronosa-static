export const navigationItems = [
  {
    id: "home",
    translationKey: "home",
  },
  {
    id: "our-water",
    translationKey: "ourWater",
  },
  {
    id: "our-story",
    translationKey: "ourStory",
  },
  {
    id: "products",
    translationKey: "products",
  },
  {
    id: "partners",
    translationKey: "partners",
  },
  {
    id: "blog",
    translationKey: "blog",
  },
  {
    id: "store-locator",
    translationKey: "storeLocator",
  },
  {
    id: "contact",
    translationKey: "contact",
  },
] as const;

export type NavigationItem = (typeof navigationItems)[number];

export type NavigationItemId = NavigationItem["id"];
