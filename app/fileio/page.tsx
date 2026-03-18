import Link from "next/link";
import type { Metadata } from "next";

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
    <>
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">
          <Link href="/" className="hover:underline">
            ホーム
          </Link>{" "}
          &rsaquo; ファイルI/O
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">ファイルI/O</h1>
        <p className="text-gray-600">
          Java のファイル操作サンプル集。外部ライブラリ不要の Pure Java で CSV・設定ファイル・ファイルシステム操作をカバー。
        </p>
      </div>

      <ul className="space-y-4">
        {samples.map((s) => (
          <li key={s.id}>
            <Link
              href={s.href}
              className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-sm transition-all"
            >
              <h2 className="font-semibold text-gray-800 mb-1">{s.title}</h2>
              <p className="text-sm text-gray-600 mb-3">{s.description}</p>
              <div className="flex gap-2 flex-wrap">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
