import type { IdiomTranslation } from "@/types/idiom";

function normalizeEnglish(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasChinese(value: string) {
  return /[\u4e00-\u9fff]/.test(value);
}

function chineseScore(query: string, item: IdiomTranslation) {
  if (item.idiom === query) {
    return 1000;
  }

  if (item.idiom.includes(query) || query.includes(item.idiom)) {
    return 700 + Math.min(query.length, item.idiom.length);
  }

  const chars = Array.from(new Set(query.split("")));
  const hits = chars.filter((char) => item.idiom.includes(char)).length;
  return hits > 0 ? hits * 20 : 0;
}

function englishScore(query: string, item: IdiomTranslation) {
  const normalized = normalizeEnglish(query);
  if (!normalized) {
    return 0;
  }

  const tokens = normalized.split(" ").filter(Boolean);
  let score = 0;

  if (item.searchTextEn.includes(normalized)) {
    score += 500 + normalized.length;
  }

  for (const token of tokens) {
    if (item.searchTextEn.includes(token)) {
      score += 40;
    }
  }

  const preferred = normalizeEnglish(item.literaryTranslations.join(" "));
  if (preferred.includes(normalized)) {
    score += 120;
  }

  return score;
}

export function searchIdioms(
  query: string,
  data: IdiomTranslation[],
  limit = 10
): IdiomTranslation[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const scored = data
    .map((item) => ({
      item,
      score: hasChinese(trimmed) ? chineseScore(trimmed, item) : englishScore(trimmed, item)
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.id - b.item.id)
    .slice(0, limit)
    .map((entry) => entry.item);

  return scored;
}

export function findExactIdiom(query: string, data: IdiomTranslation[]) {
  const trimmed = query.trim();
  return data.find((item) => item.idiom === trimmed);
}

export function getBestTranslation(item: IdiomTranslation) {
  return (
    item.literaryTranslations[0] ||
    item.proverbTranslations[0] ||
    item.literalTranslations[0] ||
    ""
  );
}
