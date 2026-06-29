"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clipboard, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clearFavorites, getFavorites, removeFavorite } from "@/lib/storage/favorites";
import type { FavoriteIdiomItem } from "@/types/idiom";

export function FavoriteList() {
  const [items, setItems] = useState<FavoriteIdiomItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  function refresh() {
    setItems(getFavorites());
    setSelected([]);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function copyItems(targets: FavoriteIdiomItem[]) {
    try {
      await navigator.clipboard.writeText(
        targets.map((item) => `${item.idiom}: ${item.translation}`).join("\n")
      );
      toast.success("复制成功");
    } catch {
      toast.error("复制失败，请手动复制");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>我的收藏</CardTitle>
          <p className="text-sm text-muted-foreground">收藏会保存在当前浏览器。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={selected.length === 0}
            onClick={() => copyItems(items.filter((item) => selected.includes(item.id)))}
          >
            <Clipboard className="h-4 w-4" />
            批量复制
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={items.length === 0}
            onClick={() => {
              clearFavorites();
              refresh();
              toast.success("收藏已清空");
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
            暂无收藏。
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
                    <span className="block max-w-2xl text-sm leading-6 text-muted-foreground">
                      {item.translation}
                    </span>
                  </span>
                </label>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => copyItems([item])}>
                    复制
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      removeFavorite(item.idiom);
                      refresh();
                      toast.success("已取消收藏");
                    }}
                  >
                    取消
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
