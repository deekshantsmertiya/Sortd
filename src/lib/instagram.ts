/**
 * Instagram link helpers.
 * Accepts the link formats people actually paste:
 *   https://www.instagram.com/reel/ABC123/
 *   https://instagram.com/reels/ABC123?igsh=xyz
 *   https://www.instagram.com/p/ABC123/?utm_source=ig_web_copy_link
 *   https://www.instagram.com/tv/ABC123
 *   https://www.instagram.com/someuser/reel/ABC123/
 *   https://instagr.am/p/ABC123
 */
const IG_RE = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:instagram\.com|instagr\.am)\/(?:[A-Za-z0-9._]+\/)?(p|reels?|tv)\/([A-Za-z0-9_-]+)/i;

export function parseInstagramUrl(url?: string): { kind: "p" | "reel" | "tv"; code: string } | null {
  if (!url) return null;
  const m = url.trim().match(IG_RE);
  if (!m) return null;
  const kind = m[1].toLowerCase().startsWith("reel") ? "reel" : (m[1].toLowerCase() as "p" | "tv");
  return { kind, code: m[2] };
}

export const isInstagramUrl = (url?: string) => !!parseInstagramUrl(url);

/** Mentions instagram but isn't a post/reel link we can embed (e.g. a profile or story link). */
export const looksLikeUnsupportedInstagram = (url?: string) =>
  !!url && /instagram\.com|instagr\.am/i.test(url) && !isInstagramUrl(url);

export function getInstagramEmbedUrl(url?: string): string {
  const p = parseInstagramUrl(url);
  if (!p) return "";
  return `https://www.instagram.com/${p.kind}/${p.code}/embed/`;
}

/** Canonical, clean link to store (strips tracking params). */
export function normalizeInstagramUrl(url: string): string {
  const p = parseInstagramUrl(url);
  return p ? `https://www.instagram.com/${p.kind}/${p.code}/` : url.trim();
}
