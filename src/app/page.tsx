import HomePageClient from "@/components/home/HomePageClient";
import {
  collectGitHubHrefsFromHome,
  collectGitHubHrefsFromNewsItems,
  fetchGitHubStarsMap,
} from "@/lib/github-stars";
import { getHomeContent, getNewsItems, getSiteConfig } from "@/lib/content";

export default async function HomePage() {
  const home = getHomeContent();
  const site = getSiteConfig();
  const newsItems = getNewsItems();
  const githubStars = await fetchGitHubStarsMap([
    ...collectGitHubHrefsFromHome(home),
    ...collectGitHubHrefsFromNewsItems(newsItems),
  ]);

  return (
    <HomePageClient
      home={home}
      newsItems={newsItems}
      defaultNewsLimit={site.featuredNewsCount}
      githubStars={githubStars}
    />
  );
}
