import { useQuery } from "@tanstack/react-query";
import { MOCK_ARTICLES } from "@/data/articles";
import { Article, CategoryType } from "@/types";

export function useArticles(category?: CategoryType) {
  return useQuery<Article[]>({
    queryKey: ["articles", category],
    queryFn: async () => {
      if (!category) return MOCK_ARTICLES;
      return MOCK_ARTICLES.filter((item) => item.category === category);
    },
    initialData: category
      ? MOCK_ARTICLES.filter((item) => item.category === category)
      : MOCK_ARTICLES,
  });
}

export function useArticleBySlug(slug: string) {
  return useQuery<Article | undefined>({
    queryKey: ["article", slug],
    queryFn: async () => {
      return MOCK_ARTICLES.find((item) => item.slug === slug || item.id === slug) || MOCK_ARTICLES[0];
    },
    initialData: MOCK_ARTICLES.find((item) => item.slug === slug || item.id === slug) || MOCK_ARTICLES[0],
  });
}

