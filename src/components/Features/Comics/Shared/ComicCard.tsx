"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/utils/formatters";
import { useEffect, useState } from "react";

interface ComicCardProps {
  comic: {
    id: string | number;
    slug: string;
    title: string;
    cover_image?: string;
    categories?: Array<{ id: string | number; name: string }>;
    stats?: {
      view_count?: number;
      chapter_count?: number;
    };
  };
}

export default function ComicCard({ comic }: ComicCardProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/comics/${comic.slug}`)}
    >
      <div className="aspect-[3/4] relative">
        {comic.cover_image ? (
          <Image
            src={comic.cover_image}
            alt={comic.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
          {comic.title}
        </h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {(comic.categories || []).slice(0, 2).map((category) => (
            <span
              key={category.id}
              className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {category.name}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{isMounted ? formatNumber(comic.stats?.view_count || 0) : (comic.stats?.view_count || 0)} lượt xem</span>
          <span>{comic.stats?.chapter_count || 0} chương</span>
        </div>
      </div>
    </div>
  );
}



