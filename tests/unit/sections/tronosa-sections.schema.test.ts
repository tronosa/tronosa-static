import { describe, expect, it } from "vitest";
import { cardSliderSectionSchema } from "@/components/sections/CardSlider/card-slider.schema";
import { featureMosaicSectionSchema } from "@/components/sections/FeatureMosaic/feature-mosaic.schema";
import { faqSectionSchema } from "@/components/sections/Faq/faq.schema";
import { videoHeroSectionSchema } from "@/components/sections/VideoHero/video-hero.schema";
import { imageHeroSectionSchema } from "@/components/sections/ImageHero/image-hero.schema";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SliderCardContent } from "@/components/sections/CardSlider/types";
import { sectionSchema } from "@/content/schemas/section.schema";
const schema = z.array(sectionSchema);
function examples(locale = "en") {
  return schema.parse(
    JSON.parse(
      readFileSync(
        join(process.cwd(), "tests", "fixtures", "sections", `${locale}.json`),
        "utf8",
      ),
    ),
  );
}

describe("Tronosa content sections", () => {
  it.each(["sr-Cyrl", "sr-Latn", "en"])("validates %s examples", (locale) => {
    expect(examples(locale)).toHaveLength(7);
  });
  it("rejects an empty video source", () => {
    const hero = examples().find((section) => section.type === "video-hero");
    if (!hero) throw new Error("Missing video hero fixture");
    expect(
      videoHeroSectionSchema.safeParse({
        ...hero,
        content: { ...hero.content, video: { ...hero.content.video, src: "" } },
      }).success,
    ).toBe(false);
  });
  it("rejects an image hero without a desktop source", () => {
    const hero = examples().find((section) => section.type === "image-hero");
    if (!hero) throw new Error("Missing image hero fixture");
    expect(
      imageHeroSectionSchema.safeParse({
        ...hero,
        content: {
          ...hero.content,
          image: { ...hero.content.image, desktop: undefined },
        },
      }).success,
    ).toBe(false);
  });
  it("rejects missing image on an image card", () => {
    const slider = examples().find((section) => section.type === "card-slider");
    if (!slider) throw new Error("Missing slider fixture");
    const card = slider.content.cards.find(
      (item: SliderCardContent) => item.kind === "image",
    );
    if (!card) throw new Error("Missing image card fixture");
    expect(
      cardSliderSectionSchema.safeParse({
        ...slider,
        content: { ...slider.content, cards: [{ ...card, image: undefined }] },
      }).success,
    ).toBe(false);
  });
  it("requires precisely four mosaic cards", () => {
    const mosaic = examples().find(
      (section) => section.type === "feature-mosaic",
    );
    if (!mosaic) throw new Error("Missing mosaic fixture");
    expect(
      featureMosaicSectionSchema.safeParse({
        ...mosaic,
        content: { ...mosaic.content, cards: mosaic.content.cards.slice(0, 3) },
      }).success,
    ).toBe(false);
  });
  it("rejects empty FAQ answers", () => {
    const faq = examples().find((section) => section.type === "faq");
    if (!faq) throw new Error("Missing FAQ fixture");
    expect(
      faqSectionSchema.safeParse({
        ...faq,
        content: { ...faq.content, items: [{ question: "Q", answer: " " }] },
      }).success,
    ).toBe(false);
  });
});
