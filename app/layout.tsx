import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "国风成语英译 | 中文成语中英在线翻译",
    template: "%s | 国风成语英译"
  },
  description:
    "面向中文成语学习、写作和翻译场景，提供成语英译、释义、出处、例句、收藏与历史记录。",
  keywords: ["成语翻译", "中文成语英文", "成语英译", "Chinese idiom translation", "成语字典"],
  openGraph: {
    title: "国风成语英译",
    description: "中文成语中英在线翻译，支持英文短语反向匹配成语。",
    type: "website",
    locale: "zh_CN"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
