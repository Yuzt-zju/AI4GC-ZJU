import { loadSiteConfig } from "@/lib/content/load-site";

const DEFAULT_DEV_URL = "http://localhost:3000";

function normalize(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

/**
 * Single source of truth for the site's absolute base URL, used by metadata,
 * canonical links, the sitemap, and Open Graph tags.
 *
 * Resolution order: SITE_URL env → Vercel deployment URL → site.yaml `url` → localhost.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.SITE_URL?.trim();
  if (fromEnv) {
    return normalize(fromEnv);
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel?.trim()) {
    return normalize(`https://${vercel.trim()}`);
  }

  const fromConfig = loadSiteConfig().url;
  if (fromConfig?.trim()) {
    return normalize(fromConfig);
  }

  return DEFAULT_DEV_URL;
}

/** Host portion of the site URL (e.g. "ai4gc.zju.edu.cn"), for display in OG cards. */
export function getSiteHost(): string {
  try {
    return new URL(getSiteUrl()).host;
  } catch {
    return "";
  }
}

/** Builds an absolute URL for a site-relative path (e.g. "/team" → "https://.../team"). */
export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
