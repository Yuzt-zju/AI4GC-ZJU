import type { Metadata } from "next";
import BlogPageClient from "@/components/blog/BlogPageClient";
import { getBlogPosts, getSiteConfig } from "@/lib/content";
import { buildListPageMetadata } from "@/lib/site/page-metadata";

export function generateMetadata(): Metadata {
  return buildListPageMetadata("blog", "/blog");
}

export default async function BlogPage() {
  const site = getSiteConfig();
  const posts = getBlogPosts();

  return (
    <BlogPageClient posts={posts} visibleCount={site.blogPageVisibleCount} />
  );
}
