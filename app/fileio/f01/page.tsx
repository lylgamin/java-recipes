import type { Metadata } from "next";
import Link from "next/link";
import VersionTabs from "@/components/VersionTabs";
import PageNav from "@/components/PageNav";
import PageWrapper from "@/components/PageWrapper";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "F-01: CSVの読み書き（java.io / java.nio）",
  description:
    "Java で CSV ファイルを読み書きする方法を Java 8 / 17 / 21 で解説。BufferedReader による java.io 方式、Files.readAllLines による java.nio 方式、大容量 CSV のストリーム処理を紹介します。",
};

const fileioNavItems = [
  { href: "/fileio/f01/", label: "F-01: CSVの読み書き" },
  { href: "/fileio/f02/", label: "F-02: .propertiesファイルの読み込み" },
  { href: "/fileio/f03a/", label: "F-03a: java.io ファイル操作" },
  { href: "/fileio/f03b/", label: "F-03b: java.nio ファイル操作" },
  { href: "/fileio/f04/", label: "F-04: JSON の読み書き" },
  { href: "/fileio/f05/", label: "F-05: YAML の読み書き" },
  { href: "/fileio/f06/", label: "F-06: XML の読み書き" },
];

const tabs = [
  {
    label: "Java 8+",
    code: `import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class CsvReadWriteSample {

    /** CSV を読み込み、行のリストを返す（java.io 方式） */
    public static List<String> readCsv(String filePath) throws IOException {
        List<String> lines = new ArrayList<>();
        // try-with-resources でストリームを確実にクローズ
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(
                        new FileInputStream(filePath), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                lines.add(line);
            }
        }
        return lines;
    }

    /** CSV を書き込む（java.io 方式） */
    public static void writeCsv(String filePath, List<String> lines) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(
                        new FileOutputStream(filePath), StandardCharsets.UTF_8))) {
            for (String line : lines) {
                writer.write(line);
                writer.newLine(); // OS に応じた改行コード（\\r\\n / \\n）を使用
            }
        }
    }

    /**
     * カンマ区切り行をフィールドの配列に分割する（簡易パース）
     * ダブルクォートで囲まれたフィールド内のカンマも正しく扱う
     */
    public static String[] parseCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes; // クォートの開始・終了を切り替え
            } else if (c == ',' && !inQuotes) {
                fields.add(sb.toString()); // クォート外のカンマで分割
                sb = new StringBuilder();
            } else {
                sb.append(c);
            }
        }
        fields.add(sb.toString()); // 最後のフィールドを追加
        return fields.toArray(new String[0]);
    }

    public static void main(String[] args) throws IOException {

        // サンプルCSVデータ
        List<String> csvLines = new ArrayList<>();
        csvLines.add("name,price,category");           // ヘッダー行
        csvLines.add("apple,100,fruit");
        csvLines.add("banana,150,fruit");
        csvLines.add("\\"milk, low-fat\\",200,dairy");  // カンマを含むフィールドはダブルクォートで囲む
        csvLines.add("bread,120,bakery");

        // 書き込み
        File tempFile = File.createTempFile("sample", ".csv");
        tempFile.deleteOnExit();
        writeCsv(tempFile.getAbsolutePath(), csvLines);
        System.out.println("書き込み完了: " + tempFile.getName());

        // 読み込み + ヘッダーをスキップ
        List<String> readLines = readCsv(tempFile.getAbsolutePath());
        boolean isHeader = true;
        for (String line : readLines) {
            if (isHeader) { isHeader = false; continue; }
            String[] fields = parseCsvLine(line);
            System.out.println("name=" + fields[0]
                    + ", price=" + fields[1]
                    + ", category=" + fields[2]);
        }
    }
}`,
    note: "Java 8 では InputStreamReader でエンコーディングを指定して FileInputStream をラップします。文字コードを省略すると JVM のデフォルト（環境依存）が使われるため注意してください。",
  },
  {
    label: "Java 17",
    code: `import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class CsvReadWriteSample {

    /** CSV を読み込む（java.nio 方式：小〜中規模ファイル向け） */
    public static List<String> readCsv(Path path) throws IOException {
        return Files.readAllLines(path, StandardCharsets.UTF_8);
    }

    /** CSV を書き込む（java.nio 方式） */
    public static void writeCsv(Path path, List<String> lines) throws IOException {
        Files.write(path, lines, StandardCharsets.UTF_8);
    }

    public static String[] parseCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(sb.toString());
                sb = new StringBuilder();
            } else {
                sb.append(c);
            }
        }
        fields.add(sb.toString());
        return fields.toArray(String[]::new); // Java 11+: メソッド参照でジェネリック配列生成
    }

    public static void main(String[] args) throws IOException {

        List<String> csvLines = List.of(
                "name,price,category",
                "apple,100,fruit",
                "banana,150,fruit",
                "\\"milk, low-fat\\",200,dairy",
                "bread,120,bakery"
        );

        Path tempFile = Files.createTempFile("sample", ".csv");
        tempFile.toFile().deleteOnExit();
        writeCsv(tempFile, new ArrayList<>(csvLines));
        System.out.println("書き込み完了: " + tempFile.getFileName());

        // 読み込み + Stream でヘッダーをスキップ
        List<String> readLines = readCsv(tempFile);
        readLines.stream()
                .skip(1) // ヘッダーをスキップ
                .forEach(line -> {
                    String[] fields = parseCsvLine(line);
                    System.out.println("name=" + fields[0]
                            + ", price=" + fields[1]
                            + ", category=" + fields[2]);
                });

        // 大容量CSVの場合: Files.lines() でストリーム処理（メモリに全行を読み込まない）
        System.out.println("\\n--- ストリーム処理（大容量向け） ---");
        try (var stream = Files.lines(tempFile, StandardCharsets.UTF_8)) { // Java 10+: var
            stream.skip(1) // ヘッダーをスキップ
                    .map(line -> parseCsvLine(line)[0]) // name フィールドのみ取得
                    .forEach(System.out::println);
        }
    }
}`,
    note: "Files.readAllLines() は全行を一括でメモリに読み込みます。大容量ファイルには Files.lines() を使い、try-with-resources で確実にストリームをクローズしてください。",
  },
  {
    label: "Java 21",
    code: `import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class CsvReadWriteSample {

    public static List<String> readCsv(Path path) throws IOException {
        return Files.readAllLines(path, StandardCharsets.UTF_8);
    }

    public static void writeCsv(Path path, List<String> lines) throws IOException {
        Files.write(path, lines, StandardCharsets.UTF_8);
    }

    public static String[] parseCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        var sb = new StringBuilder(); // Java 10+: var
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(sb.toString());
                sb = new StringBuilder();
            } else {
                sb.append(c);
            }
        }
        fields.add(sb.toString());
        return fields.toArray(String[]::new);
    }

    public static void main(String[] args) throws IOException {

        var csvLines = List.of(
                "name,price,category",
                "apple,100,fruit",
                "banana,150,fruit",
                "\\"milk, low-fat\\",200,dairy",
                "bread,120,bakery"
        );

        var tempFile = Files.createTempFile("sample", ".csv");
        tempFile.toFile().deleteOnExit();
        writeCsv(tempFile, new ArrayList<>(csvLines));
        System.out.println("書き込み完了: " + tempFile.getFileName());

        // 読み込み + Stream 処理
        readCsv(tempFile).stream()
                .skip(1)
                .forEach(line -> {
                    var fields = parseCsvLine(line);
                    System.out.println("name=" + fields[0]
                            + ", price=" + fields[1]
                            + ", category=" + fields[2]);
                });

        // 大容量CSVのストリーム処理
        System.out.println("\\n--- ストリーム処理 ---");
        try (var stream = Files.lines(tempFile, StandardCharsets.UTF_8)) {
            stream.skip(1)
                    .map(line -> parseCsvLine(line)[0])
                    .forEach(System.out::println);
        }

        // Java 11+: Files.readString() で全文を一括取得（小ファイル向け）
        String content = Files.readString(tempFile, StandardCharsets.UTF_8);
        System.out.println("\\n全文の行数: " + content.lines().count()); // Java 11+
    }
}`,
    note: "Java 21 では var を活用してコードをより簡潔に書けます。Files.readString() と content.lines() を組み合わせると、全文の行数カウントも1行で書けます。",
  },
];

