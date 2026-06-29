import type { Metadata } from "next";
import { HistoryList } from "@/components/history/history-list";

export const metadata: Metadata = {
  title: "历史记录",
  description: "查看、删除和批量收藏本地成语搜索历史。"
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">本地存储</p>
        <h1 className="font-title text-4xl">历史记录</h1>
      </div>
      <HistoryList />
    </div>
  );
}
