import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogAuthorMeta from "@/components/blog/BlogAuthorMeta";
import BlogPostBody from "@/components/blog/BlogPostBody";
import HeroBanner from "@/components/HeroBanner";
import ContentSection from "@/components/layout/ContentSection";
import { getSiteConfig } from "@/lib/content";
import { listBlogPostSlugs, loadBlogPost } from "@/lib/content/load-blog";
import { getRelatedPaperForBlog } from "@/lib/content/load-publications";
import { parsePublicationVenue } from "@/lib/publications-utils";
import { fetchGitHubStarsMap } from "@/lib/github-stars";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listBlogPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = loadBlogPost(slug);
  if (!post) {
    return {};
  }

  const site = getSiteConfig();
  const canonical = `/blog/${post.id}`;
  const authorNames = post.authors.map((author) => author.name);

  return {
    title: post.title,
    description: post.desc,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: `${post.title} | ${site.name}`,
      description: post.desc,
      url: canonical,
      ...(authorNames.length > 0 ? { authors: authorNames } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${site.name}`,
      description: post.desc,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = loadBlogPost(slug);
  if (!post) {
    notFound();
  }

  const site = getSiteConfig();
  const githubStars = await fetchGitHubStarsMap(post.links.map((link) => link.href));
  const relatedPaper = getRelatedPaperForBlog(slug);
  const relatedPaperVenue = relatedPaper
    ? parsePublicationVenue(relatedPaper.venue)
    : null;
  const heroKicker = post.author || post.authors.length > 0 ? (
    <span className="blog-post-hero__kicker">
      <span>{post.date}</span>
      <span aria-hidden> · </span>
      <BlogAuthorMeta
        authors={post.authors}
        authorLabel={post.author}
        linkAuthors
      />
    </span>
  ) : (
    post.date
  );

  return (
    <main>
      <HeroBanner
        title={post.title}
        kicker={heroKicker || site.name}
        tags={post.tags}
        compact
      />

      <ContentSection className="section-page-body section-page-body--blog">
        <article className="blog-post-page">
          <BlogPostBody content={post.body} links={post.links} githubStars={githubStars} />

          {relatedPaper ? (
            <aside className="blog-related-paper">
              <h2 className="blog-related-paper__heading">Related paper</h2>
              <a
                className="blog-related-paper__card"
                href={relatedPaper.href ?? "/publications"}
                target={relatedPaper.href ? "_blank" : undefined}
                rel={relatedPaper.href ? "noopener noreferrer" : undefined}
              >
                <span className="blog-related-paper__title">{relatedPaper.title}</span>
                {relatedPaperVenue?.conference || relatedPaperVenue?.year ? (
                  <span className="blog-related-paper__venue">
                    {[relatedPaperVenue.conference, relatedPaperVenue.year]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                ) : null}
              </a>
            </aside>
          ) : null}

          <footer className="blog-post-page__footer">
            <Link href="/blog" className="site-link site-link--back">
              ← Back to blog
            </Link>
          </footer>
        </article>
      </ContentSection>
    </main>
  );
}
