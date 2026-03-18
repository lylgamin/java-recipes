import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "java-recipes — Pure Java サンプル集",
};

const categories = [
  {
    href: "/dates/",
    label: "日付・時刻",
    color: "border-blue-400 bg-blue-50",
    description: "日付変換・フォーマット・祝日・営業日・和暦・タイムゾーン",
    items: [
      "D-01 Date/LocalDate 相互変換",
      "D-02 日付フォーマット",
      "D-03 消費税計算",
      "D-04 祝日判定",
      "D-05 営業日計算",
      "D-06 元号変換",
      "D-07 タイムゾーン処理",
    ],
  },
  {
    href: "/strings/",
    label: "文字列",
    color: "border-green-400 bg-green-50",
    description: "null安全・パディング・フォーマット・正規表現",
    items: [
      "S-01 null安全な文字列操作",
      "S-02 パディング・ゼロ埋め",
      "S-03 カンマ区切り・数値フォーマット",
      "S-04 正規表現パターン集",
    ],
  },
  {
    href: "/collections/",
    label: "コレクション",
    color: "border-purple-400 bg-purple-50",
    description: "List / Map / Set・Stream API・ソート・グルーピング",
    items: [
      "C-01 List/Map/Set 基本操作",
      "C-02 Stream API 実用パターン",
      "C-03 ソート・グルーピング・集計",
    ],
  },
  {
    href: "/fileio/",
    label: "ファイルI/O",
    color: "border-yellow-400 bg-yellow-50",
    description: "CSV・properties・java.nio.file によるファイル操作",
    items: [
      "F-01 CSVの読み書き",
      "F-02 .properties 読み込み",
      "F-03 java.nio.file 操作",
    ],
  },
  {
    href: "/network/",
    label: "ネットワーク",
    color: "border-red-400 bg-red-50",
    description: "HttpClient によるREST呼び出し（Java 11〜）",
    items: ["N-01 HttpClient REST呼び出し"],
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mb-12 text-center py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          <span className="text-orange-500">java</span>
          <span className="text-gray-400">-</span>
          <span className="text-gray-800">recipes</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          新人エンジニア向け Pure Java サンプル集。
          <br />
          外部ライブラリ不要・Java 8 / 17 / 21 の3バージョン対応。
          <br />
          学習の手助けや、外部ライブラリが利用できない場合などにご利用ください。
        </p>
        <div className="mt-5 flex justify-center gap-2 flex-wrap">
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            Java 8
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            Java 17
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
            Java 21
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
            Pure Java のみ
          </span>
        </div>
      </section>

      {/* Category Grid */}
      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          カテゴリ一覧
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`block p-5 rounded-xl border-l-4 ${cat.color} hover:shadow-md transition-shadow`}
            >
              <h3 className="font-bold text-gray-800 text-lg mb-1">
                {cat.label}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{cat.description}</p>
              <ul className="space-y-1">
                {cat.items.map((item) => (
                  <li key={item} className="text-xs text-gray-500">
                    · {item}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
