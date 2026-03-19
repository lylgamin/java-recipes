import Link from "next/link";
import type { Metadata } from "next";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "java-recipes — Pure Java サンプル集",
};

const categories = [
  {
    href: "/dates/",
    icon: "📅",
    label: "日付・時刻",
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
    icon: "🔤",
    label: "文字列",
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
    icon: "📦",
    label: "コレクション",
    description: "List / Map / Set・Stream API・ソート・グルーピング",
    items: [
      "C-01 List/Map/Set 基本操作",
      "C-02 Stream API 実用パターン",
      "C-03 ソート・グルーピング・集計",
    ],
  },
  {
    href: "/fileio/",
    icon: "📁",
    label: "ファイルI/O",
    description: "CSV・properties・java.nio.file によるファイル操作",
    items: [
      "F-01 CSVの読み書き",
      "F-02 .properties 読み込み",
      "F-03 java.nio.file 操作",
    ],
  },
  {
    href: "/network/",
    icon: "🌐",
    label: "ネットワーク",
    description: "HttpClient によるREST呼び出し（Java 11〜）",
    items: ["N-01 HttpClient REST呼び出し"],
  },
];

export default function HomePage() {
  return (
    <PageWrapper sidebar={<Sidebar tall />}>
      {/* Hero */}
      <section
        style={{
          background: "var(--white)",
          border: "1px solid var(--slate-200)",
          borderRadius: "12px",
          padding: "40px 32px",
          marginBottom: "32px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            marginBottom: "12px",
          }}
        >
          <span style={{ color: "#2563eb" }}>java</span>
          <span style={{ color: "var(--slate-400)" }}>-</span>
          <span style={{ color: "var(--slate-800)" }}>recipes</span>
        </h1>
        <p
          style={{
            color: "var(--slate-500)",
            fontSize: "15px",
            maxWidth: "520px",
            margin: "0 auto 20px",
          }}
        >
          新人エンジニア向け Pure Java サンプル集。
          <br />
          外部ライブラリ不要・Java 8 / 17 / 21 の3バージョン対応。
          <br />
          学習の手助けや、外部ライブラリが利用できない場合などにご利用ください。
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12.5px",
              fontWeight: 600,
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
            }}
          >
            Java 8
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12.5px",
              fontWeight: 600,
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
            }}
          >
            Java 17
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12.5px",
              fontWeight: 600,
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
            }}
          >
            Java 21
          </span>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12.5px",
              fontWeight: 600,
              background: "var(--slate-100)",
              color: "var(--slate-500)",
              border: "1px solid var(--slate-200)",
            }}
          >
            Pure Java のみ
          </span>
        </div>
      </section>

      {/* Category Grid */}
      <section>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--slate-500)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "16px",
          }}
        >
          カテゴリ一覧
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="category-card block"
              style={{
                background: "var(--white)",
                border: "1px solid var(--slate-200)",
                borderRadius: "10px",
                padding: "20px",
                textDecoration: "none",
              }}
            >
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>{cat.icon}</div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--slate-800)",
                  marginBottom: "4px",
                }}
              >
                {cat.label}
              </h3>
              <p
                style={{
                  fontSize: "12.5px",
                  color: "var(--slate-500)",
                  marginBottom: "10px",
                  lineHeight: 1.5,
                }}
              >
                {cat.description}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {cat.items.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontSize: "12px",
                      color: "var(--slate-400)",
                      padding: "2px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        width: "4px",
                        height: "4px",
                        background: "var(--slate-300)",
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
