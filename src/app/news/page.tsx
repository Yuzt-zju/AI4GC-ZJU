import type { Metadata } from "next";
import NewsPageClient from "@/components/news/NewsPageClient";
import { getNewsItems, getSiteConfig } from "@/lib/content";
import { collectGitHubHrefsFromNewsItems, fetchGitHubStarsMap } from "@/lib/github-stars";
import { buildListPageMetadata } from "@/lib/site/page-metadata";

export function generateMetadata(): Metadata {
  return buildListPageMetadata("news", "/news");
}

export default async function NewsPage() {
  const site = getSiteConfig();
  const newsItems = getNewsItems();
  const githubStars = await fetchGitHubStarsMap(collectGitHubHrefsFromNewsItems(newsItems));

  return (
    <NewsPageClient
      newsItems={newsItems}
      visibleCount={site.newsPageVisibleCount}
      githubStars={githubStars}
    />
  );
}
