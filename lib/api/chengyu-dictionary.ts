import type {
  ChengyuDictionaryDetail,
  ChengyuDictionaryResponse
} from "@/types/chengyu";

const API_URL = "https://cn.apihz.cn/api/zici/chacy.php";
const detailCache = new Map<string, ChengyuDictionaryDetail | null>();

function splitList(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(/[，,、\s]+/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeDetail(data: ChengyuDictionaryResponse): ChengyuDictionaryDetail {
  return {
    words: data.words ?? "",
    pinyin: data.pingyin,
    explanation: data.jieshi,
    source: data.chuchu,
    synonyms: splitList(data.tongyi),
    antonyms: splitList(data.fanyi),
    example: data.liju || data.yinzheng,
    grammar: data.yufa,
    english: data.en
  };
}

export async function fetchChengyuDetail(
  idiom: string
): Promise<ChengyuDictionaryDetail | null> {
  const query = idiom.trim();
  if (!query) {
    return null;
  }

  if (detailCache.has(query)) {
    return detailCache.get(query) ?? null;
  }

  const id = process.env.NEXT_PUBLIC_CHENGYU_API_ID;
  const key = process.env.NEXT_PUBLIC_CHENGYU_API_KEY;

  if (!id || !key) {
    detailCache.set(query, null);
    return null;
  }

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 8000);

  try {
    const url = `${API_URL}?id=${encodeURIComponent(id)}&key=${encodeURIComponent(
      key
    )}&words=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`成语字典接口响应异常：${response.status}`);
    }

    const data = (await response.json()) as ChengyuDictionaryResponse;
    if (Number(data.code) !== 200) {
      throw new Error(data.msg || "成语字典接口返回错误");
    }

    const detail = normalizeDetail(data);
    detailCache.set(query, detail);
    return detail;
  } finally {
    window.clearTimeout(timer);
  }
}
