import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "news",
    name: "NEWS",
    color: "#FFD100",
    bgColor: "#FFD100",
  },
  {
    id: "culture",
    name: "CULTURE",
    color: "#1B2F6E",
    bgColor: "#1B2F6E",
  },
  {
    id: "community",
    name: "COMMUNITY",
    color: "#E8185A",
    bgColor: "#E8185A",
  },
];

export function getCategories(): Category[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  const stored = localStorage.getItem("sortd_categories");
  if (!stored) {
    localStorage.setItem("sortd_categories", JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  return JSON.parse(stored);
}

export function saveCategories(categories: Category[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("sortd_categories", JSON.stringify(categories));
  }
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      return getCategories();
    },
    initialData: () => {
      return getCategories();
    },
  });
}

function getBrightness(hex: string) {
  const c = hex.replace("#", "");
  try {
    if (c.length === 3) {
      const r = parseInt(c[0] + c[0], 16);
      const g = parseInt(c[1] + c[1], 16);
      const b = parseInt(c[2] + c[2], 16);
      return (r * 299 + g * 587 + b * 114) / 1000;
    } else if (c.length === 6) {
      const r = parseInt(c.slice(0, 2), 16);
      const g = parseInt(c.slice(2, 4), 16);
      const b = parseInt(c.slice(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000;
    }
  } catch (e) {}
  return 0;
}

export function getCategoryBadgeStyle(categoryName: string) {
  if (!categoryName) {
    return {
      bgColor: "#FFD100",
      textColorClass: "text-sortd-black",
    };
  }
  const list = getCategories();
  const cat = list.find((c) => c.name.toUpperCase() === categoryName.toUpperCase());
  if (cat) {
    const br = getBrightness(cat.color);
    return {
      bgColor: cat.color,
      textColorClass: br > 180 ? "text-sortd-black" : "text-white",
    };
  }
  
  // Default fallback
  const brDefault = getBrightness("#FFD100");
  return {
    bgColor: "#FFD100",
    textColorClass: brDefault > 180 ? "text-sortd-black" : "text-white",
  };
}
