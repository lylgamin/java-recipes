import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "D-02: 日付フォーマット（SimpleDateFormat vs DateTimeFormatter）",
  description:
    "SimpleDateFormat と DateTimeFormatter の使い方・違いを Java 8 / 17 / 21 で解説。スレッドアンセーフな SimpleDateFormat の安全な使い方と DateTimeFormatter の基本パターンを紹介します。",
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
    code: `import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;
import java.util.Locale;

public class DateFormatSample {

    // SimpleDateFormat はスレッドアンセーフなため、ThreadLocal で保護する
    // （1スレッドに1インスタンスを割り当てることで競合を防ぐ）
    private static final ThreadLocal<SimpleDateFormat> SDF_YMD =
            ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy/MM/dd"));

    // DateTimeFormatter はスレッドセーフなため、static final で使い回せる
    private static final DateTimeFormatter DTF_YMD =
            DateTimeFormatter.ofPattern("yyyy/MM/dd");

    public static void main(String[] args) {

        // ① SimpleDateFormat でフォーマット（日付 → 文字列）
        Date date = new Date();
        String formatted = SDF_YMD.get().format(date);
        System.out.println("SimpleDateFormat フォーマット: " + formatted);

        // ② SimpleDateFormat でパース（文字列 → 日付）
        try {
            Date parsed = SDF_YMD.get().parse("2024/04/01");
            System.out.println("SimpleDateFormat パース: " + parsed);
        } catch (ParseException e) {
            System.out.println("パースエラー: " + e.getMessage());
        }

        // ③ DateTimeFormatter でフォーマット（LocalDate → 文字列）
        LocalDate localDate = LocalDate.of(2024, 4, 1);
        String dtfFormatted = localDate.format(DTF_YMD);
        System.out.println("DateTimeFormatter フォーマット: " + dtfFormatted);

        // ④ DateTimeFormatter でパース（文字列 → LocalDate）
        try {
            LocalDate dtfParsed = LocalDate.parse("2024/04/01", DTF_YMD);
            System.out.println("DateTimeFormatter パース: " + dtfParsed);
        } catch (DateTimeParseException e) {
            System.out.println("パースエラー: " + e.getMessage());
        }

        // ⑤ 曜日・時刻を含むフォーマット（日本語ロケール指定）
        DateTimeFormatter dtfFull =
                DateTimeFormatter.ofPattern("yyyy年MM月dd日(EEE) HH:mm", Locale.JAPANESE);
        LocalDateTime now = LocalDateTime.now();
        System.out.println("日本語フォーマット: " + now.format(dtfFull));
    }
}`,
    note: "Java 8 から java.time パッケージが追加されました。新規開発では DateTimeFormatter を使いましょう。既存コードで SimpleDateFormat を使う場合は ThreadLocal で保護してください。",
  },
  {
    label: "Java 17",
    code: `import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;

public class DateFormatSample {

    // DateTimeFormatter はスレッドセーフなため、static final フィールドで使い回せる
    private static final DateTimeFormatter DTF_YMD =
            DateTimeFormatter.ofPattern("yyyy/MM/dd");

    public static void main(String[] args) {

        // ① DateTimeFormatter でフォーマット（LocalDate → 文字列）
        LocalDate localDate = LocalDate.of(2024, 4, 1);
        String formatted = localDate.format(DTF_YMD);
        System.out.println("DateTimeFormatter フォーマット: " + formatted);

        // ② DateTimeFormatter でパース（文字列 → LocalDate）
        try {
            LocalDate parsed = LocalDate.parse("2024/04/01", DTF_YMD);
            System.out.println("DateTimeFormatter パース: " + parsed);
        } catch (DateTimeParseException e) {
            System.out.println("パースエラー: " + e.getMessage());
        }

        // ③ 曜日・時刻を含む日本語フォーマット
        DateTimeFormatter dtfFull =
                DateTimeFormatter.ofPattern("yyyy年MM月dd日(EEE) HH:mm", Locale.JAPANESE);
        LocalDateTime now = LocalDateTime.now();
        System.out.println("日本語フォーマット: " + now.format(dtfFull));

        // ④ ISO 標準フォーマット
        String isoFormatted = localDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
        System.out.println("ISO フォーマット: " + isoFormatted); // 2024-04-01

        // ⑤ Java 15+: テキストブロックでフォーマットパターンを整理できる
        String pattern = """
                yyyy年MM月dd日(EEE) HH:mm
                """.strip();
        DateTimeFormatter dtfBlock = DateTimeFormatter.ofPattern(pattern, Locale.JAPANESE);
        System.out.println("テキストブロックで定義したフォーマット: " + now.format(dtfBlock));
    }
}`,
    note: "Java 17 では SimpleDateFormat の代わりに DateTimeFormatter を使うのが標準的なスタイルです。テキストブロック（Java 15+）を使うとパターン文字列が読みやすくなります。",
  },
  {
    label: "Java 21",
    code: `import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;

public class DateFormatSample {

    private static final DateTimeFormatter DTF_YMD =
            DateTimeFormatter.ofPattern("yyyy/MM/dd");

    public static void main(String[] args) {

        // ① DateTimeFormatter でフォーマット
        LocalDate localDate = LocalDate.of(2024, 4, 1);
        String formatted = localDate.format(DTF_YMD);
        System.out.println("DateTimeFormatter フォーマット: " + formatted);

        // ② DateTimeFormatter でパース
        try {
            LocalDate parsed = LocalDate.parse("2024/04/01", DTF_YMD);
            System.out.println("DateTimeFormatter パース: " + parsed);
        } catch (DateTimeParseException e) {
            System.out.println("パースエラー: " + e.getMessage());
        }

        // ③ 日本語フォーマット
        DateTimeFormatter dtfFull =
                DateTimeFormatter.ofPattern("yyyy年MM月dd日(EEE) HH:mm", Locale.JAPANESE);
        LocalDateTime now = LocalDateTime.now();
        System.out.println("日本語フォーマット: " + now.format(dtfFull));

        // ④ Java 21: switch 式でオブジェクト型に応じてフォーマットを切り替える
        Object dateObj = localDate;
        String result = switch (dateObj) { // Java 21: パターンマッチング for switch
            case LocalDate d -> d.format(DTF_YMD);
            case LocalDateTime dt -> dt.format(dtfFull);
            default -> dateObj.toString();
        };
        System.out.println("パターンマッチング結果: " + result);
    }
}`,
    note: "Java 21 のパターンマッチング for switch を使うと、型に応じたフォーマット処理を簡潔に書けます。日付フォーマットのロジック自体は Java 17 と同じです。",
  },
];

