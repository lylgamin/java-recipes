import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "D-05: 営業日計算（祝日・土日除外、N営業日後）",
  description:
    "Java で営業日を計算する方法を Java 8 / 17 / 21 で解説。N営業日後・月の第N営業日・月末営業日の3パターンを実装。D-04 の祝日セットと組み合わせて使います。",
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
import java.time.YearMonth;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class BusinessDaySample {

    /** 営業日（平日かつ祝日でない）かどうかを判定する */
    public static boolean isBusinessDay(LocalDate date, Set<LocalDate> holidays) {
        DayOfWeek dow = date.getDayOfWeek();
        if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
            return false;
        }
        return !holidays.contains(date);
    }

    /** N営業日後の日付を返す */
    public static LocalDate addBusinessDays(LocalDate from, int n, Set<LocalDate> holidays) {
        LocalDate date = from;
        int count = 0;
        while (count < n) {
            date = date.plusDays(1);
            if (isBusinessDay(date, holidays)) {
                count++;
            }
        }
        return date;
    }

    /** 月の第N営業日を返す */
    public static LocalDate nthBusinessDayOfMonth(
            YearMonth yearMonth, int n, Set<LocalDate> holidays) {
        LocalDate date = yearMonth.atDay(1);
        int count = 0;
        while (true) {
            if (isBusinessDay(date, holidays)) {
                count++;
                if (count == n) {
                    return date;
                }
            }
            date = date.plusDays(1);
        }
    }

    /** 月末営業日を返す */
    public static LocalDate lastBusinessDayOfMonth(
            YearMonth yearMonth, Set<LocalDate> holidays) {
        LocalDate date = yearMonth.atEndOfMonth();
        while (!isBusinessDay(date, holidays)) {
            date = date.minusDays(1);
        }
        return date;
    }

    public static void main(String[] args) {

        // Java 8: Arrays.asList() でセットを作成
        Set<LocalDate> holidays2024 = new HashSet<>(Arrays.asList(
                LocalDate.of(2024, 4, 29), // 昭和の日
                LocalDate.of(2024, 5, 3),  // 憲法記念日
                LocalDate.of(2024, 5, 4),  // みどりの日
                LocalDate.of(2024, 5, 5),  // こどもの日
                LocalDate.of(2024, 5, 6),  // 振替休日
                LocalDate.of(2024, 11, 3), // 文化の日
                LocalDate.of(2024, 11, 4)  // 振替休日
                // ... 実際は全祝日を登録
        ));

        // ① 3営業日後（4/26金曜 → GW と祝日をスキップ → 5/2木曜）
        LocalDate base = LocalDate.of(2024, 4, 26);
        System.out.println(base + " の3営業日後: " + addBusinessDays(base, 3, holidays2024));

        // ② 2024年5月の第1営業日
        LocalDate first = nthBusinessDayOfMonth(YearMonth.of(2024, 5), 1, holidays2024);
        System.out.println("2024年5月の第1営業日: " + first); // 5/2（5/1は水曜・通常営業日）

        // ③ 2024年11月の月末営業日（11/30は土曜 → 11/29金曜）
        LocalDate last = lastBusinessDayOfMonth(YearMonth.of(2024, 11), holidays2024);
        System.out.println("2024年11月の月末営業日: " + last);
    }
}`,
    note: "Java 8 では while ループで1日ずつ進める実装が基本です。シンプルで読みやすく、初学者にも理解しやすいコードです。",
  },
  {
    label: "Java 17",
    code: `import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Set;
import java.util.stream.Stream;

public class BusinessDaySample {

