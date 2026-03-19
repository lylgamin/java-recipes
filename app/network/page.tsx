import Link from "next/link";
import type { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

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
    <PageWrapper sidebar={<Sidebar />}>
      <div className="mb-8">
        <p className="text-sm mb-1" style={{ color: "var(--slate-500)" }}>
          <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">
            ホーム
          </Link>{" "}
          &rsaquo; ネットワーク
        </p>
        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--slate-800)" }}>
          ネットワーク
        </h1>
        <p style={{ color: "var(--slate-500)" }}>
          Java のネットワーク通信サンプル集。外部ライブラリ不要で REST API を呼び出す方法を解説。
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
