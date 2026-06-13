import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/content";
import { listMemberProfileSlugs, loadMemberProfile } from "@/lib/content/load-team";
import { getSiteHost } from "@/lib/site/site-url";
import { getLogoDataUri } from "@/lib/site/og-logo";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard, truncate } from "@/lib/site/og-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AI4GC Lab member profile";

export function generateStaticParams() {
  return listMemberProfileSlugs().map((slug) => ({ slug }));
}

type ImageProps = { params: Promise<{ slug: string }> };

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const profile = loadMemberProfile(slug);
  const site = getSiteConfig();

  if (!profile) {
    return new ImageResponse(
      renderOgCard({
        kicker: site.schoolName,
        title: site.name,
        subtitle: site.tagline,
        domain: getSiteHost(),
        logoSrc: getLogoDataUri(),
      }),
      { ...size },
    );
  }

  const { member } = profile;
  const subtitle = member.degree || (member.tags ?? []).slice(0, 3).join(" · ");

  return new ImageResponse(
    renderOgCard({
      kicker: "AI4GC Lab · Team",
      title: truncate(member.name, 60),
      subtitle,
      domain: getSiteHost(),
      logoSrc: getLogoDataUri(),
    }),
    { ...size },
  );
}
