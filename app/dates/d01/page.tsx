import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "D-01: Date ↔ LocalDate ↔ java.sql.Date 相互変換",
  description:
    "java.util.Date、LocalDate、java.sql.Date の相互変換方法を Java 8 / 17 / 21 で解説。Instant を経由した確実な変換パターン。",
};

const dateNavItems = [
  { href: "/dates/d01/", label: "D-01: Date/LocalDate 相互変換" },
  { href: "/dates/d02/", label: "D-02: 日付フォーマット" },
  { href: "/dates/d03/", label: "D-03: 消費税計算" },
  { href: "/dates/d04/", label: "D-04: 祝日判定" },
  { href: "/dates/d05/", label: "D-05: 営業日計算" },
  { href: "/dates/d06/", label: "D-06: 元号変換" },
  { href: "/dates/d07/", label: "D-07: タイムゾーン処理" },
];

const tabs = [
  {
    label: "Java 8+",
    code: `import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class DateConversionSample {

    public static void main(String[] args) {

        // ① java.util.Date → LocalDate
        Date utilDate = new Date();
        LocalDate fromUtilDate = utilDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        System.out.println("util.Date → LocalDate: " + fromUtilDate);

        // ② LocalDate → java.util.Date
        LocalDate localDate = LocalDate.of(2024, 4, 1);
        Date toUtilDate = Date.from(
                localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        System.out.println("LocalDate → util.Date: " + toUtilDate);

        // ③ java.sql.Date → LocalDate
        java.sql.Date sqlDate = java.sql.Date.valueOf("2024-04-01");
        LocalDate fromSqlDate = sqlDate.toLocalDate();
        System.out.println("sql.Date → LocalDate: " + fromSqlDate);

        // ④ LocalDate → java.sql.Date
        java.sql.Date toSqlDate = java.sql.Date.valueOf(localDate);
        System.out.println("LocalDate → sql.Date: " + toSqlDate);

        // ⑤ java.util.Date → java.sql.Date
        java.sql.Date utilToSql = new java.sql.Date(utilDate.getTime());
        System.out.println("util.Date → sql.Date: " + utilToSql);
    }
}`,
    note: "Java 8 で追加された java.time パッケージを使った変換です。",
  },
  {
    label: "Java 17",
    code: `import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class DateConversionSample {

    // Java 17 では sealed class や record が使えるが
    // 変換ロジック自体は Java 8 と同じ
    public static void main(String[] args) {

        // ① java.util.Date → LocalDate
        Date utilDate = new Date();
        LocalDate fromUtilDate = utilDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        System.out.println("util.Date → LocalDate: " + fromUtilDate);

        // ② LocalDate → java.util.Date
        LocalDate localDate = LocalDate.of(2024, 4, 1);
        Date toUtilDate = Date.from(
                localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        System.out.println("LocalDate → util.Date: " + toUtilDate);

        // ③ java.sql.Date → LocalDate（JDBC で受け取った値を変換する典型例）
        java.sql.Date sqlDate = java.sql.Date.valueOf("2024-04-01");
        LocalDate fromSqlDate = sqlDate.toLocalDate();
        System.out.println("sql.Date → LocalDate: " + fromSqlDate);

        // ④ LocalDate → java.sql.Date（PreparedStatement に渡す典型例）
        java.sql.Date toSqlDate = java.sql.Date.valueOf(localDate);
        System.out.println("LocalDate → sql.Date: " + toSqlDate);
    }
}`,
    note: "Java 17 での変換ロジックは Java 8 と同一です。",
  },
  {
    label: "Java 21",
    code: `import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;

public class DateConversionSample {

    public static void main(String[] args) {

        // ① java.util.Date → LocalDate
        Date utilDate = new Date();
        LocalDate fromUtilDate = utilDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        System.out.println("util.Date → LocalDate: " + fromUtilDate);

        // ② LocalDate → java.util.Date
        LocalDate localDate = LocalDate.of(2024, 4, 1);
        Date toUtilDate = Date.from(
                localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
        System.out.println("LocalDate → util.Date: " + toUtilDate);

        // ③ java.sql.Date ↔ LocalDate
        java.sql.Date sqlDate = java.sql.Date.valueOf("2024-04-01");
        LocalDate fromSqlDate = sqlDate.toLocalDate();          // sql.Date → LocalDate
        java.sql.Date toSqlDate = java.sql.Date.valueOf(localDate); // LocalDate → sql.Date

        System.out.println("sql.Date → LocalDate: " + fromSqlDate);
        System.out.println("LocalDate → sql.Date: " + toSqlDate);
    }
}`,
    note: "Java 21 では仮想スレッド（Virtual Threads）が正式リリースされましたが、日付変換ロジック自体は変わりません。",
  },
];

