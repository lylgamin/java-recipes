import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "S-02: パディング・トリム・ゼロ埋め",
  description:
    "Java で文字列のパディング・ゼロ埋め・トリムを行う方法を Java 8 / 17 / 21 で解説。String.format の書式指定、trim() と strip() の違い（全角スペース対応）、固定長レコード出力への応用を紹介します。",
};

const stringsNavItems = [
  { href: "/strings/s01/", label: "S-01: null安全な文字列操作" },
  { href: "/strings/s02/", label: "S-02: パディング・トリム・ゼロ埋め" },
  { href: "/strings/s03/", label: "S-03: カンマ区切り・数値フォーマット" },
  { href: "/strings/s04/", label: "S-04: 正規表現（java.util.regex）" },
];

const tabs = [
  {
    label: "Java 8+",
    code: `public class PaddingTrimSample {

    public static void main(String[] args) {

        // ① ゼロ埋め（数値を固定桁数に揃える）
        int num = 42;
        String zeroPadded = String.format("%05d", num); // 5桁ゼロ埋め
        System.out.println("ゼロ埋め5桁: " + zeroPadded); // 00042

        // ② 右揃え・左揃えパディング（文字列）
        String name = "Java";
        String rightAlign = String.format("%10s", name);  // 右揃え10桁
        String leftAlign  = String.format("%-10s", name); // 左揃え10桁（- で左揃え）
        System.out.println("右揃え: [" + rightAlign + "]"); // [      Java]
        System.out.println("左揃え: [" + leftAlign  + "]"); // [Java      ]

        // ③ 固定長レコード出力（帳票・バッチ処理で頻出）
        String record = String.format("%-10s%10d円", "りんご", 1500);
        System.out.println("固定長: [" + record + "]"); // [りんご              1500円]

        // ④ trim()：先頭・末尾の ASCII 空白（半角スペース・タブ・改行）を除去
        String withSpaces = "  Java  ";
        System.out.println("trim(): [" + withSpaces.trim() + "]"); // [Java]

        // ⑤ trim() は全角スペース（U+3000）を除去しない点に注意
        String withFullWidth = "\\u3000Java\\u3000"; // 全角スペース
        System.out.println("trim()（全角）: [" + withFullWidth.trim() + "]"); // [　Java　]（除去されない！）

        // Java 8 で全角スペースも除去するには replace() を組み合わせる
        String trimmedFull = withFullWidth.replace("\\u3000", "").trim();
        System.out.println("replace後trim(): [" + trimmedFull + "]"); // [Java]

        // ⑥ 小数点桁数のフォーマット
        double pi = 3.14159265;
        System.out.println("小数2桁: " + String.format("%.2f", pi)); // 3.14
        System.out.println("計8桁小数2桁: " + String.format("%8.2f", pi)); // "    3.14"

        // ⑦ 手動ゼロ埋め（StringBuilder を使う方法）
        StringBuilder sb = new StringBuilder(String.valueOf(num));
        while (sb.length() < 5) {
            sb.insert(0, '0');
        }
        System.out.println("手動ゼロ埋め: " + sb.toString()); // 00042
    }
}`,
    note: "Java 8 では strip() が使えないため、全角スペースは replace() で事前に除去してから trim() を使います。",
  },
  {
    label: "Java 17",
    code: `public class PaddingTrimSample {

    public static void main(String[] args) {

        // ① ゼロ埋め
        int num = 42;
        System.out.println("ゼロ埋め5桁: " + String.format("%05d", num)); // 00042

        // ② 右揃え・左揃えパディング
        String name = "Java";
        System.out.println("右揃え: [" + String.format("%10s", name) + "]");  // [      Java]
        System.out.println("左揃え: [" + String.format("%-10s", name) + "]"); // [Java      ]

        // ③ 固定長レコード出力
        String record = String.format("%-10s%10d円", "りんご", 1500);
        System.out.println("固定長: [" + record + "]");

        // ④ trim()：ASCII空白のみ除去（Java 6+）
        System.out.println("trim(): [" + "  Java  ".trim() + "]"); // [Java]

        // ⑤ Java 11+: strip()：Unicode空白（全角スペースを含む）も除去
        String withFullWidth = "\\u3000Java\\u3000"; // 全角スペース
        System.out.println("trim()（全角）: [" + withFullWidth.trim() + "]");   // [　Java　]（除去されない）
        System.out.println("strip()（全角）: [" + withFullWidth.strip() + "]"); // [Java]（Java 11+）

        // ⑥ Java 11+: stripLeading() / stripTrailing()（片側だけ除去）
        String padded = "  Hello World  ";
        System.out.println("stripLeading():  [" + padded.stripLeading() + "]");  // [Hello World  ]
        System.out.println("stripTrailing(): [" + padded.stripTrailing() + "]"); // [  Hello World]

        // ⑦ 小数点フォーマット
        System.out.println("小数2桁: " + String.format("%.2f", 3.14159));

        // ⑧ Java 15+: テキストブロックでフォーマット文字列を整理できる
        String template = """
                %-10s %6.2f円
                """.strip();
        System.out.println(String.format(template, "バナナ", 150.0));
    }
}`,
    note: "Java 11 で追加された strip() は全角スペース・タブ等の Unicode 空白文字も除去します。新規開発では trim() より strip() を推奨します。",
  },
  {
    label: "Java 21",
    code: `public class PaddingTrimSample {

    public static void main(String[] args) {

        // ① ゼロ埋め
        int num = 42;
        System.out.println("ゼロ埋め5桁: " + String.format("%05d", num)); // 00042

        // ② 右揃え・左揃えパディング
        String name = "Java";
        System.out.println("右揃え: [" + String.format("%10s", name) + "]");
        System.out.println("左揃え: [" + String.format("%-10s", name) + "]");

        // ③ 固定長レコード出力
        System.out.println("固定長: [" + String.format("%-10s%10d円", "りんご", 1500) + "]");

        // ④ trim() vs strip()（全角スペースの扱いの違い）
        String withFullWidth = "\\u3000Java\\u3000";
        System.out.println("trim()（全角）: [" + withFullWidth.trim() + "]");   // 除去されない
        System.out.println("strip()（全角）: [" + withFullWidth.strip() + "]"); // Java 11+

        // ⑤ stripLeading() / stripTrailing()
        String padded = "  Hello World  ";
        System.out.println("stripLeading():  [" + padded.stripLeading() + "]");
        System.out.println("stripTrailing(): [" + padded.stripTrailing() + "]");

        // ⑥ Java 15+: formatted() メソッド（String.format の簡略形）
        String result = "%-10s %6.2f円".formatted("バナナ", 150.0); // Java 15+
        System.out.println(result);

        // ⑦ Java 11+: repeat() でゼロ埋め
        String numStr = String.valueOf(num);
        String zeroPadded = "0".repeat(Math.max(0, 5 - numStr.length())) + numStr;
        System.out.println("repeat でゼロ埋め: " + zeroPadded); // 00042

        // ⑧ 複数商品を固定長レコードに出力する例
        var items = new String[][]{
                {"apple",  "100"},
                {"banana", "150"},
                {"cherry", "200"}
        };
        for (var item : items) {
            System.out.println("%-10s%6s円".formatted(item[0], item[1]));
        }
    }
}`,
    note: "Java 15 の formatted() メソッドを使うと String.format() をメソッドチェーンで書けます。Java 21 では var で型宣言を簡潔にできます。",
  },
];

