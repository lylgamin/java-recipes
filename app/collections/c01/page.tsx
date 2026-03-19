import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "C-01: List / Map / Set 基本操作",
  description:
    "Java の List、Map、Set の基本操作を Java 8 / 17 / 21 で解説。ArrayList vs LinkedList、HashMap vs TreeMap の使い分け、Java 9 以降の List.of() のイミュータブルな落とし穴を紹介します。",
};

const collectionsNavItems = [
  { href: "/collections/c01/", label: "C-01: List / Map / Set 基本操作" },
  { href: "/collections/c02/", label: "C-02: Stream API 実用パターン" },
  { href: "/collections/c03/", label: "C-03: ソート・グルーピング・集計" },
];

const tabs = [
  {
    label: "Java 8+",
    code: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

public class CollectionBasicSample {

    public static void main(String[] args) {

        // ① ArrayList の基本操作（ランダムアクセスが速い：O(1)）
        List<String> arrayList = new ArrayList<>();
        arrayList.add("Java");
        arrayList.add("Python");
        arrayList.add("Go");
        arrayList.add(1, "Kotlin"); // インデックス1に挿入
        System.out.println("ArrayList: " + arrayList);
        System.out.println("get(0): " + arrayList.get(0)); // ランダムアクセス O(1)
        arrayList.remove("Python");
        System.out.println("remove後: " + arrayList);

        // ② LinkedList の基本操作（先頭・末尾への挿入が速い：O(1)）
        LinkedList<String> linkedList = new LinkedList<>();
        linkedList.add("first");
        linkedList.addFirst("before_first"); // 先頭に追加 O(1)
        linkedList.addLast("last");          // 末尾に追加 O(1)
        System.out.println("LinkedList: " + linkedList);

        // ③ HashMap の基本操作（キー検索が速い：O(1)）
        Map<String, Integer> hashMap = new HashMap<>();
        hashMap.put("apple", 100);
        hashMap.put("banana", 150);
        hashMap.put("cherry", 200);
        System.out.println("HashMap get(apple): " + hashMap.get("apple"));
        System.out.println("containsKey(banana): " + hashMap.containsKey("banana"));
        int val = hashMap.getOrDefault("grape", 0); // キーがない場合のデフォルト値
        System.out.println("getOrDefault(grape): " + val); // 0

        // エントリーのループ（Java 8 以降は forEach も使える）
        for (Map.Entry<String, Integer> entry : hashMap.entrySet()) {
            System.out.println("  " + entry.getKey() + ": " + entry.getValue());
        }

        // ④ TreeMap（キー昇順で管理：O(log n)）
        Map<String, Integer> treeMap = new TreeMap<>();
        treeMap.put("cherry", 200);
        treeMap.put("apple", 100);
        treeMap.put("banana", 150);
        System.out.println("TreeMap（昇順）: " + treeMap); // {apple=100, banana=150, cherry=200}

        // ⑤ HashSet の基本操作（重複なし・順序なし）
        Set<String> hashSet = new HashSet<>();
        hashSet.add("A");
        hashSet.add("B");
        hashSet.add("A"); // 重複は無視される
        System.out.println("HashSet size: " + hashSet.size()); // 2

        // ⑥ Collections.unmodifiableList() で変更不可ラッパーを作成
        List<String> base = new ArrayList<>(Arrays.asList("X", "Y", "Z"));
        List<String> unmodifiable = Collections.unmodifiableList(base);
        System.out.println("unmodifiableList: " + unmodifiable);
        // unmodifiable.add("W"); // UnsupportedOperationException が発生する
    }
}`,
    note: "Java 8 では List.of() が使えないため、Arrays.asList() + new ArrayList<>() でリストを初期化します。",
  },
  {
    label: "Java 17",
    code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

public class CollectionBasicSample {

    public static void main(String[] args) {

        // ① Java 9+ の List.of()（イミュータブルリスト）
        List<String> immutableList = List.of("Java", "Python", "Go"); // Java 9+
        System.out.println("List.of: " + immutableList);

        // immutableList.add("Kotlin"); // ← UnsupportedOperationException が発生する！

        // 変更可能なリストにするには ArrayList でラップする
        List<String> mutableList = new ArrayList<>(immutableList);
        mutableList.add("Kotlin");
        System.out.println("変更可能なリスト: " + mutableList);

        // ② Java 9+ の Map.of()（イミュータブルマップ、最大10エントリー）
        Map<String, Integer> immutableMap = Map.of( // Java 9+
                "apple", 100,
                "banana", 150,
                "cherry", 200
        );
        System.out.println("Map.of get(apple): " + immutableMap.get("apple"));
        // immutableMap.put("grape", 300); // ← UnsupportedOperationException

        // ③ Java 9+ の Set.of()（イミュータブルセット）
        Set<String> immutableSet = Set.of("A", "B", "C"); // Java 9+
        System.out.println("Set.of size: " + immutableSet.size());

        // ④ Map.ofEntries() で10エントリー以上のイミュータブルマップを作成
        Map<String, Integer> largeMap = Map.ofEntries( // Java 9+
                Map.entry("a", 1),
                Map.entry("b", 2),
                Map.entry("c", 3)
        );
        System.out.println("Map.ofEntries size: " + largeMap.size());

        // ⑤ Collections.unmodifiableList との違い
        // unmodifiableList は元のリストへの変更が反映される
        ArrayList<String> base = new ArrayList<>();
        base.add("X");
        base.add("Y");
        List<String> unmodifiable = Collections.unmodifiableList(base);
        base.add("Z"); // 元のリストを変更
        System.out.println("unmodifiableList（元リスト変更後）: " + unmodifiable); // Z が反映される

        // Java 10+: List.copyOf() は独立したイミュータブルコピーを作成
        List<String> copy = List.copyOf(base); // Java 10+
        base.add("W");
        System.out.println("List.copyOf（元リスト変更後）: " + copy); // W は反映されない

        // ⑥ HashMap の getOrDefault
        Map<String, Integer> hashMap = new HashMap<>();
        hashMap.put("apple", 100);
        int val = hashMap.getOrDefault("grape", 0);
        System.out.println("getOrDefault(grape): " + val); // 0

        // ⑦ TreeMap（キー昇順）
        TreeMap<String, Integer> treeMap = new TreeMap<>();
        treeMap.put("cherry", 200);
        treeMap.put("apple", 100);
        System.out.println("TreeMap（昇順）: " + treeMap);
    }
}`,
    note: "Java 9 で追加された List.of() / Map.of() / Set.of() はイミュータブルです。要素を追加・削除しようとすると UnsupportedOperationException が発生します。",
  },
  {
    label: "Java 21",
    code: `import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.SequencedCollection;
import java.util.Set;
import java.util.TreeMap;

public class CollectionBasicSample {

    public static void main(String[] args) {

        // ① Java 9+ の List.of()（イミュータブルリスト）
        List<String> immutableList = List.of("Java", "Python", "Go");
        System.out.println("List.of: " + immutableList);

        // 変更可能なリストにするには ArrayList でラップする
        List<String> mutableList = new ArrayList<>(immutableList);
        mutableList.add("Kotlin");
        System.out.println("変更可能なリスト: " + mutableList);

        // ② Java 21: SequencedCollection（順序付きコレクションの共通インターフェース）
        SequencedCollection<String> seqList = new ArrayList<>(List.of("X", "Y", "Z")); // Java 21+
        System.out.println("最初の要素: " + seqList.getFirst()); // Java 21+
        System.out.println("最後の要素: " + seqList.getLast());  // Java 21+
        seqList.addFirst("W"); // 先頭に追加 Java 21+
        System.out.println("addFirst後: " + seqList);

        // ③ Map.of() と Map.ofEntries()
        Map<String, Integer> immutableMap = Map.of("apple", 100, "banana", 150);
        System.out.println("Map.of get(apple): " + immutableMap.get("apple"));

        // ④ Set.of()
        Set<String> immutableSet = Set.of("A", "B", "C");
        System.out.println("Set.of size: " + immutableSet.size());

        // ⑤ Collections.unmodifiableList と List.copyOf() の違い
        ArrayList<String> base = new ArrayList<>();
        base.add("A");
        base.add("B");
        List<String> unmodifiable = Collections.unmodifiableList(base);
        base.add("C"); // 元のリストを変更
        System.out.println("unmodifiableList（元リスト変更後）: " + unmodifiable); // C が反映される

        List<String> copy = List.copyOf(base);
        base.add("D");
        System.out.println("List.copyOf（元リスト変更後）: " + copy); // D は反映されない

        // ⑥ HashMap と TreeMap
        Map<String, Integer> hashMap = new HashMap<>();
        hashMap.put("apple", 100);
        System.out.println("getOrDefault(grape): " + hashMap.getOrDefault("grape", 0)); // 0

        TreeMap<String, Integer> treeMap = new TreeMap<>();
        treeMap.put("cherry", 200);
        treeMap.put("apple", 100);
        treeMap.put("banana", 150);
        System.out.println("TreeMap（昇順）: " + treeMap);
    }
}`,
    note: "Java 21 で追加された SequencedCollection インターフェースにより、getFirst() / getLast() / addFirst() / addLast() が List・Deque・LinkedHashSet などで統一的に使えるようになりました。",
  },
];

