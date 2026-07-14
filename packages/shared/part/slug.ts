import { Name as Products } from "./product";

// Generic noise words to strip from slugs
const NOISE_WORDS = [
  /\bprocessor\b/gi,
  /\bgraphics\b/gi,
  /\bcpu\b/gi,
  /\bapu\b/gi,
  /\bedition\b/gi,
  /\bgaming\b/gi,
  /\bboxed\b/gi,
  /\bbox\b/gi,
  /\btray\b/gi,
  /\bseries\b/gi,
  /\bwith\b/gi,
  /\bnear\b/gi,
  /\bsilent\b/gi,
  /\bthermal\b/gi,
  /\bsolution\b/gi,
  /\bcooler\b/gi,
  /\band\b/gi,
  /\bsupporting\b/gi,
  /\btechnology\b/gi,
  /\bht\b/gi,
  /\bwraith\b/gi,
  /\bformerly\b/gi,
  /\bproducts\b/gi,
  /\blga\s*\d+\b/gi,
  /\bfclga\s*\d+\b/gi,
  /\bsocket\s*[a-z0-9]+\b/gi,
];

/**
 * Generates a clear, descriptive slug for any hardware part name.
 * Strips trademarks and generic noise words, replacing spaces/special characters with single hyphens.
 * Examples:
 *   - 'Intel® Core™ i5-12400F Processor' -> 'intel-core-i5-12400f'
 *   - 'Asus TUF GAMING B660M-PLUS WIFI D4' -> 'asus-tuf-b660m-plus-wifi-d4'
 */
export function generateSlug(name: string, productType?: Products): string {
  if (!name) {
    return "";
  }
  let t = name.toLowerCase();
  t = t.replace(/[®™]/g, "");
  t = t.replace(/\(tm\)|\(r\)/gi, "");

  // Strip noise words
  for (const regex of NOISE_WORDS) {
    t = t.replace(regex, "");
  }

  // Replace non-alphanumeric characters with hyphens
  t = t.replace(/[^a-z0-9]+/g, "-");

  // Strip trailing/leading hyphens and deduplicate
  t = t.replace(/^-+|-+$/g, "");
  t = t.replace(/-+/g, "-");

  return t;
}
