import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "D-07: タイムゾーン処理（JST/UTC変換、夏時間考慮）",
  description:
    "Java でタイムゾーンを扱う方法を Java 8 / 17 / 21 で解説。ZonedDateTime と OffsetDateTime の使い分け、JST ↔ UTC 変換、夏時間（DST）のある地域での注意点、DB 保存パターンを紹介します。",
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
    code: `import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class TimeZoneSample {

    public static void main(String[] args) {

        // ① ZonedDateTime: タイムゾーンルール（DST対応）付きの日時
        ZonedDateTime jstNow = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));
        System.out.println("JST 現在時刻: " + jstNow);

        // ② JST → UTC 変換（withZoneSameInstant: 同一瞬間・異なるタイムゾーンで表現）
        ZonedDateTime utcNow = jstNow.withZoneSameInstant(ZoneId.of("UTC"));
        System.out.println("UTC 変換後: " + utcNow);
        // JST は UTC+9 なので 9時間引いた値になる（例: 21:00 JST → 12:00 UTC）

        // ③ UTC → JST 変換（DB から取得した UTC 値を表示用 JST に変換）
        ZonedDateTime utcTime = ZonedDateTime.of(
                LocalDateTime.of(2024, 4, 1, 12, 0, 0),
                ZoneId.of("UTC"));
        ZonedDateTime jstTime = utcTime.withZoneSameInstant(ZoneId.of("Asia/Tokyo"));
        System.out.println("UTC 12:00 → JST: " + jstTime.toLocalDateTime()); // 21:00

        // ④ OffsetDateTime: 固定オフセット（+09:00）付きの日時
        //    DST のない地域・API 連携・DB 保存などに向いている
        OffsetDateTime jstOffset = OffsetDateTime.now(ZoneOffset.of("+09:00"));
        System.out.println("OffsetDateTime(JST): " + jstOffset);

        // ⑤ 夏時間（DST）のある地域での注意点
        //    New York は 3月第2日曜に EST（-5） → EDT（-4）に切り替わる
        ZonedDateTime nyWinter = ZonedDateTime.of(
                LocalDateTime.of(2024, 1, 15, 12, 0),
                ZoneId.of("America/New_York"));
        ZonedDateTime nySummer = ZonedDateTime.of(
                LocalDateTime.of(2024, 7, 15, 12, 0),
                ZoneId.of("America/New_York"));
        System.out.println("NY 冬(EST): " + nyWinter.getOffset()); // -05:00
        System.out.println("NY 夏(EDT): " + nySummer.getOffset()); // -04:00

        // ⑥ DB保存は UTC、表示は JST に変換するパターン
        // 保存時: JST → UTC に変換して ISO 8601 形式で保存
        ZonedDateTime nowJst = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));
        String dbValue = nowJst.withZoneSameInstant(ZoneId.of("UTC"))
                .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        System.out.println("DB保存値(UTC): " + dbValue);

        // 表示時: UTC → JST に変換して日本語フォーマットで表示
        ZonedDateTime fromDb = ZonedDateTime.parse(dbValue);
        String display = fromDb.withZoneSameInstant(ZoneId.of("Asia/Tokyo"))
                .format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"));
        System.out.println("表示(JST): " + display);
    }
}`,
    note: "Java 8 から java.time.ZonedDateTime が追加されました。タイムゾーンを扱うときは必ずタイムゾーンを明示し、ZoneId.systemDefault() への依存は避けましょう。",
  },
  {
    label: "Java 17",
    code: `import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class TimeZoneSample {

    /** UTC 文字列を JST の表示用文字列に変換するユーティリティ */
    public static String utcToJstDisplay(String utcIso) {
        return ZonedDateTime.parse(utcIso)
                .withZoneSameInstant(ZoneId.of("Asia/Tokyo"))
                .format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"));
    }

    /** 現在の JST 日時を UTC ISO 8601 形式で返す（DB 保存用） */
    public static String nowAsUtcIso() {
        return ZonedDateTime.now(ZoneId.of("Asia/Tokyo"))
                .withZoneSameInstant(ZoneId.of("UTC"))
                .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }

    public static void main(String[] args) {

        // ① JST → UTC 変換
        ZonedDateTime jstNow = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));
        ZonedDateTime utcNow = jstNow.withZoneSameInstant(ZoneId.of("UTC"));
        System.out.println("JST: " + jstNow.toLocalDateTime());
        System.out.println("UTC: " + utcNow.toLocalDateTime());

        // ② UTC → JST 変換
        ZonedDateTime utcTime = ZonedDateTime.of(
                LocalDateTime.of(2024, 4, 1, 12, 0, 0), ZoneId.of("UTC"));
        System.out.println("UTC 12:00 → JST: "
                + utcTime.withZoneSameInstant(ZoneId.of("Asia/Tokyo")).toLocalDateTime());

        // ③ OffsetDateTime（固定オフセット）
        OffsetDateTime jstOffset = OffsetDateTime.now(ZoneOffset.of("+09:00"));
        System.out.println("OffsetDateTime: " + jstOffset.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

        // ④ 夏時間（DST）の確認
        ZonedDateTime nyWinter = ZonedDateTime.of(
                LocalDateTime.of(2024, 1, 15, 12, 0), ZoneId.of("America/New_York"));
        ZonedDateTime nySummer = ZonedDateTime.of(
                LocalDateTime.of(2024, 7, 15, 12, 0), ZoneId.of("America/New_York"));
        System.out.println("NY 冬: " + nyWinter.getOffset()); // -05:00
        System.out.println("NY 夏: " + nySummer.getOffset()); // -04:00

        // ⑤ DB保存パターン
        String dbValue = nowAsUtcIso();
        System.out.println("DB保存値: " + dbValue);
        System.out.println("表示値(JST): " + utcToJstDisplay(dbValue));

        // ⑥ Java 17: switch 式でタイムゾーン別のオフセットを取得
        String timezone = "Asia/Tokyo";
        String offset = switch (timezone) {
            case "Asia/Tokyo"       -> "+09:00";
            case "UTC"              -> "+00:00";
            case "America/New_York" -> "-05:00 / -04:00（DST あり）";
            default -> ZoneId.of(timezone).getRules()
                    .getOffset(java.time.Instant.now()).toString();
        };
        System.out.println(timezone + " のオフセット: " + offset);
    }
}`,
    note: "Java 17 では switch 式でタイムゾーンごとの処理を分岐できます。ユーティリティメソッドに切り出すと、DB 保存・表示変換のロジックを再利用しやすくなります。",
  },
  {
    label: "Java 21",
    code: `import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class TimeZoneSample {

    public static void main(String[] args) {

        // ① JST → UTC 変換
        var jstNow = ZonedDateTime.now(ZoneId.of("Asia/Tokyo")); // Java 10+: var
        var utcNow = jstNow.withZoneSameInstant(ZoneId.of("UTC"));
        System.out.println("JST: " + jstNow.toLocalDateTime());
        System.out.println("UTC: " + utcNow.toLocalDateTime());

        // ② UTC → JST 変換
        var utcTime = ZonedDateTime.of(
                LocalDateTime.of(2024, 4, 1, 12, 0, 0), ZoneId.of("UTC"));
        System.out.println("UTC 12:00 → JST: "
                + utcTime.withZoneSameInstant(ZoneId.of("Asia/Tokyo")).toLocalDateTime());

        // ③ OffsetDateTime（固定オフセット）
        var jstOffset = OffsetDateTime.now(ZoneOffset.of("+09:00"));
        System.out.println("OffsetDateTime: "
                + jstOffset.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));

        // ④ 夏時間（DST）の確認
        var nyWinter = ZonedDateTime.of(
                LocalDateTime.of(2024, 1, 15, 12, 0), ZoneId.of("America/New_York"));
        var nySummer = ZonedDateTime.of(
                LocalDateTime.of(2024, 7, 15, 12, 0), ZoneId.of("America/New_York"));
        System.out.println("NY 冬: " + nyWinter.getOffset()); // -05:00
        System.out.println("NY 夏: " + nySummer.getOffset()); // -04:00

        // ⑤ DB保存パターン（UTC 保存 → JST 表示）
        var now = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));
        String dbValue = now.withZoneSameInstant(ZoneId.of("UTC"))
                .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        System.out.println("DB保存値: " + dbValue);

        var fromDb = ZonedDateTime.parse(dbValue);
        String display = fromDb.withZoneSameInstant(ZoneId.of("Asia/Tokyo"))
                .format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"));
        System.out.println("表示値(JST): " + display);

        // ⑥ Java 21: switch 式でタイムゾーン説明を生成
        var zones = new String[]{"Asia/Tokyo", "UTC", "America/New_York", "Europe/London"};
        for (var zone : zones) {
            var label = switch (zone) {
                case "Asia/Tokyo"       -> "日本標準時（JST / UTC+9）";
                case "UTC"              -> "協定世界時（UTC+0）";
                case "America/New_York" -> "東部時間（EST/EDT / DST あり）";
                default -> zone + "（オフセット: "
                        + ZoneId.of(zone).getRules().getOffset(Instant.now()) + "）";
            };
            System.out.println(label);
        }
    }
}`,
    note: "Java 21 では var で型宣言を省略してコードを簡潔にできます。switch 式でタイムゾーンのラベル生成など、ロジックの分岐がすっきり書けます。",
  },
];

