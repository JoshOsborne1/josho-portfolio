import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://josho.pro";
  const now = new Date();

  const games = ["word", "sudoku", "2048", "trivia", "memory", "wordchain", "math", "crossword", "wordscramble"];

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/games`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/wave`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/money`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/uptrend`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/premium`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...games.map(game => ({
      url: `${base}/games/${game}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
