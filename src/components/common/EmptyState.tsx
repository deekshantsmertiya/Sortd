import React from "react";
import { Inbox } from "lucide-react";

/** Shown wherever a slide, column or list has nothing to display. */
export default function EmptyState({ message = "Nothing to show here", className = "", dark = false }: { message?: string; className?: string; dark?: boolean }) {
  return (
    <div
      role="status"
      className={`w-full flex flex-col items-center justify-center gap-2 text-center py-10 px-4 rounded-[10px] border border-dashed ${dark ? "border-white/30 text-white/80" : "border-gray-300 text-sortd-grey bg-white/50"} ${className}`}
    >
      <Inbox className="w-6 h-6 opacity-60" aria-hidden="true" />
      <p className="font-body font-semibold text-sm">{message}</p>
    </div>
  );
}
