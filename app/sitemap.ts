import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://java-recipes.pages.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // カテゴリ TOP ページ
  const categoryPages = [
    "/dates/",
    "/strings/",
    "/collections/",
    "/fileio/",
    "/network/",
  ];

  // サンプル記事ページ
  const articlePages = [
    // 日付・時刻
    "/dates/d01/",

    // 文字列（追加次第ここに追記）

    // コレクション（追加次第ここに追記）

    // ファイルI/O（追加次第ここに追記）

    // ネットワーク（追加次第ここに追記）
  ];

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL + "/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...categoryPages.map((path) => ({
      url: BASE_URL + path,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...articlePages.map((path) => ({
      url: BASE_URL + path,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return staticPages;
}
