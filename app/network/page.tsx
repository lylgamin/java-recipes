import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ネットワーク",
  description:
    "Java のネットワーク処理サンプル集。Java 11 以降の HttpClient による REST API 呼び出し。",
};

const samples = [
  {
    id: "n01",
    href: "/network/n01/",
    title: "N-01: HttpClient によるREST呼び出し（Java 11〜）",
    description:
      "Java 11 で標準搭載された HttpClient を使った GET / POST リクエスト。非同期処理、タイムアウト設定、レスポンスのJSON解析まで。",
    tags: ["HttpClient", "REST", "Java 11+"],
  },
];

export default function NetworkPage() {
  return (
    <>
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">
          <Link href="/" className="hover:underline">
            ホーム
          </Link>{" "}
          &rsaquo; ネットワーク
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">ネットワーク</h1>
        <p className="text-gray-600">
          Java のネットワーク通信サンプル集。外部ライブラリ不要で REST API を呼び出す方法を解説。
        </p>
      </div>

      <ul className="space-y-4">
        {samples.map((s) => (
          <li key={s.id}>
            <Link
              href={s.href}
              className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all"
            >
              <h2 className="font-semibold text-gray-800 mb-1">{s.title}</h2>
              <p className="text-sm text-gray-600 mb-3">{s.description}</p>
              <div className="flex gap-2 flex-wrap">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs"
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
