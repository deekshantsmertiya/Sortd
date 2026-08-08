import { useQuery } from "@tanstack/react-query";
import { MOCK_LOCATIONS } from "@/data/locations";
import { MOCK_PEOPLE } from "@/data/people";
import { MOCK_VIDEOS } from "@/data/videos";
import { VideoStory, LocationItem, PersonSpotlight } from "@/types";

export interface HomepageImages {
  heroLeftDesktop: string;
  heroCenterDesktop: string;
  heroRightDesktop: string;
  heroLeftMobile: string;
  heroCenterMobile: string;
  heroRightMobile: string;
}

export const DEFAULT_IMAGES: HomepageImages = {
  heroLeftDesktop: "/hero-left.png",
  heroCenterDesktop: "/hero-center.png",
  heroRightDesktop: "/hero-right.png",
  heroLeftMobile: "/hero-left-mobile.png",
  heroCenterMobile: "/hero-center-mobile.png",
  heroRightMobile: "/hero-right-mobile.png",
};

export function getHomepageImages(): HomepageImages {
  if (typeof window === "undefined") return DEFAULT_IMAGES;
  const stored = localStorage.getItem("sortd_homepage_images");
  if (!stored) return DEFAULT_IMAGES;
  try {
    return { ...DEFAULT_IMAGES, ...JSON.parse(stored) };
  } catch (e) {
    return DEFAULT_IMAGES;
  }
}

export function saveHomepageImages(images: HomepageImages) {
  if (typeof window !== "undefined") {
    localStorage.setItem("sortd_homepage_images", JSON.stringify(images));
  }
}

export function useHomepageImages() {
  return useQuery<HomepageImages>({
    queryKey: ["homepage_images"],
    queryFn: async () => {
      return getHomepageImages();
    },
    initialData: DEFAULT_IMAGES,
  });
}

// Videos dynamic storage
export function getVideos(): VideoStory[] {
  if (typeof window === "undefined") return MOCK_VIDEOS;
  const stored = localStorage.getItem("sortd_videos");
  if (!stored) {
    localStorage.setItem("sortd_videos", JSON.stringify(MOCK_VIDEOS));
    return MOCK_VIDEOS;
  }
  try {
    return JSON.parse(stored) as VideoStory[];
  } catch (e) {
    return MOCK_VIDEOS;
  }
}

export function saveVideos(videos: VideoStory[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("sortd_videos", JSON.stringify(videos));
  }
}

export function useVideos() {
  return useQuery<VideoStory[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      return getVideos();
    },
    initialData: () => {
      return getVideos();
    },
  });
}

// Locations dynamic storage
export function getLocations(): LocationItem[] {
  if (typeof window === "undefined") return MOCK_LOCATIONS;
  const stored = localStorage.getItem("sortd_locations");
  if (!stored) {
    localStorage.setItem("sortd_locations", JSON.stringify(MOCK_LOCATIONS));
    return MOCK_LOCATIONS;
  }
  try {
    return JSON.parse(stored) as LocationItem[];
  } catch (e) {
    return MOCK_LOCATIONS;
  }
}

export function saveLocations(locations: LocationItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("sortd_locations", JSON.stringify(locations));
  }
}

export function useLocations() {
  return useQuery<LocationItem[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      return getLocations();
    },
    initialData: () => {
      return getLocations();
    },
  });
}

// Sortd People dynamic storage
export function getPeople(): PersonSpotlight[] {
  if (typeof window === "undefined") return MOCK_PEOPLE;
  const stored = localStorage.getItem("sortd_people");
  if (!stored) {
    localStorage.setItem("sortd_people", JSON.stringify(MOCK_PEOPLE));
    return MOCK_PEOPLE;
  }
  try {
    return JSON.parse(stored) as PersonSpotlight[];
  } catch (e) {
    return MOCK_PEOPLE;
  }
}

export function savePeople(people: PersonSpotlight[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("sortd_people", JSON.stringify(people));
  }
}

export function usePeople() {
  return useQuery<PersonSpotlight[]>({
    queryKey: ["people"],
    queryFn: async () => {
      return getPeople();
    },
    initialData: () => {
      return getPeople();
    },
  });
}
