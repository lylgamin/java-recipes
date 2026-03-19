import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "D-03: 消費税計算（BigDecimal・端数処理）",
  description:
    "消費税計算で必須の BigDecimal の使い方を Java 8 / 17 / 21 で解説。double の浮動小数点誤差、ROUND_DOWN/HALF_UP、軽減税率8%と標準税率10%の判定ロジックを紹介します。",
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
    code: `import java.math.BigDecimal;
import java.math.RoundingMode;

public class TaxCalculationSample {

    // 標準税率 10%（文字列コンストラクタを使うこと！）
    private static final BigDecimal STANDARD_RATE = new BigDecimal("0.10");
    // 軽減税率 8%（食料品・新聞など）
    private static final BigDecimal REDUCED_RATE = new BigDecimal("0.08");

    public static void main(String[] args) {

        // ① double の浮動小数点誤差の例（使ってはいけないパターン）
        double d1 = 0.1 + 0.2;
        System.out.println("0.1 + 0.2 = " + d1); // 0.30000000000000004 になる！

        double priceDouble = 1000.0;
        double taxDouble = priceDouble * 0.10;
        System.out.println("double で税計算: " + taxDouble); // 100.00000000000001 になることがある

        // ② BigDecimal で正確な計算（文字列コンストラクタを使うこと）
        BigDecimal price = new BigDecimal("1000");

        // 標準税率 10% の税込み計算（切り捨て）
        BigDecimal taxStandard = price.multiply(STANDARD_RATE)
                .setScale(0, RoundingMode.DOWN);
        BigDecimal totalStandard = price.add(taxStandard);
        System.out.println("1000円（10%）税額: " + taxStandard + "円、税込: " + totalStandard + "円");

        // 軽減税率 8% の税込み計算（切り捨て）
        BigDecimal taxReduced = price.multiply(REDUCED_RATE)
                .setScale(0, RoundingMode.DOWN);
        BigDecimal totalReduced = price.add(taxReduced);
        System.out.println("1000円（8%）税額: " + taxReduced + "円、税込: " + totalReduced + "円");

        // ③ 端数処理のバリエーション（1080円の10%税 = 108.0円）
        BigDecimal price2 = new BigDecimal("1080");
        BigDecimal tax2 = price2.multiply(STANDARD_RATE); // 108.0

        BigDecimal roundDown   = tax2.setScale(0, RoundingMode.DOWN);    // 切り捨て: 108
        BigDecimal roundUp     = tax2.setScale(0, RoundingMode.UP);      // 切り上げ: 108
        BigDecimal roundHalfUp = tax2.setScale(0, RoundingMode.HALF_UP); // 四捨五入: 108
        System.out.println("税額 " + tax2 + " の端数処理:");
        System.out.println("  切り捨て(DOWN):     " + roundDown);
        System.out.println("  切り上げ(UP):       " + roundUp);
        System.out.println("  四捨五入(HALF_UP):  " + roundHalfUp);

        // ④ 税込み → 税抜き（逆算）
        BigDecimal taxIncluded = new BigDecimal("1100");
        BigDecimal divisor = BigDecimal.ONE.add(STANDARD_RATE); // 1.10
        BigDecimal priceExcluded = taxIncluded.divide(divisor, 0, RoundingMode.DOWN);
        System.out.println("税込 1100円 → 税抜: " + priceExcluded + "円");
    }
}`,
    note: "BigDecimal のコンストラクタには必ず文字列を渡してください。new BigDecimal(0.1) は内部的に浮動小数点誤差を引き継いでしまいます。",
  },
  {
    label: "Java 17",
    code: `import java.math.BigDecimal;
import java.math.RoundingMode;

public class TaxCalculationSample {

    private static final BigDecimal STANDARD_RATE = new BigDecimal("0.10");
    private static final BigDecimal REDUCED_RATE = new BigDecimal("0.08");

    /**
     * 税込み金額を計算する（端数は切り捨て）
     */
    public static BigDecimal calcTaxIncluded(BigDecimal price, BigDecimal taxRate) {
        BigDecimal tax = price.multiply(taxRate).setScale(0, RoundingMode.DOWN);
        return price.add(tax);
    }

    public static void main(String[] args) {

        // ① double の浮動小数点誤差の例
        System.out.println("0.1 + 0.2 = " + (0.1 + 0.2)); // 0.30000000000000004

        // ② BigDecimal で正確な計算
        BigDecimal price = new BigDecimal("1000");
        System.out.println("1000円（10%）税込: " + calcTaxIncluded(price, STANDARD_RATE) + "円");
        System.out.println("1000円（8%）税込: " + calcTaxIncluded(price, REDUCED_RATE) + "円");

        // ③ 端数処理のバリエーション
        BigDecimal price2 = new BigDecimal("1080");
        BigDecimal tax2 = price2.multiply(STANDARD_RATE); // 108.0
        System.out.println("税額 " + tax2 + " の端数処理:");
        System.out.println("  切り捨て(DOWN):     " + tax2.setScale(0, RoundingMode.DOWN));
        System.out.println("  切り上げ(UP):       " + tax2.setScale(0, RoundingMode.UP));
        System.out.println("  四捨五入(HALF_UP):  " + tax2.setScale(0, RoundingMode.HALF_UP));

        // ④ 税込み → 税抜き（逆算）
        BigDecimal taxIncluded = new BigDecimal("1100");
        BigDecimal divisor = BigDecimal.ONE.add(STANDARD_RATE);
        BigDecimal priceExcluded = taxIncluded.divide(divisor, 0, RoundingMode.DOWN);
        System.out.println("税込 1100円 → 税抜: " + priceExcluded + "円");

        // ⑤ Java 17: switch 式で税率を切り替える（Java 14+）
        String itemType = "food";
        BigDecimal rate = switch (itemType) {
            case "food", "newspaper" -> REDUCED_RATE; // 軽減税率 8%
            default -> STANDARD_RATE;                 // 標準税率 10%
        };
        System.out.println("'" + itemType + "' の税率: " + rate);
        System.out.println("税込: " + calcTaxIncluded(new BigDecimal("300"), rate) + "円");
    }
}`,
    note: "Java 14 以降の switch 式を使うと、軽減税率・標準税率の切り替えをすっきり書けます。",
  },
  {
    label: "Java 21",
    code: `import java.math.BigDecimal;
import java.math.RoundingMode;

public class TaxCalculationSample {

    private static final BigDecimal STANDARD_RATE = new BigDecimal("0.10");
    private static final BigDecimal REDUCED_RATE = new BigDecimal("0.08");

    // Java 16+: record で商品情報を表現
    record Item(String name, BigDecimal price, boolean isReducedTax) {}

    public static BigDecimal calcTaxIncluded(BigDecimal price, BigDecimal taxRate) {
        BigDecimal tax = price.multiply(taxRate).setScale(0, RoundingMode.DOWN);
        return price.add(tax);
    }

    public static BigDecimal getTaxRate(Item item) {
        return item.isReducedTax() ? REDUCED_RATE : STANDARD_RATE;
    }

    public static void main(String[] args) {

        // ① double の浮動小数点誤差の例
        System.out.println("0.1 + 0.2 = " + (0.1 + 0.2)); // 0.30000000000000004

        // ② BigDecimal で正確な計算
        BigDecimal price = new BigDecimal("1000");
        System.out.println("1000円（10%）税込: " + calcTaxIncluded(price, STANDARD_RATE) + "円");
        System.out.println("1000円（8%）税込: " + calcTaxIncluded(price, REDUCED_RATE) + "円");

        // ③ 端数処理のバリエーション
        BigDecimal price2 = new BigDecimal("1080");
        BigDecimal tax2 = price2.multiply(STANDARD_RATE);
        System.out.println("税額 " + tax2 + " の端数処理:");
        System.out.println("  切り捨て(DOWN):     " + tax2.setScale(0, RoundingMode.DOWN));
        System.out.println("  切り上げ(UP):       " + tax2.setScale(0, RoundingMode.UP));
        System.out.println("  四捨五入(HALF_UP):  " + tax2.setScale(0, RoundingMode.HALF_UP));

        // ④ 税込み → 税抜き（逆算）
        BigDecimal taxIncluded = new BigDecimal("1100");
        BigDecimal priceExcluded = taxIncluded.divide(
                BigDecimal.ONE.add(STANDARD_RATE), 0, RoundingMode.DOWN);
        System.out.println("税込 1100円 → 税抜: " + priceExcluded + "円");

        // ⑤ Java 21: record + switch 式で商品ごとの税込み金額を計算
        var items = new Item[]{
                new Item("牛乳", new BigDecimal("200"), true),   // 軽減税率 8%
                new Item("ビール", new BigDecimal("300"), false), // 標準税率 10%
                new Item("新聞", new BigDecimal("150"), true)    // 軽減税率 8%
        };

        for (Item item : items) {
            BigDecimal rate = getTaxRate(item);
            BigDecimal total = calcTaxIncluded(item.price(), rate);
            System.out.println(item.name() + ": 税込 " + total + "円");
        }
    }
}`,
    note: "Java 16 の record を使うと、商品情報をシンプルなデータクラスとして表現できます。record はコンストラクタ・getter・equals・hashCode・toString を自動生成します。",
  },
];