export default function C01Page() {
  return (
    <PageWrapper
      sidebar={
        <Sidebar
          navTitle="コレクション"
          navItems={collectionsNavItems}
        />
      }
    >
      {/* パンくず */}
      <p className="text-sm mb-6" style={{ color: "var(--slate-500)" }}>
        <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">
          ホーム
        </Link>
        {" "}&rsaquo;{" "}
        <Link href="/collections/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">
          コレクション
        </Link>
        {" "}&rsaquo; C-01
      </p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--slate-800)" }}>
        C-01: List / Map / Set 基本操作
      </h1>
      <p className="mb-8" style={{ color: "var(--slate-500)" }}>
        Java のコレクションフレームワークは、データを効率よく管理・検索するための仕組みです。
        用途に合わせて{" "}
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>
          List
        </code>
        ・
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>
          Map
        </code>
        ・
        <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px", fontSize: "13px" }}>
          Set
        </code>{" "}
        を使い分けることが大切です。
      </p>

      {/* 1. 説明・ユースケース */}
      <section className="mb-8">
        <h2
          className="text-xl font-semibold mb-3"
          style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}
        >
          いつ使うか
        </h2>

        <div className="mt-2 p-4 rounded-lg text-sm mb-4" style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
          <p className="font-semibold mb-2" style={{ color: "var(--slate-700)" }}>コレクションの使い分け</p>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--slate-200)" }}>
                <th className="text-left py-1 pr-3" style={{ color: "var(--slate-600)" }}>型</th>
                <th className="text-left py-1 pr-3" style={{ color: "var(--slate-600)" }}>特徴</th>
                <th className="text-left py-1" style={{ color: "var(--slate-600)" }}>代表的な用途</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--slate-700)" }}>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-3 font-mono">ArrayList</td>
                <td className="py-1 pr-3">ランダムアクセス O(1)、末尾追加速い</td>
                <td className="py-1">リスト表示、順番に処理</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-3 font-mono">LinkedList</td>
                <td className="py-1 pr-3">先頭・末尾追加 O(1)、中間アクセス遅い</td>
                <td className="py-1">キュー・スタックとして使う場合</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-3 font-mono">HashMap</td>
                <td className="py-1 pr-3">キー検索 O(1)、順序なし</td>
                <td className="py-1">IDからオブジェクトを高速検索</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-3 font-mono">TreeMap</td>
                <td className="py-1 pr-3">キー昇順、O(log n)</td>
                <td className="py-1">ソートされたマップが必要な場合</td>
              </tr>
              <tr>
                <td className="py-1 pr-3 font-mono">HashSet</td>
                <td className="py-1 pr-3">重複なし、O(1)</td>
                <td className="py-1">重複排除、存在チェック</td>
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
        <VersionTabs tabs={tabs} filename="CollectionBasicSample.java" />
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
              ⚠️ List.of() / Map.of() / Set.of() はイミュータブル（変更不可）
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              Java 9 以降の{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                List.of()
              </code>
              ・
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                Map.of()
              </code>
              ・
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                Set.of()
              </code>{" "}
              で作成したコレクションに{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                add()
              </code>{" "}
              や{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                put()
              </code>{" "}
              を呼ぶと{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                UnsupportedOperationException
              </code>{" "}
              が発生します。変更が必要な場合は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                new ArrayList&lt;&gt;(List.of(...))
              </code>{" "}
              のようにラップしてから使いましょう。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ Collections.unmodifiableList() は元のリストへの変更が反映される
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                Collections.unmodifiableList()
              </code>{" "}
              はラッパーを返すだけで、元のリストが変更されると影響を受けます。
              完全に独立したコピーが欲しい場合は Java 10 以降の{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                List.copyOf()
              </code>{" "}
              を使いましょう。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>
              ⚠️ Map.of() はキーの順序を保証しない
            </p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                Map.of()
              </code>{" "}
              で作ったマップはキーの順序が保証されません。また、同じキーを2回指定すると{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                IllegalArgumentException
              </code>{" "}
              が発生します。挿入順を維持したい場合は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                LinkedHashMap
              </code>
              、キー昇順にしたい場合は{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>
                TreeMap
              </code>{" "}
              を使いましょう。
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
          <li>要素の追加・取得・削除が正しく動作すること</li>
          <li>存在しないキーで{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>get()</code>{" "}
            を呼んだとき null が返ること（HashMap）
          </li>
          <li>
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>Set</code>{" "}
            に同じ値を2回 add しても size が増えないこと
          </li>
          <li>
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>List.of()</code>{" "}
            の結果に add() を呼ぶと{" "}
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>UnsupportedOperationException</code>{" "}
            が発生すること（境界値テスト）
          </li>
          <li>
            <code style={{ background: "var(--slate-100)", padding: "1px 6px", borderRadius: "4px" }}>TreeMap</code>{" "}
            がキー昇順で返ること
          </li>
        </ul>
        <p className="mt-4 text-sm" style={{ color: "var(--slate-600)" }}>
          <a
            href="https://github.com/lylgamin/java-recipes/blob/main/java-samples/java8/src/main/java/CollectionBasicSample.java"
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
          href: "/collections/c02/",
          label: "C-02: Stream API 実用パターン",
        }}
        related={[
          { href: "/collections/c02/", label: "C-02: Stream API 実用パターン" },
          { href: "/collections/c03/", label: "C-03: ソート・グルーピング・集計" },
        ]}
      />
    </PageWrapper>
  );
}