export default function F01Page() {
  return (
    <PageWrapper sidebar={<Sidebar navTitle="ファイルI/O" navItems={fileioNavItems} />}>
      <p className="text-sm mb-6" style={{ color: "var(--slate-500)" }}>
        <Link href="/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">ホーム</Link>
        {" "}&rsaquo;{" "}
        <Link href="/fileio/" style={{ color: "var(--blue)", textDecoration: "none" }} className="hover:underline">ファイルI/O</Link>
        {" "}&rsaquo; F-01
      </p>

      <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--slate-800)" }}>
        F-01: CSVの読み書き（java.io / java.nio）
      </h1>
      <p className="mb-8" style={{ color: "var(--slate-500)" }}>
        CSV（Comma-Separated Values）は業務システムで最もよく使われるデータ形式です。
        Java 標準ライブラリで読み書きする2つの方式と、カンマを含むフィールドの扱い、大容量ファイルのストリーム処理を解説します。
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          いつ使うか
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>顧客データ・商品マスタ・売上データを CSV でインポート・エクスポートするとき</li>
          <li>バッチ処理で大量の CSV を1行ずつ処理するとき</li>
          <li>Excel から出力された CSV を Java で読み込んで処理するとき</li>
        </ul>
        <div className="mt-4 p-4 rounded-lg text-sm" style={{ background: "var(--slate-50)", border: "1px solid var(--slate-200)" }}>
          <p className="font-semibold mb-2" style={{ color: "var(--slate-700)" }}>java.io vs java.nio の比較</p>
          <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--slate-200)" }}>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>方式</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>コード量</th>
                <th className="text-left py-1 pr-4" style={{ color: "var(--slate-600)" }}>対応バージョン</th>
                <th className="text-left py-1" style={{ color: "var(--slate-600)" }}>用途</th>
              </tr>
            </thead>
            <tbody style={{ color: "var(--slate-700)" }}>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4">java.io（BufferedReader）</td>
                <td className="py-1 pr-4">多め</td>
                <td className="py-1 pr-4">Java 1.1+</td>
                <td className="py-1">レガシー環境・大容量</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--slate-100)" }}>
                <td className="py-1 pr-4">Files.readAllLines</td>
                <td className="py-1 pr-4">少ない</td>
                <td className="py-1 pr-4">Java 7+</td>
                <td className="py-1">小〜中規模ファイル</td>
              </tr>
              <tr>
                <td className="py-1 pr-4">Files.lines（ストリーム）</td>
                <td className="py-1 pr-4">少ない</td>
                <td className="py-1 pr-4">Java 8+</td>
                <td className="py-1">大容量ファイル</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          サンプルコード
        </h2>
        <VersionTabs tabs={tabs} filename="CsvReadWriteSample.java" />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          よくあるミス・注意点
        </h2>
        <div className="space-y-3 text-sm" style={{ color: "var(--slate-700)" }}>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ 文字コードを省略すると環境依存になる</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>new FileReader(file)</code>{" "}
              や{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>Files.readAllLines(path)</code>（文字コード省略）は JVM のデフォルト文字コードを使います。
              Windows では Shift_JIS、Linux では UTF-8 になることが多く、環境によって文字化けが発生します。
              必ず{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>StandardCharsets.UTF_8</code>{" "}
              や{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>Charset.forName("Windows-31J")</code>{" "}
              を明示してください。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ Files.lines() は try-with-resources が必須</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>Files.lines()</code>{" "}
              が返す Stream はファイルリソースを保持しています。
              try-with-resources を使わずに放置すると、ファイルハンドルが解放されずリークが発生します。
              必ず{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>try (var stream = Files.lines(...)){"{ }"}
              </code>{" "}
              の形で使ってください。
            </p>
          </div>
          <div className="warning-box">
            <p className="font-semibold mb-1" style={{ color: "#92400e" }}>⚠️ 単純な split(",") はカンマ入りフィールドに対応できない</p>
            <p style={{ color: "#78350f", margin: 0 }}>
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>{"line.split(\",\")"}</code>{" "}
              では{" "}
              <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: "4px" }}>{'"milk, low-fat",200,dairy'}</code>{" "}
              のようなクォート囲みのフィールドを正しく分割できません。
              実務では Apache Commons CSV などのライブラリを使うのが一般的です。サンプルの parseCsvLine() は簡易実装です。
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--slate-800)", borderBottom: "2px solid var(--slate-200)", paddingBottom: "8px" }}>
          テストする観点
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed" style={{ color: "var(--slate-700)" }}>
          <li>書き込んだ内容と読み込んだ内容が一致すること</li>
          <li>カンマを含むフィールド（ダブルクォート囲み）が正しくパースされること</li>
          <li>ヘッダー行が正しくスキップされること</li>
          <li>空のCSVファイル（ヘッダーのみ）を読み込んでも例外が発生しないこと（境界値）</li>
          <li>日本語（UTF-8）が文字化けせずに読み書きできること</li>
        </ul>
        <p className="mt-4 text-sm" style={{ color: "var(--slate-600)" }}>
          <a
            href="https://github.com/lylgamin/java-recipes/blob/main/java-samples/java8/src/main/java/CsvReadWriteSample.java"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--blue)" }}
          >
            GitHub でソースコードを見る →
          </a>
        </p>
      </section>

      <PageNav
        prev={undefined}
        next={{ href: "/fileio/f02/", label: "F-02: .propertiesファイルの読み込み" }}
        related={[
          { href: "/fileio/f03a/", label: "F-03a: java.io ファイル操作" },
          { href: "/fileio/f03b/", label: "F-03b: java.nio ファイル操作" },
        ]}
      />
    </PageWrapper>
  );
}
