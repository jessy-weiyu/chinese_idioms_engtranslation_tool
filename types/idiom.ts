export interface IdiomTranslation {
  id: number;
  idiom: string;
  literalTranslations: string[];
  literaryTranslations: string[];
  proverbTranslations: string[];
  searchTextZh: string;
  searchTextEn: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  idiom: string;
  createdAt: number;
  resultId?: number;
}

export interface FavoriteIdiomItem {
  id: string;
  idiom: string;
  translation: string;
  createdAt: number;
  sourceId?: number;
}
