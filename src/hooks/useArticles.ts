import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MOCK_ARTICLES } from "@/data/articles";
import { Article, CategoryType } from "@/types";

const STORAGE_KEY = "sortd_articles";
export const PREVIEW_SLUG = "__preview";
const PREVIEW_KEY = "sortd_article_preview";

/** Raw list including drafts, scheduled and archived (admin use). */
export function getArticles(): Article[] {
  if (typeof window === "undefined") return MOCK_ARTICLES;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ARTICLES));
    return MOCK_ARTICLES;
  }
  try {
    return JSON.parse(stored) as Article[];
  } catch (e) {
    return MOCK_ARTICLES;
  }
}

export function saveArticles(articles: Article[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  }
}

/** Is the article visible to readers right now? Legacy articles without a status count as published. */
export function isLive(a: Article, now = Date.now()): boolean {
  const status = a.status || "published";
  if (status === "published") return true;
  if (status === "scheduled") return !!a.scheduledAt && new Date(a.scheduledAt).getTime() <= now;
  return false;
}

/**
 * Auto-publish: flips every scheduled article whose time has passed to "published".
 * Returns the number of articles published.
 */
export function publishDueArticles(now = Date.now()): number {
  if (typeof window === "undefined") return 0;
  const list = getArticles();
  let count = 0;
  const next = list.map((a) => {
    if (a.status === "scheduled" && a.scheduledAt && new Date(a.scheduledAt).getTime() <= now) {
      count++;
      return { ...a, status: "published" as const, publishedAtIso: a.scheduledAt, publishedAt: "Just now" };
    }
    return a;
  });
  if (count) saveArticles(next);
  return count;
}

/** Milliseconds until the next scheduled article is due, or null if none. */
function msUntilNextScheduled(now = Date.now()): number | null {
  const times = getArticles()
    .filter((a) => a.status === "scheduled" && a.scheduledAt)
    .map((a) => new Date(a.scheduledAt!).getTime() - now);
  if (!times.length) return null;
  return Math.max(0, Math.min(...times));
}

/** Keeps scheduled articles publishing on time while any page is open. */
export function useScheduledPublisher(onPublished?: (count: number) => void) {
  const queryClient = useQueryClient();
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const n = publishDueArticles();
      if (n) {
        queryClient.invalidateQueries({ queryKey: ["articles"] });
        queryClient.invalidateQueries({ queryKey: ["article"] });
        onPublished?.(n);
      }
      const wait = msUntilNextScheduled();
      // Re-check at the next due time (capped at 60s so clock changes / new schedules are picked up).
      timer = setTimeout(tick, wait === null ? 60_000 : Math.min(Math.max(wait + 500, 1000), 60_000));
    };
    tick();
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

const liveList = (category?: CategoryType) => {
  publishDueArticles();
  const list = getArticles().filter((a) => isLive(a));
  if (!category) return list;
  return list.filter((item) => item.category.toUpperCase() === category.toUpperCase());
};

/** Public article list: only live articles. */
export function useArticles(category?: CategoryType) {
  useScheduledPublisher();
  return useQuery<Article[]>({
    queryKey: ["articles", category],
    queryFn: async () => liveList(category),
    initialData: () => liveList(category),
  });
}

/** Stores an unsaved article so /article/__preview can render it exactly like the real page. */
export function setArticlePreview(article: Article) {
  localStorage.setItem(PREVIEW_KEY, JSON.stringify(article));
}

const findBySlug = (slug: string): Article | undefined => {
  if (typeof window !== "undefined" && slug === PREVIEW_SLUG) {
    try {
      const raw = localStorage.getItem(PREVIEW_KEY);
      return raw ? (JSON.parse(raw) as Article) : undefined;
    } catch {
      return undefined;
    }
  }
  const list = liveList();
  return list.find((item) => item.slug === slug || item.id === slug);
};

export function useArticleBySlug(slug: string) {
  return useQuery<Article | undefined>({
    queryKey: ["article", slug],
    queryFn: async () => findBySlug(slug),
    initialData: () => findBySlug(slug),
  });
}
