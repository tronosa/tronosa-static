import type { DistributionMapMessages } from "./types";

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
