import type { SearchHistoryItem } from "@/types/idiom";
import { readJson, writeJson } from "./safe-local-storage";

const HISTORY_KEY = "guofeng_chengyu_history_v1";

export function getHistory() {
  return readJson<SearchHistoryItem[]>(HISTORY_KEY, []).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

export function saveHistory(items: SearchHistoryItem[]) {
  return writeJson(HISTORY_KEY, items);
}

export function addHistory(query: string, idiom: string, resultId?: number) {
  const now = Date.now();
  const next = [
    {
      id: `${idiom}-${now}`,
      query,
      idiom,
      createdAt: now,
      resultId
    },
    ...getHistory().filter((item) => item.idiom !== idiom)
  ].slice(0, 100);

  return saveHistory(next);
}

export function removeHistory(id: string) {
  return saveHistory(getHistory().filter((item) => item.id !== id));
}

export function clearHistory() {
  return saveHistory([]);
}