export default function S02Page() {
  return (
    <PageWrapper sidebar={<Sidebar navTitle="文字列" navItems={stringsNavItems} />}>
      <p className="text-sm mb-6" style={{ color: "var(--slate-500)" }}>
        <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">ホーム</Link>
        {" "}&rsaquo;{" "}
        <Link href="/strings/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">文字列</Link>
        {" "}&rsaquo; S-02
      </p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--slate-800)" }}>
        S-02: パディング・トリム・ゼロ埋め
      </h1>
      <p className="mb-8" style={{ color: "var(--slate-500)" }}>
        帳票出力やバッチ処理では、数値のゼロ埋めや文字列の桁揃えが必要になります。
        また、ユーザー入力の前後にある空白文字を除去する処理（トリム）も頻出です。
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>trim()</code>{" "}
        と{" "}
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>strip()</code>{" "}
        の違いを正しく理解しておきましょう。
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          いつ使うか
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>注文番号や社員番号を 6桁ゼロ埋め（「42」→「000042」）するとき</li>
          <li>CSVやバッチの固定長レコードで列幅を揃えて出力するとき</li>
          <li>フォーム入力の前後スペース・全角スペースを除去するとき</li>
          <li>金額・パーセンテージを小数点以下2桁に揃えて出力するとき</li>
        </ul>
        <div className="mt-4 p-4 rounded-lg text-sm" style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
          <p className="font-semibold mb-2" style={{ color: "var(--slate-700)" }}>trim() と strip() の違い</p>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--slate-200)" }}>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>メソッド</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>対応バージョン</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>半角スペース</th>
                <th className="text-left py-1" style={{ color: "var(--slate-600)" }}>全角スペース（U+3000）</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--slate-700)" }}>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">trim()</td>
                <td className="py-1 pr-4">Java 1.0+</td>
                <td className="py-1 pr-4">除去する</td>
                <td className="py-1">除去しない</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">strip()</td>
                <td className="py-1 pr-4">Java 11+</td>
                <td className="py-1 pr-4">除去する</td>
                <td className="py-1">除去する</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">stripLeading()</td>
                <td className="py-1 pr-4">Java 11+</td>
                <td className="py-1 pr-4">先頭のみ</td>
                <td className="py-1">先頭のみ</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-mono">stripTrailing()</td>
                <td className="py-1 pr-4">Java 11+</td>
                <td className="py-1 pr-4">末尾のみ</td>
                <td className="py-1">末尾のみ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          サンプルコード
        </h2>
        <VersionTabs tabs={tabs} filename="PaddingTrimSample.java" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          よくあるミス・注意点
        </h2>
        <div className="space-y-3 text-sm" style={{ color: "var(--slate-700)" }}>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ trim() は全角スペースを除去しない</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              日本語フォームでは全角スペース（　）が入力されることがあります。
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>trim()</code>{" "}
              は ASCII コード 32 以下の文字（半角スペース・タブ・改行）のみ除去するため、全角スペースは残ります。
              Java 11 以降は必ず{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>strip()</code>{" "}
              を使いましょう。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ String.format の書式文字 d と s を間違えない</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>%05d</code>{" "}
              は整数（int/long）用です。文字列に使うと{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>IllegalFormatConversionException</code>{" "}
              が発生します。文字列は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>%10s</code>
              （右揃え）や{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>%-10s</code>
              （左揃え）を使ってください。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ 全角文字は1文字で2桁分の幅を取ることがある</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>String.format("%-10s", "りんご")</code>{" "}
              は文字数ではなく Java の{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>char</code>{" "}
              単位でパディングを計算します。端末に表示するとき、全角文字は2桁分の幅を占めるため、見た目の桁数がずれる場合があります。帳票出力で厳密に揃えたい場合は表示幅を考慮した独自実装が必要です。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          テストする観点
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>数値 0 を5桁ゼロ埋めすると「00000」になること（境界値）</li>
          <li>桁数ちょうど（99999 など）の場合にパディングが付かないこと</li>
          <li>全角スペースが strip() で除去され、trim() では除去されないこと</li>
          <li>空文字列 {`""`} を trim() / strip() しても空文字列のままであること</li>
          <li>null を渡したときに NullPointerException が発生すること（バリデーション確認）</li>
        </ul>
        <p className="mt-4 text-sm" style={{ color: "var(--slate-600)" }}>
          <a
            href="https://github.com/lylgamin/java-recipes/blob/main/java-samples/java8/src/main/java/PaddingTrimSample.java"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--blue)" }}
          >
            GitHub でソースコードを見る →
          </a>
        </p>
      </section>

      <PageNav
        prev={{ href: "/strings/s01/", label: "S-01: null安全な文字列操作" }}
        next={{ href: "/strings/s03/", label: "S-03: カンマ区切り・数値フォーマット" }}
        related={[
          { href: "/strings/s01/", label: "S-01: null安全な文字列操作" },
          { href: "/strings/s03/", label: "S-03: カンマ区切り・数値フォーマット" },
        ]}
      />
    </PageWrapper>
  );
}
