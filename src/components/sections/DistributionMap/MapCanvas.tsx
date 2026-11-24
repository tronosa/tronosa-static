"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { Map as MapLibreMap, Marker } from "maplibre-gl";

import { MapPopup } from "./MapPopup";

import { getMapLibreMessages } from "./maplibre.messages";

import {
  MAP_STYLE_URL,
  getLocationCoordinates,
  prefersReducedMotion,
} from "./distribution-map.utils";

import type {
  DistributionLocation,
  DistributionMapInitialView,
  DistributionMapMessages,
} from "./types";

export type MapStatus = "loading" | "ready" | "error";

interface MapCanvasProps {
  locations: DistributionLocation[];
  initialView: DistributionMapInitialView;
  selectedLocation: DistributionLocation | null;

  messages: DistributionMapMessages;
  status: MapStatus;

  onSelect: (location: DistributionLocation, trigger: HTMLElement) => void;

  onClose: (restoreFocus?: boolean) => void;
  onStatusChange: (status: MapStatus) => void;
}

interface MapRuntime {
  map: MapLibreMap;
  library: typeof import("maplibre-gl");
  popupHost: HTMLDivElement;
}

export function MapCanvas({
  locations,
  initialView,
  selectedLocation,
  messages,
  status,
  onSelect,
  onClose,
  onStatusChange,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const markersRef = useRef<Map<string, Marker>>(new Map());

  const [runtime, setRuntime] = useState<MapRuntime | null>(null);

  const { latitude, longitude, zoom } = initialView;

  /*
   * Map initialization and lifecycle.
   */
  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let map: MapLibreMap | null = null;

    let disposed = false;
    let started = false;
    let failed = false;
    let hasEnteredViewport = false;

    let timeoutId: number | undefined;

    function handleFailure(error?: unknown) {
      if (disposed || failed) {
        return;
      }

      failed = true;

      window.clearTimeout(timeoutId);

      if (error) {
        console.error("[DistributionMap] Map initialization failed.", error);
      }

      map?.remove();
      map = null;

      onStatusChange("error");
    }

    async function initialize() {
      if (
        disposed ||
        started ||
        failed ||
        !hasEnteredViewport ||
        !container ||
        container.clientWidth === 0 ||
        container.clientHeight === 0
      ) {
        return;
      }

      started = true;

      try {
        const library = await import("maplibre-gl");

        if (disposed) {
          return;
        }

        if (container.clientWidth === 0 || container.clientHeight === 0) {
          started = false;
          return;
        }

        library.setWorkerUrl(
          new URL(
            "maplibre-gl/dist/maplibre-gl-worker.mjs",
            import.meta.url,
          ).toString(),
        );

        onStatusChange("loading");

        const instance = new library.Map({
          container,
          style: MAP_STYLE_URL,

          center: [longitude, latitude],
          zoom,

          pitch: 0,
          bearing: 0,
          maxPitch: 0,

          dragRotate: false,
          pitchWithRotate: false,
          cooperativeGestures: true,

          attributionControl: {
            compact: true,
          },

          locale: getMapLibreMessages(messages),
        });

        map = instance;

        instance.touchZoomRotate.disableRotation();

        instance.getCanvas().setAttribute("aria-label", messages.map);

        timeoutId = window.setTimeout(() => {
          handleFailure();
        }, 20000);

        instance.once("load", () => {
          if (disposed || failed) {
            return;
          }

          window.clearTimeout(timeoutId);

          instance.resize();

          setRuntime({
            map: instance,
            library,
            popupHost: document.createElement("div"),
          });

          onStatusChange("ready");
        });
      } catch (error) {
        handleFailure(error);
      }
    }

    /*
     * Observe container dimensions and preserve
     * the existing map instance during layout changes.
     */
    const resizeObserver = new ResizeObserver(() => {
      if (
        disposed ||
        failed ||
        container.clientWidth === 0 ||
        container.clientHeight === 0
      ) {
        return;
      }

      if (map) {
        map.resize();
      } else {
        void initialize();
      }
    });

    /*
     * Defer MapLibre initialization until the map
     * approaches the visible viewport.
     */
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (
          disposed ||
          failed ||
          !entries.some((entry) => entry.isIntersecting)
        ) {
          return;
        }

        hasEnteredViewport = true;

        intersectionObserver.disconnect();

        void initialize();
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      },
    );

    resizeObserver.observe(container);
    intersectionObserver.observe(container);

    return () => {
      disposed = true;

      window.clearTimeout(timeoutId);

      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      map?.remove();
    };
  }, [latitude, longitude, zoom, messages, onStatusChange]);

  /*
   * Create markers when the map or location
   * collection changes.
   */
  useEffect(() => {
    if (!runtime) {
      return;
    }

    const markers = new Map<string, Marker>();

    for (const location of locations) {
      const element = document.createElement("button");

      element.type = "button";

      element.className = "distribution-map__marker";

      element.dataset.type = location.type;
      element.dataset.selected = "false";

      element.setAttribute(
        "aria-label",
        `${location.title}: ${messages[location.type]}`,
      );

      element.setAttribute("aria-expanded", "false");

      element.addEventListener("click", (event) => {
        event.stopPropagation();
        onSelect(location, element);
      });

      const marker = new runtime.library.Marker({
        element,
        anchor: "bottom",
      })
        .setLngLat(getLocationCoordinates(location))
        .addTo(runtime.map);

      /*
       * The accessible directory provides keyboard
       * access to every location without duplicate
       * tab stops for all markers.
       */
      element.tabIndex = -1;

      markers.set(location.id, marker);
    }

    markersRef.current = markers;

    return () => {
      markers.forEach((marker) => marker.remove());

      markers.clear();
    };
  }, [runtime, locations, messages, onSelect]);

  /*
   * Keep the selected marker visually highlighted.
   */
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const selected = id === selectedLocation?.id;

      const element = marker.getElement();

      element.dataset.selected = String(selected);

      element.setAttribute("aria-expanded", String(selected));
    });
  }, [runtime, locations, selectedLocation]);

  /*
   * Render a popup anchored to the selected marker.
   */
  useEffect(() => {
    if (!runtime || !selectedLocation) {
      return;
    }

    const { map, library, popupHost } = runtime;

    const coordinates = getLocationCoordinates(selectedLocation);

    map.resize();
    map.stop();

    const offsetY = map.getContainer().clientHeight * 0.24;

    map.easeTo({
      center: coordinates,
      zoom: Math.max(map.getZoom(), 8),
      offset: [0, offsetY],
      duration: prefersReducedMotion() ? 0 : 400,
    });

    const popup = new library.Popup({
      anchor: "bottom",

      closeButton: false,
      closeOnClick: false,
      closeOnMove: false,
      focusAfterOpen: false,

      offset: 40,
      maxWidth: "none",

      className: "distribution-map__maplibre-popup",
    })
      .setLngLat(coordinates)
      .setDOMContent(popupHost)
      .addTo(map);

    const frameId = window.requestAnimationFrame(() => {
      popupHost.querySelector<HTMLElement>('[role="dialog"]')?.focus({
        preventScroll: true,
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);

      popup.remove();
    };
  }, [runtime, selectedLocation]);

  function changeZoom(amount: number) {
    if (!runtime) {
      return;
    }

    const { map } = runtime;

    map.easeTo({
      zoom: map.getZoom() + amount,
      duration: prefersReducedMotion() ? 0 : 250,
    });
  }

  function resetMap() {
    if (!runtime) {
      return;
    }

    onClose(false);

    runtime.map.stop();

    runtime.map.easeTo({
      center: [longitude, latitude],
      zoom,
      duration: prefersReducedMotion() ? 0 : 400,
    });
  }

  return (
    <div className="distribution-map__map-area">
      <div
        ref={containerRef}
        className="distribution-map__canvas"
        inert={status !== "ready"}
      />

      {status !== "ready" && (
        <div className="distribution-map__status" role="status">
          {status === "loading" && (
            <span className="distribution-map__loader" aria-hidden="true" />
          )}

          <p>{status === "error" ? messages.unavailable : messages.loading}</p>
        </div>
      )}

      {runtime && status === "ready" && (
        <div className="distribution-map__controls">
          <button
            type="button"
            aria-label={messages.zoomIn}
            title={messages.zoomIn}
            onClick={() => changeZoom(1)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>

          <button
            type="button"
            aria-label={messages.zoomOut}
            title={messages.zoomOut}
            onClick={() => changeZoom(-1)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
            </svg>
          </button>

          <button
            type="button"
            aria-label={messages.resetMap}
            title={messages.resetMap}
            onClick={resetMap}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 11a8 8 0 0 0-14-5L3 9" />
              <path d="M3 3v6h6" />
              <path d="M4 13a8 8 0 0 0 14 5l3-3" />
              <path d="M21 21v-6h-6" />
            </svg>
          </button>
        </div>
      )}

      {runtime &&
        selectedLocation &&
        createPortal(
          <MapPopup
            location={selectedLocation}
            messages={messages}
            onClose={() => onClose()}
          />,
          runtime.popupHost,
        )}
    </div>
  );
}
