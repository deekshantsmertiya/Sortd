import type { Article } from "@/types";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** HTML for an article: the rich-text body if present, otherwise built from the legacy paragraph list. */
export function articleToHtml(article: Pick<Article, "content" | "contentHtml">): string {
  if (article.contentHtml) return article.contentHtml;
  return (article.content || [])
    .map((p) => {
      if (p.startsWith("QUOTE_START")) {
        return `<blockquote><p>${esc(p.replace("QUOTE_START", "").replace("QUOTE_END", "").trim())}</p></blockquote>`;
      }
      return `<p>${esc(p)}</p>`;
    })
    .join("");
}

/** Plain-text paragraphs from editor HTML, kept in `content` for search and older components. */
export function htmlToParagraphs(html: string): string[] {
  if (typeof window === "undefined") return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  return Array.from(doc.body.querySelectorAll("p, h2, h3, h4, li, blockquote"))
    .filter((el) => !(el.tagName === "P" && el.closest("blockquote, li")))
    .map((el) => (el.textContent || "").trim())
    .filter(Boolean);
}
