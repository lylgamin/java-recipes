import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Link from "next/link";

const AD_CLIENT = "ca-pub-9891812277341685";

export const metadata: Metadata = {
  title: {
    template: "%s | java-recipes",
    default: "java-recipes — Pure Java サンプル集",
  },
  description:
    "新人エンジニア向けの Pure Java サンプル集。Java 8 / 17 / 21 対応。外部ライブラリ不要のコード例を多数掲載。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Google AdSense */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col" style={{ background: "var(--slate-50)", color: "var(--slate-800)" }}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer
          style={{
            background: "var(--white)",
            borderTop: "1px solid var(--slate-200)",
            padding: "28px 20px",
            marginTop: "40px",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "24px",
                marginBottom: "12px",
                flexWrap: "wrap",
              }}
            >
              <Link href="/" style={{ fontSize: "13px", color: "var(--slate-500)", textDecoration: "none" }}>
                ホーム
              </Link>
              <Link href="/dates/" style={{ fontSize: "13px", color: "var(--slate-500)", textDecoration: "none" }}>
                日付・時刻
              </Link>
              <Link href="/strings/" style={{ fontSize: "13px", color: "var(--slate-500)", textDecoration: "none" }}>
                文字列
              </Link>
              <Link href="/collections/" style={{ fontSize: "13px", color: "var(--slate-500)", textDecoration: "none" }}>
                コレクション
              </Link>
              <Link href="/fileio/" style={{ fontSize: "13px", color: "var(--slate-500)", textDecoration: "none" }}>
                ファイルI/O
              </Link>
              <Link href="/network/" style={{ fontSize: "13px", color: "var(--slate-500)", textDecoration: "none" }}>
                ネットワーク
              </Link>
            </div>
            <p style={{ fontSize: "12px", color: "var(--slate-400)" }}>
              © 2026 java-recipes
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
