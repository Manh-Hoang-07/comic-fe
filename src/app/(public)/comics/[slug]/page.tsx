import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getComicDetail, getComicChapters } from "@/lib/api/public/comic";
import { getComicComments } from "@/lib/api/public/comment";
import { ChapterList } from "@/components/Features/Comics/Chapters/Public/ChapterList";
import { CommentSection } from "@/components/Features/Comics/Comments/Public/CommentSection";
import ComicInfo from "@/components/Features/Comics/ComicList/Public/ComicInfo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comic = await getComicDetail(slug);
  if (!comic) return { title: "Không tìm thấy truyện" };
  return {
    title: `${comic.title} | Comic Haven`,
    description: comic.description,
    openGraph: { images: [comic.cover_image] },
  };
}

// Async server component — fetch chapters độc lập
async function AsyncChapterList({ slug, comicSlug }: { slug: string; comicSlug: string }) {
  const chaptersData = await getComicChapters(slug);
  const chapters = Array.isArray(chaptersData) ? chaptersData : (chaptersData?.data || []);
  return (
    <div className="max-w-4xl mx-auto">
      {chapters.length > 0 && (
        <div className="mb-6">
          <Link
            href={`/chapters/${chapters[chapters.length - 1].id}`}
            className="px-8 py-3 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
          >
            Đọc từ đầu
          </Link>
        </div>
      )}
      <ChapterList chapters={chapters} comicSlug={comicSlug} />
    </div>
  );
}

// Async server component — fetch comments độc lập
async function AsyncComments({ comicId }: { comicId: string | number }) {
  const commentsData = await getComicComments(String(comicId), 1);
  return <CommentSection comicId={comicId} comments={commentsData?.data || []} />;
}

// Skeleton đơn giản cho danh sách chapter
function ChapterSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 animate-pulse">
      <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded mb-2" />
      ))}
    </div>
  );
}

// Skeleton cho comment section
function CommentSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 animate-pulse">
      <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-3 mb-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ComicDetailPage({ params }: Props) {
  const { slug } = await params;
  const comic = await getComicDetail(slug);
  if (!comic) notFound();

  return (
    <main className="bg-[#f8f9fa] min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Comic info — render ngay, không chờ chapters/comments */}
        <ComicInfo comic={comic} />

        <div className="max-w-4xl mx-auto space-y-16">
          {/* Chapters — stream độc lập */}
          <Suspense fallback={<ChapterSkeleton />}>
            <AsyncChapterList slug={slug} comicSlug={comic.slug} />
          </Suspense>

          {/* Comments — stream độc lập */}
          <div className="grid grid-cols-1 gap-12 border-t border-gray-100 pt-12">
            <Suspense fallback={<CommentSkeleton />}>
              <AsyncComments comicId={comic.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
