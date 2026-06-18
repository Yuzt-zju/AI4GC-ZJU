import MarkdownBody from "@/components/markdown/MarkdownBody";
import BlogResourceLinks from "@/components/blog/BlogResourceLinks";
import type { GitHubStarsMap } from "@/lib/github-stars";
import type { BlogResourceLink } from "@/types/lab";

type BlogPostBodyProps = {
  content: string;
  links?: BlogResourceLink[];
  githubStars?: GitHubStarsMap;
};

/** Splits the body at the first heading so the resource buttons sit after the intro. */
function splitIntro(body: string): { intro: string; rest: string } {
  const match = body.match(/\n#{1,6}\s/);
  if (!match || match.index === undefined) {
    return { intro: body.trim(), rest: "" };
  }
  return {
    intro: body.slice(0, match.index).trim(),
    rest: body.slice(match.index + 1).trim(),
  };
}

export default function BlogPostBody({ content, links = [], githubStars }: BlogPostBodyProps) {
  if (links.length === 0) {
    return <MarkdownBody content={content} variant="blog" />;
  }

  const { intro, rest } = splitIntro(content);

  return (
    <>
      {intro ? <MarkdownBody content={intro} variant="blog" /> : null}
      <BlogResourceLinks links={links} githubStars={githubStars} />
      {rest ? <MarkdownBody content={rest} variant="blog" /> : null}
    </>
  );
}
