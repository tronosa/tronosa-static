import type { DistributionLocation, DistributionMapInitialView } from "./types";

export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

export const DEFAULT_MAP_VIEW: DistributionMapInitialView = {
  latitude: 44.05,
  longitude: 20.45,
  zoom: 6,
};

export function getLocationCoordinates(
  location: DistributionLocation,
): [number, number] {
  return [location.coordinates.longitude, location.coordinates.latitude];
}

export function formatLocationAddress(
  address: DistributionLocation["address"],
): string {
  return [
    address.street,
    [address.postalCode, address.city].filter(Boolean).join(" "),
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export function getDirectionsUrl(location: DistributionLocation): string {
  const { latitude, longitude } = location.coordinates;

  const params = new URLSearchParams({
    api: "1",
    destination: `${latitude},${longitude}`,
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
