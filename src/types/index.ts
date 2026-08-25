export type CategoryType = string;

export interface Category {
  id: string;
  name: CategoryType;
  color: string;
  bgColor: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: CategoryType;
  excerpt: string;
  content: string[];
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
