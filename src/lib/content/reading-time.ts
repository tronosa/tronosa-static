const WORDS_PER_MINUTE = 200;
const MIN_READING_TIME = 1;

export type ReadingTimeResult = {
  wordCount: number;
  minutes: number;
};

export function countWords(text: string, locale: string): number {
  const segmenter = new Intl.Segmenter(locale, {
    granularity: "word",
  });

  let wordCount = 0;

  for (const segment of segmenter.segment(text)) {
    if (segment.isWordLike) {
      wordCount++;
    }
  }

  return wordCount;
}

export function calculateReadingTime(
  content: readonly string[],
  locale: string,
): ReadingTimeResult {
  const text = content.join("\n");

  const wordCount = countWords(text, locale);

  const minutes = Math.max(
    MIN_READING_TIME,
    Math.ceil(wordCount / WORDS_PER_MINUTE),
  );

  return {
    wordCount,
    minutes,
  };
}
