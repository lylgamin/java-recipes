import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "日付・時刻",
  description:
    "Java の日付・時刻処理サンプル集。Date/LocalDate 変換、日付フォーマット、祝日判定、営業日計算、和暦変換、タイムゾーン処理など。",
};

const samples = [
  {
    id: "d01",
    href: "/dates/d01/",
    title: "D-01: java.util.Date ↔ LocalDate ↔ java.sql.Date 相互変換",
    description:
      "レガシーコードとモダンコードが混在する現場でよく必要になる型変換。Instant を経由した確実な変換方法を解説。",
    tags: ["Java 8+", "Date", "LocalDate"],
  },
  {
    id: "d02",
    href: "/dates/d02/",
    title: "D-02: 日付フォーマット（SimpleDateFormat vs DateTimeFormatter）",
    description:
      "SimpleDateFormat はスレッドアンセーフ。Java 8 以降は DateTimeFormatter を使う理由と実用パターンを解説。",
    tags: ["Java 8+", "DateTimeFormatter", "SimpleDateFormat"],
  },
  {
    id: "d03",
    href: "/dates/d03/",
    title: "D-03: 消費税計算（税率・軽減税率・端数処理）",
    description:
      "浮動小数点誤差を避けるための BigDecimal 活用、軽減税率8%と標準税率10%の判定、切り捨て・切り上げ処理。",
    tags: ["BigDecimal", "税率", "端数処理"],
  },
  {
    id: "d04",
    href: "/dates/d04/",
    title: "D-04: 祝日判定（内閣府CSV活用 / ハードコード方式）",
    description:
      "内閣府が公開するCSVを読み込む方式と、祝日をコードに埋め込む方式の2パターン。現場での使い分けも解説。",
    tags: ["祝日", "CSV", "LocalDate"],
  },
  {
    id: "d05",
    href: "/dates/d05/",
    title: "D-05: 営業日計算（祝日・土日除外、N営業日後）",
    description:
      "「3営業日後」「月末営業日」など、請求・締め日計算で必須の営業日算出ロジック。",
    tags: ["営業日", "祝日除外", "LocalDate"],
  },
  {
    id: "d06",
    href: "/dates/d06/",
    title: "D-06: 元号変換（和暦↔西暦、令和/平成/昭和）",
    description:
      "令和・平成・昭和の和暦と西暦の相互変換。Java 8 の JapaneseDate と純粋な計算ロジックの2方式。",
    tags: ["和暦", "元号", "JapaneseDate"],
  },
  {
    id: "d07",
    href: "/dates/d07/",
    title: "D-07: タイムゾーン処理（JST/UTC変換、夏時間考慮）",
    description:
      "JST/UTC 変換、ZonedDateTime の使い方、夏時間（DST）がある地域を扱う際の注意点。",
    tags: ["タイムゾーン", "ZonedDateTime", "UTC"],
  },
];

export default function DatesPage() {
  return (
    <>
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-1">
          <Link href="/" className="hover:underline">
            ホーム
          </Link>{" "}
          &rsaquo; 日付・時刻
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">日付・時刻</h1>
        <p className="text-gray-600">
          Java の日付・時刻処理に関するサンプル集。レガシーな{" "}
          <code className="bg-gray-100 px-1 rounded text-sm">
            java.util.Date
          </code>{" "}
          から モダンな{" "}
          <code className="bg-gray-100 px-1 rounded text-sm">
            java.time
          </code>{" "}
          API まで幅広くカバーします。
        </p>
      </div>

      <ul className="space-y-4">
        {samples.map((s) => (
          <li key={s.id}>
            <Link
              href={s.href}
              className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <h2 className="font-semibold text-gray-800 mb-1">{s.title}</h2>
              <p className="text-sm text-gray-600 mb-3">{s.description}</p>
              <div className="flex gap-2 flex-wrap">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
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
