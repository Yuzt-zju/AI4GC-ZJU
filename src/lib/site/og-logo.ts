import { readFileSync } from "fs";
import path from "path";
import { CONTENT_DIR } from "@/lib/content/paths";

const LOGO_RELATIVE = "ai4gclab/AI4GC.png";

/**
 * Reads the lab logo from disk and returns it as a base64 data URI for embedding
 * in OG cards (avoids any network fetch). Returns null if the file is unavailable.
 */
export function getLogoDataUri(): string | null {
  try {
    const filePath = path.join(CONTENT_DIR, "assets", LOGO_RELATIVE);
    const base64 = readFileSync(filePath).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch {
    return null;
  }
}
