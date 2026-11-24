import { canReadStorage } from "@/lib/hydration";
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
  showSkylineBanner?: boolean;
  heroBannerDesktop: string;
  heroBannerMobile: string;
  heroBannerLink?: string;
}

export const DEFAULT_IMAGES: HomepageImages = {
  showSkylineBanner: false,
  heroBannerDesktop: "",
  heroBannerMobile: "",
  heroBannerLink: "",
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
    placeholderData: DEFAULT_IMAGES,
  });
}

// Videos dynamic storage

/** Original upload names → the names the files were renamed to in public/videos. */
const RENAMED_VIDEO_FILES: [string, string][] = [
  ["691243d2e6f08121fe71258a1c41e71b", "/videos/video-1.mp4"],
  ["20e060ffb925ce2def069617e8e1eea7", "/videos/video-2.mp4"],
  ["2959736dbc09d577574f09845ba8cf45", "/videos/video-3.mp4"],
  ["4bc654ec38ebd09123b8e3cfdf276fef", "/videos/video-4.mp4"],
  ["2eb3f62b7d91d00e4297a7ce58c67478", "/videos/video-5.mp4"],
];

export function getVideos(): VideoStory[] {
  if (!canReadStorage()) return MOCK_VIDEOS;
  const stored = localStorage.getItem("sortd_videos_v3");
  if (!stored) {
    localStorage.setItem("sortd_videos_v3", JSON.stringify(MOCK_VIDEOS));
    return MOCK_VIDEOS;
  }
  try {
    const parsed = JSON.parse(stored) as VideoStory[];
    if (parsed.length < MOCK_VIDEOS.length) {
      localStorage.setItem("sortd_videos_v3", JSON.stringify(MOCK_VIDEOS));
      return MOCK_VIDEOS;
    }
    // The old Google sample links now return 403. Swap any still saved for the
    // matching local file (by id), leaving videos the admin added untouched.
    let changed = false;
    const migrated = parsed.map((v) => {
      if (v.videoUrl?.includes("gtv-videos-bucket")) {
        const fresh = MOCK_VIDEOS.find((m) => m.id === v.id);
        if (fresh?.videoUrl) { changed = true; return { ...v, videoUrl: fresh.videoUrl }; }
      }
      // The uploaded files were renamed from their original random names; repoint saved links.
      const renamed = v.videoUrl && RENAMED_VIDEO_FILES.find(([oldId]) => v.videoUrl!.includes(oldId));
      if (renamed) {
        changed = true;
        return { ...v, videoUrl: renamed[1] };
      }
      // Sample card 6 is the "no video" example; drop the old link to a file that was never added.
      if (v.id === "v6" && v.videoUrl === "/videos/video-6.mp4") {
        changed = true;
        return { ...v, videoUrl: undefined };
      }
      return v;
    });
    if (changed) localStorage.setItem("sortd_videos_v3", JSON.stringify(migrated));
    return migrated;
  } catch (e) {
    return MOCK_VIDEOS;
  }
}

export function saveVideos(videos: VideoStory[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("sortd_videos_v3", JSON.stringify(videos));
  }
}

export function useVideos() {
  return useQuery<VideoStory[]>({
    queryKey: ["videos_v3"],
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
  if (!canReadStorage()) return MOCK_LOCATIONS;
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
  if (!canReadStorage()) return MOCK_PEOPLE;
  const stored = localStorage.getItem("sortd_people");
  if (!stored) {
    localStorage.setItem("sortd_people", JSON.stringify(MOCK_PEOPLE));
    return MOCK_PEOPLE;
  }
  try {
    const list = JSON.parse(stored) as PersonSpotlight[];
    // Auto-migrate if stored data still has old unsplash photos or doesn't have the Figma cutouts
    if (
      !list ||
      list.length === 0 ||
      list.some((p) => !p.imageUrl || p.imageUrl.includes("unsplash.com/photo-1506794778202") || !p.imageUrl.startsWith("/people/"))
    ) {
      localStorage.setItem("sortd_people", JSON.stringify(MOCK_PEOPLE));
      return MOCK_PEOPLE;
    }
    return list;
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
