import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/content";
import { getSiteUrl } from "@/lib/site/site-url";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteConfig();

  if (!site.indexable) {
    return {
      rules: {
        userAgent: "*",
        disallow: ["/", "/admin"],
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
