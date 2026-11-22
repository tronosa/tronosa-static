const MAX_INITIALS = 2;

export function getAuthorInitials(name: string, locale: string): string {
  const words = name.trim().split(/\s+/u).filter(Boolean);

  if (words.length === 0) {
    return "";
  }

  const selectedWords =
    words.length > MAX_INITIALS ? [words[0], words[words.length - 1]] : words;

  const segmenter = new Intl.Segmenter(locale, {
    granularity: "grapheme",
  });

  return selectedWords
    .map((word) => {
      const first = segmenter.segment(word)[Symbol.iterator]().next();

      return first.done ? "" : first.value.segment;
    })
    .join("")
    .toLocaleUpperCase(locale);
}

export function hasArticleBeenUpdated(
  publishedAt: string,
  modifiedAt: string,
): boolean {
  return Date.parse(modifiedAt) > Date.parse(publishedAt);
}
