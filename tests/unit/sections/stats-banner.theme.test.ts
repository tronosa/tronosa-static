import { describe, expect, it } from "vitest";

import { statsBannerSectionSchema } from "@/components/sections/StatsBanner/stats-banner.schema";

import { statsBannerThemeNames } from "@/components/sections/StatsBanner/stats-banner.theme";

const section = {
  id: "statistics",
  type: "stats-banner",
  content: {
    title: "Statistics",
    statistics: [
      {
        value: "100%",
        label: "Example statistic",
      },
    ],
  },
};

describe("StatsBanner themes", () => {
  it.each(statsBannerThemeNames)("accepts the %s theme", (theme) => {
    const result = statsBannerSectionSchema.parse({
      ...section,
      content: {
        ...section.content,
        theme,
      },
    });

    expect(result.content.theme).toBe(theme);
  });

  it("defaults to the forest theme", () => {
    const result = statsBannerSectionSchema.parse(section);

    expect(result.content.theme).toBe("forest");
  });

  it("rejects an unsupported theme", () => {
    const result = statsBannerSectionSchema.safeParse({
      ...section,
      content: {
        ...section.content,
        theme: "unknown",
      },
    });

    expect(result.success).toBe(false);
  });
});
