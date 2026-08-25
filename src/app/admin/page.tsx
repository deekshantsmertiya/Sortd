"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import {
  Lock,
  User,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  List,
  FolderOpen,
  Mail,
  Download,
  Search,
  Eye,
  FileText,
  Menu,
  X,
  PlusCircle,
  Settings,
  Tv,
  MapPin,
  Users,
  ShieldAlert,
} from "lucide-react";
import { Article, Category, VideoStory, LocationItem, PersonSpotlight } from "@/types";
import { getArticles, saveArticles } from "@/hooks/useArticles";
import { getCategories, saveCategories, getCategoryBadgeStyle } from "@/hooks/categoryStyles";
import { getSubscribers, Subscriber } from "@/hooks/useSubscribers";
import {
  HomepageImages,
  getHomepageImages,
  saveHomepageImages,
  DEFAULT_IMAGES,
  getVideos,
  saveVideos,
  getLocations,
  saveLocations,
  getPeople,
  savePeople,
} from "@/hooks/useData";

type TabType = "posts" | "videos" | "locations" | "people" | "categories" | "subscribers" | "settings" | "users";

interface UserAccount {
  username: string;
  password?: string;
  role: "admin" | "uploader";
}

const DEFAULT_USERS: UserAccount[] = [
  { username: "sortd_web", password: "Sortd@2026", role: "admin" },
];

