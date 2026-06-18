import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";
import matter from "gray-matter";
import { CONTENT_PATHS } from "@/lib/content/paths";
import { NEWS_FILE_PATTERN } from "@/lib/content/constants";
import { parseNewsDateKey } from "@/lib/content/date";
import { readYamlFile } from "@/lib/content/read-yaml";
import { newsItemSchema } from "@/lib/content/schema";
import { resolveId } from "@/lib/content/slug";
import type { NewsItem } from "@/types/lab";

function sortNews(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => parseNewsDateKey(b.date) - parseNewsDateKey(a.date));
}

function loadNewsFile(filePath: string, fileName: string): NewsItem {
  const fileId = fileName.replace(NEWS_FILE_PATTERN, "");
  const ext = path.extname(fileName).toLowerCase();

  if (ext === ".md") {
    const { data, content } = matter(readFileSync(filePath, "utf-8"));
    const desc =
      typeof data.desc === "string" && data.desc.trim()
        ? data.desc.trim()
        : content.trim();

    return newsItemSchema.parse({
      id: resolveId(typeof data.id === "string" ? data.id : undefined, fileId),
      date: data.date,
      title: typeof data.title === "string" ? data.title : "",
      desc,
      href: typeof data.href === "string" ? data.href : undefined,
      featured: typeof data.featured === "boolean" ? data.featured : undefined,
      type: typeof data.type === "string" ? data.type : undefined,
      image:
        typeof data.image === "string" && data.image.trim()
          ? data.image.trim()
          : undefined,
      imageAlt:
        typeof data.imageAlt === "string" && data.imageAlt.trim()
          ? data.imageAlt.trim()
          : undefined,
      links: Array.isArray(data.links) ? data.links : [],
    });
  }

  const raw = readYamlFile<Record<string, unknown>>(filePath);
  return newsItemSchema.parse({
    ...raw,
    id: resolveId(typeof raw.id === "string" ? raw.id : undefined, fileId),
  });
}

export function loadNewsItems(): NewsItem[] {
  const dir = CONTENT_PATHS.newsDir;
  if (!existsSync(dir)) {
    return [];
  }

  const items = readdirSync(dir)
    .filter((file) => NEWS_FILE_PATTERN.test(file))
    .map((file) => loadNewsFile(path.join(dir, file), file));

  return sortNews(items);
}

export { filterNews } from "@/lib/content/filter-news";
