import type { z } from "zod";

import type { Locale } from "@/i18n/config";

import type {
  distributionLocationTypeSchema,
  distributionLocationAddressSchema,
  distributionLocationCoordinatesSchema,
  distributionLocationImageSchema,
  distributionLocationContactSchema,
  distributionLocationSchema,
  distributionLocationsSchema,
  distributionMapInitialViewSchema,
  distributionMapContentSchema,
  distributionMapSectionSchema,
} from "./distribution-map.schema";

export type DistributionLocationType = z.infer<
  typeof distributionLocationTypeSchema
>;

export type DistributionLocationAddress = z.infer<
  typeof distributionLocationAddressSchema
>;

export type DistributionLocationCoordinates = z.infer<
  typeof distributionLocationCoordinatesSchema
>;

export type DistributionLocationImage = z.infer<
  typeof distributionLocationImageSchema
>;

export type DistributionLocationContact = z.infer<
  typeof distributionLocationContactSchema
>;

export type DistributionLocation = z.infer<typeof distributionLocationSchema>;

export type DistributionLocations = z.infer<typeof distributionLocationsSchema>;

export type DistributionMapInitialView = z.infer<
  typeof distributionMapInitialViewSchema
>;

export type DistributionMapContent = z.infer<
  typeof distributionMapContentSchema
>;

export type DistributionMapSection = z.infer<
  typeof distributionMapSectionSchema
>;

export type DistributionMapView = "map" | "list";

export type MapActivationMessages = {
  title: string;
  description: string;
  button: string;
};

export type DistributionMapMessages = {
  eyebrow: string;
  title: string;
  description: string;

  retailer: string;
  distributor: string;
  production: string;
  partner: string;

  map: string;
  list: string;
  view: string;
  count: string;
  legend: string;

  details: string;
  showOnMap: string;
  directions: string;
  close: string;

  phone: string;
  email: string;
  website: string;

  zoomIn: string;
  zoomOut: string;
  resetMap: string;

  loading: string;
  unavailable: string;
  empty: string;

  attribution: string;
  gestureWindows: string;
  gestureMac: string;
  gestureMobile: string;

  activation: MapActivationMessages;
};

export type DistributionMapProps = DistributionMapContent;

export type DistributionMapClientProps = DistributionMapProps & {
  locale: Locale;
  locations: DistributionLocations;
  messages: DistributionMapMessages;
};
