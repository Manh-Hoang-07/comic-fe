import Image from "next/image";
import Link from "next/link";
import { FollowButton } from "@/components/Features/Comics/Shared/FollowButton";
import { Star, User, Info } from "lucide-react";
import { formatNumber } from "@/utils/formatters";
import { Comic } from "@/types/comic";

interface ComicInfoProps {
  comic: Comic;
}

export default function ComicInfo({ comic }: ComicInfoProps) {
  return (
    <>
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm font-medium text-gray-500">
        <Link href="/" className="hover:text-red-500">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link href="/comics" className="hover:text-red-500">Truyện tranh</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 truncate">{comic.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Cover Image */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src={comic.cover_image}
              alt={comic.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">{comic.title}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {comic.categories.map(cat => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-red-500" />
              <span className="text-gray-500 font-medium">Tác giả:</span>
              <span className="text-gray-900 font-bold">{comic.author || 'Đang cập nhật'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-red-500" />
              <span className="text-gray-500 font-medium">Trạng thái:</span>
              <span className="text-gray-900 font-bold">
                {comic.status === 'completed' ? 'Hoàn thành' : 'Đang tiến hành'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mb-8 text-left bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Lượt xem</p>
                <p className="text-gray-900 font-black">{formatNumber(comic.stats?.view_count)}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-100 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Theo dõi</p>
                <p className="text-gray-900 font-black">{formatNumber(comic.stats?.follow_count)}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-100 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Đánh giá</p>
                <p className="text-gray-900 font-black">
                  {comic.stats?.rating_sum
                    ? (Number(comic.stats.rating_sum) / Math.max(1, Number(comic.stats.rating_count))).toFixed(1)
                    : '4.9'}
                </p>
              </div>
            </div>
          </div>

          {/* FollowButton là "use client" nhưng OK khi là child của Server Component */}
          <div className="flex flex-wrap gap-4 mb-8">
            <FollowButton comicId={comic.id} />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 italic text-gray-600 leading-relaxed shadow-sm">
            <p className="not-italic font-bold text-gray-800 mb-2 uppercase text-xs tracking-widest">Nội dung</p>
            {comic.description || 'Chưa có mô tả cho bộ truyện này.'}
          </div>
        </div>
      </div>
    </>
  );
}
