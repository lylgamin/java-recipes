import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "S-01: null安全な文字列操作",
  description:
    "NullPointerException を防ぐ null安全な文字列操作を Java 8 / 17 / 21 で解説。Objects.toString()、Optional、isBlank() の使い方と使い分けを紹介します。",
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
    code: `import java.util.Objects;
import java.util.Optional;

public class NullSafeStringSample {

    public static void main(String[] args) {

        String nullStr = null;
        String emptyStr = "";
        String blankStr = "   ";

        // ① Objects.toString() でデフォルト値を指定（null の場合だけデフォルト値を返す）
        String result1 = Objects.toString(nullStr, "デフォルト値");
        System.out.println("Objects.toString(null): " + result1); // デフォルト値

        String result2 = Objects.toString("Hello", "デフォルト値");
        System.out.println("Objects.toString(\"Hello\"): " + result2); // Hello

        // ② null安全な equals（定数を左辺に置く）
        boolean equals1 = "target".equals(nullStr); // NullPointerException にならない
        System.out.println("\"target\".equals(null): " + equals1); // false

        // nullStr.equals("target") は NullPointerException が発生するため使ってはいけない

        // ③ null と空文字の両方をチェック（Java 8 の isEmpty）
        if (nullStr == null || nullStr.isEmpty()) {
            System.out.println("nullStr は null または空文字です");
        }

        // ④ isEmpty() では空白文字は検出できない点に注意
        System.out.println("emptyStr.isEmpty(): " + emptyStr.isEmpty()); // true
        System.out.println("blankStr.isEmpty(): " + blankStr.isEmpty()); // false（空白文字がある）

        // ⑤ Optional を使ったnull安全なチェーン処理
        String result3 = Optional.ofNullable(nullStr)
                .orElse("オプショナルのデフォルト");
        System.out.println("Optional.orElse: " + result3); // オプショナルのデフォルト

        // ⑥ Optional で map を使って変換（null の場合は変換をスキップ）
        String result4 = Optional.ofNullable(nullStr)
                .map(s -> s.toUpperCase())
                .orElse("null でした");
        System.out.println("Optional map(null): " + result4); // null でした

        String result5 = Optional.ofNullable("hello")
                .map(s -> s.toUpperCase())
                .orElse("null でした");
        System.out.println("Optional map(\"hello\"): " + result5); // HELLO
    }
}`,
    note: "Java 8 では isBlank() が使えないため、空白文字列のチェックには trim().isEmpty() を使います。",
  },
  {
    label: "Java 17",
    code: `import java.util.Objects;
import java.util.Optional;

public class NullSafeStringSample {

    public static void main(String[] args) {

        String nullStr = null;
        String emptyStr = "";
        String blankStr = "   ";

        // ① Objects.toString() でデフォルト値を指定
        String result1 = Objects.toString(nullStr, "デフォルト値");
        System.out.println("Objects.toString(null): " + result1); // デフォルト値

        // ② null安全な equals
        boolean equals1 = "target".equals(nullStr);
        System.out.println("\"target\".equals(null): " + equals1); // false

        // ③ Java 11+ の isBlank() で空白文字列も検出できる
        System.out.println("emptyStr.isBlank(): " + emptyStr.isBlank());   // true
        System.out.println("blankStr.isBlank(): " + blankStr.isBlank());   // true（Java 11+）
        System.out.println("\"hello\".isBlank(): " + "hello".isBlank());   // false

        // isEmpty() との違い: isBlank() はスペース・タブ・全角スペースも空とみなす
        System.out.println("blankStr.isEmpty(): " + blankStr.isEmpty());   // false

        // ④ null と空白文字の両方をチェック（Java 11+ 推奨パターン）
        if (nullStr == null || nullStr.isBlank()) {
            System.out.println("nullStr は null または空白文字列です");
        }

        // ⑤ Optional を使ったnull安全なチェーン処理
        String result2 = Optional.ofNullable(nullStr)
                .filter(s -> !s.isBlank()) // Java 11+: 空白文字列もフィルタ
                .orElse("空またはnullでした");
        System.out.println("Optional filter isBlank: " + result2);

        // ⑥ Optional で map を使って変換
        String result3 = Optional.ofNullable("hello")
                .map(String::toUpperCase)
                .orElse("null でした");
        System.out.println("Optional map(\"hello\"): " + result3); // HELLO
    }
}`,
    note: "Java 11 で追加された isBlank() は isEmpty() より強力で、スペースや全角スペースも空と判定します。新規開発では isBlank() を優先しましょう。",
  },
  {
    label: "Java 21",
    code: `import java.util.Objects;
import java.util.Optional;

public class NullSafeStringSample {

    public static void main(String[] args) {

        String nullStr = null;
        String emptyStr = "";
        String blankStr = "   ";

        // ① Objects.toString() でデフォルト値を指定
        String result1 = Objects.toString(nullStr, "デフォルト値");
        System.out.println("Objects.toString(null): " + result1); // デフォルト値

        // ② null安全な equals
        boolean equals1 = "target".equals(nullStr);
        System.out.println("\"target\".equals(null): " + equals1); // false

        // ③ Java 11+ の isBlank()
        System.out.println("blankStr.isBlank(): " + blankStr.isBlank()); // true

        // ④ Java 21: switch 式で null を直接扱える（パターンマッチング）
        String value = null;
        String checked = switch (value) { // Java 21: null ケースを switch で記述できる
            case null -> "null でした";
            case String s when s.isBlank() -> "空白文字列でした";
            default -> value.toUpperCase();
        };
        System.out.println("switch で null チェック: " + checked); // null でした

        // ⑤ 空文字の場合も確認
        String empty = "";
        String checkedEmpty = switch (empty) {
            case null -> "null でした";
            case String s when s.isBlank() -> "空白文字列でした";
            default -> empty.toUpperCase();
        };
        System.out.println("switch で空文字チェック: " + checkedEmpty); // 空白文字列でした

        // ⑥ Optional を使ったnull安全なチェーン処理
        String result2 = Optional.ofNullable("hello")
                .map(String::toUpperCase)
                .orElse("null でした");
        System.out.println("Optional map(\"hello\"): " + result2); // HELLO
    }
}`,
    note: "Java 21 では switch 式で null ケースを直接記述できるようになりました。Optional と使い分けることで、コードをさらに簡潔に書けます。",
  },
];

