"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Loader2,
  Sparkles,
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
  Archive,
  LayoutGrid,
  HelpCircle,
  UserCog,
  ArchiveRestore,
  CalendarClock,
  Send,
  Monitor,
  Smartphone,
} from "lucide-react";
import { Article, Category, VideoStory, LocationItem, PersonSpotlight } from "@/types";
import { getArticles, saveArticles, setArticlePreview, useScheduledPublisher, PREVIEW_SLUG } from "@/hooks/useArticles";
import type { ArticleStatus } from "@/types";
import { ARTICLE_TITLE_MAX, ARTICLE_TITLE_IDEAL_MIN } from "@/types";
import { isInstagramUrl, looksLikeUnsupportedInstagram, normalizeInstagramUrl, parseInstagramUrl, getInstagramEmbedUrl } from "@/lib/instagram";
import { zonedToUtcIso, utcIsoToZoned, formatInZone, isValidTimeZone, allTimeZones } from "@/lib/schedule";
import RichTextEditor from "@/components/admin/RichTextEditor";
import TagInput from "@/components/admin/TagInput";
import HomepageSectionsManager from "@/components/admin/HomepageSectionsManager";
import SiteSettingsPanel from "@/components/admin/SiteSettingsPanel";
import SectionNote from "@/components/admin/SectionNote";
import ImageField from "@/components/admin/ImageField";
import AccountSettings from "@/components/admin/AccountSettings";
import AdminGuide from "@/components/admin/AdminGuide";
import { articleToHtml, htmlToParagraphs } from "@/lib/articleContent";

interface ArticleDraft {
  title: string; category: string; imageUrl: string; excerpt: string; contentHtml: string;
  readTime: string; author: string; isHero: boolean; isLatest: boolean; isHighlight: boolean; isPopular: boolean;
  slug?: string; metaTitle?: string; metaDescription?: string; keywords?: string[]; tags?: string[];
  savedAt: number;
}
const draftKey = (postId: string | null) => `sortd_article_draft_${postId || "new"}`;
const readDraft = (postId: string | null): ArticleDraft | null => {
  try {
    const raw = localStorage.getItem(draftKey(postId));
    return raw ? (JSON.parse(raw) as ArticleDraft) : null;
  } catch {
    return null;
  }
};
const clearDraft = (postId: string | null) => {
  try { localStorage.removeItem(draftKey(postId)); } catch { /* ignore */ }
};
const storageErrorMessage = (err: unknown) => {
  const name = (err as { name?: string })?.name || "";
  if (name === "QuotaExceededError" || /quota/i.test(String(err))) {
    return "Browser storage is full, so this change couldn't be saved. Delete unused articles, videos or images (or upload images instead of pasting them), then try again.";
  }
  return `Couldn't save: ${(err as Error)?.message || "unknown error"}. Nothing was lost — your changes are still in the form, so you can try again.`;
};
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

type TabType = "posts" | "videos" | "locations" | "people" | "categories" | "subscribers" | "settings" | "homepage" | "account" | "guide" | "users";

interface UserAccount {
  username: string;
  password?: string;
  role: "admin" | "uploader";
  /** The main administrator: the only account that can create/delete users. Survives username changes. */
  owner?: boolean;
}

const DEFAULT_USERS: UserAccount[] = [
  { username: "sortd_web", password: "Sortd@2026", role: "admin", owner: true },
];

