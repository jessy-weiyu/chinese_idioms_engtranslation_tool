"use client";

import { Bookmark, Clipboard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TranslationGroup } from "@/components/idiom/translation-group";
import { addFavorite, isFavorite, removeFavorite } from "@/lib/storage/favorites";
import { getBestTranslation } from "@/lib/search/idiom-search";
import type { ChengyuDictionaryDetail } from "@/types/chengyu";
import type { IdiomTranslation } from "@/types/idiom";

interface ResultCardProps {
  item: IdiomTranslation;
  detail: ChengyuDictionaryDetail | null;
  loadingDetail?: boolean;
  onFavoriteChange?: () => void;
}

function Field({
  label,
  value
}: {
  label: string;
  value?: string | string[];
}) {
  const content = Array.isArray(value) ? value.join("、") : value;
  if (!content) {
    return null;
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="leading-7">{content}</p>
    </div>
  );
}

export function ResultCard({
  item,
  detail,
  loadingDetail = false,
  onFavoriteChange
}: ResultCardProps) {
  const favored = isFavorite(item.idiom);
  const bestTranslation = getBestTranslation(item);

  async function copyResult() {
    const text = [
      item.idiom,
      detail?.pinyin ? `拼音：${detail.pinyin}` : "",
      detail?.explanation ? `释义：${detail.explanation}` : "",
      `英译：${bestTranslation}`
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      toast.success("复制成功");
    } catch {
      toast.error("复制失败，请手动复制");
    }
  }

  function toggleFavorite() {
    const ok = favored
      ? removeFavorite(item.idiom)
      : addFavorite(item.idiom, bestTranslation, item.id);

    if (!ok) {
      toast.error("本地收藏写入失败");
      return;
    }

    toast.success(favored ? "已取消收藏" : "收藏成功");
    onFavoriteChange?.();
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border/60">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-4xl">{item.idiom}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              {detail?.pinyin || "拼音待成语字典 API 补充"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={copyResult}>
              <Clipboard className="h-4 w-4" />
              复制
            </Button>
            <Button type="button" variant={favored ? "secondary" : "default"} onClick={toggleFavorite}>
              <Bookmark className="h-4 w-4" />
              {favored ? "已收藏" : "收藏"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-6">
        {loadingDetail ? (
          <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            正在补全拼音、释义与出处
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="中文释义" value={detail?.explanation} />
          <Field label="出处" value={detail?.source} />
          <Field label="近义词" value={detail?.synonyms} />
          <Field label="反义词" value={detail?.antonyms} />
          <Field label="语法" value={detail?.grammar} />
          <Field label="中英补充" value={detail?.english} />
        </div>

        <Field label="例句" value={detail?.example} />

        <div className="grid gap-4 lg:grid-cols-3">
          <TranslationGroup title="直译" items={item.literalTranslations} />
          <TranslationGroup title="书面意译" items={item.literaryTranslations} />
          <TranslationGroup title="英文同义谚语" items={item.proverbTranslations} />
        </div>

        {!detail && !loadingDetail ? (
          <Badge className="border-celadon/50 bg-celadon/10 text-celadon">
            中文扩展资料需配置成语字典 API 后展示
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
