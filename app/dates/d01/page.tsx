import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";

export const metadata: Metadata = {
  title: "D-01: Date ↔ LocalDate ↔ java.sql.Date 相互変換",
  description:
    "java.util.Date、LocalDate、java.sql.Date の相互変換方法を Java 8 / 17 / 21 で解説。Instant を経由した確実な変換パターン。",
};

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
    <>
      {/* パンくず */}
      <p className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">ホーム</Link>
        {" "}&rsaquo;{" "}
        <Link href="/dates/" className="hover:underline">日付・時刻</Link>
        {" "}&rsaquo; D-01
      </p>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        D-01: java.util.Date ↔ LocalDate ↔ java.sql.Date 相互変換
      </h1>
      <p className="text-gray-600 mb-8">
        レガシーコードとモダンコードが混在する現場で頻出の型変換パターン。
        <code className="bg-gray-100 px-1 rounded text-sm">Instant</code> を経由した確実な変換方法を解説します。
      </p>

      {/* 1. 説明・ユースケース */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          いつ使うか
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm leading-relaxed">
          <li>
            古いコード（Java 8 以前）が返す{" "}
            <code className="bg-gray-100 px-1 rounded">java.util.Date</code> を
            モダンな処理で使いたいとき
          </li>
          <li>
            JDBC の ResultSet から取得した{" "}
            <code className="bg-gray-100 px-1 rounded">java.sql.Date</code> を
            ビジネスロジックで扱いたいとき
          </li>
          <li>
            計算結果の{" "}
            <code className="bg-gray-100 px-1 rounded">LocalDate</code> を
            JDBC / 古い API に渡すとき
          </li>
        </ul>
      </section>

      {/* 2. サンプルコード */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          サンプルコード
        </h2>
        <VersionTabs tabs={tabs} filename="DateConversionSample.java" />
      </section>

      {/* 3. よくあるミス */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          よくあるミス・注意点
        </h2>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-amber-800 mb-1">
              ⚠️ タイムゾーンを省略すると環境依存になる
            </p>
            <p>
              <code className="bg-gray-100 px-1 rounded">ZoneId.systemDefault()</code>{" "}
              はJVMのデフォルトタイムゾーンを使います。
              サーバーの環境によって UTC や JST が変わると日付がズレます。
              本番環境では{" "}
              <code className="bg-gray-100 px-1 rounded">{'ZoneId.of("Asia/Tokyo")'}</code>{" "}
              のように明示するのが安全です。
            </p>
          </div>
          <div>
            <p className="font-semibold text-amber-800 mb-1">
              ⚠️ java.sql.Date に対して toInstant() を呼ぶと例外
            </p>
            <p>
              <code className="bg-gray-100 px-1 rounded">java.sql.Date.toInstant()</code>{" "}
              は{" "}
              <code className="bg-gray-100 px-1 rounded">UnsupportedOperationException</code>{" "}
              をスローします。
              必ず{" "}
              <code className="bg-gray-100 px-1 rounded">toLocalDate()</code>{" "}
              を使ってください。
            </p>
          </div>
        </div>
      </section>

      {/* 4. テストする観点 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          テストする観点
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm leading-relaxed">
          <li>日付の値が変換前後で一致すること（年・月・日）</li>
          <li>タイムゾーンが JST の環境と UTC の環境で同じ結果になること</li>
          <li>うるう年（2月29日）が正しく変換されること</li>
          <li>
            <code className="bg-gray-100 px-1 rounded">null</code> を渡したときに
            NullPointerException が発生すること（または null を返すこと）
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
    </>
  );
}
