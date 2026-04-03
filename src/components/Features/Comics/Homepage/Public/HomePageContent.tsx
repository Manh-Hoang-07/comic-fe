"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api/client";
import { publicEndpoints } from "@/lib/api/endpoints";
import { ComicCard } from "@/components/Features/Comics/ComicList/Public/ComicCard";
import { Comic, ComicCategory as Category } from "@/types/comic";
import { formatNumber, formatDate } from "@/utils/formatters";



export default function HomePageContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [featuredComics, setFeaturedComics] = useState<Comic[]>([]);
  const [trendingComics, setTrendingComics] = useState<Comic[]>([]);
  const [popularComics, setPopularComics] = useState<Comic[]>([]);
  const [newestComics, setNewestComics] = useState<Comic[]>([]);
  const [recentUpdateComics, setRecentUpdateComics] = useState<Comic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadHomepageData();
  }, []);

  async function loadHomepageData() {
    setLoading(true);
    try {
      const response = await api.get(publicEndpoints.homepage);

      if (response.data?.success) {
        const data = response.data.data;

        setFeaturedComics(data.top_viewed_comics || []);
        setTrendingComics(data.trending_comics || []);
        setPopularComics(data.popular_comics || []);
        setNewestComics(data.newest_comics || []);
        setRecentUpdateComics(data.recent_update_comics || []);
        setCategories(data.comic_categories || []);
      }
    } catch (error) {
      console.error("Failed to load homepage data:", error);
    } finally {
      setLoading(false);
    }
  }

  function prevFeatured() {
    if (currentFeaturedIndex > 0) {
      setCurrentFeaturedIndex(currentFeaturedIndex - 1);
    }
  }

  function nextFeatured() {
    if (currentFeaturedIndex < featuredComics.length - 1) {
      setCurrentFeaturedIndex(currentFeaturedIndex + 1);
    }
  }

  function filterByCategory(categoryId: number) {
    router.push(`/comics?category=${categoryId}`);
  }

  function goToComic(slug: string) {
    router.push(`/comics/${slug}`);
  }

  function localFormatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return formatDate(dateString);
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Featured Comics Slider */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Truyện nổi bật</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {currentFeaturedIndex + 1} / {featuredComics.length}
              </span>
              <button
                onClick={prevFeatured}
                disabled={currentFeaturedIndex === 0}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button
                onClick={nextFeatured}
                disabled={currentFeaturedIndex === featuredComics.length - 1}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="flex space-x-6">
                <div className="w-32 h-48 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ) : featuredComics.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {featuredComics.map((comic, index) => (
                <div
                  key={comic.id}
                  className={`flex flex-col md:flex-row cursor-pointer hover:bg-gray-50 transition-colors ${index === currentFeaturedIndex ? "" : "hidden"
                    }`}
                  onClick={() => goToComic(comic.slug)}
                >
                  <div className="md:w-48 flex-shrink-0 relative aspect-[3/4] md:h-auto">
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
                  <div className="flex-1 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{comic.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(comic.categories || []).slice(0, 5).map((category) => (
                        <span
                          key={category.id}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {category.name}
                        </span>
                      ))}
                    </div>
                    {comic.last_chapter && (
                      <div className="mb-4">
                        <Link
                          href={`/comics/${comic.slug}/chapters/${comic.last_chapter.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm block"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {comic.last_chapter.title || `Chương ${comic.last_chapter.chapter_index}`}
                        </Link>
                        {comic.last_chapter.created_at && (
                          <span className="text-xs text-gray-500">
                            {formatDate(comic.last_chapter.created_at)}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{isMounted ? formatNumber(parseInt(comic.stats?.view_count || "0")) : (comic.stats?.view_count || "0")} lượt xem</span>
                      <span>{comic.stats?.chapter_count || 0} chương</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* Filter Buttons */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Phân loại</h2>
            <Link
              href="/comics"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Tìm kiếm nâng cao
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 8).map((category) => (
              <button
                key={category.id}
                onClick={() => filterByCategory(Number(category.id))}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-colors"
              >
                {category.name}
              </button>
            ))}
            <Link
              href="/comics"
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
            >
              Xem thêm
            </Link>
          </div>
        </section>

        {/* Comics Grid - Trending */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Truyện Hot</h2>
            <Link
              href="/comics?sort_by=view_count&sort_order=DESC"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              Xem tất cả
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : trendingComics.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {trendingComics.slice(0, 30).map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
          ) : null}
        </section>

        {/* Latest Updates */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Mới Cập Nhật</h2>
            <Link
              href="/comics?sort_by=updated_at&sort_order=DESC"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
            >
              Xem tất cả
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 animate-pulse">
                  <div className="w-16 h-24 bg-gray-200 rounded flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentUpdateComics.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {recentUpdateComics.slice(0, 10).map((comic) => (
                <div
                  key={comic.id}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 cursor-pointer group"
                  onClick={() => goToComic(comic.slug)}
                >
                  <div className="w-16 h-24 relative flex-shrink-0">
                    {comic.cover_image ? (
                      <Image
                        src={comic.cover_image}
                        alt={comic.title}
                        fill
                        className="object-cover rounded"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
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
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                      {comic.title}
                    </h3>
                    {comic.last_chapter && (
                      <Link
                        href={`/comics/${comic.slug}/chapters/${comic.last_chapter.id}`}
                        className="text-primary hover:text-primary/80 font-medium text-sm block mb-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {comic.last_chapter.title || `Chương ${comic.last_chapter.chapter_index}`}
                      </Link>
                    )}
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      {comic.last_chapter?.created_at && (
                        <span>{isMounted ? localFormatDate(comic.last_chapter.created_at) : ""}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      {isMounted ? formatNumber(parseInt(comic.stats?.view_count || "0")) : (comic.stats?.view_count || "0")}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      {comic.stats?.chapter_count || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        {/* Popular Comics */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Truyện Hot</h2>
            <Link
              href="/comics?sort_by=view_count&sort_order=DESC"
              className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
            >
              Xem tất cả
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : popularComics.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {popularComics.slice(0, 30).map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
          ) : null}
        </section>

        {/* Newest Comics */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Truyện Mới</h2>
            <Link
              href="/comics?sort_by=created_at&sort_order=DESC"
              className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
            >
              Xem tất cả
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : newestComics.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {newestComics.slice(0, 30).map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}



