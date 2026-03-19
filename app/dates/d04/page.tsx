import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "D-04: 祝日判定（整形済みリスト方式）",
  description:
    "Java で祝日を判定する方法を Java 8 / 17 / 21 で解説。isHoliday(LocalDate, Set<LocalDate>) のシグネチャで汎用的な設計を行い、Set.of() と new HashSet(Arrays.asList()) の Java バージョン別の違いも紹介します。",
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
    code: `import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class HolidayCheckSample {

    /**
     * 指定日が祝日かどうかを判定する
     *
     * @param date     判定する日付
     * @param holidays 祝日のセット（事前に整形済みのデータを渡す）
     * @return 祝日の場合 true
     */
    public static boolean isHoliday(LocalDate date, Set<LocalDate> holidays) {
        return holidays.contains(date);
    }

    /**
     * 指定日が休日（土曜・日曜・祝日）かどうかを判定する
     *
     * @param date     判定する日付
     * @param holidays 祝日のセット
     * @return 休日の場合 true
     */
    public static boolean isNonWorkingDay(LocalDate date, Set<LocalDate> holidays) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            return true;
        }
        return isHoliday(date, holidays);
    }

    public static void main(String[] args) {

        // Java 8: Arrays.asList() でセットを初期化する（Set.of はまだ使えない）
        Set<LocalDate> holidays2024 = new HashSet<>(Arrays.asList(
                LocalDate.of(2024, 1, 1),   // 元日
                LocalDate.of(2024, 1, 8),   // 成人の日
                LocalDate.of(2024, 2, 11),  // 建国記念の日
                LocalDate.of(2024, 2, 12),  // 振替休日
                LocalDate.of(2024, 2, 23),  // 天皇誕生日
                LocalDate.of(2024, 3, 20),  // 春分の日
                LocalDate.of(2024, 4, 29),  // 昭和の日
                LocalDate.of(2024, 5, 3),   // 憲法記念日
                LocalDate.of(2024, 5, 4),   // みどりの日
                LocalDate.of(2024, 5, 5),   // こどもの日
                LocalDate.of(2024, 5, 6),   // 振替休日
                LocalDate.of(2024, 7, 15),  // 海の日
                LocalDate.of(2024, 8, 11),  // 山の日
                LocalDate.of(2024, 8, 12),  // 振替休日
                LocalDate.of(2024, 9, 16),  // 敬老の日
                LocalDate.of(2024, 9, 22),  // 秋分の日
                LocalDate.of(2024, 10, 14), // スポーツの日
                LocalDate.of(2024, 11, 3),  // 文化の日
                LocalDate.of(2024, 11, 4),  // 振替休日
                LocalDate.of(2024, 11, 23)  // 勤労感謝の日
        ));

        // 判定サンプル
        LocalDate holiday = LocalDate.of(2024, 1, 1);   // 元日（祝日）
        LocalDate weekday = LocalDate.of(2024, 1, 4);   // 平日
        LocalDate saturday = LocalDate.of(2024, 1, 6);  // 土曜日

        System.out.println(holiday + " 祝日: " + isHoliday(holiday, holidays2024));     // true
        System.out.println(weekday + " 祝日: " + isHoliday(weekday, holidays2024));     // false
        System.out.println(saturday + " 休日: " + isNonWorkingDay(saturday, holidays2024)); // true
        System.out.println(weekday + " 休日: " + isNonWorkingDay(weekday, holidays2024));   // false

        // 祝日一覧を表示
        System.out.println("\\n2024年の祝日一覧:");
        holidays2024.stream().sorted()
                .forEach(d -> System.out.println("  " + d));
    }
}`,
    note: "Java 8 では Set.of() が使えないため、new HashSet<>(Arrays.asList(...)) でセットを初期化します。",
  },
  {
    label: "Java 17",
    code: `import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Set;

public class HolidayCheckSample {

    /**
     * 指定日が祝日かどうかを判定する
     */
    public static boolean isHoliday(LocalDate date, Set<LocalDate> holidays) {
        return holidays.contains(date);
    }

    /**
     * 指定日が休日（土曜・日曜・祝日）かどうかを判定する
     */
    public static boolean isNonWorkingDay(LocalDate date, Set<LocalDate> holidays) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            return true;
        }
        return isHoliday(date, holidays);
    }

    public static void main(String[] args) {

        // Java 9+ の Set.of() で簡潔に祝日データを初期化（イミュータブル）
        Set<LocalDate> holidays2024 = Set.of( // Java 9+
                LocalDate.of(2024, 1, 1),   // 元日
                LocalDate.of(2024, 1, 8),   // 成人の日
                LocalDate.of(2024, 2, 11),  // 建国記念の日
                LocalDate.of(2024, 2, 12),  // 振替休日
                LocalDate.of(2024, 2, 23),  // 天皇誕生日
                LocalDate.of(2024, 3, 20),  // 春分の日
                LocalDate.of(2024, 4, 29),  // 昭和の日
                LocalDate.of(2024, 5, 3),   // 憲法記念日
                LocalDate.of(2024, 5, 4),   // みどりの日
                LocalDate.of(2024, 5, 5),   // こどもの日
                LocalDate.of(2024, 5, 6),   // 振替休日
                LocalDate.of(2024, 7, 15),  // 海の日
                LocalDate.of(2024, 8, 11),  // 山の日
                LocalDate.of(2024, 8, 12),  // 振替休日
                LocalDate.of(2024, 9, 16),  // 敬老の日
                LocalDate.of(2024, 9, 22),  // 秋分の日
                LocalDate.of(2024, 10, 14), // スポーツの日
                LocalDate.of(2024, 11, 3),  // 文化の日
                LocalDate.of(2024, 11, 4),  // 振替休日
                LocalDate.of(2024, 11, 23)  // 勤労感謝の日
        );

        // 判定サンプル
        LocalDate holiday = LocalDate.of(2024, 1, 1);
        LocalDate weekday = LocalDate.of(2024, 1, 4);
        LocalDate saturday = LocalDate.of(2024, 1, 6);

        System.out.println(holiday + " 祝日: " + isHoliday(holiday, holidays2024));
        System.out.println(weekday + " 祝日: " + isHoliday(weekday, holidays2024));
        System.out.println(saturday + " 休日: " + isNonWorkingDay(saturday, holidays2024));
        System.out.println(weekday + " 休日: " + isNonWorkingDay(weekday, holidays2024));

        // Java 17: record で祝日情報を持つデータクラスを定義
        record Holiday(LocalDate date, String name) {} // Java 16+

        var newYear = new Holiday(LocalDate.of(2024, 1, 1), "元日");
        System.out.println("Holiday record: " + newYear.date() + " " + newYear.name());
    }
}`,
    note: "Java 9 以降は Set.of() で祝日データを1行で初期化できます。Set.of() はイミュータブルなため、年度ごとに新しい Set を作成するのが正しい使い方です。",
  },
  {
    label: "Java 21",
    code: `import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Set;

public class HolidayCheckSample {

    // Java 16+: record で祝日情報を表現
    record Holiday(LocalDate date, String name) {}

    /**
     * 指定日が祝日かどうかを判定する
     */
    public static boolean isHoliday(LocalDate date, Set<LocalDate> holidays) {
        return holidays.contains(date);
    }

    /**
     * 指定日が休日（土曜・日曜・祝日）かどうかを判定する
     */
    public static boolean isNonWorkingDay(LocalDate date, Set<LocalDate> holidays) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            return true;
        }
        return isHoliday(date, holidays);
    }

    public static void main(String[] args) {

        // Java 9+ の Set.of() で簡潔に祝日データを初期化
        Set<LocalDate> holidays2024 = Set.of(
                LocalDate.of(2024, 1, 1),   // 元日
                LocalDate.of(2024, 1, 8),   // 成人の日
                LocalDate.of(2024, 2, 11),  // 建国記念の日
                LocalDate.of(2024, 2, 12),  // 振替休日
                LocalDate.of(2024, 2, 23),  // 天皇誕生日
                LocalDate.of(2024, 3, 20),  // 春分の日
                LocalDate.of(2024, 4, 29),  // 昭和の日
                LocalDate.of(2024, 5, 3),   // 憲法記念日
                LocalDate.of(2024, 5, 4),   // みどりの日
                LocalDate.of(2024, 5, 5),   // こどもの日
                LocalDate.of(2024, 5, 6),   // 振替休日
                LocalDate.of(2024, 7, 15),  // 海の日
                LocalDate.of(2024, 8, 11),  // 山の日
                LocalDate.of(2024, 8, 12),  // 振替休日
                LocalDate.of(2024, 9, 16),  // 敬老の日
                LocalDate.of(2024, 9, 22),  // 秋分の日
                LocalDate.of(2024, 10, 14), // スポーツの日
                LocalDate.of(2024, 11, 3),  // 文化の日
                LocalDate.of(2024, 11, 4),  // 振替休日
                LocalDate.of(2024, 11, 23)  // 勤労感謝の日
        );

        // 判定サンプル
        LocalDate holiday = LocalDate.of(2024, 1, 1);
        LocalDate weekday = LocalDate.of(2024, 1, 4);
        LocalDate saturday = LocalDate.of(2024, 1, 6);

        System.out.println(holiday + " 祝日: " + isHoliday(holiday, holidays2024));
        System.out.println(weekday + " 祝日: " + isHoliday(weekday, holidays2024));
        System.out.println(saturday + " 休日: " + isNonWorkingDay(saturday, holidays2024));
        System.out.println(weekday + " 休日: " + isNonWorkingDay(weekday, holidays2024));

        // Java 21: record を使って祝日情報を保持する例
        var newYear = new Holiday(LocalDate.of(2024, 1, 1), "元日");
        System.out.println("Holiday: " + newYear.date() + " " + newYear.name());

        // Java 21: switch 式でその日の種別を判定する
        LocalDate checkDate = LocalDate.of(2024, 5, 3); // 憲法記念日
        String dayType = switch (checkDate.getDayOfWeek()) {
            case SATURDAY, SUNDAY -> "週末";
            default -> isHoliday(checkDate, holidays2024) ? "祝日" : "平日";
        };
        System.out.println(checkDate + ": " + dayType);
    }
}`,
    note: "Java 21 では switch 式でその日が週末・祝日・平日かを簡潔に判定できます。record を使うと祝日情報のデータクラスも簡潔に書けます。",
  },
];

