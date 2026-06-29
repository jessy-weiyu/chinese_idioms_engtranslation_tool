import Link from "next/link";
import { Bookmark, History } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/82 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/60 bg-primary/10 font-title text-xl text-primary">
            译
          </span>
          <div>
            <p className="font-title text-xl tracking-wide text-foreground">国风成语英译</p>
            <p className="text-xs text-muted-foreground">Chinese Idiom Translation</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/history">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">历史</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/favorites">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">收藏</span>
            </Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