    public static boolean isBusinessDay(LocalDate date, Set<LocalDate> holidays) {
        DayOfWeek dow = date.getDayOfWeek();
        if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
            return false;
        }
        return !holidays.contains(date);
    }

    /** N営業日後（Java 9+: Stream.iterate で無限日付列を生成） */
    public static LocalDate addBusinessDays(LocalDate from, int n, Set<LocalDate> holidays) {
        return Stream.iterate(from.plusDays(1), d -> d.plusDays(1))
                .filter(d -> isBusinessDay(d, holidays))
                .limit(n)                        // 営業日を n 個取り出す
                .reduce((first, last) -> last)   // 最後の要素（= N営業日後）を取得
                .orElseThrow();
    }

    /** 月の第N営業日（Java 9+: LocalDate.datesUntil() で月内の全日付を Stream 化） */
    public static LocalDate nthBusinessDayOfMonth(
            YearMonth yearMonth, int n, Set<LocalDate> holidays) {
        return yearMonth.atDay(1)
                .datesUntil(yearMonth.atEndOfMonth().plusDays(1)) // Java 9+
                .filter(d -> isBusinessDay(d, holidays))
                .skip(n - 1)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        yearMonth + " に第" + n + "営業日が存在しません"));
    }

    /** 月末営業日（Stream.iterate で末日から遡る） */
    public static LocalDate lastBusinessDayOfMonth(
            YearMonth yearMonth, Set<LocalDate> holidays) {
        return Stream.iterate(yearMonth.atEndOfMonth(), d -> d.minusDays(1))
                .filter(d -> isBusinessDay(d, holidays))
                .findFirst()
                .orElseThrow();
    }

    public static void main(String[] args) {

        Set<LocalDate> holidays2024 = Set.of( // Java 9+
                LocalDate.of(2024, 4, 29),
                LocalDate.of(2024, 5, 3),
                LocalDate.of(2024, 5, 4),
                LocalDate.of(2024, 5, 5),
                LocalDate.of(2024, 5, 6),
                LocalDate.of(2024, 11, 3),
                LocalDate.of(2024, 11, 4)
        );

        LocalDate base = LocalDate.of(2024, 4, 26);
        System.out.println(base + " の3営業日後: " + addBusinessDays(base, 3, holidays2024));
        System.out.println("2024年5月の第1営業日: "
                + nthBusinessDayOfMonth(YearMonth.of(2024, 5), 1, holidays2024));
        System.out.println("2024年11月の月末営業日: "
                + lastBusinessDayOfMonth(YearMonth.of(2024, 11), holidays2024));
    }
}`,
    note: "Java 9 以降は Stream.iterate() と datesUntil() を使ってループを排除し、宣言的なコードで書けます。",
  },
  {
    label: "Java 21",
    code: `import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Set;
import java.util.stream.Stream;

public class BusinessDaySample {

