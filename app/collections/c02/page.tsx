import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "C-02: Stream API 実用パターン",
  description:
    "Java の Stream API を Java 8 / 17 / 21 で解説。filter・map・flatMap・distinct・sorted の基本操作から、groupingBy・joining・averagingInt などの Collectors まで実用パターンを網羅します。",
};

const collectionsNavItems = [
  { href: "/collections/c01/", label: "C-01: List / Map / Set 基本操作" },
  { href: "/collections/c02/", label: "C-02: Stream API 実用パターン" },
  { href: "/collections/c03/", label: "C-03: ソート・グルーピング・集計" },
];

const tabs = [
  {
    label: "Java 8+",
    code: `import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class StreamApiSample {

    public static void main(String[] args) {

        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "Alice", "Dave", "Bob");
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // ① filter: 条件に合う要素だけ抽出
        List<Integer> evens = numbers.stream()
                .filter(n -> n % 2 == 0)
                .collect(Collectors.toList());
        System.out.println("偶数: " + evens); // [2, 4, 6, 8, 10]

        // ② map: 各要素を変換
        List<String> upper = names.stream()
                .distinct()
                .map(s -> s.toUpperCase())
                .collect(Collectors.toList());
        System.out.println("大文字: " + upper);

        // ③ sorted + distinct
        List<String> sortedNames = names.stream()
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        System.out.println("ソート済み: " + sortedNames);

        // ④ flatMap: ネストされたリストをフラット化
        List<List<Integer>> nested = Arrays.asList(
                Arrays.asList(1, 2, 3),
                Arrays.asList(4, 5),
                Arrays.asList(6, 7, 8, 9)
        );
        List<Integer> flat = nested.stream()
                .flatMap(list -> list.stream())
                .collect(Collectors.toList());
        System.out.println("flatMap: " + flat);

        // ⑤ joining: 文字列連結
        String joined = names.stream()
                .distinct()
                .sorted()
                .collect(Collectors.joining(", ", "[", "]"));
        System.out.println("joining: " + joined);

        // ⑥ groupingBy: グループ化（文字数でグループ）
        Map<Integer, List<String>> byLength = names.stream()
                .distinct()
                .collect(Collectors.groupingBy(s -> s.length()));
        System.out.println("文字数でグループ: " + byLength);

        // ⑦ 集計（sum / count / average）
        int sum = numbers.stream().mapToInt(Integer::intValue).sum();
        long count = numbers.stream().filter(n -> n > 5).count();
        System.out.println("合計: " + sum + "、5超の個数: " + count);

        // ⑧ Optional を返す終端操作
        Optional<String> first = names.stream()
                .filter(s -> s.startsWith("C"))
                .findFirst();
        System.out.println("C始まり: " + first.orElse("なし")); // Charlie

        Optional<Integer> max = numbers.stream().max(Integer::compareTo);
        System.out.println("最大値: " + max.orElse(0)); // 10
    }
}`,
    note: "Java 8 では collect(Collectors.toList()) が必要です。ラムダ式では型推論が効くため、引数の型宣言は省略できます。",
  },
  {
    label: "Java 17",
    code: `import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class StreamApiSample {

    // Java 16+: record でデータクラスを定義
    record Product(String name, int price, String category) {}

    public static void main(String[] args) {

        List<String> names = List.of("Alice", "Bob", "Charlie", "Alice", "Dave", "Bob");
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // ① filter + toList（Java 16+: collect(toUnmodifiableList()) の簡略形）
        List<Integer> evens = numbers.stream()
                .filter(n -> n % 2 == 0)
                .toList(); // Java 16+
        System.out.println("偶数: " + evens);

        // ② map + distinct + sorted + toList
        List<String> sortedNames = names.stream()
                .distinct()
                .sorted()
                .toList();
        System.out.println("ソート済み: " + sortedNames);

        // ③ flatMap
        List<List<Integer>> nested = List.of(
                List.of(1, 2, 3), List.of(4, 5), List.of(6, 7, 8));
        List<Integer> flat = nested.stream().flatMap(List::stream).toList();
        System.out.println("flatMap: " + flat);

        // ④ joining
        String joined = names.stream().distinct().sorted()
                .collect(Collectors.joining(", ", "[", "]"));
        System.out.println("joining: " + joined);

        // ⑤ record を使った groupingBy + mapping
        List<Product> products = List.of(
                new Product("apple",  100, "fruit"),
                new Product("banana", 150, "fruit"),
                new Product("milk",   200, "dairy"),
                new Product("bread",  120, "bakery")
        );

        Map<String, List<String>> byCategory = products.stream()
                .collect(Collectors.groupingBy(
                        Product::category,
                        Collectors.mapping(Product::name, Collectors.toList())
                ));
        byCategory.forEach((cat, prods) ->
                System.out.println(cat + ": " + prods));

        // ⑥ 集計
        int total = products.stream().mapToInt(Product::price).sum();
        double avg = products.stream().collect(Collectors.averagingInt(Product::price));
        System.out.println("合計: " + total + "、平均: " + avg);

        // ⑦ Optional を返す終端操作
        Optional<Product> cheapest = products.stream()
                .min(Comparator.comparingInt(Product::price));
        System.out.println("最安値: " + cheapest.map(Product::name).orElse("なし"));
    }
}`,
    note: "Java 16 の toList() で collect(Collectors.toList()) を省略できます。record を使うとデータクラスが簡潔になり、Stream との組み合わせがより自然に書けます。",
  },
  {
    label: "Java 21",
    code: `import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class StreamApiSample {

    record Product(String name, int price, String category) {}

    public static void main(String[] args) {

        List<String> names = List.of("Alice", "Bob", "Charlie", "Alice", "Dave", "Bob");
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // ① filter + toList
        List<Integer> evens = numbers.stream().filter(n -> n % 2 == 0).toList();
        System.out.println("偶数: " + evens);

        // ② distinct + sorted + toList
        List<String> sortedNames = names.stream().distinct().sorted().toList();
        System.out.println("ソート済み: " + sortedNames);

        // ③ flatMap
        List<Integer> flat = List.of(List.of(1,2,3), List.of(4,5), List.of(6,7,8))
                .stream().flatMap(List::stream).toList();
        System.out.println("flatMap: " + flat);

        // ④ groupingBy + mapping（record 使用）
        List<Product> products = List.of(
                new Product("apple",  100, "fruit"),
                new Product("banana", 150, "fruit"),
                new Product("milk",   200, "dairy"),
                new Product("bread",  120, "bakery")
        );

        Map<String, List<String>> byCategory = products.stream()
                .collect(Collectors.groupingBy(Product::category,
                        Collectors.mapping(Product::name, Collectors.toList())));
        byCategory.forEach((cat, prods) -> System.out.println(cat + ": " + prods));

        // ⑤ 集計
        System.out.println("合計: " + products.stream().mapToInt(Product::price).sum());
        System.out.println("平均: " + products.stream()
                .collect(Collectors.averagingInt(Product::price)));

        // ⑥ Optional
        Optional<Product> cheapest = products.stream()
                .min(Comparator.comparingInt(Product::price));
        System.out.println("最安値: " + cheapest.map(Product::name).orElse("なし"));

        // ⑦ Java 21: switch 式と Stream を組み合わせた分類ラベル付け
        products.stream().forEach(p -> {
            String label = switch (p.category()) {
                case "fruit" -> "食品（果物）";
                case "dairy" -> "食品（乳製品）";
                default -> "その他";
            };
            System.out.println(p.name() + ": " + label);
        });

        // ⑧ teeing（Java 12+）: 2つの Collector を同時に適用
        var stats = products.stream()
                .collect(Collectors.teeing(
                        Collectors.minBy(Comparator.comparingInt(Product::price)),
                        Collectors.maxBy(Comparator.comparingInt(Product::price)),
                        (min, max) -> "最安=" + min.map(Product::name).orElse("?")
                                + " 最高=" + max.map(Product::name).orElse("?")
                ));
        System.out.println("teeing: " + stats);
    }
}`,
    note: "Java 12 の Collectors.teeing() を使うと、最小値と最大値の同時取得など、2つの Collector の結果を組み合わせた処理を1回のストリーム操作で書けます。",
  },
];