function getUserAccounts(): UserAccount[] {
  if (typeof window === "undefined") return DEFAULT_USERS;
  const stored = localStorage.getItem("sortd_admin_users");
  if (!stored) {
    localStorage.setItem("sortd_admin_users", JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    const list = JSON.parse(stored) as UserAccount[];
    // Older data had no owner flag: the original "sortd_web" account is the owner,
    // otherwise the first admin. Saved so the flag survives a username change.
    if (list.length && !list.some((u) => u.owner)) {
      const owner = list.find((u) => u.username === "sortd_web") || list.find((u) => u.role === "admin");
      if (owner) {
        owner.owner = true;
        localStorage.setItem("sortd_admin_users", JSON.stringify(list));
      }
    }
    return list;
  } catch (e) {
    return DEFAULT_USERS;
  }
}

function isOwnerAccount(username: string): boolean {
  return !!getUserAccounts().find((u) => u.username.toLowerCase() === username.toLowerCase())?.owner;
}

function saveUserAccounts(users: UserAccount[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("sortd_admin_users", JSON.stringify(users));
  }
}

const STATUS_STYLES: Record<ArticleStatus, string> = {
  published: "bg-green-50 text-green-700 border-green-200",
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  archived: "bg-amber-50 text-amber-700 border-amber-200",
};
function StatusBadge({ status }: { status: ArticleStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
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
  const [postSlug, setPostSlug] = useState("");
  const [postSlugTouched, setPostSlugTouched] = useState(false);
  const [postMetaTitle, setPostMetaTitle] = useState("");
  const [postMetaDescription, setPostMetaDescription] = useState("");
  const [postKeywords, setPostKeywords] = useState<string[]>([]);
  const [postTags, setPostTags] = useState<string[]>([]);
  const [postCategory, setPostCategory] = useState("NEWS");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postReadTime, setPostReadTime] = useState("60 SECONDS");
  const [postIsHero, setPostIsHero] = useState(false);
  const [postIsLatest, setPostIsLatest] = useState(false);
  const [postIsHighlight, setPostIsHighlight] = useState(false);
  const [postIsPopular, setPostIsPopular] = useState(false);
  const [postAuthor, setPostAuthor] = useState("");
  const [postErrors, setPostErrors] = useState<Record<string, string>>({});
  const [postSaveError, setPostSaveError] = useState("");
  const [draftStatus, setDraftStatus] = useState<{ state: "idle" | "saving" | "saved" | "error"; at?: number; msg?: string }>({ state: "idle" });
  const [pendingDraft, setPendingDraft] = useState<ArticleDraft | null>(null);
  const draftBaselineRef = useRef<string | null>(null);
  const [postStatus, setPostStatus] = useState<ArticleStatus>("draft");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("09:00");
  const [schedTz, setSchedTz] = useState("Asia/Dubai");

  // Extra Setting: Fetch image for article
  const [fetchUrlInput, setFetchUrlInput] = useState("");
  const [isFetchingImage, setIsFetchingImage] = useState(false);
  const [fetchImageMessage, setFetchImageMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFetchImageFromUrl = async (urlToFetch?: string) => {
    const targetUrl = (urlToFetch || fetchUrlInput).trim();
    if (!targetUrl) {
      setFetchImageMessage({ type: "error", text: "Please enter or select a valid image URL to fetch." });
      return;
    }
    setIsFetchingImage(true);
    setFetchImageMessage(null);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fetchUrl: targetUrl }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setPostImageUrl(data.url);
        setFetchImageMessage({ type: "success", text: "Image successfully fetched and saved to article!" });
        setFetchUrlInput("");
      } else {
        if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
          setPostImageUrl(targetUrl);
          setFetchImageMessage({ type: "success", text: "Image URL applied to article." });
        } else {
          setFetchImageMessage({ type: "error", text: data.error || "Failed to fetch image." });
        }
      }
    } catch (err: any) {
      if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
        setPostImageUrl(targetUrl);
        setFetchImageMessage({ type: "success", text: "Image URL applied to article." });
      } else {
        setFetchImageMessage({ type: "error", text: err.message || "Failed to fetch image." });
      }
    } finally {
      setIsFetchingImage(false);
    }
  };
  const [publishPreviewOpen, setPublishPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"view" | "publish">("view");
  const [previewNonce, setPreviewNonce] = useState(0);
  const [adminToast, setAdminToast] = useState("");
  const [adminError, setAdminError] = useState("");
  const notifyError = (msg: string) => { setAdminToast(""); setAdminError(msg); };
  useEffect(() => {
    if (!adminError) return;
    const t = setTimeout(() => setAdminError(""), 8000);
    return () => clearTimeout(t);
  }, [adminError]);
  // Anything that throws while saving (e.g. browser storage full) is reported instead of failing silently.
  useEffect(() => {
    const onError = (e: ErrorEvent | PromiseRejectionEvent) => {
      const err = "reason" in e ? e.reason : e.error;
      if (!err) return;
      setAdminError(storageErrorMessage(err));
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onError);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onError);
    };
  }, []);
  const [postStatusFilter, setPostStatusFilter] = useState<"all" | ArticleStatus>("all");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [timeZoneOptions, setTimeZoneOptions] = useState<string[]>(["Asia/Dubai", "UTC"]);
  useEffect(() => setTimeZoneOptions(allTimeZones()), []);
  useEffect(() => {
    if (!adminToast) return;
    const t = setTimeout(() => setAdminToast(""), 4000);
    return () => clearTimeout(t);
  }, [adminToast]);
  // Auto-publish scheduled articles while the admin panel is open, and refresh the list when it happens.
  useScheduledPublisher((n) => {
    loadData();
    setAdminToast(`${n} scheduled article${n > 1 ? "s" : ""} just went live.`);
  });

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
    if (/instagram.com|instagr.am/i.test(videoUrl)) {
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
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryColor, setEditCategoryColor] = useState("#3B82F6");
  const [categoryError, setCategoryError] = useState("");

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
    const maxMb = type === "image" ? 10 : 200;
    if (!file.type.startsWith(type === "image" ? "image/" : "video/")) {
      notifyError(`“${file.name}” isn't ${type === "image" ? "an image" : "a video"} file. Choose a ${type === "image" ? "JPG, PNG, WebP or GIF" : "MP4 or MOV"} file.`);
      return "";
    }
    if (file.size > maxMb * 1024 * 1024) {
      notifyError(`“${file.name}” is ${(file.size / 1024 / 1024).toFixed(1)} MB. The maximum for ${type === "image" ? "images" : "videos"} is ${maxMb} MB.`);
      return "";
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let detail = "";
        try { detail = (await res.json()).error || ""; } catch { /* not JSON */ }
        throw new Error(detail || `server responded ${res.status}`);
      }

      const data = await res.json();
      if (!data.url) throw new Error("no file URL was returned");
      setAdminToast(`“${file.name}” uploaded.`);
      return data.url;
    } catch (err: any) {
      notifyError(`Upload of “${file.name}” failed: ${err.message}. Check your connection and try again.`);
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
    setPostAuthor(currentUser || "");
    setPostSlug(""); setPostSlugTouched(false);
    setPostMetaTitle(""); setPostMetaDescription(""); setPostKeywords([]); setPostTags([]);
    setPostStatus("draft");
    resetSchedule();
    resetEditorStatus(null);
    setIsPostModalOpen(true);
  };

  const resetSchedule = () => {
    const tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Dubai"; } catch { return "Asia/Dubai"; } })();
    const tomorrow = utcIsoToZoned(new Date(Date.now() + 24 * 3600 * 1000).toISOString(), tz);
    setSchedDate(tomorrow.date);
    setSchedTime("09:00");
    setSchedTz(tz);
  };

  const resetEditorStatus = (postId: string | null) => {
    setPostErrors({});
    setPostSaveError("");
    setDraftStatus({ state: "idle" });
    setPendingDraft(readDraft(postId));
  };

  const restoreDraft = () => {
    if (!pendingDraft) return;
    const d = pendingDraft;
    setPostTitle(d.title); setPostCategory(d.category); setPostImageUrl(d.imageUrl); setPostExcerpt(d.excerpt);
    setPostContent(d.contentHtml); setPostReadTime(d.readTime); setPostAuthor(d.author);
    setPostIsHero(d.isHero); setPostIsLatest(d.isLatest); setPostIsHighlight(d.isHighlight); setPostIsPopular(d.isPopular);
    if (d.slug) { setPostSlug(d.slug); setPostSlugTouched(true); }
    setPostMetaTitle(d.metaTitle || ""); setPostMetaDescription(d.metaDescription || ""); setPostKeywords(d.keywords || []); setPostTags(d.tags || []);
    setPendingDraft(null);
  };

  const discardDraft = () => {
    clearDraft(editingPost?.id || null);
    setPendingDraft(null);
  };

  const closePostModal = () => {
    if (draftStatus.state === "saved" && !confirm("Close the editor? Your unsaved changes are kept as a draft and can be restored next time you open this article.")) return;
    setIsPostModalOpen(false);
  };

  const openEditPostModal = (post: Article) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostCategory(post.category);
    setPostImageUrl(post.imageUrl);
    setPostExcerpt(post.excerpt);
    setPostContent(articleToHtml(post));
    setPostReadTime(post.readTime);
    setPostIsHero(!!post.isHero);
    setPostIsLatest(!!post.isLatest);
    setPostIsHighlight(!!post.isHighlight);
    setPostIsPopular(!!post.isPopular);
    setPostAuthor(post.author?.name || "");
    setPostSlug(post.slug || ""); setPostSlugTouched(true);
    setPostMetaTitle(post.seo?.metaTitle || ""); setPostMetaDescription(post.seo?.metaDescription || "");
    setPostKeywords(post.seo?.keywords || []); setPostTags(post.tags || []);
    setPostStatus(post.status || "published");
    if (post.status === "scheduled" && post.scheduledAt) {
      const tz = post.scheduledTimeZone || "Asia/Dubai";
      const z = utcIsoToZoned(post.scheduledAt, tz);
      setSchedDate(z.date); setSchedTime(z.time); setSchedTz(tz);
    } else {
      resetSchedule();
    }
    resetEditorStatus(post.id);
    setIsPostModalOpen(true);
  };

  // Auto-save: write a draft 1s after the last change while the editor is open.
  useEffect(() => {
    if (!isPostModalOpen) { draftBaselineRef.current = null; return; }
    const postId = editingPost?.id || null;
    const snapshot = JSON.stringify([postTitle, postCategory, postImageUrl, postExcerpt, postContent, postReadTime, postAuthor, postIsHero, postIsLatest, postIsHighlight, postIsPopular, postSlug, postMetaTitle, postMetaDescription, postKeywords, postTags]);
    if (draftBaselineRef.current === null) { draftBaselineRef.current = snapshot; return; }
    if (snapshot === draftBaselineRef.current) return; // nothing changed since the editor opened
    const hasContent = postTitle || postExcerpt || postContent || postImageUrl;
    if (!hasContent) return;
    if (editingPost && pendingDraft) return; // don't overwrite a newer draft before the user decides
    setDraftStatus((s) => (s.state === "idle" ? s : { ...s, state: "saving" }));
    const t = setTimeout(() => {
      const draft: ArticleDraft = {
        title: postTitle, category: postCategory, imageUrl: postImageUrl, excerpt: postExcerpt, contentHtml: postContent,
        readTime: postReadTime, author: postAuthor, isHero: postIsHero, isLatest: postIsLatest,
        isHighlight: postIsHighlight, isPopular: postIsPopular, savedAt: Date.now(),
        slug: postSlugTouched ? postSlug : undefined, metaTitle: postMetaTitle, metaDescription: postMetaDescription, keywords: postKeywords, tags: postTags,
      };
      try {
        localStorage.setItem(draftKey(postId), JSON.stringify(draft));
        setDraftStatus({ state: "saved", at: draft.savedAt });
      } catch (err) {
        setDraftStatus({ state: "error", msg: storageErrorMessage(err) });
      }
    }, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostModalOpen, postTitle, postCategory, postImageUrl, postExcerpt, postContent, postReadTime, postAuthor, postIsHero, postIsLatest, postIsHighlight, postIsPopular, postSlug, postMetaTitle, postMetaDescription, postKeywords, postTags]);

  // Warn before leaving the page with the editor open.
  useEffect(() => {
    if (!isPostModalOpen) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isPostModalOpen]);

  type PostIntent = "draft" | "publish" | "schedule" | "archive";

  const scrollToSaveError = () =>
    setTimeout(() => document.getElementById("post-save-error")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);

  /** Validates the form for an intent. Drafts only need a headline; publish/schedule need everything. */
  const validatePost = (intent: PostIntent): boolean => {
    setPostSaveError("");
    const paragraphs = htmlToParagraphs(postContent);
    const hasInlineImage = /<img\s/i.test(postContent);
    const errors: Record<string, string> = {};
    const strict = intent === "publish" || intent === "schedule";
    if (!postTitle.trim()) errors.title = "Add a headline.";
    else if (postTitle.trim().length > ARTICLE_TITLE_MAX) errors.title = `Headline is ${postTitle.trim().length} characters. The maximum is ${ARTICLE_TITLE_MAX} (including spaces) so it fits on article cards.`;
    if (postMetaTitle.length > 60) errors.seo = "Meta title should be 60 characters or fewer.";
    if (postMetaDescription.length > 160) errors.seo = "Meta description should be 160 characters or fewer.";
    if (strict) {
      if (!postAuthor.trim()) errors.author = "Add the author or publisher name.";
      if (!postImageUrl.trim()) errors.image = "Upload a featured image.";
      if (!postExcerpt.trim()) errors.excerpt = "Add a short summary.";
      if (paragraphs.length === 0 && !hasInlineImage) errors.content = "The article body is empty.";
    }
    if (/src=["']data:/i.test(postContent)) errors.content = "Pasted images can't be saved directly. Use the Upload Image button in the toolbar instead.";
    const existingSlugs = getArticles().filter((a) => a.id !== editingPost?.id).map((a) => a.slug);
    const nextSlug = effectiveSlug();
    if (!nextSlug) errors.slug = postSlug.trim() ? "The URL slug needs at least one letter or number." : "Headline needs at least one letter or number.";
    else if (existingSlugs.includes(nextSlug)) errors.slug = `The URL /article/${nextSlug} is already used by another article. Change the slug or headline.`;
    if (intent === "schedule") {
      if (!schedDate || !schedTime) errors.schedule = "Pick a date and time to publish.";
      else if (!isValidTimeZone(schedTz)) errors.schedule = `"${schedTz}" isn't a recognised time zone.`;
      else {
        const iso = zonedToUtcIso(schedDate, schedTime, schedTz);
        if (new Date(iso).getTime() <= Date.now() + 30_000) errors.schedule = "The scheduled time is in the past. Pick a future date and time, or use Publish now.";
      }
    }
    setPostErrors(errors);
    const n = Object.keys(errors).length;
    if (n) {
      setPostSaveError(`Please fix ${n} problem${n > 1 ? "s" : ""} below before ${intent === "draft" ? "saving" : intent === "schedule" ? "scheduling" : "publishing"}.`);
      scrollToSaveError();
      return false;
    }
    return true;
  };

  const makeSlug = (title: string) =>
    title.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  /** Custom slug if the admin typed one, otherwise generated from the headline. */
  const effectiveSlug = () => makeSlug(postSlugTouched && postSlug.trim() ? postSlug : postTitle);

  /** Builds the article object from the form for a given status. */
  const buildPost = (status: ArticleStatus): Article => {
    const base: Partial<Article> = editingPost ? { ...editingPost } : {};
    const scheduledAt = status === "scheduled" ? zonedToUtcIso(schedDate, schedTime, schedTz) : undefined;
    const wasLive = editingPost && (editingPost.status || "published") === "published";
    const nowLive = status === "published";
    return {
      ...base,
      id: editingPost?.id || `post-${Date.now()}`,
      title: postTitle.trim(),
      slug: effectiveSlug(),
      category: postCategory,
      imageUrl: postImageUrl,
      excerpt: postExcerpt,
      content: htmlToParagraphs(postContent),
      contentHtml: postContent,
      author: { name: postAuthor.trim(), avatarUrl: editingPost?.author?.avatarUrl || "", role: editingPost?.author?.role || "Publisher" },
      readTime: postReadTime,
      isHero: postIsHero,
      isLatest: postIsLatest,
      isHighlight: postIsHighlight,
      isPopular: postIsPopular,
      tags: postTags,
      seo: { metaTitle: postMetaTitle.trim() || undefined, metaDescription: postMetaDescription.trim() || undefined, keywords: postKeywords.length ? postKeywords : undefined },
      status,
      scheduledAt,
      scheduledTimeZone: status === "scheduled" ? schedTz : undefined,
      publishedAt: nowLive && !wasLive ? "Just now" : base.publishedAt || "Just now",
      publishedAtIso: nowLive && !wasLive ? new Date().toISOString() : base.publishedAtIso,
    } as Article;
  };

  /** Writes the article; returns false (with a visible error) if storage fails. */
  const commitPost = (post: Article, message: string): boolean => {
    try {
      const list = getArticles();
      const exists = list.some((a) => a.id === post.id);
      saveArticles(exists ? list.map((a) => (a.id === post.id ? post : a)) : [post, ...list]);
    } catch (err) {
      setPostSaveError(storageErrorMessage(err));
      scrollToSaveError();
      return false;
    }
    clearDraft(editingPost?.id || null);
    setDraftStatus({ state: "idle" });
    setIsPostModalOpen(false);
    setPublishPreviewOpen(false);
    loadData();
    invalidateMainQueries();
    setAdminToast(message);
    return true;
  };

  const handlePostAction = (intent: PostIntent) => {
    if (!validatePost(intent)) return;
    if (intent === "publish") {
      // Manual publish always goes through the preview popup first.
      openPreview("publish");
      return;
    }
    if (intent === "draft") commitPost(buildPost("draft"), `“${postTitle.trim()}” saved as a draft.`);
    if (intent === "archive") {
      if (!confirm("Archive this article? It will be hidden from the website but kept in the admin panel.")) return;
      commitPost(buildPost("archived"), `“${postTitle.trim()}” archived.`);
    }
    if (intent === "schedule") {
      const iso = zonedToUtcIso(schedDate, schedTime, schedTz);
      commitPost(buildPost("scheduled"), `“${postTitle.trim()}” scheduled for ${formatInZone(iso, schedTz)}.`);
    }
  };

  /** Opens the real article page in a popup, rendering the unsaved form content. */
  const openPreview = (mode: "view" | "publish") => {
    if (mode === "view" && !postTitle.trim()) {
      setPostErrors({ title: "Add a headline to preview the article." });
      setPostSaveError("Add a headline to preview the article.");
      scrollToSaveError();
      return;
    }
    try {
      setArticlePreview({ ...buildPost(mode === "publish" ? "published" : postStatus), publishedAt: mode === "publish" ? "Just now" : buildPost(postStatus).publishedAt });
    } catch (err) {
      setPostSaveError(`Couldn't open the preview: ${storageErrorMessage(err)}`);
      scrollToSaveError();
      return;
    }
    setPreviewNonce(Date.now());
    setPreviewMode(mode);
    setPublishPreviewOpen(true);
  };

  const confirmPublish = () => {
    commitPost(buildPost("published"), `“${postTitle.trim()}” is now live.`);
  };

  /** Quick status changes from the article list. */
  const setPostStatusFromList = (post: Article, status: ArticleStatus) => {
    if (status === "archived" && !confirm(`Archive “${post.title}”? It will be hidden from the website.`)) return;
    try {
      const list = getArticles();
      saveArticles(list.map((a) => (a.id === post.id ? {
        ...a,
        status,
        ...(status === "published" && (a.status || "published") !== "published" ? { publishedAt: "Just now", publishedAtIso: new Date().toISOString(), scheduledAt: undefined } : {}),
      } : a)));
    } catch (err) {
      notifyError(storageErrorMessage(err));
      return;
    }
    loadData();
    invalidateMainQueries();
    setAdminToast(status === "archived" ? `“${post.title}” archived.` : status === "draft" ? `“${post.title}” moved to drafts.` : `“${post.title}” is now live.`);
  };

  const handleDeletePost = (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    const currentList = getArticles();
    const filtered = currentList.filter((item) => item.id !== id);
    saveArticles(filtered);
    loadData();
    invalidateMainQueries();
    setAdminToast("Article deleted.");
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
      notifyError("Please fill in all required fields (marked Required) before saving.");
      return;
    }
    if (looksLikeUnsupportedInstagram(videoUrl)) {
      notifyError("That Instagram link can't be embedded. Use a link to a post or reel, e.g. https://www.instagram.com/reel/ABC123/ (profile and story links don't work).");
      return;
    }
    if (videoUrl && isInstagramUrl(videoUrl)) {
      // Store a clean canonical link (drops ?igsh= / utm tracking).
      const clean = normalizeInstagramUrl(videoUrl);
      if (clean !== videoUrl) setVideoUrl(clean);
    }
    const storedVideoUrl = videoUrl && isInstagramUrl(videoUrl) ? normalizeInstagramUrl(videoUrl) : videoUrl;

    const currentList = getVideos();

    if (editingVideo) {
      const updated = currentList.map((item) => {
        if (item.id === editingVideo.id) {
          return {
            ...item,
            title: videoTitle,
            category: videoCategory,
            thumbnailUrl: videoThumbnailUrl,
            videoUrl: storedVideoUrl || undefined,
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
        videoUrl: storedVideoUrl || undefined,
        description: videoDescription,
        duration: videoDuration,
        longDescription: videoLongDescription || undefined,
      };
      saveVideos([newVideo, ...currentList]);
    }

    setIsVideoModalOpen(false);
    loadData();
    invalidateMainQueries();
    setAdminToast(editingVideo ? `Video “${videoTitle}” updated.` : `Video “${videoTitle}” added.`);
  };

  const handleDeleteVideo = (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    const currentList = getVideos();
    const filtered = currentList.filter((item) => item.id !== id);
    saveVideos(filtered);
    loadData();
    invalidateMainQueries();
    setAdminToast("Video deleted.");
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
      notifyError("Please fill in all required fields (marked Required) before saving.");
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
    setAdminToast(editingLocation ? "Location updated." : "Location added.");
  };

  const handleDeleteLocation = (id: string) => {
    if (!confirm("Are you sure you want to delete this location?")) return;
    const currentList = getLocations();
    const filtered = currentList.filter((item) => item.id !== id);
    saveLocations(filtered);
    loadData();
    invalidateMainQueries();
    setAdminToast("Location deleted.");
  };

  // 4. Sortd People Actions (Admin Only)
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
      notifyError("Please fill in all required fields (marked Required) before saving.");
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
    setAdminToast(editingPerson ? "Member updated." : "Member added to Sortd People.");
  };

  const handleDeletePerson = (id: string) => {
    if (!confirm("Are you sure you want to remove this member from Sortd People?")) return;
    const currentList = getPeople();
    const filtered = currentList.filter((item) => item.id !== id);
    savePeople(filtered);
    loadData();
    invalidateMainQueries();
    setAdminToast("Member removed from Sortd People.");
  };

  // 5. Category Actions (Admin Only)
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const nameUpper = newCategoryName.trim().toUpperCase();
    const currentCats = getCategories();

    if (currentCats.some((c) => c.name.toUpperCase() === nameUpper)) {
      notifyError("A category with that name already exists.");
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
    setAdminToast("Category created.");
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setEditCategoryName(cat.name);
    setEditCategoryColor(cat.color);
    setCategoryError("");
  };

  /** Renames/recolours a category and moves every article, video and member to the new name. */
  const handleSaveCategoryEdit = () => {
    const cats = getCategories();
    const cat = cats.find((c) => c.id === editingCategoryId);
    if (!cat) return;
    const newName = editCategoryName.trim().toUpperCase();
    if (!newName) { setCategoryError("Category name can't be empty."); return; }
    if (newName.length > 24) { setCategoryError("Keep category names to 24 characters or fewer."); return; }
    if (!/^#[0-9a-f]{6}$/i.test(editCategoryColor)) { setCategoryError("Colour must be a hex value like #3B82F6."); return; }
    if (cats.some((c) => c.id !== cat.id && c.name.toUpperCase() === newName)) { setCategoryError(`A category called "${newName}" already exists.`); return; }
    const oldName = cat.name.toUpperCase();
    try {
      saveCategories(cats.map((c) => (c.id === cat.id ? { ...c, name: newName, color: editCategoryColor, bgColor: editCategoryColor } : c)));
      if (newName !== oldName) {
        const rename = <T extends { category: string }>(x: T): T => (x.category.toUpperCase() === oldName ? { ...x, category: newName } : x);
        saveArticles(getArticles().map(rename));
        saveVideos(getVideos().map(rename));
        savePeople(getPeople().map(rename));
      }
    } catch (err) {
      setCategoryError(storageErrorMessage(err));
      return;
    }
    setEditingCategoryId(null);
    loadData();
    invalidateMainQueries();
    setAdminToast(newName !== oldName ? `Category renamed to ${newName}. All its articles, videos and members were updated.` : `Category ${newName} updated.`);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    const list = getArticles();
    const count = list.filter((item) => item.category.toUpperCase() === name.toUpperCase()).length;
    const vCount = getVideos().filter((v) => v.category.toUpperCase() === name.toUpperCase()).length;
    if (count > 0 || vCount > 0) {
      notifyError(`Can't delete "${name}" yet: it's used by ${count} article${count === 1 ? "" : "s"}${vCount ? ` and ${vCount} video${vCount === 1 ? "" : "s"}` : ""}. Move them to another category first (or rename this category instead).`);
      return;
    }
    const isMain = ["NEWS", "CULTURE", "COMMUNITY"].includes(name.toUpperCase());
    if (!confirm(isMain
      ? `"${name}" is one of the homepage's main columns. Deleting it leaves that column empty ("Nothing to show here"). Delete anyway?`
      : `Are you sure you want to delete category "${name}"?`)) return;

    const currentCats = getCategories();
    const filtered = currentCats.filter((c) => c.id !== id);
    saveCategories(filtered);
    loadData();
    invalidateMainQueries();
    setAdminToast(`Category “${name}” deleted.`);
  };

  // 6. Homepage Banner Settings Actions (Admin Only)
  const handleSaveHomepageImages = (e: React.FormEvent) => {
    e.preventDefault();
    saveHomepageImages(homeImages);
    queryClient.invalidateQueries({ queryKey: ["homepage_images"] });
    setAdminToast("Banner images saved. Changes are live on the homepage.");
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
    if (!isOwner) {
      notifyError("Only the main administrator can create user accounts.");
      return;
    }

    if (!newUsername.trim() || !newUserPassword.trim()) return;

    const currentUsers = getUserAccounts();
    const nameLower = newUsername.trim().toLowerCase();

    if (currentUsers.some((u) => u.username.toLowerCase() === nameLower)) {
      notifyError("That username is already taken. Choose another.");
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
    setAdminToast("User account created.");
  };

  const handleDeleteUser = (usernameToDelete: string) => {
    // Permission Check: Only the main administrator (sortd_web) is allowed to perform user CRUD operations
    if (!isOwner) {
      notifyError("Only the main administrator can delete user accounts.");
      return;
    }

    if (isOwnerAccount(usernameToDelete)) {
      notifyError("The main administrator account can't be deleted.");
      return;
    }

    if (!confirm(`Are you sure you want to delete user account "${usernameToDelete}"?`)) return;

    const currentUsers = getUserAccounts();
    const filtered = currentUsers.filter((u) => u.username !== usernameToDelete);
    saveUserAccounts(filtered);
    loadData();
    setAdminToast(`User “${usernameToDelete}” deleted.`);
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      notifyError("There are no subscribers to export yet.");
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
    const matchesStatus = postStatusFilter === "all" || (post.status || "published") === postStatusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });
  const allArticleTags = Array.from(new Set(articles.flatMap((a) => a.tags || []))).sort((x, y) => x.localeCompare(y));
  const statusCounts = articles.reduce<Record<string, number>>((acc, a) => {
    const s = a.status || "published";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

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
  const isOwner = !!currentUser && userAccounts.some((u) => u.owner && u.username.toLowerCase() === currentUser.toLowerCase());

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
                onClick={() => setActiveTab("guide")}
                className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${activeTab === "guide" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Help &amp; Guide</span>
              </button>

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
                    onClick={() => setActiveTab("homepage")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${
                      activeTab === "homepage"
                        ? "bg-sortd-yellow text-sortd-black"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4 shrink-0" />
                    <span>Site Settings</span>
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
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors text-left w-full ${activeTab === "account" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
          >
            <UserCog className="w-4 h-4" />
            <span>My Account</span>
          </button>
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
                  onClick={() => { setActiveTab("guide"); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${activeTab === "guide" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                >
                  <HelpCircle className="w-4 h-4 shrink-0" />
                  <span>Help &amp; Guide</span>
                </button>
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
                      onClick={() => { setActiveTab("homepage"); setMobileMenuOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all text-left ${activeTab === "homepage" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                    >
                      <LayoutGrid className="w-4 h-4 shrink-0" />
                      <span>Site Settings</span>
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
              <button onClick={() => { setActiveTab("account"); setMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-colors text-left w-full ${activeTab === "account" ? "bg-sortd-yellow text-sortd-black" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
                <UserCog className="w-4 h-4" />
                <span>My Account</span>
              </button>
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
                <SectionNote purpose="Write, edit, schedule, publish and archive articles. Tick the placement boxes in the editor to feature an article in a homepage section." where="article pages (/article/…), Latest Stories, the News/Culture/Community columns, Popular Stories, the Highlight block, search results and /latest." tip="Only Published (or due Scheduled) articles are visible to readers. Drafts and Archived stay private." />
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
              <select
                value={postStatusFilter}
                onChange={(e) => setPostStatusFilter(e.target.value as "all" | ArticleStatus)}
                className="w-full px-4 py-2 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-bold text-sortd-grey bg-white focus:outline-none uppercase"
              >
                <option value="all">All statuses ({articles.length})</option>
                <option value="published">Published ({statusCounts.published || 0})</option>
                <option value="scheduled">Scheduled ({statusCounts.scheduled || 0})</option>
                <option value="draft">Drafts ({statusCounts.draft || 0})</option>
                <option value="archived">Archived ({statusCounts.archived || 0})</option>
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
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 hidden sm:table-cell">Flags</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs font-medium">
                      {filteredArticles.map((post) => {
                        const st = post.status || "published";
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
                              <p className="text-[10px] text-sortd-grey mt-0.5 font-normal">
                                By <span className="font-semibold text-sortd-black">{post.author?.name || "Sortd Dubai"}</span>{!post.author?.name && <span className="text-sortd-grey"> (default)</span>} · {post.slug}
                              </p>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2 py-0.5 rounded-[4px] font-body font-bold text-[8.5px] uppercase tracking-wider inline-flex items-center justify-center ${badge.textColorClass}`} style={{ backgroundColor: badge.bgColor }}>
                                {post.category}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <StatusBadge status={st} />
                              {st === "scheduled" && post.scheduledAt && (
                                <p className="text-[10px] text-sortd-grey mt-1 whitespace-nowrap">{formatInZone(post.scheduledAt, post.scheduledTimeZone || "UTC")}</p>
                              )}
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
                                {st === "published" && (
                                  <a href={`/article/${post.slug}`} target="_blank" rel="noopener noreferrer" title="View on site" className="p-1.5 rounded-[6px] hover:bg-gray-100 text-sortd-black"><Eye className="w-4 h-4" /></a>
                                )}
                                {(st === "draft" || st === "archived") && (
                                  <button onClick={() => openEditPostModal(post)} title="Review & publish" className="p-1.5 rounded-[6px] hover:bg-green-50 text-green-700"><Send className="w-4 h-4" /></button>
                                )}
                                {st !== "archived" ? (
                                  <button onClick={() => setPostStatusFromList(post, "archived")} title="Archive" className="p-1.5 rounded-[6px] hover:bg-gray-100 text-sortd-grey"><Archive className="w-4 h-4" /></button>
                                ) : (
                                  <button onClick={() => setPostStatusFromList(post, "draft")} title="Restore to drafts" className="p-1.5 rounded-[6px] hover:bg-gray-100 text-sortd-grey"><ArchiveRestore className="w-4 h-4" /></button>
                                )}
                                <button onClick={() => openEditPostModal(post)} title="Edit" className="p-1.5 rounded-[6px] hover:bg-gray-100 text-sortd-black transition-colors"><Edit2 className="w-4 h-4" /></button>
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
                <SectionNote purpose="Add video stories from an Instagram post/reel link, a direct .mp4 link, or an uploaded file. Each needs a thumbnail image." where="the VIDEOS carousel on the homepage and the full-screen story viewer that opens when a video is tapped." tip="If a story has no video, the viewer shows “Nothing to show here”." />
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
                <SectionNote purpose="Edit the city cards (name, tagline, image)." where="the Locations section near the bottom of the homepage." tip="Turn the whole section on/off in Site Settings › Locations." />
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
                <SectionNote purpose="Add, edit and remove the members featured in the Sortd People section (photo, name, title, quote)." where="the SORTD PEOPLE section of the homepage (desktop by default — enable mobile in Site Settings › Homepage Sections)." />
              </div>
              <button onClick={openNewPersonModal} className="inline-flex items-center justify-center gap-2 px-5 py-3 h-[42px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs tracking-wider uppercase transition-colors shrink-0">
                <Plus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm max-w-sm">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={peopleSearch}
                  onChange={(e) => setPeopleSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            {filteredPeople.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sortd-grey font-medium">No members matched.</p>
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
                <SectionNote purpose="Add, rename, recolour and delete categories. Renaming moves every article, video and member in that category to the new name." where="category pills on every card, the News/Culture/Community homepage columns, the header menu, and the category filters on /news and /latest." tip="A category in use can’t be deleted — move or rename its articles first." />
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
                      if (editingCategoryId === cat.id) {
                        return (
                          <tr key={cat.id} className="bg-yellow-50/40">
                            <td className="py-3 px-6" colSpan={3}>
                              <div className="flex flex-wrap items-center gap-2">
                                <input autoFocus value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSaveCategoryEdit(); if (e.key === "Escape") setEditingCategoryId(null); }} aria-label="Category name" className="px-3 py-2 border border-gray-300 focus:border-sortd-black rounded-[8px] text-xs font-bold uppercase focus:outline-none" />
                                <input type="color" value={editCategoryColor} onChange={(e) => setEditCategoryColor(e.target.value)} aria-label="Category colour" className="w-9 h-9 rounded-[6px] border border-gray-200 cursor-pointer p-0" />
                                <input value={editCategoryColor} onChange={(e) => setEditCategoryColor(e.target.value)} maxLength={7} aria-label="Category colour hex" className="w-24 px-2 py-2 border border-gray-300 rounded-[8px] text-xs font-mono font-bold uppercase focus:outline-none" />
                                <span className="text-[10px] text-sortd-grey font-medium">{postCount} posts will move with it</span>
                              </div>
                              {categoryError && <p className="mt-1.5 text-[11px] font-semibold text-red-600">{categoryError}</p>}
                            </td>
                            <td className="py-3 px-6 text-right whitespace-nowrap">
                              <button onClick={handleSaveCategoryEdit} className="px-3 py-1.5 rounded-md bg-sortd-black text-white text-[10px] font-bold uppercase tracking-wider mr-1.5">Save</button>
                              <button onClick={() => setEditingCategoryId(null)} className="px-3 py-1.5 rounded-md border border-gray-200 text-sortd-grey text-[10px] font-bold uppercase tracking-wider">Cancel</button>
                            </td>
                          </tr>
                        );
                      }
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
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <button onClick={() => startEditCategory(cat)} title="Edit category" className="p-1.5 rounded-[6px] hover:bg-gray-100 text-sortd-black transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteCategory(cat.id, cat.name)} title="Delete category" className="p-1.5 rounded-[6px] hover:bg-red-50 text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
                <SectionNote purpose="Everyone who subscribed through a Subscribe form. Export as CSV for your email tool." where="collected from the Subscribe button in the header, the subscribe card on article pages and the homepage pop-up." />
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
        {activeTab === "guide" && (
          <AdminGuide isAdmin={isAdmin} onOpen={(t) => setActiveTab(t)} />
        )}

        {activeTab === "account" && (
          <AccountSettings
            currentUser={currentUser}
            onUsernameChanged={(name) => { setCurrentUser(name); loadData(); }}
            onSaved={setAdminToast}
          />
        )}

        {activeTab === "homepage" && isAdmin && (
          <div className="flex flex-col gap-10">
            <SiteSettingsPanel onSaved={setAdminToast} />
            <HomepageSectionsManager onSaved={setAdminToast} />
          </div>
        )}

        {activeTab === "settings" && isAdmin && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Homepage Images</h2>
              <SectionNote purpose="Images for the top of the homepage: the image-only hero banner (desktop and mobile separately) and the optional skyline + logo strip." where="Homepage › directly under the yellow header." tip="Use the recommended sizes shown on each upload for the sharpest result." />
            </div>

            <form onSubmit={handleSaveHomepageImages} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
              <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer select-none">
                <span className="flex flex-col">
                  <span className="text-sm font-bold uppercase tracking-wider text-sortd-black font-body">Show Skyline Banner</span>
                  <span className="text-[10px] text-sortd-grey font-medium">Show or hide the skyline + logo block under the header on the homepage (desktop and mobile).</span>
                </span>
                <input
                  type="checkbox"
                  checked={!!homeImages.showSkylineBanner}
                  onChange={(e) => setHomeImages({ ...homeImages, showSkylineBanner: e.target.checked })}
                  className="w-5 h-5 accent-sortd-black shrink-0"
                />
              </label>

              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-sortd-black mb-1 font-body">Hero Banner Image</h3>
                <p className="text-[10px] text-sortd-grey font-medium">Image-only banner under the header. Desktop and mobile are set separately. If left empty, the featured article&apos;s image is used.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {([
                  { field: "heroBannerDesktop", label: "Desktop Hero Image", size: "1920 × 436 px", note: "Shown on screens 1280px and wider. Keep key content centred — edges crop on narrower desktops.", preview: "aspect-[1920/436]" },
                  { field: "heroBannerMobile", label: "Mobile / Tablet Hero Image", size: "750 × 476 px", note: "Shown below 1280px wide. Falls back to the desktop image if empty.", preview: "aspect-[750/476]" },
                ] as const).map((b) => (
                  <div key={b.field} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">{b.label}</label>
                      <span className="text-[10px] font-bold text-sortd-black bg-sortd-yellow/40 px-2 py-0.5 rounded">Recommended: {b.size}</span>
                    </div>
                    <div className={`relative w-full ${b.preview} rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center`}>
                      {homeImages[b.field] ? (
                        <img src={homeImages[b.field]} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <span className="text-[10px] text-sortd-grey font-medium">No image — using featured article image</span>
                      )}
                    </div>
                    <p className="text-[10px] text-sortd-grey font-medium">{b.note}</p>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await handleFileUpload(file, "image");
                        if (url) setHomeImages((prev) => ({ ...prev, [b.field]: url }));
                        e.target.value = "";
                      }}
                      className="text-xs file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-sortd-black file:text-white file:text-xs file:font-bold file:cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="…or paste an image URL"
                      value={homeImages[b.field]}
                      onChange={(e) => setHomeImages({ ...homeImages, [b.field]: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-205 focus:border-sortd-black rounded-lg text-xs font-medium"
                    />
                    {homeImages[b.field] && (
                      <button type="button" onClick={() => setHomeImages({ ...homeImages, [b.field]: "" })} className="self-start text-[10px] font-bold text-sortd-pink hover:underline uppercase">Remove image</button>
                    )}
                  </div>
                ))}
              </div>

              {/* Hero Banner Clickable Link Setting */}
              <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200 mt-2">
                <div className="flex items-baseline justify-between gap-2">
                  <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Hero Banner Clickable Link</label>
                  <span className="text-[10px] font-semibold text-sortd-grey uppercase">Optional</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. /article/dubai-golden-visa-rules or https://example.com"
                  value={homeImages.heroBannerLink || ""}
                  onChange={(e) => setHomeImages({ ...homeImages, heroBannerLink: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 focus:border-sortd-black rounded-lg text-xs font-medium text-sortd-black placeholder:text-gray-400 focus:outline-none"
                />
                <p className="text-[10px] text-sortd-grey font-medium">When visitors click the hero banner on the homepage, they will navigate to this link. If left empty, it opens the top featured article.</p>
              </div>

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
                <SectionNote purpose="Create logins for other team members. “Uploader” accounts can only manage Articles and Videos; “Admin” accounts can change everything." where="admin panel only — nothing here is shown on the public website." tip="Only the main administrator can add or delete accounts. To change your own username or password, use My Account." />
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
                      const isLockedUser = !!u.owner;
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
                                disabled={!isOwner}
                                className={`p-1.5 rounded-[6px] transition-colors ${
                                  isOwner
                                    ? "hover:bg-red-50 text-red-600 cursor-pointer"
                                    : "text-gray-300 cursor-not-allowed opacity-50"
                                }`}
                                title={isOwner ? "Delete User" : "Permission Denied"}
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
              
              {!isOwner && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] sm:text-xs font-semibold text-red-700 leading-relaxed uppercase tracking-wider">
                  ⚠️ Access Denied: Only the main administrator account is authorized to create or delete user accounts.
                </div>
              )}

              <form onSubmit={handleCreateUser} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 select-none font-body">Username (Required)</label>
                  <input
                    type="text"
                    required
                    disabled={!isOwner}
                    placeholder={isOwner ? "e.g. editor_dubai" : "Permission Denied"}
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
                    disabled={!isOwner}
                    placeholder={isOwner ? "Enter password..." : "Permission Denied"}
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 select-none font-body">Select Permission Level</label>
                  <select
                    value={newUserRole}
                    disabled={!isOwner}
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
                  disabled={!isOwner}
                  className={`w-full mt-2 py-3 rounded-[8px] font-body font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 ${
                    isOwner
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
              <div className="flex items-center gap-3 min-w-0">
                <h3 className="font-heading font-normal text-xl uppercase tracking-wider">{editingPost ? "Edit Article" : "Create New Article"}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${draftStatus.state === "error" ? "text-red-600" : "text-sortd-grey"}`} aria-live="polite">
                  {draftStatus.state === "saving" && "Saving draft…"}
                  {draftStatus.state === "saved" && draftStatus.at && `Draft auto-saved ${new Date(draftStatus.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`}
                  {draftStatus.state === "error" && "Auto-save failed"}
                </span>
              </div>
              <button type="button" onClick={closePostModal} className="p-1.5 rounded-full hover:bg-gray-200 text-sortd-black transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form noValidate onSubmit={(e) => e.preventDefault()} className="flex-grow overflow-y-auto p-6 flex flex-col gap-5">
              {pendingDraft && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-900">
                    An unsaved draft from {new Date(pendingDraft.savedAt).toLocaleString()} was found{pendingDraft.title ? ` (“${pendingDraft.title}”)` : ""}.
                  </p>
                  <div className="flex gap-2">
                    <button type="button" onClick={restoreDraft} className="px-3 py-1.5 rounded-md bg-sortd-black text-white text-[10px] font-bold uppercase tracking-wider">Restore draft</button>
                    <button type="button" onClick={discardDraft} className="px-3 py-1.5 rounded-md border border-amber-300 text-amber-900 text-[10px] font-bold uppercase tracking-wider">Discard</button>
                  </div>
                </div>
              )}
              {postSaveError && (
                <div id="post-save-error" role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">{postSaveError}</div>
              )}
              {draftStatus.state === "error" && draftStatus.msg && (
                <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">Auto-save problem: {draftStatus.msg}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <label htmlFor="post-title" className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Article Title (Required)</label>
                    <span
                      aria-live="polite"
                      className={`text-[10px] font-bold tabular-nums ${postTitle.length > ARTICLE_TITLE_MAX ? "text-red-600" : postTitle.trim().length >= ARTICLE_TITLE_IDEAL_MIN ? "text-emerald-600" : postTitle.length > 0 ? "text-amber-600" : "text-sortd-grey"}`}
                    >
                      {postTitle.length}/{ARTICLE_TITLE_MAX}
                    </span>
                  </div>
                  <input id="post-title" type="text" maxLength={ARTICLE_TITLE_MAX} placeholder="Enter headline..." value={postTitle} onChange={(e) => setPostTitle(e.target.value)} aria-invalid={!!postErrors.title} aria-describedby="post-title-hint" className={`w-full px-4 py-3 bg-gray-55 border ${postErrors.title || postTitle.length > ARTICLE_TITLE_MAX ? "border-red-400" : "border-gray-200"} focus:border-sortd-black rounded-[8px] text-xs font-semibold text-sortd-black placeholder:text-gray-400 focus:outline-none transition-colors`} />
                  <p id="post-title-hint" className="mt-1 text-[10px] text-sortd-grey font-medium">Best length: {ARTICLE_TITLE_IDEAL_MIN}–{ARTICLE_TITLE_MAX} characters including spaces, so the headline fills 2 full lines on article cards.{postTitle.trim().length > 0 && postTitle.trim().length < ARTICLE_TITLE_IDEAL_MIN ? " This one is short and will sit on 1 line on desktop." : ""}</p>
                  {postErrors.title && <p className="mt-1 text-[11px] font-semibold text-red-600">{postErrors.title}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Author / Publisher Name (Required)</label>
                  <input type="text" placeholder="e.g. Sara Ahmed or Sortd Dubai Desk" value={postAuthor} onChange={(e) => setPostAuthor(e.target.value)} aria-invalid={!!postErrors.author} className={`w-full px-4 py-3 bg-gray-55 border ${postErrors.author ? "border-red-400" : "border-gray-200"} focus:border-sortd-black rounded-[8px] text-xs font-semibold text-sortd-black placeholder:text-gray-400 focus:outline-none transition-colors`} />
                  {postErrors.author && <p className="mt-1 text-[11px] font-semibold text-red-600">{postErrors.author}</p>}
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
                  {postErrors.image && <p className="mt-1 text-[11px] font-semibold text-red-600">{postErrors.image}</p>}

                  {/* Extra Setting: Fetch Image for Article */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sortd-yellow-dark" />
                        <span className="text-[10px] font-bold text-sortd-black uppercase tracking-wider font-body">Extra Setting: Fetch Image for Article</span>
                      </div>
                      <span className="text-[9px] font-semibold text-sortd-grey uppercase">Auto-Fetch</span>
                    </div>

                    <p className="text-[10px] text-sortd-grey font-medium leading-relaxed">
                      Fetch an image directly from any web link or click a curated preset to instantly set high-res photography.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="Paste image URL (https://...)"
                        value={fetchUrlInput}
                        onChange={(e) => setFetchUrlInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-gray-200 focus:border-sortd-black rounded-lg text-xs font-medium text-sortd-black placeholder:text-gray-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={isFetchingImage || !fetchUrlInput.trim()}
                        onClick={() => handleFetchImageFromUrl()}
                        className="px-3 py-1.5 rounded-lg bg-sortd-black hover:bg-gray-800 text-white font-body font-bold text-[10px] uppercase tracking-wider disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shrink-0"
                      >
                        {isFetchingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                        <span>Fetch Image</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-gray-200/70">
                      <span className="text-[9px] font-bold text-sortd-grey uppercase">Quick Presets:</span>
                      {[
                        { label: "Dubai Skyline", url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80" },
                        { label: "Burj Khalifa", url: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80" },
                        { label: "Karak & Café", url: "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1200&q=80" },
                        { label: "Old Dubai", url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80" },
                        { label: "Business", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          disabled={isFetchingImage}
                          onClick={() => handleFetchImageFromUrl(preset.url)}
                          className="text-[9px] font-semibold bg-white hover:bg-sortd-yellow/40 text-sortd-black border border-gray-200 px-2 py-0.5 rounded transition-colors"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>

                    {fetchImageMessage && (
                      <div className={`text-[10px] font-medium px-2 py-1 rounded-md mt-1 ${fetchImageMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                        {fetchImageMessage.text}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Read Time Tag</label>
                  <input type="text" required placeholder="e.g. 60 SECONDS" value={postReadTime} onChange={(e) => setPostReadTime(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold text-sortd-black placeholder:text-gray-400 focus:outline-none transition-colors uppercase" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Excerpt / Short Summary (Required)</label>
                <textarea rows={2} placeholder="Summary for grid feeds..." value={postExcerpt} onChange={(e) => setPostExcerpt(e.target.value)} aria-invalid={!!postErrors.excerpt} className={`w-full px-4 py-3 bg-gray-55 border ${postErrors.excerpt ? "border-red-400" : "border-gray-200"} focus:border-sortd-black rounded-[8px] text-xs font-medium text-sortd-black focus:outline-none resize-y`} />
                {postErrors.excerpt && <p className="mt-1 text-[11px] font-semibold text-red-600">{postErrors.excerpt}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Full Article Content (Required)</label>
                <p className="text-[10px] text-sortd-grey font-medium mb-1.5 font-body">Use the toolbar for headings, bold, lists, links and quotes. Add images with the image button, or drag &amp; drop / paste them into the text.</p>
                <RichTextEditor
                  value={postContent}
                  onChange={setPostContent}
                  invalid={!!postErrors.content}
                  onUploadImage={(file) => handleFileUpload(file, "image")}
                />
                {postErrors.content && <p className="mt-1 text-[11px] font-semibold text-red-600">{postErrors.content}</p>}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5 font-body">Tags</label>
                <TagInput value={postTags} onChange={setPostTags} suggestions={allArticleTags} placeholder="Type a tag and press Enter (e.g. Food, Metro, Events)" ariaLabel="Article tags" />
                <p className="mt-1 text-[10px] text-sortd-grey font-medium">Tags aren&apos;t shown on article cards; readers can filter by them on the Latest Stories page.</p>
              </div>

              {/* SEO */}
              <details className="rounded-xl border border-gray-200 group" open={!!postErrors.seo || !!postErrors.slug}>
                <summary className="cursor-pointer select-none px-4 py-3 flex items-center justify-between text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">
                  <span>SEO Settings</span>
                  <span className="normal-case tracking-normal font-semibold text-[10px]">Meta title, description, URL &amp; keywords</span>
                </summary>
                <div className="px-4 pb-4 flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">URL / Slug</label>
                      {postSlugTouched && <button type="button" onClick={() => { setPostSlugTouched(false); setPostSlug(""); }} className="text-[10px] font-bold text-sortd-pink hover:underline uppercase">Reset to headline</button>}
                    </div>
                    <div className={`flex items-center bg-gray-55 border ${postErrors.slug ? "border-red-400" : "border-gray-200"} focus-within:border-sortd-black rounded-[8px] overflow-hidden`}>
                      <span className="pl-3 text-xs text-sortd-grey font-medium whitespace-nowrap">/article/</span>
                      <input
                        type="text"
                        value={postSlugTouched ? postSlug : makeSlug(postTitle)}
                        onChange={(e) => { setPostSlugTouched(true); setPostSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")); }}
                        onBlur={() => postSlugTouched && setPostSlug(makeSlug(postSlug))}
                        placeholder="auto-generated-from-headline"
                        className="flex-1 min-w-0 bg-transparent px-1 py-2.5 text-xs font-semibold text-sortd-black focus:outline-none"
                      />
                    </div>
                    {postErrors.slug && <p className="mt-1 text-[11px] font-semibold text-red-600">{postErrors.slug}</p>}
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Meta Title</label>
                      <span className={`text-[10px] font-bold tabular-nums ${postMetaTitle.length > 60 ? "text-red-600" : "text-sortd-grey"}`}>{postMetaTitle.length}/60</span>
                    </div>
                    <input type="text" value={postMetaTitle} onChange={(e) => setPostMetaTitle(e.target.value)} placeholder={postTitle ? `${postTitle} | sortd Dubai` : "Defaults to the headline"} className="w-full px-3 py-2.5 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold focus:outline-none" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Meta Description</label>
                      <span className={`text-[10px] font-bold tabular-nums ${postMetaDescription.length > 160 ? "text-red-600" : "text-sortd-grey"}`}>{postMetaDescription.length}/160</span>
                    </div>
                    <textarea rows={2} value={postMetaDescription} onChange={(e) => setPostMetaDescription(e.target.value)} placeholder={postExcerpt || "Defaults to the summary"} className="w-full px-3 py-2.5 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium focus:outline-none resize-y" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1 font-body">Keywords</label>
                    <TagInput value={postKeywords} onChange={setPostKeywords} placeholder="Add a keyword and press Enter" ariaLabel="SEO keywords" />
                  </div>
                  {/* Search result preview */}
                  <div className="rounded-lg border border-gray-100 bg-white p-3">
                    <p className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1.5">Google preview</p>
                    <p className="text-[11px] text-green-700 truncate">sortd.ae/article/{effectiveSlug() || "…"}</p>
                    <p className="text-[15px] text-[#1a0dab] leading-snug truncate">{postMetaTitle || (postTitle ? `${postTitle} | sortd Dubai` : "Article title")}</p>
                    <p className="text-[12px] text-[#4d5156] line-clamp-2">{postMetaDescription || postExcerpt || "The meta description appears here."}</p>
                  </div>
                  {postErrors.seo && <p className="text-[11px] font-semibold text-red-600">{postErrors.seo}</p>}
                </div>
              </details>

              <div>
                <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1 select-none font-body">Homepage placement</label>
                <p className="text-[10px] text-sortd-grey font-medium mb-2">Tick where this article should be featured. It always appears in its category column, search and the /latest page regardless.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 select-none">
                  <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-gray-100 cursor-pointer hover:border-gray-300">
                    <input type="checkbox" checked={postIsLatest} onChange={(e) => setPostIsLatest(e.target.checked)} className="w-4 h-4 mt-0.5 accent-sortd-black shrink-0" />
                    <span className="flex flex-col"><span className="text-xs font-bold text-sortd-black">Latest Stories row</span><span className="text-[10px] text-sortd-grey font-medium leading-snug">Homepage row near the top. Shows the first 4 ticked articles.</span></span>
                  </label>
                  <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-gray-100 cursor-pointer hover:border-gray-300">
                    <input type="checkbox" checked={postIsPopular} onChange={(e) => setPostIsPopular(e.target.checked)} className="w-4 h-4 mt-0.5 accent-sortd-black shrink-0" />
                    <span className="flex flex-col"><span className="text-xs font-bold text-sortd-black">Popular Stories</span><span className="text-[10px] text-sortd-grey font-medium leading-snug">Homepage Popular carousel and its View all page. Shows the first 6 ticked.</span></span>
                  </label>
                  <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-gray-100 cursor-pointer hover:border-gray-300">
                    <input type="checkbox" checked={postIsHighlight} onChange={(e) => setPostIsHighlight(e.target.checked)} className="w-4 h-4 mt-0.5 accent-sortd-black shrink-0" />
                    <span className="flex flex-col"><span className="text-xs font-bold text-sortd-black">Highlight Block</span><span className="text-[10px] text-sortd-grey font-medium leading-snug">The large single feature (image + headline + button). Uses the first ticked article.</span></span>
                  </label>
                  <label className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-gray-100 cursor-pointer hover:border-gray-300">
                    <input type="checkbox" checked={postIsHero} onChange={(e) => setPostIsHero(e.target.checked)} className="w-4 h-4 mt-0.5 accent-sortd-black shrink-0" />
                    <span className="flex flex-col"><span className="text-xs font-bold text-sortd-black">Hero fallback image</span><span className="text-[10px] text-sortd-grey font-medium leading-snug">Only used if no hero banner image is uploaded in Banner Images.</span></span>
                  </label>
                </div>
              </div>
              {/* Publishing panel */}
              <div className="rounded-xl border border-gray-200 p-4 flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider font-body">Publishing</label>
                  <span className="text-[11px] font-semibold text-sortd-grey">
                    Current status: <StatusBadge status={editingPost ? postStatus : "draft"} />
                    {editingPost?.status === "scheduled" && editingPost.scheduledAt && (
                      <span className="ml-1">· goes live {formatInZone(editingPost.scheduledAt, editingPost.scheduledTimeZone || "UTC")}</span>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1.4fr] gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1 font-body">Publish date</label>
                    <input type="date" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} className={`w-full px-3 py-2 border ${postErrors.schedule ? "border-red-400" : "border-gray-200"} focus:border-sortd-black rounded-[8px] text-xs font-semibold focus:outline-none`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1 font-body">Time</label>
                    <input type="time" value={schedTime} onChange={(e) => setSchedTime(e.target.value)} className={`w-full px-3 py-2 border ${postErrors.schedule ? "border-red-400" : "border-gray-200"} focus:border-sortd-black rounded-[8px] text-xs font-semibold focus:outline-none`} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-sortd-grey uppercase tracking-wider mb-1 font-body">Time zone</label>
                    <select value={schedTz} onChange={(e) => setSchedTz(e.target.value)} className="w-full px-3 py-2 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold bg-white focus:outline-none">
                      {timeZoneOptions.map((tz) => <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                </div>
                {schedDate && schedTime && isValidTimeZone(schedTz) && (
                  <p className="text-[11px] text-sortd-grey font-medium -mt-2">
                    Will go live at <span className="font-bold text-sortd-black">{formatInZone(zonedToUtcIso(schedDate, schedTime, schedTz), schedTz)}</span>
                    {(() => { try { const local = Intl.DateTimeFormat().resolvedOptions().timeZone; return local !== schedTz ? ` (${formatInZone(zonedToUtcIso(schedDate, schedTime, schedTz), local)} your time)` : ""; } catch { return ""; } })()}
                  </p>
                )}
                {postErrors.schedule && <p className="-mt-2 text-[11px] font-semibold text-red-600">{postErrors.schedule}</p>}
              </div>

              <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 select-none">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={closePostModal} className="px-4 h-[40px] rounded-[8px] border border-gray-200 hover:bg-gray-100 text-sortd-grey font-body font-bold text-xs uppercase tracking-wider">Cancel</button>
                  {editingPost && postStatus !== "archived" && (
                    <button type="button" onClick={() => handlePostAction("archive")} className="px-4 h-[40px] rounded-[8px] border border-gray-200 hover:bg-gray-100 text-sortd-grey font-body font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5"><Archive className="w-3.5 h-3.5" />Archive</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => handlePostAction("draft")} className="px-4 h-[40px] rounded-[8px] border border-gray-300 hover:bg-gray-100 text-sortd-black font-body font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />{editingPost && postStatus === "published" ? "Unpublish to draft" : "Save draft"}</button>
                  <button type="button" onClick={() => openPreview("view")} className="px-4 h-[40px] rounded-[8px] border border-gray-300 hover:bg-gray-100 text-sortd-black font-body font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />Preview</button>
                  <button type="button" onClick={() => handlePostAction("schedule")} className="px-4 h-[40px] rounded-[8px] border border-sortd-black hover:bg-gray-100 text-sortd-black font-body font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" />Schedule</button>
                  <button type="button" onClick={() => handlePostAction("publish")} className="px-5 h-[40px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5"><Send className="w-3.5 h-3.5" />{editingPost && postStatus === "published" ? "Update" : "Publish"}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ARTICLE PREVIEW (and publish confirmation) */}
      {publishPreviewOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4" role="dialog" aria-modal="true" aria-label="Article preview">
          <div className="bg-white w-full max-w-6xl h-[94vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50">
              <div className="min-w-0">
                <h3 className="font-heading text-xl uppercase tracking-wider">{previewMode === "publish" ? "Review before publishing" : "Preview"}</h3>
                <p className="text-[11px] text-sortd-grey font-medium">This is exactly how the article page will look to readers. Nothing is public yet.</p>
              </div>
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                {(["desktop", "mobile"] as const).map((d) => (
                  <button key={d} type="button" onClick={() => setPreviewDevice(d)} className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${previewDevice === d ? "bg-sortd-black text-white" : "text-sortd-grey hover:bg-gray-100"}`}>
                    {d === "desktop" ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}{d}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-0 bg-gray-200 flex justify-center overflow-hidden">
              <iframe
                key={previewNonce}
                title="Article preview"
                src={`/article/${PREVIEW_SLUG}?t=${previewNonce}`}
                className={`h-full bg-white transition-all ${previewDevice === "mobile" ? "w-[390px] my-0 border-x border-gray-300" : "w-full"}`}
              />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 px-4 sm:px-6 py-3 border-t border-gray-100">
              {previewMode === "publish" ? (
                <>
                  <span className="mr-auto text-[11px] font-semibold text-sortd-grey">Publishing makes this article visible on the website immediately.</span>
                  <button type="button" onClick={() => setPublishPreviewOpen(false)} className="px-5 h-[40px] rounded-[8px] border border-gray-200 hover:bg-gray-100 text-sortd-grey font-body font-bold text-xs uppercase tracking-wider">Cancel — keep editing</button>
                  <button type="button" onClick={confirmPublish} className="px-5 h-[40px] rounded-[8px] bg-sortd-pink hover:bg-sortd-pink-hover text-white font-body font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5"><Send className="w-3.5 h-3.5" />Confirm &amp; publish</button>
                </>
              ) : (
                <button type="button" onClick={() => setPublishPreviewOpen(false)} className="px-5 h-[40px] rounded-[8px] bg-[#0A0A0A] text-white font-body font-bold text-xs uppercase tracking-wider">Close preview</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error toast */}
      {adminError && (
        <div role="alert" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[81] pl-4 pr-2 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-2xl max-w-[92vw] flex items-center gap-3">
          <span>{adminError}</span>
          <button type="button" onClick={() => setAdminError("")} aria-label="Dismiss" className="p-1 rounded hover:bg-white/20"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Toast */}
      {adminToast && !adminError && (
        <div role="status" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[80] px-5 py-3 rounded-xl bg-sortd-black text-white text-xs font-semibold shadow-2xl max-w-[92vw]">
          {adminToast}
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
                  className={`w-full px-4 py-3 bg-gray-55 border ${looksLikeUnsupportedInstagram(videoUrl) ? "border-red-400" : "border-gray-200"} focus:border-sortd-black rounded-[8px] text-xs font-semibold text-sortd-black focus:outline-none transition-colors`}
                />
                <div className="mt-1.5 mb-3 text-[11px] font-semibold">
                  {!videoUrl && <span className="text-sortd-grey font-medium">Paste an Instagram post/reel link or a direct .mp4 link. Leave empty to show &ldquo;Nothing to show here&rdquo; in the player.</span>}
                  {videoUrl && isInstagramUrl(videoUrl) && <span className="text-green-700">✓ Instagram {parseInstagramUrl(videoUrl)?.kind === "p" ? "post" : parseInstagramUrl(videoUrl)?.kind} detected. It will play inside the video story.</span>}
                  {looksLikeUnsupportedInstagram(videoUrl) && <span className="text-red-600">This Instagram link can&apos;t be embedded. Use a post or reel link like instagram.com/reel/ABC123/ (profile and story links don&apos;t work).</span>}
                  {videoUrl && !/instagram.com|instagr.am/i.test(videoUrl) && <span className="text-sortd-grey font-medium">Direct video link.</span>}
                </div>
                {videoUrl && isInstagramUrl(videoUrl) && (
                  <div className="mb-3 w-[180px] aspect-[9/16] rounded-lg overflow-hidden border border-gray-200 bg-black">
                    <iframe title="Instagram preview" src={getInstagramEmbedUrl(videoUrl)} className="w-full h-full border-none" allow="encrypted-media" scrolling="no" />
                  </div>
                )}

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
                <ImageField label="City image" required value={locationImageUrl} onChange={setLocationImageUrl} onUpload={(file) => handleFileUpload(file, "image")} previewClass="aspect-[3/4]" hint="Shown on the city card. Portrait images work best (about 600 × 800 px)." />
              </div>
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100 select-none">
                <button type="button" onClick={() => setIsLocationModalOpen(false)} className="px-5 py-3 h-[40px] rounded-[8px] border border-gray-200 hover:bg-gray-100 text-sortd-grey font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0">Cancel</button>
                <button type="submit" className="px-5 py-3 h-[40px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-1.5">Save Location</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SORTD PEOPLE MEMBER CREATE / EDIT */}
      {isPersonModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fade-in">
            <div className="flex justify-between items-center px-6 py-4 bg-gray-55 border-b border-gray-100">
              <h3 className="font-heading font-normal text-xl uppercase tracking-wider">{editingPerson ? "Edit Sortd People Member" : "Add Sortd People Member"}</h3>
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
                  <ImageField label="Member photo" required value={personImageUrl} onChange={setPersonImageUrl} onUpload={(file) => handleFileUpload(file, "image")} previewClass="aspect-square" hint="Square photos work best (at least 600 × 600 px)." />
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
                <textarea required rows={4} placeholder="Enter the member's quote..." value={personQuote} onChange={(e) => setPersonQuote(e.target.value)} className="w-full px-4 py-3 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-medium text-sortd-black focus:outline-none resize-y" />
              </div>
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100 select-none">
                <button type="button" onClick={() => setIsPersonModalOpen(false)} className="px-5 py-3 h-[40px] rounded-[8px] border border-gray-200 hover:bg-gray-100 text-sortd-grey font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0">Cancel</button>
                <button type="submit" className="px-5 py-3 h-[40px] rounded-[8px] bg-[#0A0A0A] hover:bg-sortd-pink text-white font-body font-bold text-xs uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center gap-1.5">Save Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