    public static boolean isBusinessDay(LocalDate date, Set<LocalDate> holidays) {
        DayOfWeek dow = date.getDayOfWeek();
        if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
            return false;
        }
        return !holidays.contains(date);
    }

    public static LocalDate addBusinessDays(LocalDate from, int n, Set<LocalDate> holidays) {
        return Stream.iterate(from.plusDays(1), d -> d.plusDays(1))
                .filter(d -> isBusinessDay(d, holidays))
                .limit(n)
                .reduce((first, last) -> last)
                .orElseThrow();
    }

    public static LocalDate nthBusinessDayOfMonth(
            YearMonth yearMonth, int n, Set<LocalDate> holidays) {
        return yearMonth.atDay(1)
                .datesUntil(yearMonth.atEndOfMonth().plusDays(1))
                .filter(d -> isBusinessDay(d, holidays))
                .skip(n - 1)
                .findFirst()
                .orElseThrow();
    }

    public static LocalDate lastBusinessDayOfMonth(
            YearMonth yearMonth, Set<LocalDate> holidays) {
        return Stream.iterate(yearMonth.atEndOfMonth(), d -> d.minusDays(1))
                .filter(d -> isBusinessDay(d, holidays))
                .findFirst()
                .orElseThrow();
    }

    public static void main(String[] args) {

        Set<LocalDate> holidays2024 = Set.of(
                LocalDate.of(2024, 4, 29),
                LocalDate.of(2024, 5, 3),
                LocalDate.of(2024, 5, 4),
                LocalDate.of(2024, 5, 5),
                LocalDate.of(2024, 5, 6),
                LocalDate.of(2024, 11, 3),
                LocalDate.of(2024, 11, 4)
        );

        LocalDate base = LocalDate.of(2024, 4, 26);
        System.out.println(base + " の3営業日後: " + addBusinessDays(base, 3, holidays2024));
        System.out.println("2024年5月の第1営業日: "
                + nthBusinessDayOfMonth(YearMonth.of(2024, 5), 1, holidays2024));
        System.out.println("2024年11月の月末営業日: "
                + lastBusinessDayOfMonth(YearMonth.of(2024, 11), holidays2024));

        // Java 21: switch 式で日付の種別を判定
        LocalDate check = LocalDate.of(2024, 5, 3);
        String dayType = switch (check.getDayOfWeek()) {
            case SATURDAY, SUNDAY -> "週末";
            default -> holidays2024.contains(check) ? "祝日" : "営業日";
        };
        System.out.println(check + ": " + dayType); // 祝日

        // 2024年4月の営業日数をカウント
        YearMonth apr = YearMonth.of(2024, 4);
        long bizDays = apr.atDay(1)
                .datesUntil(apr.atEndOfMonth().plusDays(1))
                .filter(d -> isBusinessDay(d, holidays2024))
                .count();
        System.out.println("2024年4月の営業日数: " + bizDays);
    }
}`,
    note: "Java 21 では switch 式と Stream API を組み合わせることで、日付の種別判定から集計まで簡潔に書けます。",
  },
];

export default function D05Page() {
  return (
    <PageWrapper sidebar={<Sidebar navTitle="日付・時刻" navItems={dateNavItems} />}>
      <p className="text-sm mb-6" style={{ color: "var(--slate-500)" }}>
        <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">ホーム</Link>
        {" "}&rsaquo;{" "}
        <Link href="/dates/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">日付・時刻</Link>
        {" "}&rsaquo; D-05
      </p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--slate-800)" }}>
        D-05: 営業日計算（祝日・土日除外、N営業日後）
      </h1>
      <p className="mb-8" style={{ color: "var(--slate-500)" }}>
        「3営業日後」「月末営業日」など、土日と祝日を除いた日付計算は業務システムで頻出です。
        D-04 で作成した{" "}
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>Set&lt;LocalDate&gt;</code>{" "}
        の祝日セットと組み合わせて3つのパターンを実装します。
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          いつ使うか
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>EC サイトで「注文から3営業日後に発送」の予定日を計算するとき</li>
          <li>請求書の支払期限（月末営業日）を自動計算するとき</li>
          <li>給与振込日（月の第〇営業日）を計算するとき</li>
          <li>カレンダーに営業日のみハイライト表示するとき</li>
        </ul>
        <div className="mt-4 p-4 rounded-lg text-sm" style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
          <p className="font-semibold mb-2" style={{ color: "var(--slate-700)" }}>実装する3パターン</p>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--slate-200)" }}>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>メソッド</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>用途例</th>
                <th className="text-left py-1" style={{ color: "var(--slate-600)" }}>Java 8 / 17+ の違い</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--slate-700)" }}>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono text-xs">addBusinessDays(from, n)</td>
                <td className="py-1 pr-4">発送予定日・支払期限</td>
                <td className="py-1">while → Stream.iterate</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono text-xs">nthBusinessDayOfMonth(ym, n)</td>
                <td className="py-1 pr-4">給与振込日</td>
                <td className="py-1">while → datesUntil</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-mono text-xs">lastBusinessDayOfMonth(ym)</td>
                <td className="py-1 pr-4">月末締め・月末払い</td>
                <td className="py-1">while → Stream.iterate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          サンプルコード
        </h2>
        <VersionTabs tabs={tabs} filename="BusinessDaySample.java" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          よくあるミス・注意点
        </h2>
        <div className="space-y-3 text-sm" style={{ color: "var(--slate-700)" }}>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ 起算日（from）自体は含まない</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>addBusinessDays(from, 1, holidays)</code>{" "}
              は「from の翌営業日」を返します。from が営業日であっても、from 自体はカウントに含みません。
              「当日を含めてカウントする」仕様が必要な場合は、from を対象に含むよう実装を変更してください。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ 祝日データが不完全だと計算結果が変わる</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              振替休日を祝日セットに登録し忘れると、実際には休日の日が営業日と判定されてしまいます。
              D-04 で解説した通り、内閣府CSVを使う方式だと振替休日も含まれるため安全です。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ Stream.iterate は無限ストリームなので limit() を忘れずに</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              Java 17 の実装で使っている{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>Stream.iterate()</code>{" "}
              は無限に日付を生成し続けます。
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>filter()</code>{" "}
              だけでは終端にならないため、必ず{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>limit()</code>{" "}
              や{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>findFirst()</code>{" "}
              で終端操作を行ってください。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          テストする観点
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>N=1 のとき、翌営業日が返ること（from が金曜なら月曜）</li>
          <li>GW や年末年始をまたぐ N 営業日後の計算が正しいこと</li>
          <li>月末が土曜・日曜・祝日のとき、月末営業日が正しく手前の営業日になること</li>
          <li>第1営業日が月初ではなく数日後になる月（祝日連続）でも正しく動作すること</li>
          <li>n=0 や負数を渡したときの動作（IllegalArgumentException を期待するか確認）</li>
        </ul>
        <p className="mt-4 text-sm" style={{ color: "var(--slate-600)" }}>
          <a
            href="https://github.com/lylgamin/java-recipes/blob/main/java-samples/java8/src/main/java/BusinessDaySample.java"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--blue)" }}
          >
            GitHub でソースコードを見る →
          </a>
        </p>
      </section>

      <PageNav
        prev={{ href: "/dates/d04/", label: "D-04: 祝日判定（整形済みリスト方式）" }}
        next={{ href: "/dates/d06/", label: "D-06: 元号変換（和暦↔西暦）" }}
        related={[
          { href: "/dates/d04/", label: "D-04: 祝日判定" },
          { href: "/dates/d07/", label: "D-07: タイムゾーン処理" },
        ]}
      />
    </PageWrapper>
  );
}
