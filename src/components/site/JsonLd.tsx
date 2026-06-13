type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Emits a JSON-LD structured-data script (schema.org) for search engines. */
export default function JsonLd({ data }: JsonLdProps) {
  // Escape "<" so the JSON can never break out of the <script> element.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
