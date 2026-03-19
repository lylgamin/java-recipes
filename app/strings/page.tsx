import Link from "next/link";
import type { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "文字列",
  description:
    "Java の文字列処理サンプル集。null安全操作、パディング・ゼロ埋め、カンマ区切り・数値フォーマット、正規表現パターン集。",
};

const samples = [
  {
    id: "s01",
    href: "/strings/s01/",
    title: "S-01: null安全な文字列操作",
    description:
      "NullPointerException を避けながら文字列を扱う方法。Objects.toString()、Optional、if-else の使い分け。",
    tags: ["null安全", "Optional", "NPE対策"],
  },
  {
    id: "s02",
    href: "/strings/s02/",
    title: "S-02: パディング・トリム・ゼロ埋め",
    description:
      "String.format() と printf フォーマット指定子によるゼロ埋め・空白埋め・左右揃え。trim() と strip() の違いも解説。",
    tags: ["String.format", "ゼロ埋め", "パディング"],
  },
  {
    id: "s03",
    href: "/strings/s03/",
    title: "S-03: カンマ区切り・数値フォーマット",
    description:
      "NumberFormat / DecimalFormat によるカンマ区切り整数・小数表示、通貨フォーマット。ロケールの扱いも解説。",
    tags: ["NumberFormat", "DecimalFormat", "通貨"],
  },
  {
    id: "s04",
    href: "/strings/s04/",
    title: "S-04: 正規表現（java.util.regex 実用パターン集）",
    description:
      "メールアドレス・電話番号・郵便番号などの実用バリデーションパターン。Pattern / Matcher の使い方と性能最適化。",
    tags: ["正規表現", "Pattern", "Matcher"],
  },
];

export default function StringsPage() {
  return (
    <PageWrapper sidebar={<Sidebar />}>
      <div className="mb-8">
        <p className="text-sm mb-1" style={{ color: "var(--slate-500)" }}>
          <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">
            ホーム
          </Link>{" "}
          &rsaquo; 文字列
        </p>
        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--slate-800)" }}>
          文字列
        </h1>
        <p style={{ color: "var(--slate-500)" }}>
          Java の文字列処理に関するサンプル集。null 安全処理から、フォーマット・正規表現まで。
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
