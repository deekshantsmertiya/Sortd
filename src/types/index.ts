export type CategoryType = string;

export interface Category {
  id: string;
  name: CategoryType;
  color: string;
  bgColor: string;
}

export interface SeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

/** Max characters (incl. spaces) for article titles: 50 always fits 2 lines on the narrowest (mobile) card. */
export const ARTICLE_TITLE_MAX = 50;
/** Shorter than this and the headline sits on 1 line on desktop cards; aim for 36–50. */
export const ARTICLE_TITLE_IDEAL_MIN = 36;

export type ArticleStatus ="draft" | "published" | "scheduled" | "archived";

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: CategoryType;
  excerpt: string;
  content: string[];
  /** Rich-text body (HTML) from the admin editor. When present it is rendered instead of `content`. */
  contentHtml?: string;
  /** Publishing state. Missing = published (legacy articles). */
  status?: ArticleStatus;
  /** UTC ISO instant when a scheduled article goes live. */
  scheduledAt?: string;
  /** IANA time zone the schedule was entered in (for display/editing). */
  scheduledTimeZone?: string;
  /** UTC ISO instant the article went live. */
  publishedAtIso?: string;
  /** Free-form tags (not shown on cards; used for filtering). */
  tags?: string[];
  seo?: SeoSettings;
  imageUrl: string;
  publishedAt: string;
  readTime: string;
  isPopular?: boolean;
  isLatest?: boolean;
  isHighlight?: boolean;
  isHero?: boolean;
  subCategory?: string;
  author?: {
    name: string;
    avatarUrl: string;
    role: string;
  };
}

export interface VideoStory {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  thumbnailUrl: string;
  duration: string;
  videoUrl?: string;
  longDescription?: string;
}

export interface PersonSpotlight {
  id: string;
  name: string;
  title: string;
  quote: string;
  imageUrl: string;
  category: CategoryType;
}

export interface LocationItem {
  id: string;
  name: string;
  tagline: string;
  landmarkType: "museum" | "frame" | "burj" | "atlantis" | "marina" | "creek" | "mosque" | "souk" | "fort";
  articleCount: number;
  imageUrl?: string;
}
