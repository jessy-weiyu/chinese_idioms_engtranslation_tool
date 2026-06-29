export interface ChengyuDictionaryDetail {
  words: string;
  pinyin?: string;
  explanation?: string;
  source?: string;
  synonyms?: string[];
  antonyms?: string[];
  example?: string;
  grammar?: string;
  english?: string;
}

export interface ChengyuDictionaryResponse {
  code: number;
  msg?: string;
  words?: string;
  pingyin?: string;
  jieshi?: string;
  chuchu?: string;
  tongyi?: string;
  fanyi?: string;
  liju?: string;
  yinzheng?: string;
  yufa?: string;
  en?: string;
}