export default function S01Page() {
  return (
    <PageWrapper
      sidebar={
        <Sidebar
          navTitle="文字列"
          navItems={stringsNavItems}
        />
      }
    >
      {/* パンくず */}
      <p className="text-sm mb-6" style={{ color: "var(--slate-500)" }}>
        <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">
          ホーム
        </Link>
        {" "}&rsaquo;{" "}
        <Link href="/strings/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">
          文字列
        </Link>
        {" "}&rsaquo; S-01
      </p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--slate-800)" }}>
        S-01: null安全な文字列操作
      </h1>
      <p className="mb-8" style={{ color: "var(--slate-500)" }}>
        Java プログラムで最も多い実行時エラーの1つが{" "}
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>
          NullPointerException
        </code>
        （NPE）です。文字列を安全に扱うパターンを身につけて、NPE を事前に防ぎましょう。
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
          <li>データベースや外部APIから取得した値が null になりうるとき</li>
          <li>フォームの入力値が空欄（null または空文字）の場合にデフォルト値を使いたいとき</li>
          <li>メソッドの引数に null が渡される可能性があるとき</li>
          <li>文字列比較で NPE が発生しないようにしたいとき</li>
        </ul>

        <div className="mt-4 p-4 rounded-lg text-sm" style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
          <p className="font-semibold mb-2" style={{ color: "var(--slate-700)" }}>isEmpty() と isBlank() の違い</p>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--slate-200)" }}>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>メソッド</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>対応バージョン</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>空文字 &quot;&quot;</th>
                <th className="text-left py-1" style={{ color: "var(--slate-600)" }}>空白のみ &quot;   &quot;</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--slate-700)" }}>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4 font-mono">isEmpty()</td>
                <td className="py-1 pr-4">Java 6+</td>
                <td className="py-1 pr-4">true</td>
                <td className="py-1">false</td>
              </tr>
              <tr>
                <td className="py-1 pr-4 font-mono">isBlank()</td>
                <td className="py-1 pr-4">Java 11+</td>
                <td className="py-1 pr-4">true</td>
                <td className="py-1">true</td>
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
        <VersionTabs tabs={tabs} filename="NullSafeStringSample.java" />
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
              ⚠️ 変数を左辺にして equals() を呼ぶと NPE が発生する
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                str.equals("target")
              </code>{" "}
              は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                str
              </code>{" "}
              が null のとき NPE が発生します。定数やリテラルを左辺に置いた{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                "target".equals(str)
              </code>{" "}
              に書き換えましょう。2つの変数を比較する場合は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                Objects.equals(str1, str2)
              </code>{" "}
              を使うと両方が null でも安全です。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ isBlank() は Java 11+ でしか使えない
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                isBlank()
              </code>{" "}
              は Java 11 で追加されたメソッドです。Java 8 環境では{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                str.trim().isEmpty()
              </code>{" "}
              で代用できますが、trim() は ASCII 空白（半角スペース・タブ）のみを除去します。全角スペースも除去したい場合は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                str.strip().isEmpty()
              </code>
              （Java 11+）を使いましょう。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ null に対して isBlank() を呼ぶと NPE が発生する
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                str.isBlank()
              </code>{" "}
              は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                str
              </code>{" "}
              が null のとき NPE が発生します。必ず{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                str == null || str.isBlank()
              </code>{" "}
              のように先に null チェックを行ってから呼び出してください。
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
          <li>null を渡したとき NPE が発生せずデフォルト値が返ること</li>
          <li>空文字{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>{`""`}</code>{" "}
            を渡したときの動作（null と同じ扱いをするかどうか仕様を確認する）
          </li>
          <li>空白のみの文字列{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>{`"   "`}</code>{" "}
            を渡したときの動作（isBlank() を使っているか確認する）
          </li>
          <li>正常な文字列が渡されたときにそのまま処理されること</li>
          <li>
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>equals()</code>{" "}
            の比較で null が渡されても NPE が発生しないこと
          </li>
        </ul>
        <p className="mt-4 text-sm" style={{ color: "var(--slate-600)" }}>
          <a
            href="https://github.com/lylgamin/java-recipes/blob/main/java-samples/java8/src/main/java/NullSafeStringSample.java"
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
        prev={undefined}
        next={{
          href: "/strings/s02/",
          label: "S-02: パディング・トリム・ゼロ埋め",
        }}
        related={[
          { href: "/strings/s02/", label: "S-02: パディング・トリム・ゼロ埋め" },
          { href: "/strings/s04/", label: "S-04: 正規表現（java.util.regex）" },
        ]}
      />
    </PageWrapper>
  );
}
