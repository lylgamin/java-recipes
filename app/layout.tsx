import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    template: "%s | java-recipes",
    default: "java-recipes — Pure Java サンプル集",
  },
  description:
    "現場配属された新人エンジニア向けの Pure Java サンプル集。Java 8 / 17 / 21 対応。外部ライブラリ不要のコード例を多数掲載。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
          © 2026 java-recipes
        </footer>
      </body>
    </html>
  );
}
