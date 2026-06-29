import type { Metadata } from "next";
import { FavoriteList } from "@/components/favorites/favorite-list";

export const metadata: Metadata = {
  title: "我的收藏",
  description: "管理本地收藏的中文成语英译内容。"
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">本地持久化</p>
        <h1 className="font-title text-4xl">我的收藏</h1>
      </div>
      <FavoriteList />
    </div>
  );
}
