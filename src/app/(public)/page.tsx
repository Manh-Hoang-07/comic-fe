import { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getComicHomepageData } from "@/lib/api/public/comic";
import { TrendingHero } from "@/components/Features/Comics/ComicList/Public/TrendingHero";
import { ComicSection } from "@/components/Features/Comics/ComicList/Public/ComicSection";
import { CategorySidebar } from "@/components/Features/Comics/Categories/Public/CategorySidebar";
import { formatNumber } from "@/utils/formatters";

export const metadata: Metadata = {
  title: "Trang Chủ | Comic Haven - Thế Giới Truyện Tranh Miễn Phí",
  description:
    "Trang web đọc truyện tranh online lớn nhất với hàng ngàn đầu truyện hấp dẫn được cập nhật mỗi ngày.",
};

export const revalidate = 60;

// Skeleton hiển thị ngay khi request đến, trước khi data về
function HomepageSkeleton() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen animate-pulse">
      <div className="container mx-auto px-4 py-8">
        {/* Hero skeleton */}
        <div className="w-full h-[400px] bg-gray-200 rounded-2xl mb-8" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content skeleton */}
          <div className="flex-1 space-y-12">
            {[...Array(3)].map((_, s) => (
              <div key={s}>
                <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-[2/3] bg-gray-200 rounded-xl" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:w-80 w-full space-y-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
              <div className="grid grid-cols-2 gap-2">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 mb-4">
                  <div className="w-16 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Async Server Component — fetch homepage data
async function AsyncHomepageContent() {
  const data = await getComicHomepageData();

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <svg
            className="w-20 h-20 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Oops! Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-6">
            Không thể kết nối được với máy chủ để lấy dữ liệu trang chủ.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition"
          >
            Thử lại
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#f8f9fa] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="sr-only">
          Comic Haven - Thế giới truyện tranh trực tuyến
        </h1>

        <TrendingHero comics={data.trending_comics || []} />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ComicSection
              title="Mới cập nhật"
              comics={data.recent_update_comics || []}
              viewAllLink="/comics?sort=last_chapter_updated_at:desc"
            />
            <ComicSection
              title="Truyện phổ biến"
              comics={data.popular_comics || []}
              viewAllLink="/comics?sort=view_count:desc"
            />
            <ComicSection
              title="Truyện mới đăng"
              comics={data.newest_comics || []}
              viewAllLink="/comics?sort=created_at:desc"
            />
          </div>

          <aside className="lg:w-80 w-full">
            <div className="sticky top-24 space-y-8">
              <CategorySidebar categories={data.comic_categories || []} />

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-extrabold mb-6 border-b pb-2 text-gray-800 uppercase tracking-tighter">
                  Xem nhiều nhất
                </h3>
                <div className="space-y-4">
                  {(data.top_viewed_comics || []).map((comic, idx) => (
                    <div key={comic.id} className="flex gap-4 group cursor-pointer">
                      <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={comic.cover_image}
                          alt={comic.title}
                          width={64}
                          height={80}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="64px"
                        />
                        <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg">
                          #{idx + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-800 line-clamp-2 group-hover:text-red-500 transition-colors">
                          {comic.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                          <svg
                            className="w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          {formatNumber(comic.stats?.view_count)} lượt xem
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function ComicHomePage() {
  return (
    <Suspense fallback={<HomepageSkeleton />}>
      <AsyncHomepageContent />
    </Suspense>
  );
}
