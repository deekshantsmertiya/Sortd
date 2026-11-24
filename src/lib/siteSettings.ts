"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SeoSettings } from "@/types";

/* ------------------------------------------------------------------ */
/* Homepage sections                                                   */
/* ------------------------------------------------------------------ */

export type HomeSectionId =
  | "hero" | "latest" | "categories" | "videos" | "highlight" | "popular" | "people" | "locations";

export interface HomeSectionMeta {
  id: HomeSectionId;
  name: string;
  description: string;
  /** Where it appears, in plain words, so editors can find it on the site. */
  location: string;
  /** Where its content is managed in admin. */
  managedIn: string;
}

export interface HomeSectionConfig {
  id: HomeSectionId;
  showDesktop: boolean;
  showMobile: boolean;
  /** Optional custom heading shown on the website (falls back to the default). */
  title?: string;
  /** Optional short intro text shown under the heading. */
  subtitle?: string;
}

/** Default heading/intro per section, and whether that section shows a heading/intro at all. */
export const SECTION_TEXT_DEFAULTS: Partial<Record<HomeSectionId, { title: string; subtitle?: string; supportsSubtitle: boolean }>> = {
  latest: { title: "LATEST STORIES", supportsSubtitle: true },
  videos: { title: "VIDEOS", supportsSubtitle: true },
  popular: { title: "POPULAR STORIES", supportsSubtitle: true },
  people: { title: "SORTD PEOPLE", subtitle: "Meet the faces behind Dubai's stories — the creators, founders and neighbours shaping the city.", supportsSubtitle: true },
  locations: { title: "LOCATIONS", supportsSubtitle: true },
};

/** Heading + intro for a section, honouring admin overrides. */
export function useSectionText(id: HomeSectionId): { title: string; subtitle?: string } {
  const { data } = useHomeSections();
  const d = SECTION_TEXT_DEFAULTS[id];
  const cfg = data?.find((x) => x.id === id);
  return {
    title: (cfg?.title?.trim() || d?.title || "").toUpperCase(),
    subtitle: cfg?.subtitle !== undefined ? cfg.subtitle.trim() || undefined : d?.subtitle,
  };
}

export const HOME_SECTIONS: Record<HomeSectionId, HomeSectionMeta> = {
  hero: {
    id: "hero", name: "Hero Banner",
    description: "Full-width image directly under the header (optionally with the skyline + logo strip above it).",
    location: "Homepage › top, under the yellow header",
    managedIn: "Banner Images tab",
  },
  latest: {
    id: "latest", name: "Latest Stories",
    description: "Row of the newest article cards with a “View all” link to the paginated Latest Stories page.",
    location: "Homepage › “LATEST STORIES” heading",
    managedIn: "Articles tab (tick “Latest Stories”)",
  },
  categories: {
    id: "categories", name: "News / Culture / Community",
    description: "Three category columns on desktop; a swipeable slider with a progress bar on mobile.",
    location: "Homepage › “NEWS”, “CULTURE”, “COMMUNITY” headings",
    managedIn: "Articles tab (by category)",
  },
  videos: {
    id: "videos", name: "Videos",
    description: "Carousel of video stories (MP4 or Instagram reels). Opens a full-screen story viewer.",
    location: "Homepage › “VIDEOS” heading",
    managedIn: "Videos tab",
  },
  highlight: {
    id: "highlight", name: "Highlight Article",
    description: "Large single-article feature block.",
    location: "Homepage › large featured article block after Videos",
    managedIn: "Articles tab (tick “Highlight Block”)",
  },
  popular: {
    id: "popular", name: "Popular Stories",
    description: "List of the most-read articles.",
    location: "Homepage › “POPULAR STORIES” heading",
    managedIn: "Articles tab (tick “Popular Stories”)",
  },
  people: {
    id: "people", name: "Sortd People",
    description: "Cards featuring members of the Sortd community.",
    location: "Homepage › “SORTD PEOPLE” heading",
    managedIn: "Sortd People tab",
  },
  locations: {
    id: "locations", name: "Locations",
    description: "City/emirate cards (Dubai, Abu Dhabi, Sharjah…).",
    location: "Homepage › locations strip near the bottom, above the footer",
    managedIn: "Locations tab",
  },
};

export const DEFAULT_HOME_SECTIONS: HomeSectionConfig[] = (
  ["hero", "latest", "categories", "videos", "highlight", "popular", "locations", "people"] as HomeSectionId[]
).map((id) => ({
  id,
  showDesktop: id !== "locations" && id !== "people", // Locations and Sortd People hidden by default
  showMobile: id !== "people", // Sortd People hidden by default; turn on in Admin › Homepage & SEO
}));

const SECTIONS_KEY = "sortd_home_sections";

export function getHomeSections(): HomeSectionConfig[] {
  if (typeof window === "undefined") return DEFAULT_HOME_SECTIONS;
  try {
    const raw = localStorage.getItem(SECTIONS_KEY);
    if (!raw) return DEFAULT_HOME_SECTIONS;
    const saved = JSON.parse(raw) as HomeSectionConfig[];
    const known = saved.filter((s) => s.id in HOME_SECTIONS);
    // Append any sections added in code since the admin last saved.
    const missing = DEFAULT_HOME_SECTIONS.filter((d) => !known.some((s) => s.id === d.id));
    const result = [...known, ...missing];
    // Ensure locations is before people matching Figma order
    const locIdx = result.findIndex((s) => s.id === "locations");
    const pplIdx = result.findIndex((s) => s.id === "people");
    if (locIdx > -1 && pplIdx > -1 && locIdx > pplIdx) {
      const [loc] = result.splice(locIdx, 1);
      result.splice(pplIdx, 0, loc);
    }
    return result;
  } catch {
    return DEFAULT_HOME_SECTIONS;
  }
}

