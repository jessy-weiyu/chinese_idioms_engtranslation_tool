import type { FavoriteIdiomItem } from "@/types/idiom";
import { readJson, writeJson } from "./safe-local-storage";

const FAVORITES_KEY = "guofeng_chengyu_favorites_v1";

export function getFavorites() {
  return readJson<FavoriteIdiomItem[]>(FAVORITES_KEY, []).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

export function saveFavorites(items: FavoriteIdiomItem[]) {
  return writeJson(FAVORITES_KEY, items);
}

export function addFavorite(idiom: string, translation: string, sourceId?: number) {
  const exists = getFavorites().some((item) => item.idiom === idiom);
  if (exists) {
    return true;
  }

  return saveFavorites([
    {
      id: `${idiom}-${Date.now()}`,
      idiom,
      translation,
      createdAt: Date.now(),
      sourceId
    },
    ...getFavorites()
  ]);
}

export function removeFavorite(idiom: string) {
  return saveFavorites(getFavorites().filter((item) => item.idiom !== idiom));
}

export function isFavorite(idiom: string) {
  return getFavorites().some((item) => item.idiom === idiom);
}

export function clearFavorites() {
  return saveFavorites([]);
}
