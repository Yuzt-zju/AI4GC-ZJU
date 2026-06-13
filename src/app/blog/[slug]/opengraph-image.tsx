import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/content";
import { listBlogPostSlugs, loadBlogPost } from "@/lib/content/load-blog";
import { getSiteHost } from "@/lib/site/site-url";
import { getLogoDataUri } from "@/lib/site/og-logo";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard, truncate } from "@/lib/site/og-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AI4GC Lab blog post";

export function generateStaticParams() {
  return listBlogPostSlugs().map((slug) => ({ slug }));
}

type ImageProps = { params: Promise<{ slug: string }> };

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const post = loadBlogPost(slug);
  const site = getSiteConfig();

  const title = post ? truncate(post.title, 90) : site.name;
  const subtitle = post
    ? [post.author, post.date].filter(Boolean).join(" · ")
    : site.tagline;

  return new ImageResponse(
    renderOgCard({
      kicker: "AI4GC Lab · Blog",
      title,
      subtitle,
      domain: getSiteHost(),
      logoSrc: getLogoDataUri(),
    }),
    { ...size },
  );
}
