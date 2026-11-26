"use client";

import { useId } from "react";

import { LocationImage, LocationInformation } from "./MapPopup";

import type { DistributionLocation } from "./types";

import type { DistributionMapMessages } from "./types";

interface LocationDirectoryProps {
  locations: DistributionLocation[];
  messages: DistributionMapMessages;

  selectedLocationId: string | null;
  mapUnavailable: boolean;

  onSelect: (location: DistributionLocation, trigger: HTMLElement) => void;
}

export function LocationDirectory({
  locations,
  messages,
  selectedLocationId,
  mapUnavailable,
  onSelect,
}: LocationDirectoryProps) {
  const groupId = useId();

  return (
    <div className="distribution-map__directory">
      <header className="distribution-map__directory-header">
        <span className="distribution-map__eyebrow">{messages.eyebrow}</span>

        <h3 className="distribution-map__directory-title">{messages.list}</h3>

        <p className="distribution-map__directory-count">
          {messages.count}: {locations.length}
        </p>
      </header>

      {locations.length === 0 ? (
        <p className="distribution-map__empty">{messages.empty}</p>
      ) : (
        <ul role="list" className="distribution-map__list">
          {locations.map((location) => (
            <li
              key={location.id}
              className="distribution-map__list-item"
              data-selected={selectedLocationId === location.id}
            >
              <details name={groupId} className="distribution-map__location">
                <summary className="distribution-map__location-summary">
                  <span
                    className="distribution-map__location-icon"
                    data-type={location.type}
                    aria-hidden="true"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>

                  <span className="distribution-map__location-content">
                    <strong>{location.title}</strong>

                    <span>
                      {location.address.city}
                      {" \u00B7 "}
                      {messages[location.type]}
                    </span>
                  </span>

                  <svg
                    className="distribution-map__chevron"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </summary>

                <div className="distribution-map__location-details">
                  <LocationImage location={location} />

                  <LocationInformation
                    location={location}
                    messages={messages}
                  />

                  {!mapUnavailable && (
                    <button
                      type="button"
                      className="distribution-map__button"
                      aria-label={`${messages.showOnMap}: ${location.title}`}
                      onClick={(event) =>
                        onSelect(location, event.currentTarget)
                      }
                    >
                      {messages.showOnMap}
                    </button>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
