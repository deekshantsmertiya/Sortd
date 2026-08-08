import { useQuery } from "@tanstack/react-query";
import { MOCK_ARTICLES } from "@/data/articles";
import { Article, CategoryType } from "@/types";

export function getArticles(): Article[] {
  if (typeof window === "undefined") return MOCK_ARTICLES;
  const stored = localStorage.getItem("sortd_articles");
  if (!stored) {
    localStorage.setItem("sortd_articles", JSON.stringify(MOCK_ARTICLES));
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
    localStorage.setItem("sortd_articles", JSON.stringify(articles));
  }
}

export function useArticles(category?: CategoryType) {
  return useQuery<Article[]>({
    queryKey: ["articles", category],
    queryFn: async () => {
      const list = getArticles();
      if (!category) return list;
      return list.filter((item) => item.category.toUpperCase() === category.toUpperCase());
    },
    initialData: () => {
      const list = getArticles();
      if (!category) return list;
      return list.filter((item) => item.category.toUpperCase() === category.toUpperCase());
    },
  });
}

export function useArticleBySlug(slug: string) {
  return useQuery<Article | undefined>({
    queryKey: ["article", slug],
    queryFn: async () => {
      const list = getArticles();
      return list.find((item) => item.slug === slug || item.id === slug) || list[0];
    },
    initialData: () => {
      const list = getArticles();
      return list.find((item) => item.slug === slug || item.id === slug) || list[0];
    },
  });
}
