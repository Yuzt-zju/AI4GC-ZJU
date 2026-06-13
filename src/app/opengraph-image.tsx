import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/content";
import { getSiteHost } from "@/lib/site/site-url";
import { getLogoDataUri } from "@/lib/site/og-logo";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/site/og-card";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "AI4GC Lab";

export default function Image() {
  const site = getSiteConfig();

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
