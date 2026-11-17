export const navigationItems = [
  {
    id: "home",
    href: "/",
    translationKey: "home",
  },
  {
    id: "about",
    href: "/about",
    translationKey: "about",
  },
  {
    id: "blog",
    href: "/blog",
    translationKey: "blog",
  },
  {
    id: "contact",
    href: "/contact",
    translationKey: "contact",
  },
] as const;

export type NavigationItem = (typeof navigationItems)[number];
export type NavigationItemId = NavigationItem["id"];
