import Image from "next/image";
import LinkChip from "@/components/site/LinkChip";
import { newsDateTimeAttr } from "@/lib/content/date";
import { getNewsLinks } from "@/lib/content/news-links";
import { cn } from "@/lib/utils";
import type { GitHubStarsMap } from "@/lib/github-stars";
import type { NewsItem } from "@/types/lab";

const newsThumbSizes = "(min-width: 768px) 14rem, 100vw";

function resolveNewsImage(image: NewsItem["image"]): string | undefined {
  const trimmed = image?.trim();
  return trimmed ? trimmed : undefined;
}

type NewsListItemProps = {
  item: NewsItem;
  showTitleLink?: boolean;
  compact?: boolean;
  githubStars?: GitHubStarsMap;
};

export default function NewsListItem({
  item,
  showTitleLink = true,
  compact = false,
  githubStars,
}: NewsListItemProps) {
  const titleLink = showTitleLink && item.href;
  const hasTitle = Boolean(item.title);
  const links = getNewsLinks(item);
  const imageSrc = resolveNewsImage(item.image);
  const hasMedia = Boolean(imageSrc);
  const typeSlug = item.type
    ? item.type.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : undefined;

  return (
    <article
      className={cn(
        "site-news-item",
        hasMedia && "site-news-item--with-media",
        compact && "site-news-item--compact",
      )}
    >
      <time className="site-news-item__date" dateTime={newsDateTimeAttr(item.date)}>
        {item.date}
      </time>
      <div className="site-news-item__main">
        {imageSrc ? (
          <div className="site-news-item__media">
            <Image
              src={imageSrc}
              alt={item.imageAlt ?? item.title ?? "News preview"}
              fill
              className="site-news-item__cover"
              sizes={newsThumbSizes}
            />
            {item.type ? (
              <span className={cn("site-news-item__badge", typeSlug && `site-news-item__badge--${typeSlug}`)}>
                {item.type}
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="site-news-item__body">
          {hasTitle ? (
            titleLink ? (
              <a
                href={item.href}
                className="site-news-item__title site-link site-link--title"
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.title}
              </a>
            ) : (
              <h3 className="site-news-item__title">{item.title}</h3>
            )
          ) : (
            <p className="site-news-item__title site-news-item__title--plain">{item.desc}</p>
          )}
          {hasTitle && item.desc ? <p className="site-news-item__desc">{item.desc}</p> : null}
          {links.length > 0 ? (
            <div className="site-link-chip-list site-news-item__links">
              {links.map((link) => (
                <LinkChip key={`${link.label}-${link.href}`} link={link} githubStars={githubStars} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