export default function D04Page() {
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
        {" "}&rsaquo; D-04
      </p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--slate-800)" }}>
        D-04: 祝日判定（整形済みリスト方式）
      </h1>
      <p className="mb-8" style={{ color: "var(--slate-500)" }}>
        Javaの標準ライブラリには祝日データが含まれていません。このページでは、内閣府が公開するCSVをあらかじめ処理して{" "}
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>
          Set&lt;LocalDate&gt;
        </code>{" "}
        として持つ方式を解説します。次の D-05 営業日計算と組み合わせて使います。
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
          <li>注文の配達予定日計算で祝日を除外したいとき</li>
          <li>給与計算・勤怠管理で祝日を休日として扱いたいとき</li>
          <li>カレンダー表示で祝日をハイライトしたいとき</li>
          <li>D-05 営業日計算（N営業日後の計算）の前提データとして使うとき</li>
        </ul>

        <div className="mt-4 p-4 rounded-lg text-sm" style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
          <p className="font-semibold mb-2" style={{ color: "var(--slate-700)" }}>祝日データの取得方法</p>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--slate-200)" }}>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>方式</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>メリット</th>
                <th className="text-left py-1" style={{ color: "var(--slate-600)" }}>デメリット</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--slate-700)" }}>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4">ハードコード方式</td>
                <td className="py-1 pr-4">シンプル・外部依存なし</td>
                <td className="py-1">毎年手動更新が必要</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4">内閣府CSV読み込み</td>
                <td className="py-1 pr-4">公式データで正確</td>
                <td className="py-1">ファイル配置・更新が必要</td>
              </tr>
              <tr>
                <td className="py-1 pr-4">外部API連携</td>
                <td className="py-1 pr-4">自動更新</td>
                <td className="py-1">ネットワーク依存・障害リスク</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2" style={{ color: "var(--slate-500)" }}>
            このページでは最もシンプルなハードコード方式を例示します。本番環境では内閣府CSV（
            <code style={{ background: "var(--slate-100)", padding: "1px 4px", borderRadius: "3px" }}>syukujitsu.csv</code>
            ）を事前にパースして{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 4px", borderRadius: "3px" }}>Set&lt;LocalDate&gt;</code>{" "}
            に変換する方式を推奨します。
          </p>
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
        <VersionTabs tabs={tabs} filename="HolidayCheckSample.java" />
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
              ⚠️ Set.of() はイミュータブルなので後から追加できない
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              Java 9 以降の{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                Set.of()
              </code>{" "}
              で作成したセットに{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                add()
              </code>{" "}
              を呼ぶと{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                UnsupportedOperationException
              </code>{" "}
              が発生します。祝日データを動的に追加・変更する場合は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                new HashSet&lt;&gt;(Set.of(...))
              </code>{" "}
              でラップしてください。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ 振替休日を忘れずに登録する
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              祝日が日曜日にあたる場合、翌月曜日が振替休日になります。
              ハードコード方式では振替休日も漏れなく登録する必要があります。
              内閣府の CSV ファイルには振替休日も含まれているので、CSV 読み込み方式の方が安全です。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ List ではなく Set を使う
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              祝日の存在チェックには{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                List.contains()
              </code>{" "}
              でも動作しますが、O(n) の線形探索になります。
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                Set.contains()
              </code>{" "}
              は O(1) のハッシュ検索なので、多数の日付を判定する場合は Set を使いましょう。
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
          <li>祝日として登録した日付が{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>isHoliday()</code>{" "}
            で true を返すこと
          </li>
          <li>祝日でない平日が false を返すこと（境界値テスト：祝日の前日・翌日）</li>
          <li>土曜・日曜が{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>isNonWorkingDay()</code>{" "}
            で true を返すこと
          </li>
          <li>振替休日が正しく判定されること</li>
          <li>年をまたぐ日付で正しく動作すること（12/31 と 1/1 など）</li>
        </ul>
        <p className="mt-4 text-sm" style={{ color: "var(--slate-600)" }}>
          <a
            href="https://github.com/lylgamin/java-recipes/blob/main/java-samples/java8/src/main/java/HolidayCheckSample.java"
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
          href: "/dates/d03/",
          label: "D-03: 消費税計算（BigDecimal・端数処理）",
        }}
        next={{
          href: "/dates/d05/",
          label: "D-05: 営業日計算（祝日・土日除外、N営業日後）",
        }}
        related={[
          { href: "/dates/d05/", label: "D-05: 営業日計算" },
          { href: "/dates/d01/", label: "D-01: Date/LocalDate 相互変換" },
        ]}
      />
    </PageWrapper>
  );
}
