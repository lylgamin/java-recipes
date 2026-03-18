import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "コレクション",
  description:
    "Java のコレクション処理サンプル集。List / Map / Set の基本操作、Stream API 実用パターン、ソート・グルーピング・集計。",
};

const samples = [
  {
    id: "c01",
    href: "/collections/c01/",
    title: "C-01: List / Map / Set 基本操作",
    description:
      "ArrayList、HashMap、HashSet の生成・追加・検索・削除。Java 9 以降の of() / copyOf() によるイミュータブルコレクションも解説。",
    tags: ["ArrayList", "HashMap", "HashSet"],
  },
  {
    id: "c02",
    href: "/collections/c02/",
    title: "C-02: Stream API 実用パターン",
    description:
      "filter / map / flatMap / collect の基本から、toMap / groupingBy / joining などの Collectors 実用例まで。",
    tags: ["Stream API", "Collectors", "Java 8+"],
  },
  {
    id: "c03",
    href: "/collections/c03/",
    title: "C-03: ソート・グルーピング・集計",
    description:
      "Comparator.comparing() によるマルチキーソート、groupingBy による集計、summingInt / averagingDouble などの集計関数。",
    tags: ["Comparator", "groupingBy", "集計"],
  },
];

export default function CollectionsPage() {
  return (
    <>
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">
          <Link href="/" className="hover:underline">
            ホーム
          </Link>{" "}
          &rsaquo; コレクション
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">コレクション</h1>
        <p className="text-gray-600">
          Java のコレクション操作と Stream API のサンプル集。業務でよく使うパターンを厳選して掲載。
        </p>
      </div>

      <ul className="space-y-4">
        {samples.map((s) => (
          <li key={s.id}>
            <Link
              href={s.href}
              className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <h2 className="font-semibold text-gray-800 mb-1">{s.title}</h2>
              <p className="text-sm text-gray-600 mb-3">{s.description}</p>
              <div className="flex gap-2 flex-wrap">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs"
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