export function saveHomeSections(list: HomeSectionConfig[]) {
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(list));
}

export function useHomeSections() {
  return useQuery<HomeSectionConfig[]>({
    queryKey: ["home_sections"],
    queryFn: async () => getHomeSections(),
    placeholderData: DEFAULT_HOME_SECTIONS,
  });
}

/* ------------------------------------------------------------------ */
/* Page SEO                                                            */
/* ------------------------------------------------------------------ */

export type PageKey = "home" | "latest" | "news";

export const PAGE_SEO_META: Record<PageKey, { name: string; path: string }> = {
  home: { name: "Homepage", path: "/" },
  latest: { name: "Latest Stories", path: "/latest" },
  news: { name: "All Stories / Category pages", path: "/news" },
};

export interface PageSeo extends SeoSettings {
  /** Custom URL path for the page (informational; the route itself is fixed in code). */
  slug?: string;
}

const PAGE_SEO_KEY = "sortd_page_seo";

export function getPageSeo(): Record<PageKey, PageSeo> {
  const empty = { home: {}, latest: {}, news: {} } as Record<PageKey, PageSeo>;
  if (typeof window === "undefined") return empty;
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(PAGE_SEO_KEY) || "{}") };
  } catch {
    return empty;
  }
}

export function savePageSeo(v: Record<PageKey, PageSeo>) {
  localStorage.setItem(PAGE_SEO_KEY, JSON.stringify(v));
}

const SITE_NAME = "sortd Dubai";

/**
 * Updates a <meta> tag's content. Never removes tags: Next.js/React own the ones from `metadata`,
 * and removing them breaks React when the page unmounts. Tags we create ourselves are marked
 * with data-sortd-seo and are only emptied (not removed) when a page has no value.
 */
function setMeta(attr: "name" | "property", key: string, content?: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    if (!content) return;
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute("data-sortd-seo", "");
    document.head.appendChild(el);
  }
  if (content) el.setAttribute("content", content);
  else if (el.hasAttribute("data-sortd-seo")) el.setAttribute("content", "");
}

/**
 * Applies SEO tags in the browser. `fallback` supplies defaults (e.g. an article's headline/excerpt)
 * when the admin left a field empty.
 */
export function useSeo(seo: SeoSettings | undefined, fallback: { title?: string; description?: string } = {}) {
  const title = seo?.metaTitle?.trim() || (fallback.title ? `${fallback.title} | ${SITE_NAME}` : undefined);
  const description = seo?.metaDescription?.trim() || fallback.description;
  const keywords = seo?.keywords?.length ? seo.keywords.join(", ") : undefined;
  useEffect(() => {
    if (title) document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "keywords", keywords);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
  }, [title, description, keywords]);
}

export function usePageSeo(page: PageKey, fallback: { title?: string; description?: string } = {}) {
  const { data } = useQuery({ queryKey: ["page_seo"], queryFn: async () => getPageSeo() });
  useSeo(data?.[page], fallback);
}

/* ------------------------------------------------------------------ */
/* Design, footer links & location settings                            */
/* ------------------------------------------------------------------ */

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  x?: string;
  linkedin?: string;
  whatsapp?: string;
  email?: string;
}

export interface SiteSettings {
  /** Colour of the vertical line (and text) beside pull-quotes in every article. */
  articleLineColor: string;
  /** Show the Locations section (city cards) on the website. When off it is hidden on every device. */
  locationsEnabled: boolean;
  social: SocialLinks;
  /** Content of the /about page (linked from "About" in the header, menu and footer). */
  about: { title: string; body: string };
}

const PARAGRAPH_BREAK = String.fromCharCode(10, 10);

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  about: {
    title: "About Sortd",
    body: [
      "Sortd is Dubai's unfiltered take on news, culture and community — every story built to be read in 60 seconds.",
      "We cover what's changing in the city, the people behind it, and the places worth knowing about, without the noise.",
      "Got a story, a tip or a correction? Get in touch through the links in the footer.",
    ].join(PARAGRAPH_BREAK),
  },
  articleLineColor: "#E8185A",
  locationsEnabled: false, // hidden by default; turn on in Admin › Site Settings
  social: {
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
    youtube: "https://www.youtube.com/",
  },
};

const SITE_KEY = "sortd_site_settings";

export function getSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;
  try {
    const raw = JSON.parse(localStorage.getItem(SITE_KEY) || "{}");
    return { ...DEFAULT_SITE_SETTINGS, ...raw, social: { ...DEFAULT_SITE_SETTINGS.social, ...(raw.social || {}) }, about: { ...DEFAULT_SITE_SETTINGS.about, ...(raw.about || {}) } };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(v: SiteSettings) {
  localStorage.setItem(SITE_KEY, JSON.stringify(v));
}

export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: ["site_settings"],
    queryFn: async () => getSiteSettings(),
    placeholderData: DEFAULT_SITE_SETTINGS,
  });
}

/** Applies design settings as CSS variables on <html>. Mount once (in the root layout). */
export function SiteThemeVars() {
  const { data } = useSiteSettings();
  const color = data?.articleLineColor || DEFAULT_SITE_SETTINGS.articleLineColor;
  useEffect(() => {
    document.documentElement.style.setProperty("--article-line", color);
  }, [color]);
  return null;
}
