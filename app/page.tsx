import { Suspense } from "react";
import { HeroSearch } from "@/components/sections/hero-search";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-12">正在展开卷册...</div>}>
      <HeroSearch />
    </Suspense>
  );
}
