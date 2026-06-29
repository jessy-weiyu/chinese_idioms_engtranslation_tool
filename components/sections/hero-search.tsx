"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { HotIdiomList } from "@/components/idiom/hot-idiom-list";
import { ResultCard } from "@/components/idiom/result-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchChengyuDetail } from "@/lib/api/chengyu-dictionary";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { addHistory } from "@/lib/storage/history";
import { findExactIdiom, searchIdioms } from "@/lib/search/idiom-search";
import type { ChengyuDictionaryDetail } from "@/types/chengyu";
import type { IdiomTranslation } from "@/types/idiom";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function HeroSearch() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<IdiomTranslation[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IdiomTranslation[]>([]);
  const [selected, setSelected] = useState<IdiomTranslation | null>(null);
  const [detail, setDetail] = useState<ChengyuDictionaryDetail | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 500);
  const handledInitialQuery = useRef<string | null>(null);

  useEffect(() => {
    fetch(`${publicBasePath}/data/idioms.json`)
      .then((response) => response.json())
      .then((items: IdiomTranslation[]) => setData(items))
      .catch(() => toast.error("本地成语数据库加载失败"))
      .finally(() => setLoadingData(false));
  }, []);

  const performSearch = useCallback(
    async (rawQuery: string) => {
      const value = rawQuery.trim();
      if (!value) {
        toast.error("请输入中文成语或英文短语");
        return;
      }

      const matches = searchIdioms(value, data, 10);
      setResults(matches);

      if (matches.length === 0) {
        setSelected(null);
        setDetail(null);
        toast.error("暂未匹配到相关成语");
        return;
      }

      const exact = findExactIdiom(value, data);
      const nextSelected = exact ?? matches[0];
      setSelected(nextSelected);
      setDetail(null);
      addHistory(value, nextSelected.idiom, nextSelected.id);

      setLoadingDetail(true);
      try {
        const nextDetail = await fetchChengyuDetail(nextSelected.idiom);
        setDetail(nextDetail);
        if (!nextDetail) {
          toast.info("未配置成语字典 API，已展示 PETCI 英译结果");
        }
      } catch {
        toast.error("成语字典接口异常，已保留英译结果");
      } finally {
        setLoadingDetail(false);
      }
    },
    [data]
  );

  useEffect(() => {
    const q = searchParams.get("q");
    if (!q || data.length === 0 || handledInitialQuery.current === q) {
      return;
    }

    handledInitialQuery.current = q;
    setQuery(q);
    void performSearch(q);
  }, [data, performSearch, searchParams]);

  useEffect(() => {
    if (!debouncedQuery.trim() || data.length === 0) {
      return;
    }
    const matches = searchIdioms(debouncedQuery, data, 10);
    setResults(matches);
  }, [data, debouncedQuery]);

  const intro = useMemo(
    () => (loadingData ? "正在铺开成语卷册" : `已载入 ${data.length} 条成语英译数据`),
    [data.length, loadingData]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/80 px-5 py-12 shadow-paper sm:px-10">
        <div className="absolute right-8 top-8 hidden h-24 w-24 rounded-full border border-primary/25 opacity-50 sm:block" />
        <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-celadon/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            {intro}
          </div>
          <h1 className="font-title text-4xl leading-tight tracking-wide sm:text-6xl">
            中文成语，中英互译
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
            输入中文成语查看英译、释义、出处和例句；也可以输入英文短语，反向匹配可能对应的中文成语。
          </p>

          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              void performSearch(query);
            }}
          >
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="例如：画蛇添足 / gild the lily"
              aria-label="输入中文成语或英文短语"
            />
            <Button type="submit" size="lg" disabled={loadingData}>
              <Search className="h-4 w-4" />
              搜索
            </Button>
          </form>
        </div>
      </section>

      <div className="mt-8 grid gap-6">
        {selected ? (
          <ResultCard
            item={selected}
            detail={detail}
            loadingDetail={loadingDetail}
            onFavoriteChange={() => setSelected({ ...selected })}
          />
        ) : null}

        {results.length > 1 ? (
          <section className="paper-card p-5">
            <h2 className="mb-4 font-title text-2xl">相关匹配</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant={selected?.id === item.id ? "secondary" : "outline"}
                  onClick={() => {
                    setQuery(item.idiom);
                    void performSearch(item.idiom);
                  }}
                >
                  {item.idiom}
                </Button>
              ))}
            </div>
          </section>
        ) : null}

        <HotIdiomList
          onSelect={(value) => {
            setQuery(value);
            void performSearch(value);
          }}
        />
      </div>
    </div>
  );
}