export default function D03Page() {
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
        {" "}&rsaquo; D-03
      </p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--slate-800)" }}>
        D-03: 消費税計算（BigDecimal・端数処理）
      </h1>
      <p className="mb-8" style={{ color: "var(--slate-500)" }}>
        金額計算には{" "}
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>
          double
        </code>{" "}
        ではなく{" "}
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>
          BigDecimal
        </code>{" "}
        を使うことが必須です。浮動小数点誤差の問題と、消費税計算で必要な端数処理（切り捨て・切り上げ・四捨五入）を解説します。
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
          <li>ECサイトの商品金額・消費税計算</li>
          <li>給与計算・社会保険料の端数処理</li>
          <li>外貨両替・為替レート計算</li>
          <li>税込み価格から税抜き価格の逆算</li>
        </ul>

        <div className="mt-4 p-4 rounded-lg text-sm" style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
          <p className="font-semibold mb-2" style={{ color: "var(--slate-700)" }}>端数処理の種類</p>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--slate-200)" }}>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>定数名</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>処理内容</th>
                <th className="text-left py-1" style={{ color: "var(--slate-600)" }}>108.4 の場合</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--slate-700)" }}>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">RoundingMode.DOWN</td>
                <td className="py-1 pr-4">切り捨て（消費税に多い）</td>
                <td className="py-1">108</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">RoundingMode.UP</td>
                <td className="py-1 pr-4">切り上げ</td>
                <td className="py-1">109</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-mono">RoundingMode.HALF_UP</td>
                <td className="py-1 pr-4">四捨五入</td>
                <td className="py-1">108</td>
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
        <VersionTabs tabs={tabs} filename="TaxCalculationSample.java" />
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
              ⚠️ double や float で金額計算をしてはいけない
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                0.1 + 0.2
              </code>{" "}
              は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                0.30000000000000004
              </code>{" "}
              になります。これは{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                double
              </code>{" "}
              が2進数で小数を表現するために生じる誤差です。金額・消費税・割引率など、正確な小数計算が必要な場面では必ず{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                BigDecimal
              </code>{" "}
              を使いましょう。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ new BigDecimal(0.1) も誤差がある
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                new BigDecimal(0.1)
              </code>{" "}
              は double の浮動小数点誤差をそのまま引き継いでしまいます。必ず文字列を使った{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                new BigDecimal("0.1")
              </code>{" "}
              か{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                BigDecimal.valueOf(0.1)
              </code>{" "}
              を使ってください。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ divide() は端数処理の指定が必要
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                bigDecimal.divide(other)
              </code>{" "}
              で割り切れない場合、{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                ArithmeticException
              </code>{" "}
              が発生します。必ず{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                divide(other, scale, RoundingMode)
              </code>{" "}
              のように桁数と端数処理を指定してください。
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
          <li>税率10%の計算結果が正しいこと（1000円 → 税額100円、税込1100円）</li>
          <li>税率8%の計算結果が正しいこと（1000円 → 税額80円、税込1080円）</li>
          <li>端数が発生する金額での切り捨て結果が正しいこと（例：1円以下を切り捨て）</li>
          <li>税込み → 税抜きの逆算が正しいこと（1100円 → 1000円）</li>
          <li>0円の場合に正しく0円が返ること（境界値テスト）</li>
          <li>
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>
              null
            </code>{" "}
            や負数を渡した場合の動作（バリデーション確認）
          </li>
        </ul>
        <p className="mt-4 text-sm" style={{ color: "var(--slate-600)" }}>
          <a
            href="https://github.com/lylgamin/java-recipes/blob/main/java-samples/java8/src/main/java/TaxCalculationSample.java"
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
          href: "/dates/d02/",
          label: "D-02: 日付フォーマット（SimpleDateFormat vs DateTimeFormatter）",
        }}
        next={{
          href: "/dates/d04/",
          label: "D-04: 祝日判定（整形済みリスト方式）",
        }}
        related={[
          { href: "/dates/d04/", label: "D-04: 祝日判定" },
          { href: "/dates/d05/", label: "D-05: 営業日計算" },
        ]}
      />
    </PageWrapper>
  );
}
