# java-recipes

新人エンジニア向けの Pure Java サンプル集です。外部ライブラリを使わず、Java 標準ライブラリのみで実装しています。

- **サイト**: [java-recipes.pages.dev](https://java-recipes.pages.dev)
- **ソースコード**: [java-samples/](./java-samples) — 各ページのサンプルコード（Java 8 / 17 / 21）を収録

## サンプル一覧

凡例: ✅ 公開済み / 🔜 準備中

### 日付・時刻

| ID | ページ | タイトル | 状態 |
|:--|:--|:--|:--|
| D-01 | [/dates/d01](https://java-recipes.pages.dev/dates/d01/) | java.util.Date ↔ LocalDate ↔ java.sql.Date 相互変換 | ✅ |
| D-02 | [/dates/d02](https://java-recipes.pages.dev/dates/d02/) | 日付フォーマット（SimpleDateFormat vs DateTimeFormatter） | ✅ |
| D-03 | [/dates/d03](https://java-recipes.pages.dev/dates/d03/) | 消費税計算（税率・軽減税率・端数処理） | ✅ |
| D-04 | [/dates/d04](https://java-recipes.pages.dev/dates/d04/) | 祝日判定（内閣府CSV活用 / ハードコード方式） | ✅ |
| D-05 | [/dates/d05](https://java-recipes.pages.dev/dates/d05/) | 営業日計算（祝日・土日除外、N営業日後） | ✅ |
| D-06 | /dates/d06 | 元号変換（和暦↔西暦、令和/平成/昭和） | 🔜 |
| D-07 | [/dates/d07](https://java-recipes.pages.dev/dates/d07/) | タイムゾーン処理（JST/UTC変換、夏時間考慮） | ✅ |

### 文字列

| ID | ページ | タイトル | 状態 |
|:--|:--|:--|:--|
| S-01 | [/strings/s01](https://java-recipes.pages.dev/strings/s01/) | null安全な文字列操作 | ✅ |
| S-02 | [/strings/s02](https://java-recipes.pages.dev/strings/s02/) | パディング・トリム・ゼロ埋め | ✅ |
| S-03 | /strings/s03 | カンマ区切り・数値フォーマット | 🔜 |
| S-04 | /strings/s04 | 正規表現（java.util.regex 実用パターン集） | 🔜 |

### コレクション

| ID | ページ | タイトル | 状態 |
|:--|:--|:--|:--|
| C-01 | [/collections/c01](https://java-recipes.pages.dev/collections/c01/) | List / Map / Set 基本操作 | ✅ |
| C-02 | [/collections/c02](https://java-recipes.pages.dev/collections/c02/) | Stream API 実用パターン | ✅ |
| C-03 | /collections/c03 | ソート・グルーピング・集計 | 🔜 |

### ファイルI/O

| ID | ページ | タイトル | 状態 |
|:--|:--|:--|:--|
| F-01 | [/fileio/f01](https://java-recipes.pages.dev/fileio/f01/) | CSVの読み書き | ✅ |
| F-02 | /fileio/f02 | .propertiesファイルの読み込み | 🔜 |
| F-03a | /fileio/f03a | java.io によるファイル操作 | 🔜 |
| F-03b | /fileio/f03b | java.nio.file によるファイル操作 | 🔜 |
| F-04 | /fileio/f04 | JSON の読み書き（Pure Java + Jackson） | 🔜 |
| F-05 | /fileio/f05 | YAML の読み書き（Pure Java + SnakeYAML） | 🔜 |
| F-06 | /fileio/f06 | XML の読み書き（DOM / SAX / StAX） | 🔜 |

### ネットワーク

| ID | ページ | タイトル | 状態 |
|:--|:--|:--|:--|
| N-01 | /network/n01 | HttpClient によるREST呼び出し（Java 11〜） | 🔜 |
| N-02 | /network/n02 | HttpURLConnection によるHTTP通信（Java 8〜） | 🔜 |
| N-03 | /network/n03 | TCP ソケット通信（ServerSocket / Socket） | 🔜 |
| N-04 | /network/n04 | UDP 通信（DatagramSocket） | 🔜 |
| N-05 | /network/n05 | メール送信（Jakarta Mail） | 🔜 |

### バッチフレームワーク連載

| ID | タイトル |
|:--|:--|
| B-01 | 基本構造設計（前処理/本処理/後処理） |
| B-02 | 設定ファイル読み込み（.properties） |
| B-03 | リトライ処理（指数バックオフ） |
| B-04 | ログ設計（java.util.logging） |
| B-05 | エラーハンドリング（異常終了・継続・スキップ） |
| B-06 | 完成版・全コードまとめ |

> バッチ連載は全パート完成後に公開予定です。

## ソースコード

各ページのサンプルコードは [`java-samples/`](./java-samples) に収録されています。
Java 8 / 17 / 21 の3バージョンを用意しており、Maven でコンパイル確認済みです。

```
java-samples/
├── java8/src/main/java/    ← Java 8 版サンプル
├── java17/src/main/java/   ← Java 17 版サンプル
└── java21/src/main/java/   ← Java 21 版サンプル
```

## 技術スタック

- **フロントエンド**: Next.js (Static Export) + TypeScript + Tailwind CSS
- **ホスティング**: Cloudflare Pages
- **対象 Java バージョン**: Java 8 / Java 17 / Java 21