export default function D07Page() {
  return (
    <PageWrapper sidebar={<Sidebar navTitle="日付・時刻" navItems={dateNavItems} />}>
      <p className="text-sm mb-6" style={{ color: "var(--slate-500)" }}>
        <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">ホーム</Link>
        {" "}&rsaquo;{" "}
        <Link href="/dates/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">日付・時刻</Link>
        {" "}&rsaquo; D-07
      </p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--slate-800)" }}>
        D-07: タイムゾーン処理（JST/UTC変換、夏時間考慮）
      </h1>
      <p className="mb-8" style={{ color: "var(--slate-500)" }}>
        グローバルに展開するシステムや、DBとのデータ受け渡しでは、タイムゾーンの正しい扱いが必須です。
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>ZonedDateTime</code>{" "}
        と{" "}
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>OffsetDateTime</code>{" "}
        の違いと、夏時間（DST）が存在する地域での注意点を解説します。
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          いつ使うか
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>DB には UTC で保存し、画面表示は JST に変換するとき</li>
          <li>海外拠点との日時データを API でやり取りするとき（ISO 8601 形式）</li>
          <li>夏時間（DST）がある地域のスケジュール・アラームを扱うとき</li>
          <li>ログのタイムスタンプをタイムゾーン情報付きで記録・解析するとき</li>
        </ul>
        <div className="mt-4 p-4 rounded-lg text-sm" style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
          <p className="font-semibold mb-2" style={{ color: "var(--slate-700)" }}>ZonedDateTime vs OffsetDateTime</p>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--slate-200)" }}>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>型</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>DST対応</th>
                <th className="text-left py-1" style={{ color: "var(--slate-600)" }}>向いている用途</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--slate-700)" }}>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">ZonedDateTime</td>
                <td className="py-1 pr-4">あり（タイムゾーンルール適用）</td>
                <td className="py-1">将来の予定・スケジュール・ユーザー表示</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-mono">OffsetDateTime</td>
                <td className="py-1 pr-4">なし（固定オフセット）</td>
                <td className="py-1">DB 保存・API 送受信・ログ記録</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          サンプルコード
        </h2>
        <VersionTabs tabs={tabs} filename="TimeZoneSample.java" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          よくあるミス・注意点
        </h2>
        <div className="space-y-3 text-sm" style={{ color: "var(--slate-700)" }}>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ ZoneId.systemDefault() は環境依存</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>ZoneId.systemDefault()</code>{" "}
              は JVM が起動している環境のタイムゾーンを使います。
              ローカル（JST）と本番サーバー（UTC）で動作が異なり、日時が9時間ずれるバグが発生します。
              必ず{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>{"ZoneId.of(\"Asia/Tokyo\")"}</code>{" "}
              のようにタイムゾーンを明示してください。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ withZoneSameLocal vs withZoneSameInstant の違い</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>withZoneSameInstant()</code>{" "}
              は「同じ瞬間・別のタイムゾーンで表現」（正しいタイムゾーン変換）。
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>withZoneSameLocal()</code>{" "}
              は「同じローカル時刻・別のタイムゾーンに変更」（瞬間が変わる）。
              タイムゾーン変換には必ず{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>withZoneSameInstant()</code>{" "}
              を使ってください。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ 夏時間の切り替え日時は1時間が存在しないか重複する</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              夏時間開始時（スプリング・フォワード）は1時間が存在しません。夏時間終了時（フォール・バック）は1時間が2回存在します。
              ZonedDateTime でこれらの日時を扱う場合、JVM は自動的に調整しますが、
              OffsetDateTime で固定オフセットを指定すると曖昧さを回避できます。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          テストする観点
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>JST → UTC 変換で9時間差になること（例: 21:00 JST → 12:00 UTC）</li>
          <li>UTC → JST 変換が正しくできること（逆方向）</li>
          <li>ISO 8601 形式で出力した文字列を parse() で復元できること（ラウンドトリップ）</li>
          <li>New York のタイムゾーンで1月（EST: -5）と7月（EDT: -4）でオフセットが異なること</li>
          <li>DB保存値（UTC）を JST に変換して表示した値が正しいこと</li>
        </ul>
        <p className="mt-4 text-sm" style={{ color: "var(--slate-600)" }}>
          <a
            href="https://github.com/lylgamin/java-recipes/blob/main/java-samples/java8/src/main/java/TimeZoneSample.java"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--blue)" }}
          >
            GitHub でソースコードを見る →
          </a>
        </p>
      </section>

      <PageNav
        prev={{ href: "/dates/d06/", label: "D-06: 元号変換（和暦↔西暦）" }}
        next={undefined}
        related={[
          { href: "/dates/d01/", label: "D-01: Date/LocalDate 相互変換" },
          { href: "/dates/d02/", label: "D-02: 日付フォーマット" },
          { href: "/dates/d05/", label: "D-05: 営業日計算" },
        ]}
      />
    </PageWrapper>
  );
}