export default function D02Page() {
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
        {" "}&rsaquo; D-02
      </p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--slate-800)" }}>
        D-02: 日付フォーマット（SimpleDateFormat vs DateTimeFormatter）
      </h1>
      <p className="mb-8" style={{ color: "var(--slate-500)" }}>
        日付を文字列に変換したり、文字列から日付を読み取る処理は頻出です。
        Java 8 から追加された{" "}
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>
          DateTimeFormatter
        </code>{" "}
        と、古くから使われている{" "}
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>
          SimpleDateFormat
        </code>{" "}
        の違いと使い分けを解説します。
      </p>

      {/* 1. 説明・ユースケース */}
      <section className="mb-8">
        <h2
          className="text-xl font-semibold mb-3"
          style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}
        >
          いつ使うか
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>
            画面表示のために{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>LocalDate</code>{" "}
            を「2024/04/01」などの文字列に変換するとき
          </li>
          <li>
            フォームやCSVから受け取った日付文字列を{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>LocalDate</code>{" "}
            に変換するとき
          </li>
          <li>ログファイルやレポートに「2024年04月01日(月)」形式で出力するとき</li>
          <li>古いコードで使われている{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>SimpleDateFormat</code>{" "}
            を保守・改修するとき
          </li>
        </ul>

        <div className="mt-4 p-4 rounded-lg text-sm" style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
          <p className="font-semibold mb-2" style={{ color: "var(--slate-700)" }}>主なフォーマットパターン文字</p>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--slate-200)" }}>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>文字</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>意味</th>
                <th className="text-left py-1" style={{ color: "var(--slate-600)" }}>例</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--slate-700)" }}>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">yyyy</td>
                <td className="py-1 pr-4">西暦（4桁）</td>
                <td className="py-1">2024</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">MM</td>
                <td className="py-1 pr-4">月（2桁）</td>
                <td className="py-1">04</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">dd</td>
                <td className="py-1 pr-4">日（2桁）</td>
                <td className="py-1">01</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">EEE</td>
                <td className="py-1 pr-4">曜日（短縮）</td>
                <td className="py-1">月（Locale.JAPANESE 指定時）</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">HH</td>
                <td className="py-1 pr-4">時（24時間、2桁）</td>
                <td className="py-1">09</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-mono">mm</td>
                <td className="py-1 pr-4">分（2桁）</td>
                <td className="py-1">30</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. サンプルコード */}
      <section className="mb-8">
        <h2
          className="text-xl font-semibold mb-3"
          style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}
        >
          サンプルコード
        </h2>
        <VersionTabs tabs={tabs} filename="DateFormatSample.java" />
      </section>

      {/* 3. よくあるミス */}
      <section className="mb-8">
        <h2
          className="text-xl font-semibold mb-3"
          style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}
        >
          よくあるミス・注意点
        </h2>
        <div className="space-y-3 text-sm" style={{ color: "var(--slate-700)" }}>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ SimpleDateFormat はスレッドアンセーフ
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                SimpleDateFormat
              </code>{" "}
              を static フィールドで複数スレッドから同時に使うと、日付が文字化けしたり例外が発生します。
              回避策は2つあります。①{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                ThreadLocal
              </code>{" "}
              で1スレッドに1インスタンスを持たせる。②スレッドセーフな{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                DateTimeFormatter
              </code>{" "}
              に置き換える。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ パースエラーの例外クラスが違う
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                SimpleDateFormat
              </code>{" "}
              は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                java.text.ParseException
              </code>
              （チェック例外）を投げます。一方{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                DateTimeFormatter
              </code>{" "}
              は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                DateTimeParseException
              </code>
              （非チェック例外）を投げます。catch する例外クラスを間違えないように注意しましょう。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ 曜日を表示するには Locale 指定が必要
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                {"DateTimeFormatter.ofPattern(\"EEE\")"}
              </code>{" "}
              は実行環境のデフォルトロケールに依存します。日本語の曜日（「月」「火」など）を表示したい場合は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                {"DateTimeFormatter.ofPattern(\"EEE\", Locale.JAPANESE)"}
              </code>{" "}
              と必ず Locale を指定してください。
            </p>
          </div>
        </div>
      </section>

      {/* 4. テストする観点 */}
      <section className="mb-8">
        <h2
          className="text-xl font-semibold mb-3"
          style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}
        >
          テストする観点
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>正常なフォーマット：{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>
              LocalDate.of(2024, 4, 1)
            </code>{" "}
            が「2024/04/01」になること
          </li>
          <li>境界値：1月（01）、12月（12）、1日（01）、31日（31）が正しくフォーマットされること</li>
          <li>パース正常系：「2024/04/01」が{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>LocalDate.of(2024, 4, 1)</code>{" "}
            になること
          </li>
          <li>パース異常系：「2024/13/01」（存在しない月）でパースエラーが発生すること</li>
          <li>ロケールの確認：{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>Locale.JAPANESE</code>{" "}
            指定時に曜日が日本語（「月」など）で出力されること
          </li>
        </ul>
        <p className="mt-4 text-sm" style={{ color: "var(--slate-600)" }}>
          <a
            href="https://github.com/lylgamin/java-recipes/blob/main/java-samples/java8/src/main/java/DateFormatSample.java"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--blue)" }}
          >
            GitHub でソースコードを見る →
          </a>
        </p>
      </section>

      {/* 5. 関連ページ */}
      <PageNav
        prev={{
          href: "/dates/d01/",
          label: "D-01: Date/LocalDate/sql.Date 相互変換",
        }}
        next={{
          href: "/dates/d03/",
          label: "D-03: 消費税計算（BigDecimal・端数処理）",
        }}
        related={[
          { href: "/dates/d01/", label: "D-01: Date/LocalDate 相互変換" },
          { href: "/dates/d07/", label: "D-07: タイムゾーン処理" },
        ]}
      />
    </PageWrapper>
  );
}
