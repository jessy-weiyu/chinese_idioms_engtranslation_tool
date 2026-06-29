"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookmarkPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addFavorite } from "@/lib/storage/favorites";
import { clearHistory, getHistory, removeHistory } from "@/lib/storage/history";
import type { SearchHistoryItem } from "@/types/idiom";

export function HistoryList() {
  const [items, setItems] = useState<SearchHistoryItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  function refresh() {
    setItems(getHistory());
    setSelected([]);
  }

  useEffect(() => {
    refresh();
  }, []);

  function addSelectedToFavorites() {
    const targets = items.filter((item) => selected.includes(item.id));
    for (const item of targets) {
      addFavorite(item.idiom, item.query, item.resultId);
    }
    toast.success("已批量加入收藏");
    setSelected([]);
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>历史记录</CardTitle>
          <p className="text-sm text-muted-foreground">按最近搜索时间倒序展示。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={selected.length === 0}
            onClick={addSelectedToFavorites}
          >
            <BookmarkPlus className="h-4 w-4" />
            批量收藏
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={items.length === 0}
            onClick={() => {
              clearHistory();
              refresh();
              toast.success("历史记录已清空");
            }}
          >
            <Trash2 className="h-4 w-4" />
            清空
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            暂无搜索历史。
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/45 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary"
                    checked={selected.includes(item.id)}
                    onChange={(event) =>
                      setSelected((current) =>
                        event.target.checked
                          ? [...current, item.id]
                          : current.filter((id) => id !== item.id)
                      )
                    }
                  />
                  <span>
                    <Link href={`/?q=${encodeURIComponent(item.idiom)}`} className="font-title text-2xl">
                      {item.idiom}
                    </Link>
                    <span className="block text-sm text-muted-foreground">
                      查询：{item.query} · {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </span>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    removeHistory(item.id);
                    refresh();
                    toast.success("已删除");
                  }}
                >
                  删除
                </Button>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
