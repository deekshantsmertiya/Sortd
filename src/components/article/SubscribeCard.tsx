"use client";

import React, { useState } from "react";
import { Gift, CheckCircle, ArrowRight } from "lucide-react";
import { addSubscriber } from "@/hooks/useSubscribers";

interface SubscribeCardProps {
  variant?: "default" | "article";
  shareUrl?: string;
  articleTitle?: string;
}

export default function SubscribeCard({ variant = "default", shareUrl, articleTitle }: SubscribeCardProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      addSubscriber(email);
      setSubscribed(true);
    }
  };

  if (variant === "article") {
    return (
      <div className="w-full border-t border-b border-gray-100 pt-4 pb-8 text-sortd-black">
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h3 className="font-heading font-extrabold text-2xl uppercase tracking-wider mb-1">
                STAY SORTD. SUBSCRIBE NOW
              </h3>
              <p className="text-xs text-sortd-grey font-medium">
                News, culture and community stories in 60 seconds.
              </p>
            </div>
            
            {shareUrl && articleTitle && (
              <div className="hidden md:flex items-center gap-[6px] self-start mt-1">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(articleTitle + " " + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-sortd-yellow hover:text-sortd-black hover:border-sortd-yellow flex items-center justify-center transition-colors bg-white shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(articleTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-sortd-yellow hover:text-sortd-black hover:border-sortd-yellow flex items-center justify-center transition-colors bg-white shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.861-.173.746-.511 1.002-.756 1.023-.533.048-.938-.352-1.454-.69-.808-.53-1.264-.858-2.051-1.376-.91-.599-.32-.928.198-1.467.135-.14.249-.267.362-.387 1.222-1.127 1.833-1.69 1.833-1.69.13-.122.18-.184.093-.274-.087-.09-.239-.03-.342.003L11.5 10.3c-.927.604-1.854 1.208-2.781 1.812-.511.341-.95.511-1.317.511-.476 0-1.393-.257-2.073-.483-.836-.277-1.503-.423-1.445-.893.03-.244.368-.493 1.014-.748 3.968-1.724 6.613-2.861 7.935-3.411 3.78-1.573 4.566-1.846 5.077-1.854.113-.002.365.026.529.159.138.113.176.267.191.385-.008.081-.004.22-.008.309z"/>
                  </svg>
                </a>
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-sortd-yellow hover:text-sortd-black hover:border-sortd-yellow flex items-center justify-center transition-colors bg-white shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(articleTitle)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-sortd-yellow hover:text-sortd-black hover:border-sortd-yellow flex items-center justify-center transition-colors bg-white shadow-sm cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-sortd-yellow hover:text-sortd-black hover:border-sortd-yellow flex items-center justify-center transition-colors bg-white shadow-sm cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            )}
          </div>

          {subscribed ? (
            <div className="text-green-600 font-body font-bold text-xs uppercase">
              You&apos;re in! Welcome to Sortd Dubai.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-[6px] border border-gray-200 text-xs font-medium text-sortd-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-sortd-black"
                />
                <Gift className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-[6px] bg-sortd-yellow text-sortd-black font-body font-extrabold text-xs tracking-wider uppercase hover:bg-sortd-yellow-hover transition-colors shadow-sm text-center"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[10px] text-gray-400 font-medium mt-2">
            By subscribing you agree to the terms & conditions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl bg-sortd-yellow border border-sortd-black/10 p-6 sm:p-8 text-sortd-black relative overflow-hidden shadow-sortd-md">
      <div className="max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Gift Icon Badge */}
        <div className="w-12 h-12 rounded-full bg-sortd-black text-sortd-yellow flex items-center justify-center mb-4 shadow-md">
          <Gift className="w-6 h-6" />
        </div>

        <h3 className="font-heading font-extrabold text-2xl sm:text-3xl uppercase tracking-wider mb-2">
          STAY SORTD. SUBSCRIBE NOW
        </h3>

        <p className="text-xs sm:text-sm font-medium text-sortd-black/85 mb-6 max-w-md">
          Get Dubai&apos;s 60-second news highlights, hidden dining spots, and cultural drops straight to your inbox every morning.
        </p>

        {subscribed ? (
          <div className="flex items-center gap-2 px-6 py-3.5 rounded-none bg-sortd-black text-white font-body font-bold text-sm">
            <CheckCircle className="w-5 h-5 text-sortd-yellow" />
            <span>YOU&apos;RE IN! WELCOME TO SORTD DUBAI.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-grow">
              <Gift className="w-4 h-4 text-sortd-grey absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-none bg-white border border-sortd-black/10 text-xs sm:text-sm font-medium text-sortd-black placeholder:text-sortd-grey focus:outline-none focus:ring-2 focus:ring-sortd-black"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-none bg-sortd-black text-white font-body font-bold text-xs tracking-wider uppercase hover:bg-sortd-pink transition-colors shadow-md flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <span>SUBSCRIBE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-[11px] font-medium text-sortd-black/70 mt-4">
          No spam, ever. Unsubscribe with one click anytime.
        </p>
      </div>
    </div>
  );
}