function getUserAccounts(): UserAccount[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  const stored = localStorage.getItem("sortd_admin_users");
  if (!stored) {
    localStorage.setItem("sortd_admin_users", JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    return JSON.parse(stored) as UserAccount[];
  } catch (e) {
    return DEFAULT_USERS;
  }
}

function saveUserAccounts(users: UserAccount[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("sortd_admin_users", JSON.stringify(users));
  }
}

export default function AdminPage() {
  const queryClient = useQueryClient();

  // Authentication & Role State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState<"admin" | "uploader">("uploader");
  const [currentUser, setCurrentUser] = useState("");
  const [authError, setAuthError] = useState("");

  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data States
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [videos, setVideos] = useState<VideoStory[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [people, setPeople] = useState<PersonSpotlight[]>([]);
  const [homeImages, setHomeImages] = useState<HomepageImages>(DEFAULT_IMAGES);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);

  // Search & Filter States
  const [postSearch, setPostSearch] = useState("");
  const [postCategoryFilter, setPostCategoryFilter] = useState("ALL");
  const [videoSearch, setVideoSearch] = useState("");
  const [videoCategoryFilter, setVideoCategoryFilter] = useState("ALL");
  const [locationSearch, setLocationSearch] = useState("");
  const [peopleSearch, setPeopleSearch] = useState("");
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  // Modals visibility
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);

  // Article Modal Form States
  const [editingPost, setEditingPost] = useState<Article | null>(null);
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("NEWS");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postReadTime, setPostReadTime] = useState("60 SECONDS");
  const [postIsHero, setPostIsHero] = useState(false);
  const [postIsLatest, setPostIsLatest] = useState(false);
  const [postIsHighlight, setPostIsHighlight] = useState(false);
  const [postIsPopular, setPostIsPopular] = useState(false);

  // Video Modal Form States
  const [editingVideo, setEditingVideo] = useState<VideoStory | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("NEWS");
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoDuration, setVideoDuration] = useState("02:00");
  const [videoLongDescription, setVideoLongDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Automatically determine video duration when videoUrl is pasted/changed
  useEffect(() => {
    if (!videoUrl) {
      setVideoDuration("02:00");
      return;
    }
    if (videoUrl.includes("instagram.com")) {
      setVideoDuration("01:00");
    } else {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";
      videoElement.onloadedmetadata = () => {
        const seconds = videoElement.duration;
        if (!isNaN(seconds) && isFinite(seconds)) {
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          const formatted = `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
          setVideoDuration(formatted);
        }
      };
      videoElement.src = videoUrl;
    }
  }, [videoUrl]);

  // Location Modal Form States
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);
  const [locationName, setLocationName] = useState("");
  const [locationTagline, setLocationTagline] = useState("");
  const [locationLandmarkType, setLocationLandmarkType] = useState("atlantis");
  const [locationArticleCount, setLocationArticleCount] = useState(10);
  const [locationImageUrl, setLocationImageUrl] = useState("");

  // Person Modal Form States
  const [editingPerson, setEditingPerson] = useState<PersonSpotlight | null>(null);
  const [personName, setPersonName] = useState("");
  const [personTitle, setPersonTitle] = useState("");
  const [personQuote, setPersonQuote] = useState("");
  const [personImageUrl, setPersonImageUrl] = useState("");
  const [personCategory, setPersonCategory] = useState("CULTURE");

  // Category Form States
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6");

  // User Management Form States
  const [newUsername, setNewUsername] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "uploader">("uploader");

  // Load Admin Authentication & Data on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("sortd_admin_logged_in") === "true";
      const role = (localStorage.getItem("sortd_admin_role") as "admin" | "uploader") || "uploader";
      const user = localStorage.getItem("sortd_admin_user") || "";
      setIsLoggedIn(logged);
      setUserRole(role);
      setCurrentUser(user);
      if (role === "uploader") {
        setActiveTab("posts");
      }
    }
    loadData();
  }, []);

  const loadData = () => {
    setArticles(getArticles());
    setCategories(getCategories());
    setSubscribers(getSubscribers());
    setVideos(getVideos());
    setLocations(getLocations());
    setPeople(getPeople());
    setHomeImages(getHomepageImages());
    setUserAccounts(getUserAccounts());
  };

  const handleFileUpload = async (file: File, type: "image" | "video"): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await res.json();
      return data.url;
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
      return "";
    } finally {
      setIsUploading(false);
    }
  };

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const list = getUserAccounts();
    const found = list.find((u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password);
    
    if (found) {
      localStorage.setItem("sortd_admin_logged_in", "true");
      localStorage.setItem("sortd_admin_role", found.role);
      localStorage.setItem("sortd_admin_user", found.username);
      setIsLoggedIn(true);
      setUserRole(found.role);
      setCurrentUser(found.username);
      if (found.role === "uploader") {
        setActiveTab("posts");
      }
      setAuthError("");
      loadData();
    } else {
      setAuthError("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sortd_admin_logged_in");
    localStorage.removeItem("sortd_admin_role");
    localStorage.removeItem("sortd_admin_user");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setCurrentUser("");
  };

  // Sync React Query cache
  const invalidateMainQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["articles"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    queryClient.invalidateQueries({ queryKey: ["subscribers"] });
    queryClient.invalidateQueries({ queryKey: ["videos"] });
    queryClient.invalidateQueries({ queryKey: ["locations"] });
    queryClient.invalidateQueries({ queryKey: ["people"] });
    queryClient.invalidateQueries({ queryKey: ["homepage_images"] });
  };

  // 1. Article Actions
  const openNewPostModal = () => {
    setEditingPost(null);
    setPostTitle("");
    const cats = getCategories();
    setPostCategory(cats[0]?.name || "NEWS");
    setPostImageUrl("");
    setPostExcerpt("");
    setPostContent("");
    setPostReadTime("60 SECONDS");
    setPostIsHero(false);
    setPostIsLatest(false);
    setPostIsHighlight(false);
    setPostIsPopular(false);
    setIsPostModalOpen(true);
  };

  const openEditPostModal = (post: Article) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostCategory(post.category);
    setPostImageUrl(post.imageUrl);
    setPostExcerpt(post.excerpt);
    setPostContent(post.content.join("\n\n"));
    setPostReadTime(post.readTime);
    setPostIsHero(!!post.isHero);
    setPostIsLatest(!!post.isLatest);
    setPostIsHighlight(!!post.isHighlight);
    setPostIsPopular(!!post.isPopular);
    setIsPostModalOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postImageUrl || !postExcerpt || !postContent) {
      alert("Please fill in all required fields.");
      return;
    }

    const slug = postTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const currentList = getArticles();

    if (editingPost) {
      const updated = currentList.map((item) => {
        if (item.id === editingPost.id) {
          return {
            ...item,
            title: postTitle,
            category: postCategory,
            imageUrl: postImageUrl,
            excerpt: postExcerpt,
            content: postContent.split(/\n\s*\n/).filter((p) => p.trim() !== ""),
            readTime: postReadTime,
            isHero: postIsHero,
            isLatest: postIsLatest,
            isHighlight: postIsHighlight,
            isPopular: postIsPopular,
            slug,
          };
        }
        return item;
      });
      saveArticles(updated);
    } else {
      const newId = `post-${Date.now()}`;
      const newPost: Article = {
        id: newId,
        title: postTitle,
        slug,
        category: postCategory,
        excerpt: postExcerpt,
        content: postContent.split(/\n\s*\n/).filter((p) => p.trim() !== ""),
        imageUrl: postImageUrl,
        publishedAt: "Just now",
        readTime: postReadTime,
        isHero: postIsHero,
        isLatest: postIsLatest,
        isHighlight: postIsHighlight,
        isPopular: postIsPopular,
      };
      saveArticles([newPost, ...currentList]);
    }

    setIsPostModalOpen(false);
    loadData();
    invalidateMainQueries();
  };

  const handleDeletePost = (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const currentList = getArticles();
    const filtered = currentList.filter((item) => item.id !== id);
    saveArticles(filtered);
    loadData();
    invalidateMainQueries();
  };

  // 2. Video Actions
  const openNewVideoModal = () => {
    setEditingVideo(null);
    setVideoTitle("");
    const cats = getCategories();
    setVideoCategory(cats[0]?.name || "NEWS");
    setVideoThumbnailUrl("");
    setVideoUrl("");
    setVideoDescription("");
    setVideoDuration("02:00");
    setVideoLongDescription("");
    setIsVideoModalOpen(true);
  };

  const openEditVideoModal = (video: VideoStory) => {
    setEditingVideo(video);
    setVideoTitle(video.title);
    setVideoCategory(video.category);
    setVideoThumbnailUrl(video.thumbnailUrl);
    setVideoUrl(video.videoUrl || "");
    setVideoDescription(video.description);
    setVideoDuration(video.duration);
    setVideoLongDescription(video.longDescription || "");
    setIsVideoModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoThumbnailUrl || !videoDescription || !videoLongDescription) {
      alert("Please fill in all required fields.");
      return;
    }

    const currentList = getVideos();

    if (editingVideo) {
      const updated = currentList.map((item) => {
        if (item.id === editingVideo.id) {
          return {
            ...item,
            title: videoTitle,
            category: videoCategory,
            thumbnailUrl: videoThumbnailUrl,
            videoUrl: videoUrl || undefined,
            description: videoDescription,
            duration: videoDuration,
            longDescription: videoLongDescription || undefined,
          };
        }
        return item;
      });
      saveVideos(updated);
    } else {
      const newId = `video-${Date.now()}`;
      const newVideo: VideoStory = {
        id: newId,
        title: videoTitle,
        category: videoCategory,
        thumbnailUrl: videoThumbnailUrl,
        videoUrl: videoUrl || undefined,
        description: videoDescription,
        duration: videoDuration,
        longDescription: videoLongDescription || undefined,
      };
      saveVideos([newVideo, ...currentList]);
    }

    setIsVideoModalOpen(false);
    loadData();
    invalidateMainQueries();
  };

  const handleDeleteVideo = (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    const currentList = getVideos();
    const filtered = currentList.filter((item) => item.id !== id);
    saveVideos(filtered);
    loadData();
    invalidateMainQueries();
  };

  // 3. Location Actions (Admin Only)
  const openNewLocationModal = () => {
    setEditingLocation(null);
    setLocationName("");
    setLocationTagline("");
    setLocationLandmarkType("atlantis");
    setLocationArticleCount(5);
    setLocationImageUrl("");
    setIsLocationModalOpen(true);
  };

  const openEditLocationModal = (loc: LocationItem) => {
    setEditingLocation(loc);
    setLocationName(loc.name);
    setLocationTagline(loc.tagline);
    setLocationLandmarkType(loc.landmarkType);
    setLocationArticleCount(loc.articleCount);
    setLocationImageUrl(loc.imageUrl || "");
    setIsLocationModalOpen(true);
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName || !locationTagline || !locationImageUrl) {
      alert("Please fill in all required fields.");
      return;
    }

    const currentList = getLocations();

    if (editingLocation) {
      const updated = currentList.map((item) => {
        if (item.id === editingLocation.id) {
          return {
            ...item,
            name: locationName.toUpperCase(),
            tagline: locationTagline,
            landmarkType: locationLandmarkType as any,
            articleCount: Number(locationArticleCount),
            imageUrl: locationImageUrl,
          };
        }
        return item;
      });
      saveLocations(updated);
    } else {
      const newId = `loc-${Date.now()}`;
      const newLoc: LocationItem = {
        id: newId,
        name: locationName.toUpperCase(),
        tagline: locationTagline,
        landmarkType: locationLandmarkType as any,
        articleCount: Number(locationArticleCount),
        imageUrl: locationImageUrl,
      };
      saveLocations([...currentList, newLoc]);
    }

    setIsLocationModalOpen(false);
    loadData();
    invalidateMainQueries();
  };

  const handleDeleteLocation = (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    const currentList = getLocations();
    const filtered = currentList.filter((item) => item.id !== id);
    saveLocations(filtered);
    loadData();
    invalidateMainQueries();
  };

  // 4. Person Spotlight Actions (Admin Only)
  const openNewPersonModal = () => {
    setEditingPerson(null);
    setPersonName("");
    setPersonTitle("");
    setPersonQuote("");
    setPersonImageUrl("");
    setPersonCategory("CULTURE");
    setIsPersonModalOpen(true);
  };

  const openEditPersonModal = (person: PersonSpotlight) => {
    setEditingPerson(person);
    setPersonName(person.name);
    setPersonTitle(person.title);
    setPersonQuote(person.quote);
    setPersonImageUrl(person.imageUrl);
    setPersonCategory(person.category);
    setIsPersonModalOpen(true);
  };

  const handleSavePerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName || !personTitle || !personQuote || !personImageUrl) {
      alert("Please fill in all required fields.");
      return;
    }

    const currentList = getPeople();

    if (editingPerson) {
      const updated = currentList.map((item) => {
        if (item.id === editingPerson.id) {
          return {
            ...item,
            name: personName.toUpperCase(),
            title: personTitle.toUpperCase(),
            quote: personQuote,
            imageUrl: personImageUrl,
            category: personCategory,
          };
        }
        return item;
      });
      savePeople(updated);
    } else {
      const newId = `person-${Date.now()}`;
      const newPerson: PersonSpotlight = {
        id: newId,
        name: personName.toUpperCase(),
        title: personTitle.toUpperCase(),
        quote: personQuote,
        imageUrl: personImageUrl,
        category: personCategory,
      };
      savePeople([...currentList, newPerson]);
    }

    setIsPersonModalOpen(false);
    loadData();
    invalidateMainQueries();
  };

  const handleDeletePerson = (id: string) => {
    if (!confirm("Are you sure you want to delete this spotlight team member?")) return;
    const currentList = getPeople();
    const filtered = currentList.filter((item) => item.id !== id);
    savePeople(filtered);
    loadData();
    invalidateMainQueries();
  };

  // 5. Category Actions (Admin Only)
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const nameUpper = newCategoryName.trim().toUpperCase();
    const currentCats = getCategories();

    if (currentCats.some((c) => c.name.toUpperCase() === nameUpper)) {
      alert("Category already exists.");
      return;
    }

    const newId = nameUpper.toLowerCase();
    const newCat: Category = {
      id: newId,
      name: nameUpper,
      color: newCategoryColor,
      bgColor: newCategoryColor,
    };

    const updated = [...currentCats, newCat];
    saveCategories(updated);
    setNewCategoryName("");
    setNewCategoryColor("#3B82F6");
    loadData();
    invalidateMainQueries();
  };

  const handleDeleteCategory = (id: string, name: string) => {
    const list = getArticles();
    const count = list.filter((item) => item.category.toUpperCase() === name.toUpperCase()).length;
    if (count > 0) {
      alert(`Cannot delete category "${name}" because it is currently assigned to ${count} posts.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    const currentCats = getCategories();
    const filtered = currentCats.filter((c) => c.id !== id);
    saveCategories(filtered);
    loadData();
    invalidateMainQueries();
  };

  // 6. Homepage Banner Settings Actions (Admin Only)
  const handleSaveHomepageImages = (e: React.FormEvent) => {
    e.preventDefault();
    saveHomepageImages(homeImages);
    queryClient.invalidateQueries({ queryKey: ["homepage_images"] });
    alert("Homepage banner settings updated successfully!");
  };

  const handleResetImage = (field: keyof HomepageImages) => {
    setHomeImages((prev) => ({
      ...prev,
      [field]: DEFAULT_IMAGES[field],
    }));
  };

  // 7. Dynamic User Accounts Actions (Admin Only)
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    // Permission Check: Only the main administrator (sortd_web) is allowed to perform user CRUD operations
    if (currentUser.toLowerCase() !== "sortd_web") {
      alert("Permission Denied: Only the main administrator account can create user accounts.");
      return;
    }

    if (!newUsername.trim() || !newUserPassword.trim()) return;

    const currentUsers = getUserAccounts();
    const nameLower = newUsername.trim().toLowerCase();

    if (currentUsers.some((u) => u.username.toLowerCase() === nameLower)) {
      alert("User account username already exists.");
      return;
    }

    const newUser: UserAccount = {
      username: newUsername.trim(),
      password: newUserPassword,
      role: newUserRole,
    };

    const updated = [...currentUsers, newUser];
    saveUserAccounts(updated);
    setNewUsername("");
    setNewUserPassword("");
    setNewUserRole("uploader");
    loadData();
  };

  const handleDeleteUser = (usernameToDelete: string) => {
    // Permission Check: Only the main administrator (sortd_web) is allowed to perform user CRUD operations
    if (currentUser.toLowerCase() !== "sortd_web") {
      alert("Permission Denied: Only the main administrator account can delete user accounts.");
      return;
    }

    if (usernameToDelete === "sortd_web") {
      alert("Cannot delete the system locked default admin user.");
      return;
    }

    if (!confirm(`Are you sure you want to delete user account "${usernameToDelete}"?`)) return;

    const currentUsers = getUserAccounts();
    const filtered = currentUsers.filter((u) => u.username !== usernameToDelete);
    saveUserAccounts(filtered);
    loadData();
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      alert("No subscribers to export.");
      return;
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Email,Subscribed At\n";
    subscribers.forEach((sub) => {
      csvContent += `"${sub.email}","${sub.subscribedAt}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sortd_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filters calculation
  const filteredArticles = articles.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(postSearch.toLowerCase());
    const matchesCategory =
      postCategoryFilter === "ALL" ||
      post.category.toUpperCase() === postCategoryFilter.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const filteredVideos = videos.filter((vid) => {
    const matchesSearch =
      vid.title.toLowerCase().includes(videoSearch.toLowerCase()) ||
      vid.description.toLowerCase().includes(videoSearch.toLowerCase());
    const matchesCategory =
      videoCategoryFilter === "ALL" ||
      vid.category.toUpperCase() === videoCategoryFilter.toUpperCase();
    return matchesSearch && matchesCategory;
  });

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    loc.tagline.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredPeople = people.filter((p) =>
    p.name.toLowerCase().includes(peopleSearch.toLowerCase()) ||
    p.title.toLowerCase().includes(peopleSearch.toLowerCase()) ||
    p.quote.toLowerCase().includes(peopleSearch.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  const filteredUsers = userAccounts.filter((u) =>
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Login view
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center px-4 select-none">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/header.png"
              alt="Sortd Logo"
              width={100}
              height={30}
              className="object-contain"
              priority
            />
          </div>
          
          <h2 className="font-heading text-4xl text-sortd-black uppercase tracking-wider mb-2 text-center">
            ADMIN LOCKSCREEN
          </h2>
          <p className="text-xs text-sortd-grey font-body font-semibold mb-6 text-center">
            Log in to manage articles, categories and subscribers.
          </p>

          {authError && (
            <div className="w-full p-3 bg-red-50 text-red-600 rounded-[6px] text-xs font-bold uppercase tracking-wider mb-4 border border-red-100 text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[12px] text-sm text-sortd-black placeholder:text-gray-400 focus:outline-none font-body font-medium transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[12px] text-sm text-sortd-black placeholder:text-gray-400 focus:outline-none font-body font-medium transition-colors"
              />
            </div>

            <div className="flex justify-end -mt-1 select-none">
              <button
                type="button"
                onClick={() => alert("Please contact the administrator at admin@sortd.ae to reset your credentials.")}
                className="text-[11px] text-sortd-grey hover:text-sortd-pink font-body font-bold tracking-wide hover:underline focus:outline-none transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-[12px] bg-sortd-yellow hover:bg-sortd-yellow-hover text-sortd-black font-heading text-lg tracking-widest uppercase transition-colors shadow-sm text-center flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-sortd-black" />
              <span>UNLOCK ADMIN PANEL</span>
            </button>
          </form>
        </div>
        <p className="text-[10px] text-gray-500 font-body font-bold mt-6 uppercase tracking-widest">
          © 2026 SORTD DUBAI. ALL RIGHTS RESERVED.
        </p>
      </div>
    );
  }

  const isAdmin = userRole === "admin";

  return (
    <div className="h-screen overflow-hidden bg-[#F7F9FC] flex flex-col lg:flex-row text-sortd-black">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-slate-900 text-white h-screen sticky top-0 p-6 select-none shrink-0 border-r border-slate-800">
        <div className="flex flex-col h-full min-h-0">
          {/* Logo Brand */}
          <div className="relative w-[79.5px] h-[111px] mb-6 mt-2 mx-auto shrink-0">
            <Image
              src="/Footer.png"
              alt="Sortd Logo"
              fill
              className="object-contain"
              sizes="79.5px"
            />
          </div>

          <h1 className="font-heading font-normal text-xl tracking-wider uppercase text-center mb-6 border-b border-white/5 pb-4 shrink-0">
            Dashboard
          </h1>

          {/* Scrollable Nav Area */}
          <div className="flex-grow overflow-y-auto pr-1 mb-4 min-h-0 select-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
            <nav className="flex flex-col gap-1.5 font-body font-bold text-xs tracking-widest uppercase">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${
                  activeTab === "posts"
                    ? "bg-sortd-yellow text-sortd-black"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Articles ({articles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("videos")}
                className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${
                  activeTab === "videos"
                    ? "bg-sortd-yellow text-sortd-black"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Tv className="w-4 h-4 shrink-0" />
                <span>Videos ({videos.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("categories")}
                className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${
                  activeTab === "categories"
                    ? "bg-sortd-yellow text-sortd-black"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <FolderOpen className="w-4 h-4 shrink-0" />
                <span>Categories ({categories.length})</span>
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => setActiveTab("locations")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${
                      activeTab === "locations"
                        ? "bg-sortd-yellow text-sortd-black"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>Locations ({locations.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("people")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${
                      activeTab === "people"
                        ? "bg-sortd-yellow text-sortd-black"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    <span>Sortd People ({people.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("subscribers")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${
                      activeTab === "subscribers"
                        ? "bg-sortd-yellow text-sortd-black"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>Subscribers ({subscribers.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${
                      activeTab === "settings"
                        ? "bg-sortd-yellow text-sortd-black"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    <span>Banner Images</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("users")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${
                      activeTab === "users"
                        ? "bg-sortd-yellow text-sortd-black"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <Users className="w-4 h-4 shrink-0" />
                    <span>Manage Users ({userAccounts.length})</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="flex flex-col gap-3 font-body font-bold text-xs tracking-widest uppercase border-t border-white/5 pt-4 mt-auto shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-[8px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-[8px] text-red-400 hover:text-white hover:bg-red-900/40 transition-colors text-left w-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sticky Header */}
      <header className="lg:hidden w-full bg-slate-900 text-white h-16 flex items-center justify-between px-4 select-none shrink-0 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1 rounded-md text-slate-400 hover:text-white"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="font-heading font-normal text-md tracking-wider uppercase">
            Sortd Admin ({userRole.toUpperCase()})
          </h2>
        </div>
        <div className="relative w-12 h-6">
          <Image
            src="/Footer.png"
            alt="Sortd Logo"
            fill
            className="object-contain"
            sizes="48px"
          />
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm">
          <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-slate-900 text-white p-5 flex flex-col justify-between shadow-2xl animate-slide-in overflow-y-auto">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
                <span className="font-heading font-normal text-lg tracking-wider uppercase">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5 font-body font-bold text-xs tracking-widest uppercase">
                <button
                  onClick={() => { setActiveTab("posts"); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${activeTab === "posts" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Articles ({articles.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab("videos"); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${activeTab === "videos" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                >
                  <Tv className="w-4 h-4 shrink-0" />
                  <span>Videos ({videos.length})</span>
                </button>

                <button
                  onClick={() => { setActiveTab("categories"); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${activeTab === "categories" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                >
                  <FolderOpen className="w-4 h-4 shrink-0" />
                  <span>Categories ({categories.length})</span>
                </button>

                {isAdmin && (
                  <>
                    <button
                      onClick={() => { setActiveTab("locations"); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${activeTab === "locations" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                    >
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>Locations ({locations.length})</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab("people"); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${activeTab === "people" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                    >
                      <Users className="w-4 h-4 shrink-0" />
                      <span>Sortd People ({people.length})</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab("subscribers"); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${activeTab === "subscribers" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                    >
                      <Mail className="w-4 h-4 shrink-0" />
                      <span>Subscribers ({subscribers.length})</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab("settings"); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${activeTab === "settings" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                    >
                      <Settings className="w-4 h-4 shrink-0" />
                      <span>Banner Images</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab("users"); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${activeTab === "users" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                    >
                      <Users className="w-4 h-4 shrink-0" />
                      <span>Manage Users ({userAccounts.length})</span>
                    </button>
                  </>
                )}
              </nav>
            </div>

            <div className="flex flex-col gap-3 font-body font-bold text-xs tracking-widest uppercase border-t border-white/5 pt-4 mt-6">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-[8px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Eye className="w-4 h-4" />
                <span>View Site</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-[8px] text-red-400 hover:text-white hover:bg-red-900/40 transition-colors text-left w-full">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-10 overflow-y-auto w-full">
        
        {/* TAB: ARTICLES */}
        {activeTab === "posts" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Articles</h2>
                <p className="text-xs text-sortd-grey font-medium mt-1">Manage editorial posts appearing on sections.</p>
              </div>
              <button onClick={openNewPostModal} className="inline-flex items-center justify-center gap-2 px-5 py-3 h-[42px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs tracking-wider uppercase transition-colors shrink-0">
                <Plus className="w-4 h-4" />
                <span>New Article</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium focus:outline-none"
                />
              </div>
              <select
                value={postCategoryFilter}
                onChange={(e) => setPostCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-bold text-sortd-grey bg-white focus:outline-none uppercase"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sortd-grey font-medium">No articles matched search filters.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] sm:text-[11px] font-bold text-sortd-grey uppercase tracking-widest">
                        <th className="py-4 px-6">Image</th>
                        <th className="py-4 px-6">Title</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6 hidden sm:table-cell">Flags</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs font-medium">
                      {filteredArticles.map((post) => {
                        const badge = getCategoryBadgeStyle(post.category);
                        return (
                          <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="relative w-12 h-12 rounded-[6px] overflow-hidden border border-gray-200/50">
                                <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <p className="font-bold line-clamp-1 uppercase tracking-wide">{post.title}</p>
                              <p className="text-[10px] text-sortd-grey mt-0.5 font-normal">{post.slug}</p>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2 py-0.5 rounded-[4px] font-body font-bold text-[8.5px] uppercase tracking-wider inline-flex items-center justify-center ${badge.textColorClass}`} style={{ backgroundColor: badge.bgColor }}>
                                {post.category}
                              </span>
                            </td>
                            <td className="py-4 px-6 hidden sm:table-cell">
                              <div className="flex flex-wrap gap-1">
                                {post.isHero && <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">Hero</span>}
                                {post.isLatest && <span className="bg-yellow-50 text-yellow-600 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">Latest</span>}
                                {post.isHighlight && <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">Highlight</span>}
                                {post.isPopular && <span className="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">Popular</span>}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2.5">
                                <button onClick={() => openEditPostModal(post)} className="p-1.5 rounded-[6px] hover:bg-gray-100 text-sortd-black transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDeletePost(post.id)} className="p-1.5 rounded-[6px] hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: VIDEOS */}
        {activeTab === "videos" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Video Stories</h2>
                <p className="text-xs text-sortd-grey font-medium mt-1">Manage video feeds appearing in horizontal grids.</p>
              </div>
              <button onClick={openNewVideoModal} className="inline-flex items-center justify-center gap-2 px-5 py-3 h-[42px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs tracking-wider uppercase transition-colors shrink-0">
                <Plus className="w-4 h-4" />
                <span>New Video</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={videoSearch}
                  onChange={(e) => setVideoSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium focus:outline-none"
                />
              </div>
              <select
                value={videoCategoryFilter}
                onChange={(e) => setVideoCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-bold text-sortd-grey bg-white focus:outline-none uppercase"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {filteredVideos.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sortd-grey font-medium">No videos found.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] sm:text-[11px] font-bold text-sortd-grey uppercase tracking-widest">
                        <th className="py-4 px-6">Thumbnail</th>
                        <th className="py-4 px-6">Title</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Duration</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs font-medium">
                      {filteredVideos.map((vid) => {
                        const badge = getCategoryBadgeStyle(vid.category);
                        return (
                          <tr key={vid.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="relative w-12 h-16 rounded-[6px] overflow-hidden border border-gray-200/50">
                                <img src={vid.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <p className="font-bold line-clamp-1 uppercase tracking-wide">{vid.title}</p>
                              <p className="text-[10px] text-sortd-grey mt-0.5 font-normal line-clamp-1">{vid.description}</p>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2 py-0.5 rounded-[4px] font-body font-bold text-[8.5px] uppercase tracking-wider inline-flex items-center justify-center ${badge.textColorClass}`} style={{ backgroundColor: badge.bgColor }}>
                                {vid.category}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-mono text-gray-500">{vid.duration}</td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2.5">
                                <button onClick={() => openEditVideoModal(vid)} className="p-1.5 rounded-[6px] hover:bg-gray-100 text-sortd-black transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteVideo(vid.id)} className="p-1.5 rounded-[6px] hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: LOCATIONS (ADMIN ONLY) */}
        {activeTab === "locations" && isAdmin && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Locations</h2>
                <p className="text-xs text-sortd-grey font-medium mt-1">Manage regional cards and custom city image assets.</p>
              </div>
              <button onClick={openNewLocationModal} className="inline-flex items-center justify-center gap-2 px-5 py-3 h-[42px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs tracking-wider uppercase transition-colors shrink-0">
                <Plus className="w-4 h-4" />
                <span>New Location</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm max-w-sm">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            {filteredLocations.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sortd-grey font-medium">No locations matched filters.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] sm:text-[11px] font-bold text-sortd-grey uppercase tracking-widest">
                        <th className="py-4 px-6">Card Image</th>
                        <th className="py-4 px-6">City Name</th>
                        <th className="py-4 px-6">Tagline Description</th>
                        <th className="py-4 px-6">Landmark Type</th>
                        <th className="py-4 px-6">Articles Count</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs font-medium">
                      {filteredLocations.map((loc) => (
                        <tr key={loc.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="relative w-16 h-10 rounded-[6px] overflow-hidden border border-gray-200/50 bg-slate-50 flex items-center justify-center">
                              {loc.imageUrl ? (
                                <img src={loc.imageUrl} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <span className="text-[9px] uppercase font-bold text-slate-400">Default SVG</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 font-bold uppercase tracking-wider">{loc.name}</td>
                          <td className="py-4 px-6 text-gray-500 font-normal">{loc.tagline}</td>
                          <td className="py-4 px-6 font-mono text-[10px] text-blue-600 uppercase">{loc.landmarkType}</td>
                          <td className="py-4 px-6 font-bold">{loc.articleCount} posts</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              <button onClick={() => openEditLocationModal(loc)} className="p-1.5 rounded-[6px] hover:bg-gray-100 text-sortd-black transition-colors"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteLocation(loc.id)} className="p-1.5 rounded-[6px] hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: SORTD PEOPLE (ADMIN ONLY) */}
        {activeTab === "people" && isAdmin && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Sortd People</h2>
                <p className="text-xs text-sortd-grey font-medium mt-1">Manage quote spotlights and profiles on the desktop layout.</p>
              </div>
              <button onClick={openNewPersonModal} className="inline-flex items-center justify-center gap-2 px-5 py-3 h-[42px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs tracking-wider uppercase transition-colors shrink-0">
                <Plus className="w-4 h-4" />
                <span>New Spotlight</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm max-w-sm">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search spotlights..."
                  value={peopleSearch}
                  onChange={(e) => setPeopleSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            {filteredPeople.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sortd-grey font-medium">No spotlights matched.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-[10px] sm:text-[11px] font-bold text-sortd-grey uppercase tracking-widest">
                        <th className="py-4 px-6">Avatar</th>
                        <th className="py-4 px-6">Name</th>
                        <th className="py-4 px-6">Role / Title</th>
                        <th className="py-4 px-6">Quote Snippet</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs font-medium">
                      {filteredPeople.map((p) => {
                        const badge = getCategoryBadgeStyle(p.category);
                        return (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200/50">
                                <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                              </div>
                            </td>
                            <td className="py-4 px-6 font-bold uppercase tracking-wider">{p.name}</td>
                            <td className="py-4 px-6 text-gray-500 uppercase">{p.title}</td>
                            <td className="py-4 px-6 max-w-xs font-normal text-gray-500 italic line-clamp-1">{p.quote}</td>
                            <td className="py-4 px-6">
                              <span className={`px-2 py-0.5 rounded-[4px] font-body font-bold text-[8.5px] uppercase tracking-wider inline-flex items-center justify-center ${badge.textColorClass}`} style={{ backgroundColor: badge.bgColor }}>
                                {p.category}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2.5">
                                <button onClick={() => openEditPersonModal(p)} className="p-1.5 rounded-[6px] hover:bg-gray-100 text-sortd-black transition-colors"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDeletePerson(p.id)} className="p-1.5 rounded-[6px] hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: CATEGORIES (ADMIN ONLY) */}
        {activeTab === "categories" && isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div>
                <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Categories</h2>
                <p className="text-xs text-sortd-grey font-medium mt-1">Create and manage customized category values for articles.</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] sm:text-[11px] font-bold text-sortd-grey uppercase tracking-widest">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Color Preview</th>
                      <th className="py-4 px-6">Post Count</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-medium">
                    {categories.map((cat) => {
                      const postCount = articles.filter((a) => a.category.toUpperCase() === cat.name.toUpperCase()).length;
                      const isDefault = ["news", "culture", "community"].includes(cat.id);
                      return (
                        <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold uppercase tracking-wide">{cat.name}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-[4px] border border-gray-300/40 shrink-0 shadow-sm" style={{ backgroundColor: cat.color }} />
                              <span className="font-mono text-gray-500 uppercase">{cat.color}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-semibold">{postCount} posts</td>
                          <td className="py-4 px-6 text-right">
                            {!isDefault ? (
                              <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="p-1.5 rounded-[6px] hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            ) : (
                              <span className="text-[10px] uppercase font-bold text-gray-400 select-none pr-1.5">Lock System</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <h3 className="font-heading font-normal text-xl uppercase tracking-wider">Create Category</h3>
              <form onSubmit={handleCreateCategory} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 select-none font-body">Category Name (Required)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Travel, Sports"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 select-none font-body">Select HEX Color Theme</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="w-12 h-12 rounded-[8px] border border-gray-200 cursor-pointer overflow-hidden p-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      maxLength={7}
                      required
                      placeholder="#3B82F6"
                      value={newCategoryColor}
                      onChange={(e) => setNewCategoryColor(e.target.value)}
                      className="flex-grow px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-mono font-bold uppercase focus:outline-none"
                    />
                  </div>
                </div>

                <button type="submit" className="w-full mt-2 py-3 rounded-[8px] bg-sortd-yellow hover:bg-sortd-yellow-hover text-sortd-black font-body font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: SUBSCRIBERS (ADMIN ONLY) */}
        {activeTab === "subscribers" && isAdmin && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Newsletter Subscribers</h2>
                <p className="text-xs text-sortd-grey font-medium mt-1">View and export lists of users who signed up to Sortd newsletter.</p>
              </div>
              <button onClick={handleExportCSV} className="inline-flex items-center justify-center gap-2 px-5 py-3 h-[42px] rounded-[8px] border-2 border-slate-900 bg-white hover:bg-gray-100 text-slate-950 font-body font-bold text-xs tracking-wider uppercase transition-colors shrink-0">
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-900/10 text-slate-900 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Total Subscribers</span>
                  <span className="text-3xl font-heading font-bold text-sortd-black">{subscribers.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search subscribers by email..."
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sortd-grey font-medium">No subscribers matched your search.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] sm:text-[11px] font-bold text-sortd-grey uppercase tracking-widest">
                      <th className="py-4 px-6">Email Address</th>
                      <th className="py-4 px-6">Subscribed On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-mono font-medium">
                    {filteredSubscribers.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 text-sm font-sans font-bold select-all">{sub.email}</td>
                        <td className="py-4 px-6 font-sans text-gray-500 font-normal">{sub.subscribedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: BANNER IMAGES (ADMIN ONLY) */}
        {activeTab === "settings" && isAdmin && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Homepage Images</h2>
              <p className="text-xs text-sortd-grey font-medium mt-1">Customize the skyline illustration and logo image URLs displayed in the main top banner.</p>
            </div>

            <form onSubmit={handleSaveHomepageImages} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
              
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-sortd-black mb-1 font-body">Desktop Top Banner Configuration (min-width: 768px)</h3>
                <p className="text-[10px] text-sortd-grey font-medium">Skyline elements flanking the center logo mark.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Left Skyline Image (Desktop)</label>
                  <div className="relative w-full h-[100px] rounded-lg overflow-hidden bg-gray-50 border border-gray-100 mb-2 flex items-center justify-center p-2">
                    <img src={homeImages.heroLeftDesktop} className="max-w-full max-h-full object-contain" alt="" />
                  </div>
                  <input
                    type="text"
                    value={homeImages.heroLeftDesktop}
                    onChange={(e) => setHomeImages({ ...homeImages, heroLeftDesktop: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-205 focus:border-sortd-black rounded-lg text-xs font-medium"
                  />
                  <button type="button" onClick={() => handleResetImage("heroLeftDesktop")} className="self-start text-[10px] font-bold text-sortd-pink hover:underline uppercase transition-all">Reset to Default</button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Center Logo Image (Desktop)</label>
                  <div className="relative w-full h-[100px] rounded-lg overflow-hidden bg-gray-50 border border-gray-100 mb-2 flex items-center justify-center p-2">
                    <img src={homeImages.heroCenterDesktop} className="max-w-full max-h-full object-contain" alt="" />
                  </div>
                  <input
                    type="text"
                    value={homeImages.heroCenterDesktop}
                    onChange={(e) => setHomeImages({ ...homeImages, heroCenterDesktop: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-205 focus:border-sortd-black rounded-lg text-xs font-medium"
                  />
                  <button type="button" onClick={() => handleResetImage("heroCenterDesktop")} className="self-start text-[10px] font-bold text-sortd-pink hover:underline uppercase transition-all">Reset to Default</button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Right Skyline Image (Desktop)</label>
                  <div className="relative w-full h-[100px] rounded-lg overflow-hidden bg-gray-55 border border-gray-100 mb-2 flex items-center justify-center p-2">
                    <img src={homeImages.heroRightDesktop} className="max-w-full max-h-full object-contain" alt="" />
                  </div>
                  <input
                    type="text"
                    value={homeImages.heroRightDesktop}
                    onChange={(e) => setHomeImages({ ...homeImages, heroRightDesktop: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-205 focus:border-sortd-black rounded-lg text-xs font-medium"
                  />
                  <button type="button" onClick={() => handleResetImage("heroRightDesktop")} className="self-start text-[10px] font-bold text-sortd-pink hover:underline uppercase transition-all">Reset to Default</button>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-4 mt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-sortd-black mb-1 font-body">Mobile Top Banner Configuration (max-width: 767px)</h3>
                <p className="text-[10px] text-sortd-grey font-medium">Optimized skyline layout sizing for mobile viewports.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Left Skyline Image (Mobile)</label>
                  <div className="relative w-full h-[80px] rounded-lg overflow-hidden bg-gray-50 border border-gray-100 mb-2 flex items-center justify-center p-2">
                    <img src={homeImages.heroLeftMobile} className="max-w-full max-h-full object-contain" alt="" />
                  </div>
                  <input
                    type="text"
                    value={homeImages.heroLeftMobile}
                    onChange={(e) => setHomeImages({ ...homeImages, heroLeftMobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-205 focus:border-sortd-black rounded-lg text-xs font-medium"
                  />
                  <button type="button" onClick={() => handleResetImage("heroLeftMobile")} className="self-start text-[10px] font-bold text-sortd-pink hover:underline uppercase transition-all">Reset to Default</button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Center Logo Image (Mobile)</label>
                  <div className="relative w-full h-[80px] rounded-lg overflow-hidden bg-gray-50 border border-gray-100 mb-2 flex items-center justify-center p-2">
                    <img src={homeImages.heroCenterMobile} className="max-w-full max-h-full object-contain" alt="" />
                  </div>
                  <input
                    type="text"
                    value={homeImages.heroCenterMobile}
                    onChange={(e) => setHomeImages({ ...homeImages, heroCenterMobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-205 focus:border-sortd-black rounded-lg text-xs font-medium"
                  />
                  <button type="button" onClick={() => handleResetImage("heroCenterMobile")} className="self-start text-[10px] font-bold text-sortd-pink hover:underline uppercase transition-all">Reset to Default</button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Right Skyline Image (Mobile)</label>
                  <div className="relative w-full h-[80px] rounded-lg overflow-hidden bg-gray-55 border border-gray-100 mb-2 flex items-center justify-center p-2">
                    <img src={homeImages.heroRightMobile} className="max-w-full max-h-full object-contain" alt="" />
                  </div>
                  <input
                    type="text"
                    value={homeImages.heroRightMobile}
                    onChange={(e) => setHomeImages({ ...homeImages, heroRightMobile: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-205 focus:border-sortd-black rounded-lg text-xs font-medium"
                  />
                  <button type="button" onClick={() => handleResetImage("heroRightMobile")} className="self-start text-[10px] font-bold text-sortd-pink hover:underline uppercase transition-all">Reset to Default</button>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 select-none">
                <button type="submit" className="px-6 py-3.5 rounded-[12px] bg-sortd-yellow hover:bg-sortd-yellow-hover text-sortd-black font-heading text-lg tracking-widest uppercase transition-colors shadow-sm text-center flex items-center justify-center gap-2">
                  <Settings className="w-4 h-4 text-sortd-black" />
                  <span>Save Banner Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: MANAGE USERS (ADMIN ONLY) */}
        {activeTab === "users" && isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div>
                <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">User Account Management</h2>
                <p className="text-xs text-sortd-grey font-medium mt-1">Create sub-editor login credentials and assign restrictive permissions.</p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm max-w-sm">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search user accounts..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-[10px] sm:text-[11px] font-bold text-sortd-grey uppercase tracking-widest">
                      <th className="py-4 px-6">Username</th>
                      <th className="py-4 px-6">Password</th>
                      <th className="py-4 px-6">Assigned Permission Role</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-medium">
                    {filteredUsers.map((u) => {
                      const isLockedUser = u.username === "sortd_web";
                      return (
                        <tr key={u.username} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-6 font-bold font-mono">{u.username}</td>
                          <td className="py-4 px-6 text-gray-500 font-mono select-all">{u.password || "••••••••"}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-0.5 rounded-[4px] font-body font-bold text-[8.5px] uppercase tracking-wider inline-flex items-center justify-center ${u.role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            {!isLockedUser ? (
                              <button
                                onClick={() => handleDeleteUser(u.username)}
                                disabled={currentUser.toLowerCase() !== "sortd_web"}
                                className={`p-1.5 rounded-[6px] transition-colors ${
                                  currentUser.toLowerCase() === "sortd_web"
                                    ? "hover:bg-red-50 text-red-600 cursor-pointer"
                                    : "text-gray-300 cursor-not-allowed opacity-50"
                                }`}
                                title={currentUser.toLowerCase() === "sortd_web" ? "Delete User" : "Permission Denied"}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-[10px] uppercase font-bold text-gray-400 select-none pr-1.5 flex items-center justify-end gap-1"><Lock className="w-3 h-3" /> System Lock</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
              <h3 className="font-heading font-normal text-xl uppercase tracking-wider">Create Account</h3>
              
              {currentUser.toLowerCase() !== "sortd_web" && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] sm:text-xs font-semibold text-red-700 leading-relaxed uppercase tracking-wider">
                  ⚠️ Access Denied: Only the main administrator account ("sortd_web") is authorized to create or delete user accounts.
                </div>
              )}

              <form onSubmit={handleCreateUser} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 select-none font-body">Username (Required)</label>
                  <input
                    type="text"
                    required
                    disabled={currentUser.toLowerCase() !== "sortd_web"}
                    placeholder={currentUser.toLowerCase() === "sortd_web" ? "e.g. editor_dubai" : "Permission Denied"}
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 select-none font-body">Password (Required)</label>
                  <input
                    type="password"
                    required
                    disabled={currentUser.toLowerCase() !== "sortd_web"}
                    placeholder={currentUser.toLowerCase() === "sortd_web" ? "Enter password..." : "Permission Denied"}
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 select-none font-body">Select Permission Level</label>
                  <select
                    value={newUserRole}
                    disabled={currentUser.toLowerCase() !== "sortd_web"}
                    onChange={(e) => setNewUserRole(e.target.value as "admin" | "uploader")}
                    className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-bold text-sortd-grey uppercase tracking-wider bg-white focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="uploader">Uploader (Only manages Articles & Videos)</option>
                    <option value="admin">Admin (Full Access to everything)</option>
                  </select>
                </div>

                <div className="p-3 bg-yellow-50/50 rounded-lg border border-yellow-100/50 flex gap-2">
                  <ShieldAlert className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-yellow-800 leading-normal font-medium">
                    Uploaders only see Articles and Videos tabs. They are completely locked out of database configs, layouts, and subscribers.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={currentUser.toLowerCase() !== "sortd_web"}
                  className={`w-full mt-2 py-3 rounded-[8px] font-body font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 ${
                    currentUser.toLowerCase() === "sortd_web"
                      ? "bg-sortd-yellow hover:bg-sortd-yellow-hover text-sortd-black cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create User</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ARTICLE CREATE / EDIT */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 bg-gray-55 border-b border-gray-100">
              <h3 className="font-heading font-normal text-xl uppercase tracking-wider">{editingPost ? "Edit Article" : "Create New Article"}</h3>
              <button onClick={() => setIsPostModalOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 text-sortd-black transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSavePost} className="flex-grow overflow-y-auto p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Article Title (Required)</label>
                  <input type="text" required placeholder="Enter headline..." value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold text-sortd-black placeholder:text-gray-400 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Category (Required)</label>
                  <select value={postCategory} onChange={(e) => setPostCategory(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-bold text-sortd-grey uppercase tracking-wider bg-white focus:outline-none transition-colors">
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Featured Image (Required)</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file, "image");
                          if (url) setPostImageUrl(url);
                        }
                      }}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-xs file:font-semibold file:bg-sortd-yellow file:text-sortd-black hover:file:bg-sortd-yellow-hover cursor-pointer"
                    />
                    {postImageUrl && (
                      <div className="relative w-12 h-12 rounded-[8px] overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-55">
                        <img src={postImageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  {postImageUrl && (
                    <div className="mt-1 text-[9px] text-gray-500 truncate max-w-xs font-mono">
                      {postImageUrl}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Read Time Tag</label>
                  <input type="text" required placeholder="e.g. 60 SECONDS" value={postReadTime} onChange={(e) => setPostReadTime(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold text-sortd-black placeholder:text-gray-400 focus:outline-none transition-colors uppercase" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Excerpt / Short Summary (Required)</label>
                <textarea required rows={2} placeholder="Summary for grid feeds..." value={postExcerpt} onChange={(e) => setPostExcerpt(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium text-sortd-black focus:outline-none resize-y" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Full Article Content (Required)</label>
                <p className="text-[10px] text-sortd-grey font-medium mb-1.5 font-body">Separate paragraphs by leaving a blank line (double linebreak).</p>
                <textarea required rows={7} placeholder="Write paragraph one...&#10;&#10;Write paragraph two..." value={postContent} onChange={(e) => setPostContent(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium text-sortd-black focus:outline-none resize-y" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-2 select-none font-body font-bold">Section Placement Flags</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 select-none">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer"><input type="checkbox" checked={postIsHero} onChange={(e) => setPostIsHero(e.target.checked)} className="w-4 h-4 text-sortd-yellow focus:ring-sortd-black rounded-[4px]" /><span>Hero Banner</span></label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer"><input type="checkbox" checked={postIsLatest} onChange={(e) => setPostIsLatest(e.target.checked)} className="w-4 h-4 text-sortd-yellow focus:ring-sortd-black rounded-[4px]" /><span>Latest Stories</span></label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer"><input type="checkbox" checked={postIsHighlight} onChange={(e) => setPostIsHighlight(e.target.checked)} className="w-4 h-4 text-sortd-yellow focus:ring-sortd-black rounded-[4px]" /><span>Spotlight Highlight</span></label>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer"><input type="checkbox" checked={postIsPopular} onChange={(e) => setPostIsPopular(e.target.checked)} className="w-4 h-4 text-sortd-yellow focus:ring-sortd-black rounded-[4px]" /><span>Popular Stories</span></label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100 select-none">
                <button type="button" onClick={() => setIsPostModalOpen(false)} className="px-5 py-3 h-[40px] rounded-[8px] border border-gray-200 hover:bg-gray-100 text-sortd-grey font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0">Cancel</button>
                <button type="submit" className="px-5 py-3 h-[40px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-1.5">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIDEO CREATE / EDIT */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 bg-gray-55 border-b border-gray-100">
              <h3 className="font-heading font-normal text-xl uppercase tracking-wider">{editingVideo ? "Edit Video Story" : "Create New Video Story"}</h3>
              <button onClick={() => setIsVideoModalOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 text-sortd-black transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveVideo} className="flex-grow overflow-y-auto p-6 flex flex-col gap-5">
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Video Title (Required)</label>
                <input type="text" required placeholder="Enter video headline..." value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold text-sortd-black focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Category (Required)</label>
                <select value={videoCategory} onChange={(e) => setVideoCategory(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-bold text-sortd-grey uppercase tracking-wider bg-white focus:outline-none transition-colors">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Thumbnail Image (Required)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleFileUpload(file, "image");
                        if (url) setVideoThumbnailUrl(url);
                      }
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-xs file:font-semibold file:bg-sortd-yellow file:text-sortd-black hover:file:bg-sortd-yellow-hover cursor-pointer"
                  />
                  {videoThumbnailUrl && (
                    <div className="relative w-12 h-12 rounded-[8px] overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-55">
                      <img src={videoThumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                {videoThumbnailUrl && (
                  <div className="mt-1 text-[9px] text-gray-500 truncate max-w-xs font-mono">
                    {videoThumbnailUrl}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Instagram Reel / Video URL (or Direct MP4 URL)</label>
                <input
                  type="text"
                  placeholder="e.g. https://www.instagram.com/reel/C8k292iO394/"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold text-sortd-black focus:outline-none transition-colors mb-3"
                />

                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Or Upload Video File (Optional)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Automatically calculate and format video duration
                        const videoElement = document.createElement("video");
                        videoElement.preload = "metadata";
                        videoElement.onloadedmetadata = () => {
                          window.URL.revokeObjectURL(videoElement.src);
                          const seconds = videoElement.duration;
                          const mins = Math.floor(seconds / 60);
                          const secs = Math.floor(seconds % 60);
                          const formatted = `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
                          setVideoDuration(formatted);
                        };
                        videoElement.src = URL.createObjectURL(file);

                        // Upload the video file
                        const url = await handleFileUpload(file, "video");
                        if (url) setVideoUrl(url);
                      }
                    }}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-[8px] file:border-0 file:text-xs file:font-semibold file:bg-sortd-yellow file:text-sortd-black hover:file:bg-sortd-yellow-hover cursor-pointer"
                  />
                  {videoUrl && !videoUrl.includes("instagram.com") && (
                    <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-[4px] border border-green-100 flex-shrink-0">
                      File Selected
                    </div>
                  )}
                </div>
                {videoUrl && (
                  <div className="mt-1.5 text-[9px] text-gray-500 truncate max-w-xs font-mono">
                    Current URL: {videoUrl}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Short Description / Subtitle (Required)</label>
                <textarea required rows={2} placeholder="Sub-caption under the player..." value={videoDescription} onChange={(e) => setVideoDescription(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium text-sortd-black focus:outline-none resize-y" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Main Description (Required)</label>
                <textarea required rows={4} placeholder="Full contextual detail description to show inside the player modal..." value={videoLongDescription} onChange={(e) => setVideoLongDescription(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium text-sortd-black focus:outline-none resize-y" />
              </div>
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100 select-none">
                <button type="button" onClick={() => setIsVideoModalOpen(false)} className="px-5 py-3 h-[40px] rounded-[8px] border border-gray-200 hover:bg-gray-100 text-sortd-grey font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0">Cancel</button>
                <button type="submit" className="px-5 py-3 h-[40px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-1.5">Save Video</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOCATION CREATE / EDIT */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 bg-gray-55 border-b border-gray-100">
              <h3 className="font-heading font-normal text-xl uppercase tracking-wider">{editingLocation ? "Edit Location Card" : "Create New Location Card"}</h3>
              <button onClick={() => setIsLocationModalOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 text-sortd-black transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveLocation} className="flex-grow overflow-y-auto p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Location Name (Required)</label>
                  <input type="text" required placeholder="e.g. DUBAI, SHARJAH" value={locationName} onChange={(e) => setLocationName(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-bold text-sortd-black focus:outline-none transition-colors uppercase" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Landmark Type Code (Figma SVGs)</label>
                  <select value={locationLandmarkType} onChange={(e) => setLocationLandmarkType(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-bold text-sortd-grey uppercase tracking-wider bg-white focus:outline-none transition-colors">
                    <option value="atlantis">Atlantis Sky-Rise</option>
                    <option value="mosque">Grand Mosque</option>
                    <option value="souk">Traditional Blue Souk</option>
                    <option value="fort">Heritage Dhayah Fort</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Tagline / Landmark Subtitle (Required)</label>
                  <input type="text" required placeholder="e.g. Palm Jumeirah & Atlantis Vibes" value={locationTagline} onChange={(e) => setLocationTagline(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium text-sortd-black focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Articles Count Tag</label>
                  <input type="number" min={0} required placeholder="42" value={locationArticleCount} onChange={(e) => setLocationArticleCount(Number(e.target.value))} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-bold text-sortd-black focus:outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Custom Image URL (Required)</label>
                <input type="text" required placeholder="e.g. /Dubai.png or https://unsplash.com/..." value={locationImageUrl} onChange={(e) => setLocationImageUrl(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium text-sortd-black focus:outline-none transition-colors" />
              </div>
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100 select-none">
                <button type="button" onClick={() => setIsLocationModalOpen(false)} className="px-5 py-3 h-[40px] rounded-[8px] border border-gray-200 hover:bg-gray-100 text-sortd-grey font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0">Cancel</button>
                <button type="submit" className="px-5 py-3 h-[40px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-1.5">Save Location</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PERSON SPOTLIGHT CREATE / EDIT */}
      {isPersonModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 bg-gray-55 border-b border-gray-100">
              <h3 className="font-heading font-normal text-xl uppercase tracking-wider">{editingPerson ? "Edit Spotlight Card" : "Create New Spotlight Card"}</h3>
              <button onClick={() => setIsPersonModalOpen(false)} className="p-1.5 rounded-full hover:bg-gray-200 text-sortd-black transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSavePerson} className="flex-grow overflow-y-auto p-6 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Full Name (Required)</label>
                  <input type="text" required placeholder="e.g. SHAH RUKH KHAN" value={personName} onChange={(e) => setPersonName(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-bold text-sortd-black focus:outline-none transition-colors uppercase" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Role / Title (Required)</label>
                  <input type="text" required placeholder="e.g. ACTOR & CREATIVE" value={personTitle} onChange={(e) => setPersonTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold text-sortd-black focus:outline-none transition-colors uppercase" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Image Avatar URL (Required)</label>
                  <input type="url" required placeholder="https://images.unsplash.com/..." value={personImageUrl} onChange={(e) => setPersonImageUrl(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium text-sortd-black focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Category Badge</label>
                  <select value={personCategory} onChange={(e) => setPersonCategory(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-bold text-sortd-grey uppercase tracking-wider bg-white focus:outline-none transition-colors">
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Personal Quote / Short Excerpt (Required)</label>
                <textarea required rows={4} placeholder="Enter spotlight interview quote..." value={personQuote} onChange={(e) => setPersonQuote(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium text-sortd-black focus:outline-none resize-y" />
              </div>
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100 select-none">
                <button type="button" onClick={() => setIsPersonModalOpen(false)} className="px-5 py-3 h-[40px] rounded-[8px] border border-gray-200 hover:bg-gray-100 text-sortd-grey font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0">Cancel</button>
                <button type="submit" className="px-5 py-3 h-[40px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-1.5">Save Spotlight</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
