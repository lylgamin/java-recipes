import Link from "next/link";
import type { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ファイルI/O",
  description:
    "Java のファイルI/Oサンプル集。CSVの読み書き、.propertiesファイル読み込み、java.nio.file によるファイル操作。",
};

const samples = [
  {
    id: "f01",
    href: "/fileio/f01/",
    title: "F-01: CSVの読み書き",
    description:
      "外部ライブラリ不要で CSV を読み書きする方法。文字コード指定、ヘッダー行スキップ、カンマを含むフィールドの処理。",
    tags: ["CSV", "BufferedReader", "文字コード"],
  },
  {
    id: "f02",
    href: "/fileio/f02/",
    title: "F-02: .propertiesファイルの読み込み",
    description:
      "Properties クラスによる設定ファイル読み込み。クラスパスからの取得、デフォルト値設定、UTF-8 対応の注意点。",
    tags: ["Properties", "設定ファイル", "クラスパス"],
  },
  {
    id: "f03",
    href: "/fileio/f03/",
    title: "F-03: java.nio.file によるファイル操作",
    description:
      "Files.readAllLines / writeString / copy / move / walk などの NIO.2 API。try-with-resources による確実なクローズ処理。",
    tags: ["NIO.2", "Files", "Path"],
  },
];

export default function FileIOPage() {
  return (
    <PageWrapper sidebar={<Sidebar />}>
      <div className="mb-8">
        <p className="text-sm mb-1" style={{ color: "var(--slate-500)" }}>
          <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">
            ホーム
          </Link>{" "}
          &rsaquo; ファイルI/O
        </p>
        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--slate-800)" }}>
          ファイルI/O
        </h1>
        <p style={{ color: "var(--slate-500)" }}>
          Java のファイル操作サンプル集。外部ライブラリ不要の Pure Java で CSV・設定ファイル・ファイルシステム操作をカバー。
        </p>
      </div>

      <ul className="space-y-4">
        {samples.map((s) => (
          <li key={s.id}>
            <Link
              href={s.href}
              className="sample-card block p-5"
              style={{
                background: "var(--white)",
                border: "1px solid var(--slate-200)",
                borderRadius: "10px",
                textDecoration: "none",
              }}
            >
              <h2 className="font-semibold mb-1" style={{ color: "var(--slate-800)" }}>
                {s.title}
              </h2>
              <p className="text-sm mb-3" style={{ color: "var(--slate-500)" }}>
                {s.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "2px 8px",
                      background: "var(--blue-light)",
                      color: "var(--blue)",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </PageWrapper>
  );
}
