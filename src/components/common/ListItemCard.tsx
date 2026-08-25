import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Zap, Globe, Users } from "lucide-react";
import { Article } from "@/types";
import { getCategoryBadgeStyle } from "@/hooks/categoryStyles";

interface ListItemCardProps {
  article: Article;
  className?: string;
}

export default function ListItemCard({ article, className = "" }: ListItemCardProps) {
  const badgeStyle = getCategoryBadgeStyle(article.category);

  const getIcon = (catName: string) => {
    switch (catName.toUpperCase()) {
      case "NEWS":
        return <Zap className="w-3 h-3 text-current fill-current" />;
      case "CULTURE":
        return <Globe className="w-3 h-3 text-current" />;
      case "COMMUNITY":
        return <Users className="w-3 h-3 text-current" />;
      default:
        return <Zap className="w-3 h-3 text-current" />;
    }
  };

  const icon = getIcon(article.category);

  return (
    <Link href={`/article/${article.slug}`} className={`group block ${className}`}>
      <div className="flex gap-[16px] sm:gap-[20px] lg:gap-[12px] xl:gap-[20px] items-start w-full min-h-[136px] sm:min-h-[145px] lg:min-h-[110px] xl:min-h-[145px] py-1 select-none">
        {/* Left Square Thumbnail Image (responsive, Radius 15.34px) */}
        <div className="relative w-[136px] h-[136px] sm:w-[145px] sm:h-[145px] lg:w-[110px] lg:h-[110px] xl:w-[145px] xl:h-[145px] flex-shrink-0 rounded-[15px] overflow-hidden bg-gray-100">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 136px, (max-width: 1024px) 145px, (max-width: 1280px) 110px, 145px"
          />
        </div>

        {/* Right Content Stack */}
        <div className="flex flex-col gap-[4px] min-w-0 flex-grow py-0.5">
          {/* Tag & Time Row */}
          <div className="flex items-center gap-2">
            <span
              className={`h-[22px] px-2.5 rounded-none font-body font-bold text-[10px] uppercase tracking-[1px] inline-flex items-center justify-center gap-1 ${badgeStyle.textColorClass}`}
              style={{ backgroundColor: badgeStyle.bgColor }}
            >
              {icon}
              <span>{article.category}</span>
            </span>
            <span className="hidden md:inline text-[10px] font-semibold text-sortd-grey uppercase tracking-wider">
              {article.publishedAt}
            </span>
          </div>

          {/* Bebas Neue Headline Title */}
          <h4 className="font-heading font-normal text-[20px] sm:text-[23px] lg:text-[18px] xl:text-[23px] leading-[20px] sm:leading-[23px] lg:leading-[18px] xl:leading-[23px] text-[#0A0A0A] uppercase tracking-[1px] line-clamp-2 group-hover:text-sortd-pink transition-colors">
            {article.title}
          </h4>

          {/* Description Excerpt */}
          <p className="text-[13px] sm:text-[14px] leading-[18px] sm:leading-[20px] text-[#555555] line-clamp-1 sm:line-clamp-2 font-medium">
            {article.excerpt}
          </p>

          {/* Bottom Yellow Read-time Button */}
          <div className="mt-[2px]">
            <span className="inline-flex items-center gap-[5px] px-[8px] py-[4px] h-[23px] rounded-none bg-[#FFD100] text-sortd-black font-body font-bold text-[10px] uppercase tracking-[1px] group-hover:bg-[#E0B800] transition-colors shadow-sm">
              <Clock className="w-3.5 h-3.5 text-sortd-black" />
              <span>READ IN {article.readTime}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
