import type { ReactElement } from "react";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Literal hex approximations of the site's oklch palette (Satori needs concrete colors).
const COLOR = {
  brand: "#343f87",
  bgSoft: "#f5f6f8",
  surface: "#ffffff",
  text: "#20232b",
  muted: "#5b606b",
  hairline: "#e2e4e9",
};

export function truncate(text: string, max: number): string {
  const clean = text.trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

type OgCardProps = {
  kicker: string;
  title: string;
  subtitle?: string;
  /** Right-aligned footer note, e.g. the site domain. */
  domain?: string;
  logoSrc?: string | null;
};

/** Renders a 1200×630 branded share card for use with next/og ImageResponse. */
export function renderOgCard({ kicker, title, subtitle, domain, logoSrc }: OgCardProps): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: COLOR.bgSoft,
        color: COLOR.text,
        fontFamily: "sans-serif",
      }}
    >
      {/* top accent bar */}
      <div style={{ display: "flex", height: 14, backgroundColor: COLOR.brand }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "64px 72px",
        }}
      >
        {/* header: logo + kicker */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoSrc} width={72} height={66} alt="" style={{ objectFit: "contain" }} />
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: COLOR.muted,
            }}
          >
            {kicker}
          </div>
        </div>

        {/* body: title + subtitle, vertically centered */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 62, fontWeight: 700, lineHeight: 1.12 }}>
            {title}
          </div>
          {subtitle ? (
            <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: COLOR.muted }}>
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: `2px solid ${COLOR.hairline}`,
            fontSize: 24,
            color: COLOR.muted,
          }}
        >
          <div style={{ display: "flex" }}>AI4GC Lab · Zhejiang University</div>
          {domain ? <div style={{ display: "flex" }}>{domain}</div> : null}
        </div>
      </div>
    </div>
  );
}
