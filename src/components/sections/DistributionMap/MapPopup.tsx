"use client";

import { useId } from "react";
import Image from "next/image";

import type { DistributionLocation } from "./types";

import type { DistributionMapMessages } from "./distribution-map.i18n";

import {
  formatLocationAddress,
  getDirectionsUrl,
} from "./distribution-map.utils";

interface LocationInformationProps {
  location: DistributionLocation;
  messages: DistributionMapMessages;
}

interface MapPopupProps extends LocationInformationProps {
  onClose: () => void;
}

export function LocationImage({
  location,
}: {
  location: DistributionLocation;
}) {
  if (!location.image) {
    return null;
  }

  return (
    <Image
      src={location.image.src}
      alt={location.image.alt}
      width={640}
      height={360}
      loading="lazy"
      decoding="async"
      unoptimized
      className="distribution-map__image"
    />
  );
}

export function LocationInformation({
  location,
  messages,
}: LocationInformationProps) {
  return (
    <div className="distribution-map__information">
      <p className="distribution-map__address">
        {formatLocationAddress(location.address)}
      </p>

      {location.description && (
        <p className="distribution-map__description">{location.description}</p>
      )}

      {location.contact?.phone && (
        <a
          href={`tel:${location.contact.phone}`}
          className="distribution-map__contact"
        >
          {messages.phone}: {location.contact.phone}
        </a>
      )}

      {location.contact?.email && (
        <a
          href={`mailto:${location.contact.email}`}
          className="distribution-map__contact"
        >
          {messages.email}: {location.contact.email}
        </a>
      )}

      {location.contact?.website &&
        /^https?:\/\//i.test(location.contact.website) && (
          <a
            href={location.contact.website}
            className="distribution-map__contact"
          >
            {messages.website}
          </a>
        )}

      <a
        href={getDirectionsUrl(location)}
        target="_blank"
        className="distribution-map__directions"
      >
        <span>{messages.directions}</span>

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
          <path d="M7 17 17 7M7 7h10v10" />
        </svg>
      </a>
    </div>
  );
}

export function MapPopup({ location, messages, onClose }: MapPopupProps) {
  const titleId = useId();

  return (
    <article
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="distribution-map__popup"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <button
        type="button"
        aria-label={messages.close}
        className="distribution-map__popup-close"
        onClick={onClose}
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
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>

      {location.image && (
        <div className="distribution-map__popup-media">
          <LocationImage location={location} />
        </div>
      )}

      <div className="distribution-map__popup-body">
        <span className="distribution-map__eyebrow">
          {messages[location.type]}
        </span>

        <h3 id={titleId} className="distribution-map__popup-title">
          {location.title}
        </h3>

        <LocationInformation location={location} messages={messages} />
      </div>
    </article>
  );
}
