import type { Locale } from "@/i18n/config";

const en = {
  eyebrow: "Our network",
  title: "Always close to you",
  description: "Discover our distribution and retail network.",

  retailer: "Retail location",
  distributor: "Distributor",
  production: "Production facility",
  partner: "Partner",

  map: "Map",
  list: "Locations",
  view: "Display mode",
  count: "Number of locations",
  legend: "Location types",

  details: "Location details",
  showOnMap: "Show on map",
  directions: "Get directions",
  close: "Close",

  phone: "Phone",
  email: "Email",
  website: "Website",

  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  resetMap: "Reset map view",

  loading: "Loading map...",
  unavailable: "The map is currently unavailable.",
  empty: "No locations are currently available.",

  attribution: "Map attribution",
  gestureWindows: "Use Ctrl + scroll to zoom the map",
  gestureMac: "Use ⌘ + scroll to zoom the map",
  gestureMobile: "Use two fingers to move the map",
};

export type DistributionMapMessages = Record<keyof typeof en, string>;

const translations = {
  "sr-Cyrl": {
    eyebrow: "Наша мрежа",
    title: "Увек близу вас",
    description: "Откријте нашу продајну и дистрибутивну мрежу.",

    retailer: "Продајно место",
    distributor: "Дистрибутер",
    production: "Производни погон",
    partner: "Партнер",

    map: "Мапа",
    list: "Локације",
    view: "Начин приказа",
    count: "Број локација",
    legend: "Типови локација",

    details: "Детаљи локације",
    showOnMap: "Прикажи на мапи",
    directions: "Како до нас?",
    close: "Затвори",

    phone: "Телефон",
    email: "Имејл",
    website: "Веб-сајт",

    zoomIn: "Увећај мапу",
    zoomOut: "Умањи мапу",
    resetMap: "Врати почетни приказ",

    loading: "Учитавање мапе...",
    unavailable: "Мапа тренутно није доступна.",
    empty: "Тренутно нема доступних локација.",

    attribution: "Извори података мапе",
    gestureWindows: "Користите Ctrl + scroll за зумирање мапе",
    gestureMac: "Користите ⌘ + scroll за зумирање мапе",
    gestureMobile: "Користите два прста за померање мапе",
  },

  "sr-Latn": {
    eyebrow: "Naša mreža",
    title: "Uvek blizu vas",
    description: "Otkrijte našu prodajnu i distributivnu mrežu.",

    retailer: "Prodajno mesto",
    distributor: "Distributer",
    production: "Proizvodni pogon",
    partner: "Partner",

    map: "Mapa",
    list: "Lokacije",
    view: "Način prikaza",
    count: "Broj lokacija",
    legend: "Tipovi lokacija",

    details: "Detalji lokacije",
    showOnMap: "Prikaži na mapi",
    directions: "Kako do nas?",
    close: "Zatvori",

    phone: "Telefon",
    email: "Imejl",
    website: "Veb-sajt",

    zoomIn: "Uvećaj mapu",
    zoomOut: "Umanji mapu",
    resetMap: "Vrati početni prikaz",

    loading: "Učitavanje mape...",
    unavailable: "Mapa trenutno nije dostupna.",
    empty: "Trenutno nema dostupnih lokacija.",

    attribution: "Izvori podataka mape",
    gestureWindows: "Koristite Ctrl + scroll za zumiranje mape",
    gestureMac: "Koristite ⌘ + scroll za zumiranje mape",
    gestureMobile: "Koristite dva prsta za pomeranje mape",
  },

  en,
} satisfies Record<Locale, DistributionMapMessages>;

export function getMapMessages(locale: Locale): DistributionMapMessages {
  return translations[locale];
}

export function getMapLibreMessages(
  messages: DistributionMapMessages,
): Record<string, string> {
  return {
    "Map.Title": messages.map,
    "Marker.Title": messages.details,
    "Popup.Close": messages.close,

    "NavigationControl.ZoomIn": messages.zoomIn,
    "NavigationControl.ZoomOut": messages.zoomOut,

    "AttributionControl.ToggleAttribution": messages.attribution,

    "CooperativeGesturesHandler.WindowsHelpText": messages.gestureWindows,

    "CooperativeGesturesHandler.MacHelpText": messages.gestureMac,

    "CooperativeGesturesHandler.MobileHelpText": messages.gestureMobile,
  };
}
