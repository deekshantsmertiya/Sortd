"use client";

import React from "react";
import {
  FileText, Video, Tags, MapPin, Users, Mail, Settings, Image as ImageIcon, UserCog, ShieldCheck, Lightbulb, ArrowRight,
} from "lucide-react";

export type GuideTab = "posts" | "videos" | "categories" | "locations" | "people" | "subscribers" | "homepage" | "settings" | "users" | "account";

interface Entry {
  tab: GuideTab;
  icon: React.ReactNode;
  name: string;
  what: string;
  where: string;
  how: string[];
  adminOnly?: boolean;
}

const ENTRIES: Entry[] = [
  {
    tab: "posts", icon: <FileText className="w-5 h-5" />, name: "Articles",
    what: "Every story on the site. Write with the rich-text editor (headings, bold, lists, links, images), add an author, tags and SEO, then save as a draft, schedule, publish or archive.",
    where: "Article pages, Latest Stories, the News / Culture / Community columns, Popular Stories, the Highlight block, search and the /latest and /news pages.",
    how: [
      "Headlines are limited to 35 characters so they fit on cards; the counter turns red when you go over.",
      "“Publish” always shows a preview first, so you can check the real page before it goes live.",
      "Placement boxes: Latest Stories (homepage row, first 4 ticked), Popular Stories (first 6 ticked), Highlight Block (the big feature, first ticked), Hero fallback (its image is used only if no hero banner image is uploaded).",
      "Drafts and archived articles are never visible to readers. Scheduled articles go live automatically at their time.",
    ],
  },
  {
    tab: "videos", icon: <Video className="w-5 h-5" />, name: "Videos",
    what: "Short video stories. Paste an Instagram post/reel link, a direct .mp4 link, or upload a file, plus a thumbnail.",
    where: "The VIDEOS carousel on the homepage and the full-screen story viewer.",
    how: ["Instagram profile or story links can't be embedded — use a link to a specific post or reel.", "A story with no video shows “Nothing to show here” in the viewer."],
  },
  {
    tab: "categories", icon: <Tags className="w-5 h-5" />, name: "Categories", adminOnly: true,
    what: "The sections articles belong to (e.g. News, Culture, Community) and their colours.",
    where: "Category pills on every card, the homepage columns, the header menu and the filters on /news and /latest.",
    how: ["Renaming a category moves all its articles, videos and members automatically.", "A category that's in use can't be deleted until its articles are moved."],
  },
  {
    tab: "locations", icon: <MapPin className="w-5 h-5" />, name: "Locations", adminOnly: true,
    what: "City cards (name, tagline, image).",
    where: "The Locations section near the bottom of the homepage — currently switched off in Site Settings › Locations.",
    how: ["Turn the section on in Site Settings, then choose desktop/mobile in Homepage Sections."],
  },
  {
    tab: "people", icon: <Users className="w-5 h-5" />, name: "Sortd People", adminOnly: true,
    what: "Members featured in the Sortd People section: photo, name, title and quote.",
    where: "The SORTD PEOPLE section of the homepage.",
    how: ["Square photos (at least 600 × 600 px) look best.", "Change the section heading and intro text in Site Settings › Homepage Sections."],
  },
  {
    tab: "subscribers", icon: <Mail className="w-5 h-5" />, name: "Subscribers", adminOnly: true,
    what: "Everyone who signed up for the newsletter. Export as CSV for your email tool.",
    where: "Collected from the header Subscribe button, the homepage pop-up and the subscribe card on article pages.",
    how: [],
  },
  {
    tab: "homepage", icon: <Settings className="w-5 h-5" />, name: "Site Settings", adminOnly: true,
    what: "Site-wide options: article line colour, About page text, footer Connect links, Locations on/off, homepage section order/visibility/headings, and SEO for the main pages.",
    where: "Across the whole website.",
    how: ["Homepage Sections: drag the handle or use the arrows to reorder; separate Desktop and Mobile switches; “Edit heading & intro text” on each section.", "Remember to press Save in each panel."],
  },
  {
    tab: "settings", icon: <ImageIcon className="w-5 h-5" />, name: "Banner Images", adminOnly: true,
    what: "The image-only hero banner (separate desktop and mobile images) and the optional skyline + logo strip.",
    where: "The top of the homepage, directly under the yellow header.",
    how: ["Recommended sizes: desktop 1920 × 436 px, mobile 750 × 476 px."],
  },
  {
    tab: "users", icon: <ShieldCheck className="w-5 h-5" />, name: "Manage Users", adminOnly: true,
    what: "Logins for your team. Uploaders can only manage Articles and Videos; Admins can change everything.",
    where: "Admin panel only.",
    how: ["Only the main administrator can add or delete accounts."],
  },
  {
    tab: "account", icon: <UserCog className="w-5 h-5" />, name: "My Account",
    what: "Change your own username and password.",
    where: "Admin panel only.",
    how: ["Both changes ask for your current password."],
  },
];

export default function AdminGuide({ isAdmin, onOpen }: { isAdmin: boolean; onOpen: (tab: GuideTab) => void }) {
  const entries = ENTRIES.filter((e) => isAdmin || !e.adminOnly);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">Help &amp; Guide</h2>
        <p className="text-xs text-sortd-grey font-medium mt-1 max-w-3xl">
          What each part of this admin panel controls, where it shows on the website, and the rules to know. Click a card to open that section.
        </p>
      </div>

      <div className="flex items-start gap-2 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-xs text-sortd-black font-medium">
        <Lightbulb className="w-4 h-4 shrink-0 mt-px text-yellow-600" />
        <div className="flex flex-col gap-1">
          <p><span className="font-bold">Saving:</span> every change shows a green confirmation; problems show a red message explaining what to fix. Nothing is lost if a save fails.</p>
          <p><span className="font-bold">Article drafts</span> auto-save while you type and can be restored if you close the editor.</p>
          <p><span className="font-bold">Note:</span> content is currently stored in this browser. Changes made here are visible in this browser only until the site is connected to a database.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {entries.map((e) => (
          <button
            key={e.tab}
            type="button"
            onClick={() => onOpen(e.tab)}
            className="text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-2 hover:border-sortd-black transition-colors group"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-heading text-xl uppercase tracking-wider inline-flex items-center gap-2">{e.icon}{e.name}</h3>
              <ArrowRight className="w-4 h-4 text-sortd-grey group-hover:text-sortd-black" />
            </div>
            <p className="text-xs text-sortd-black font-medium">{e.what}</p>
            <p className="text-[11px] text-sortd-grey font-medium"><span className="font-bold text-sortd-black">On the website:</span> {e.where}</p>
            {e.how.length > 0 && (
              <ul className="list-disc pl-4 text-[11px] text-sortd-grey font-medium flex flex-col gap-0.5">
                {e.how.map((h) => <li key={h}>{h}</li>)}
              </ul>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
