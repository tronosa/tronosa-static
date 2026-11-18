"use client";

import { useCallback, useId, useRef, useState } from "react";

import { LocationDirectory } from "./LocationDirectory";

import { MapCanvas, type MapStatus } from "./MapCanvas";

import { getMapMessages } from "./distribution-map.i18n";
import { DEFAULT_MAP_VIEW } from "./distribution-map.utils";

import type {
  DistributionLocation,
  DistributionMapClientProps,
  DistributionMapView,
} from "./types";

import "maplibre-gl/dist/maplibre-gl.css";
import "./distribution-map.css";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

export function DistributionMapClient({
  locale,
  eyebrow,
  title,
  description,
  locations,
  initialView,
  showLegend,
  showLocationList,
}: DistributionMapClientProps) {
  const headingId = useId();
  const mapPanelId = useId();
  const directoryPanelId = useId();

  const mapPanelRef = useRef<HTMLDivElement>(null);

  const triggerRef = useRef<HTMLElement | null>(null);

  const [view, setView] = useState<DistributionMapView>("map");

  const [status, setStatus] = useState<MapStatus>("loading");

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );

  const messages = getMapMessages(locale);

  const mapView = initialView ?? DEFAULT_MAP_VIEW;

  const selectedLocation =
    locations.find((location) => location.id === selectedLocationId) ?? null;

  const locationTypes = [
    ...new Set(locations.map((location) => location.type)),
  ];

  const handleSelect = useCallback(
    (location: DistributionLocation, trigger: HTMLElement) => {
      triggerRef.current = trigger;

      setSelectedLocationId(location.id);
      setView("map");

      if (trigger.closest(".distribution-map__directory")) {
        window.requestAnimationFrame(() => {
          if (
            trigger.getClientRects().length === 0 &&
            (document.activeElement === trigger ||
              document.activeElement === document.body)
          ) {
            mapPanelRef.current?.focus({
              preventScroll: true,
            });
          }
        });
      }
    },
    [],
  );

  const handleClose = useCallback((restoreFocus = true) => {
    const trigger = triggerRef.current;

    triggerRef.current = null;

    setSelectedLocationId(null);

    if (!restoreFocus) {
      return;
    }

    if (trigger?.closest(".distribution-map__directory")) {
      setView("list");
    }

    window.requestAnimationFrame(() => {
      if (trigger?.isConnected && trigger.getClientRects().length > 0) {
        trigger.focus({
          preventScroll: true,
        });

        return;
      }

      mapPanelRef.current?.focus({
        preventScroll: true,
      });
    });
  }, []);

  function handleViewChange(nextView: DistributionMapView) {
    setView(nextView);
    setSelectedLocationId(null);

    triggerRef.current = null;
  }

  return (
    <section
      aria-labelledby={headingId}
      className={cn("distribution-map", "py-16 md:py-24")}
    >
      <Container>
        <header className="distribution-map__header">
          <span className="distribution-map__eyebrow">
            {eyebrow ?? messages.eyebrow}
          </span>

          <h2 id={headingId}>{title ?? messages.title}</h2>

          <p>{description ?? messages.description}</p>
        </header>

        <div
          className="distribution-map__locator"
          data-directory={showLocationList ? "always" : "toggle"}
        >
          <div
            className="distribution-map__view-switcher"
            role="group"
            aria-label={messages.view}
            data-view={view}
          >
            <button
              type="button"
              aria-pressed={view === "map"}
              aria-controls={mapPanelId}
              onClick={() => handleViewChange("map")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" />
                <path d="M9 3v15M15 6v15" />
              </svg>

              {messages.map}
            </button>

            <button
              type="button"
              aria-pressed={view === "list"}
              aria-controls={directoryPanelId}
              onClick={() => handleViewChange("list")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M8 6h13M8 12h13M8 18h13" />
                <path d="M3 6h1M3 12h1M3 18h1" />
              </svg>
              {messages.list} ({locations.length})
            </button>
          </div>

          <div className="distribution-map__layout" data-view={view}>
            <div
              id={directoryPanelId}
              role="region"
              aria-label={messages.list}
              className="distribution-map__directory-panel"
            >
              <LocationDirectory
                locations={locations}
                messages={messages}
                selectedLocationId={selectedLocationId}
                mapUnavailable={status === "error"}
                onSelect={handleSelect}
              />
            </div>

            <div
              id={mapPanelId}
              ref={mapPanelRef}
              role="region"
              aria-label={messages.map}
              tabIndex={-1}
              className="distribution-map__map-panel"
            >
              <MapCanvas
                key={`${mapView.latitude}:${mapView.longitude}:${mapView.zoom}`}
                locations={locations}
                initialView={mapView}
                selectedLocation={selectedLocation}
                messages={messages}
                status={status}
                onSelect={handleSelect}
                onClose={handleClose}
                onStatusChange={setStatus}
              />
            </div>
          </div>

          {showLegend && locationTypes.length > 0 && (
            <ul
              role="list"
              aria-label={messages.legend}
              className="distribution-map__legend"
            >
              {locationTypes.map((type) => (
                <li key={type}>
                  <span
                    className="distribution-map__legend-dot"
                    data-type={type}
                    aria-hidden="true"
                  />

                  {messages[type]}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