export default function D01Page() {
  return (
    <PageWrapper
      sidebar={
        <Sidebar
          navTitle="日付・時刻"
          navItems={dateNavItems}
        />
      }
    >
      {/* パンくず */}
      <p className="text-sm mb-6" style={{ color: "var(--slate-500)" }}>
        <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">
          ホーム
        </Link>
        {" "}&rsaquo;{" "}
        <Link href="/dates/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">
          日付・時刻
        </Link>
        {" "}&rsaquo; D-01
      </p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--slate-800)" }}>
        D-01: java.util.Date ↔ LocalDate ↔ java.sql.Date 相互変換
      </h1>
      <p className="mb-8" style={{ color: "var(--slate-500)" }}>
        レガシーコードとモダンコードが混在する場面で頻出の型変換パターン。
        <code
          style={{
            background: "var(--slate-100)",
            padding: "1px 6px",
            borderRadius: "4px",
            fontSize: "13px",
          }}
        >
          Instant
        </code>{" "}
        を経由した確実な変換方法を解説します。
      </p>

      {/* 1. 説明・ユースケース */}
      <section className="mb-8">
        <h2
          className="text-xl font-semibold mb-3"
          style={{
            color: "var(--slate-800)",
            borderBottom: "2px solid var(--slate-200)",
            paddingBottom: "8px",
          }}
        >
          いつ使うか
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>
            古いコード（Java 8 以前）が返す{" "}
            <code
              style={{
                background: "var(--slate-100)",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              java.util.Date
            </code>{" "}
            をモダンな処理で使いたいとき
          </li>
          <li>
            JDBC の ResultSet から取得した{" "}
            <code
              style={{
                background: "var(--slate-100)",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              java.sql.Date
            </code>{" "}
            をビジネスロジックで扱いたいとき
          </li>
          <li>
            計算結果の{" "}
            <code
              style={{
                background: "var(--slate-100)",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              LocalDate
            </code>{" "}
            を JDBC / 古い API に渡すとき
          </li>
        </ul>
      </section>

      {/* 2. サンプルコード */}
      <section className="mb-8">
        <h2
          className="text-xl font-semibold mb-3"
          style={{
            color: "var(--slate-800)",
            borderBottom: "2px solid var(--slate-200)",
            paddingBottom: "8px",
          }}
        >
          サンプルコード
        </h2>
        <VersionTabs tabs={tabs} filename="DateConversionSample.java" />
      </section>

      {/* 3. よくあるミス */}
      <section className="mb-8">
        <h2
          className="text-xl font-semibold mb-3"
          style={{
            color: "var(--slate-800)",
            borderBottom: "2px solid var(--slate-200)",
            paddingBottom: "8px",
          }}
        >
          よくあるミス・注意点
        </h2>
        <div className="space-y-3 text-sm" style={{ color: "var(--slate-700)" }}>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ タイムゾーンを省略すると環境依存になる
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code
                style={{
                  background: "rgba(0,0,0,0.06)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                ZoneId.systemDefault()
              </code>{" "}
              はJVMのデフォルトタイムゾーンを使います。
              サーバーの環境によって UTC や JST が変わると日付がズレます。
              本番環境では{" "}
              <code
                style={{
                  background: "rgba(0,0,0,0.06)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                {'ZoneId.of("Asia/Tokyo")'}
              </code>{" "}
              のように明示するのが安全です。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ java.sql.Date に対して toInstant() を呼ぶと例外
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code
                style={{
                  background: "rgba(0,0,0,0.06)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                java.sql.Date.toInstant()
              </code>{" "}
              は{" "}
              <code
                style={{
                  background: "rgba(0,0,0,0.06)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                UnsupportedOperationException
              </code>{" "}
              をスローします。
              必ず{" "}
              <code
                style={{
                  background: "rgba(0,0,0,0.06)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                }}
              >
                toLocalDate()
              </code>{" "}
              を使ってください。
            </p>
          </div>
        </div>
      </section>

      {/* 4. テストする観点 */}
      <section className="mb-8">
        <h2
          className="text-xl font-semibold mb-3"
          style={{
            color: "var(--slate-800)",
            borderBottom: "2px solid var(--slate-200)",
            paddingBottom: "8px",
          }}
        >
          テストする観点
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>日付の値が変換前後で一致すること（年・月・日）</li>
          <li>タイムゾーンが JST の環境と UTC の環境で同じ結果になること</li>
          <li>うるう年（2月29日）が正しく変換されること</li>
          <li>
            <code
              style={{
                background: "var(--slate-100)",
                padding: "1px 6px",
                borderRadius: "4px",
              }}
            >
              null
            </code>{" "}
            を渡したときに NullPointerException が発生すること（または null を返すこと）
          </li>
        </ul>
      </section>

      {/* 5. 関連ページ */}
      <PageNav
        prev={undefined}
        next={{
          href: "/dates/d02/",
          label: "D-02: 日付フォーマット（SimpleDateFormat vs DateTimeFormatter）",
        }}
        related={[
          { href: "/dates/d02/", label: "D-02: 日付フォーマット" },
          { href: "/dates/d05/", label: "D-05: 営業日計算" },
          { href: "/dates/d07/", label: "D-07: タイムゾーン処理" },
        ]}
      />
    </PageWrapper>
  );
}