export default function C02Page() {
  return (
    <PageWrapper sidebar={<Sidebar navTitle="コレクション" navItems={collectionsNavItems} />}>
      <p className="text-sm mb-6" style={{ color: "var(--slate-500)" }}>
        <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">ホーム</Link>
        {" "}&rsaquo;{" "}
        <Link href="/collections/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">コレクション</Link>
        {" "}&rsaquo; C-02
      </p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--slate-800)" }}>
        C-02: Stream API 実用パターン
      </h1>
      <p className="mb-8" style={{ color: "var(--slate-500)" }}>
        Stream API は Java 8 で追加された、コレクション操作を宣言的に書くための仕組みです。
        for ループを使わずに「フィルタ・変換・集計」を簡潔に記述でき、Java 開発では必須の知識です。
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          いつ使うか
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>リストから条件に合う要素だけを抜き出したいとき（filter）</li>
          <li>オブジェクトのリストから特定のフィールドだけ取り出したいとき（map）</li>
          <li>カテゴリ別・担当者別にグループ化して集計したいとき（groupingBy）</li>
          <li>複数リストを1つのリストに統合したいとき（flatMap）</li>
        </ul>
        <div className="mt-4 p-4 rounded-lg text-sm" style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
          <p className="font-semibold mb-2" style={{ color: "var(--slate-700)" }}>主要な Stream 操作一覧</p>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--slate-200)" }}>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>操作</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>種類</th>
                <th className="text-left py-1" style={{ color: "var(--slate-600)" }}>説明</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--slate-700)" }}>
              {[
                ["filter()", "中間", "条件に合う要素のみ残す"],
                ["map()", "中間", "各要素を別の値に変換する"],
                ["flatMap()", "中間", "ネストを1段階フラットにする"],
                ["distinct()", "中間", "重複を除去する"],
                ["sorted()", "中間", "要素をソートする"],
                ["collect()", "終端", "結果をリスト・マップ等に変換"],
                ["count()", "終端", "要素数を返す"],
                ["findFirst()", "終端", "最初の要素を Optional で返す"],
              ].map(([op, type, desc]) => (
                <tr key={op} style={{ borderBottom: "1px solid var(--slate-100)" }}>
                  <td className="py-1 pr-4 font-mono">{op}</td>
                  <td className="py-1 pr-4">{type}</td>
                  <td className="py-1">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          サンプルコード
        </h2>
        <VersionTabs tabs={tabs} filename="StreamApiSample.java" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          よくあるミス・注意点
        </h2>
        <div className="space-y-3 text-sm" style={{ color: "var(--slate-700)" }}>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ Stream は一度しか使えない</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              一度終端操作（collect / count / findFirst 等）を呼び出した Stream を再利用しようとすると{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>IllegalStateException</code>{" "}
              が発生します。Stream が必要なたびに{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>collection.stream()</code>{" "}
              で新しく生成してください。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ parallelStream() はラムダ内に副作用があると危険</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>parallelStream()</code>{" "}
              を使うと複数スレッドで並列処理されます。ラムダ内で外部の変数を書き換えたり、非スレッドセーフなコレクションへ追加したりすると、予期しない結果になります。並列化は大量データの純粋な計算処理に限定して使いましょう。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ toList()（Java 16+）はイミュータブルなリストを返す</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              Java 16 の{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>stream().toList()</code>{" "}
              が返すリストは変更不可です。後で要素を追加・削除したい場合は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>collect(Collectors.toList())</code>{" "}
              を使いましょう（こちらは変更可能な ArrayList を返します）。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          テストする観点
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>空のリストを Stream 処理しても例外が発生せず空リストが返ること</li>
          <li>filter で全件除外された場合（空 Stream）でも collect が空リストを返すこと</li>
          <li>groupingBy でグループが1件しかない場合も正しく動作すること</li>
          <li>findFirst() の結果が Optional.empty() のとき orElse() のデフォルト値が返ること</li>
          <li>distinct() で重複が正しく排除されること（equals/hashCode に依存する点を確認）</li>
        </ul>
        <p className="mt-4 text-sm" style={{ color: "var(--slate-600)" }}>
          <a
            href="https://github.com/lylgamin/java-recipes/blob/main/java-samples/java8/src/main/java/StreamApiSample.java"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--blue)" }}
          >
            GitHub でソースコードを見る →
          </a>
        </p>
      </section>

      <PageNav
        prev={{ href: "/collections/c01/", label: "C-01: List / Map / Set 基本操作" }}
        next={{ href: "/collections/c03/", label: "C-03: ソート・グルーピング・集計" }}
        related={[
          { href: "/collections/c01/", label: "C-01: List / Map / Set 基本操作" },
          { href: "/collections/c03/", label: "C-03: ソート・グルーピング・集計" },
        ]}
      />
    </PageWrapper>
  );
}
