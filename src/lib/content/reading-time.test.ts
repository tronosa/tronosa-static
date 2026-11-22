import { describe, expect, it } from "vitest";

import { countWords, calculateReadingTime } from "./reading-time";

describe("countWords", () => {
  it.each([
    ["Voda je deo prirode.", "sr-Latn", 4],
    ["Вода је део природе.", "sr-Cyrl", 4],
    ["Water is essential for life.", "en", 5],
  ])("counts words in '%s' using locale %s", (text, locale, expected) => {
    expect(countWords(text, locale)).toBe(expected);
  });

  it("ignores punctuation", () => {
    expect(countWords("Water, nature... life!", "en")).toBe(3);
  });

  it("handles empty strings", () => {
    expect(countWords("", "en")).toBe(0);
  });

  it("handles whitespace-only strings", () => {
    expect(countWords("   \n\t  ", "en")).toBe(0);
  });

  it("handles multiple whitespace separators", () => {
    expect(countWords("Water   nature\nlife\tforest", "en")).toBe(4);
  });

  it("ignores standalone symbols", () => {
    expect(countWords("Water — nature & life.", "en")).toBe(3);
  });
});

describe("calculateReadingTime", () => {
  it.each([
    [0, 1],
    [1, 1],
    [199, 1],
    [200, 1],
    [201, 2],
    [399, 2],
    [400, 2],
    [401, 3],
    [1000, 5],
    [2000, 10],
  ])("estimates %i words as %i minutes", (wordCount, minutes) => {
    const content = [
      Array.from({ length: wordCount }, () => "water").join(" "),
    ];

    expect(calculateReadingTime(content, "en")).toEqual({
      wordCount,
      minutes,
    });
  });

  it("counts words across multiple content blocks", () => {
    const result = calculateReadingTime(
      [
        "Natural source",
        "Water is essential for life.",
        "Protecting our environment.",
      ],
      "en",
    );

    expect(result).toEqual({
      wordCount: 10,
      minutes: 1,
    });
  });

  it("handles an empty content array", () => {
    expect(calculateReadingTime([], "en")).toEqual({
      wordCount: 0,
      minutes: 1,
    });
  });

  it("does not merge adjacent content blocks", () => {
    expect(calculateReadingTime(["Water", "Nature"], "en")).toEqual({
      wordCount: 2,
      minutes: 1,
    });
  });

  it.each(["sr-Latn", "sr-Cyrl", "en"])("supports locale %s", (locale) => {
    const result = calculateReadingTime(["Test"], locale);

    expect(result.minutes).toBe(1);
  });
});
