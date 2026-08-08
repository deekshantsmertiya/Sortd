import { useQuery } from "@tanstack/react-query";

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

export function getSubscribers(): Subscriber[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("sortd_subscribers");
  if (!stored) return [];
  try {
    return JSON.parse(stored) as Subscriber[];
  } catch (e) {
    return [];
  }
}

export function addSubscriber(email: string): boolean {
  if (typeof window === "undefined" || !email) return false;
  const current = getSubscribers();
  if (current.some((sub) => sub.email.toLowerCase() === email.toLowerCase())) {
    return false;
  }
  const updated = [
    {
      email: email.trim(),
      subscribedAt: new Date().toLocaleString(),
    },
    ...current,
  ];
  localStorage.setItem("sortd_subscribers", JSON.stringify(updated));
  return true;
}

export function useSubscribers() {
  return useQuery<Subscriber[]>({
    queryKey: ["subscribers"],
    queryFn: async () => {
      return getSubscribers();
    },
  });
}
