import { useQuery } from "@tanstack/react-query";
import { MOCK_LOCATIONS } from "@/data/locations";
import { MOCK_PEOPLE } from "@/data/people";
import { MOCK_VIDEOS } from "@/data/videos";

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      return MOCK_LOCATIONS;
    },
    initialData: MOCK_LOCATIONS,
  });
}

export function usePeople() {
  return useQuery({
    queryKey: ["people"],
    queryFn: async () => {
      return MOCK_PEOPLE;
    },
    initialData: MOCK_PEOPLE,
  });
}

export function useVideos() {
  return useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      return MOCK_VIDEOS;
    },
    initialData: MOCK_VIDEOS,
  });
}

