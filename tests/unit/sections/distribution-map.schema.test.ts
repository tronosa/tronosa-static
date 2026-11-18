import { describe, expect, it } from "vitest";

import {
  distributionLocationSchema,
  distributionLocationsSchema,
  distributionLocationCoordinatesSchema,
  distributionMapInitialViewSchema,
  distributionMapContentSchema,
  distributionMapSectionSchema,
} from "@/components/sections/DistributionMap/distribution-map.schema";

const location = {
  id: "location-1",
  type: "retailer",
  title: "Distribution location",
  address: {
    city: "Loznica",
    country: "Serbia",
  },
  coordinates: {
    latitude: 44.53,
    longitude: 19.22,
  },
};

describe("Distribution location schema", () => {
  it("validates a location and applies default values", () => {
    const result = distributionLocationSchema.parse(location);

    expect(result.featured).toBe(false);
    expect(result.enabled).toBe(true);
  });

  it("preserves explicitly provided flags", () => {
    const result = distributionLocationSchema.parse({
      ...location,
      featured: true,
      enabled: false,
    });

    expect(result.featured).toBe(true);
    expect(result.enabled).toBe(false);
  });

  it.each(["retailer", "distributor", "production", "partner"])(
    "accepts the %s location type",
    (type) => {
      expect(
        distributionLocationSchema.safeParse({
          ...location,
          type,
        }).success,
      ).toBe(true);
    },
  );

  it("rejects an unsupported location type", () => {
    expect(
      distributionLocationSchema.safeParse({
        ...location,
        type: "unknown",
      }).success,
    ).toBe(false);
  });

  it("rejects an empty location ID", () => {
    expect(
      distributionLocationSchema.safeParse({
        ...location,
        id: "",
      }).success,
    ).toBe(false);
  });

  it("rejects an empty city", () => {
    expect(
      distributionLocationSchema.safeParse({
        ...location,
        address: {
          ...location.address,
          city: "",
        },
      }).success,
    ).toBe(false);
  });
});

describe("Distribution location collection", () => {
  it("accepts an empty collection", () => {
    expect(distributionLocationsSchema.parse([])).toEqual([]);
  });

  it("accepts locations with unique IDs", () => {
    const result = distributionLocationsSchema.parse([
      location,
      {
        ...location,
        id: "location-2",
      },
    ]);

    expect(result).toHaveLength(2);
  });

  it("rejects duplicate location IDs", () => {
    const result = distributionLocationsSchema.safeParse([
      location,
      {
        ...location,
        title: "Another location",
      },
    ]);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "Distribution location IDs must be unique.",
          }),
        ]),
      );
    }
  });
});

describe("Distribution location coordinates", () => {
  it.each([
    { latitude: -90, longitude: -180 },
    { latitude: 90, longitude: 180 },
    { latitude: 0, longitude: 0 },
  ])("accepts valid coordinates %o", (coordinates) => {
    expect(
      distributionLocationCoordinatesSchema.safeParse(coordinates).success,
    ).toBe(true);
  });

  it.each([
    { latitude: -91, longitude: 0 },
    { latitude: 91, longitude: 0 },
    { latitude: 0, longitude: -181 },
    { latitude: 0, longitude: 181 },
  ])("rejects invalid coordinates %o", (coordinates) => {
    expect(
      distributionLocationCoordinatesSchema.safeParse(coordinates).success,
    ).toBe(false);
  });
});

describe("Distribution map initial view", () => {
  it("applies default map coordinates and zoom", () => {
    expect(distributionMapInitialViewSchema.parse({})).toEqual({
      latitude: 44.05,
      longitude: 20.45,
      zoom: 6,
    });
  });

  it("preserves custom initial view values", () => {
    const initialView = {
      latitude: 45.25,
      longitude: 19.84,
      zoom: 12,
    };

    expect(distributionMapInitialViewSchema.parse(initialView)).toEqual(
      initialView,
    );
  });

  it.each([0, 22])("accepts zoom boundary %s", (zoom) => {
    expect(distributionMapInitialViewSchema.safeParse({ zoom }).success).toBe(
      true,
    );
  });

  it.each([-1, 23])("rejects invalid zoom %s", (zoom) => {
    expect(distributionMapInitialViewSchema.safeParse({ zoom }).success).toBe(
      false,
    );
  });
});

describe("Distribution map content", () => {
  it("applies default visibility settings", () => {
    expect(distributionMapContentSchema.parse({})).toEqual({
      showLegend: true,
      showLocationList: true,
    });
  });

  it("allows hiding the legend and location list", () => {
    expect(
      distributionMapContentSchema.parse({
        showLegend: false,
        showLocationList: false,
      }),
    ).toEqual({
      showLegend: false,
      showLocationList: false,
    });
  });

  it.each(["eyebrow", "title", "description"])(
    "rejects whitespace-only %s",
    (field) => {
      expect(
        distributionMapContentSchema.safeParse({
          [field]: "   ",
        }).success,
      ).toBe(false);
    },
  );

  it("rejects unsupported categories", () => {
    expect(
      distributionMapContentSchema.safeParse({
        categories: ["unknown"],
      }).success,
    ).toBe(false);
  });
});

describe("Distribution map section", () => {
  it("validates a distribution map section", () => {
    expect(
      distributionMapSectionSchema.safeParse({
        id: "distribution-map",
        type: "distribution-map",
        content: {},
      }).success,
    ).toBe(true);
  });

  it("rejects an incorrect section type", () => {
    expect(
      distributionMapSectionSchema.safeParse({
        id: "distribution-map",
        type: "unknown",
        content: {},
      }).success,
    ).toBe(false);
  });
});
