"use client";

import { Button } from "@/components/ui/button";

const HOT_IDIOMS = [
  "画蛇添足",
  "守株待兔",
  "亡羊补牢",
  "刻舟求剑",
  "掩耳盗铃",
  "杯弓蛇影",
  "雪中送炭",
  "锦上添花",
  "一鸣惊人",
  "水滴石穿",
  "井底之蛙",
  "滥竽充数"
];

export function HotIdiomList({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <section className="paper-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-title text-2xl">热门常用成语</h2>
        <span className="text-xs text-muted-foreground">点击即可查询</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {HOT_IDIOMS.map((idiom) => (
          <Button
            key={idiom}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSelect(idiom)}
          >
            {idiom}
          </Button>
        ))}
      </div>
    </section>
  );
}
