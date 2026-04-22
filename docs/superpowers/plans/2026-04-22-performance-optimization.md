# Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cải thiện hiệu năng hệ thống qua 4 nhóm thay đổi: Redis cache, Web Vitals, RSC Streaming, và giảm "use client" components.

**Architecture:** Sequential execution — mỗi task độc lập, commit riêng. Task 1-2 là backend/infra, Task 3-4 là refactor component. Không có breaking changes — tất cả thay đổi backward compatible.

**Tech Stack:** Next.js 15, React 19, ioredis, TypeScript

---

## File Map

| File | Action | Task |
|------|--------|------|
| `src/lib/redis.ts` | Create | T1 |
| `src/app/api/public/system-config/general/route.ts` | Modify | T1 |
| `src/components/Providers/WebVitalsReporter.tsx` | Create | T2 |
| `src/app/layout.tsx` | Modify | T2, T3a |
| `src/app/(public)/layout.tsx` | Modify | T3a |
| `src/app/(public)/comics/[slug]/page.tsx` | Modify | T3b |
| `src/components/Features/Comics/ComicList/Public/ComicDetail.tsx` | Modify | T3b |
| `src/components/UI/Navigation/Breadcrumbs.tsx` | Modify | T4a |
| `src/components/UI/DataDisplay/StatusBadge.tsx` | Modify | T4a |
| `src/app/(public)/faqs/page.tsx` | Modify | T4b |
| `src/components/Features/Introduction/Faqs/Public/FaqsPage.tsx` | Modify | T4b |
| `src/app/(public)/gallery/page.tsx` | Modify | T4c |
| `src/components/Features/Introduction/Gallery/Public/GalleryGrid.tsx` | Modify | T4c |
| `src/components/Features/Introduction/Gallery/Public/GalleryInteractive.tsx` | Create | T4c |

---

## Task 1: Redis Cache cho System Config

**Mục tiêu:** Thay `Map` in-memory trong route handler bằng Redis — không mất cache khi server restart.

**Files:**
- Create: `src/lib/redis.ts`
- Modify: `src/app/api/public/system-config/general/route.ts`

- [ ] **Step 1: Cài ioredis**

```bash
npm install ioredis
npm install --save-dev @types/ioredis
```

Verify: `cat package.json | grep ioredis`

- [ ] **Step 2: Tạo Redis singleton client**

Tạo `src/lib/redis.ts`:

```typescript
import Redis from "ioredis";

let client: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (client) return client;

  try {
    const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      lazyConnect: true,
      enableOfflineQueue: false,
    });

    redis.on("error", (err) => {
      console.warn("[Redis] Connection error:", err.message);
    });

    client = redis;
    return client;
  } catch (err) {
    console.warn("[Redis] Failed to create client:", err);
    return null;
  }
}
```

- [ ] **Step 3: Cập nhật route handler dùng Redis**

Thay toàn bộ nội dung `src/app/api/public/system-config/general/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import { getRedisClient } from "@/lib/redis";

const CACHE_TTL_SECONDS = 60 * 60; // 1 giờ
const CACHE_KEY = "public:general-config";

export async function GET(request: NextRequest) {
  const redis = getRedisClient();

  try {
    // Kiểm tra Redis cache
    if (redis) {
      const cached = await redis.get(CACHE_KEY).catch(() => null);
      if (cached) {
        return NextResponse.json(JSON.parse(cached), {
          headers: { "X-Cache": "HIT" },
        });
      }
    }

    // Gọi backend API
    const response = await fetch(
      `${env.apiUrl}/api/public/SystemConfig/general`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();

    // Lưu vào Redis
    if (redis) {
      await redis
        .set(CACHE_KEY, JSON.stringify(data), "EX", CACHE_TTL_SECONDS)
        .catch(() => null);
    }

    return NextResponse.json(data, { headers: { "X-Cache": "MISS" } });
  } catch (error: unknown) {
    // Stale fallback từ Redis nếu backend lỗi
    if (redis) {
      const stale = await redis.get(CACHE_KEY).catch(() => null);
      if (stale) {
        return NextResponse.json(JSON.parse(stale), {
          headers: { "X-Cache": "STALE" },
        });
      }
    }

    // Default config nếu không có cache và backend lỗi
    const defaultConfig = {
      site_name: env.siteName,
      site_description: env.siteDescription,
      site_logo: null,
      site_favicon: null,
      site_email: null,
      site_phone: null,
      site_address: null,
      site_copyright: null,
      timezone: "Asia/Ho_Chi_Minh",
      locale: "vi",
      currency: "VND",
      contact_channels: null,
      meta_title: null,
      meta_description: null,
      meta_keywords: null,
      og_title: null,
      og_description: null,
      og_image: null,
      canonical_url: null,
      google_analytics_id: null,
      google_search_console: null,
      facebook_pixel_id: null,
      twitter_site: null,
    };

    return NextResponse.json(defaultConfig, { headers: { "X-Cache": "ERROR" } });
  }
}
```

- [ ] **Step 4: Thêm REDIS_URL vào env (nếu có .env)**

Kiểm tra: `ls d:/comic-fe/.env* 2>/dev/null`

Nếu có `.env.local` hoặc `.env`, thêm vào:
```
REDIS_URL=redis://localhost:6379
```

- [ ] **Step 5: Khởi động Redis và test thủ công**

```bash
# Windows — đảm bảo Redis đang chạy
# Mở browser hoặc curl:
curl http://localhost:3000/api/public/system-config/general
# Lần 1: X-Cache: MISS
# Lần 2: X-Cache: HIT
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/redis.ts src/app/api/public/system-config/general/route.ts package.json package-lock.json
git commit -m "perf: replace in-memory Map cache with Redis for system-config route"
```

---

## Task 2: Web Vitals Monitoring (console log) - chưa cần làm cái này, sẽ làm sau

**Mục tiêu:** Log Core Web Vitals (LCP, FID, CLS, FCP, TTFB) ra console để theo dõi hiệu năng thực tế.

**Files:**
- Create: `src/components/Providers/WebVitalsReporter.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Tạo WebVitalsReporter component**

Tạo `src/components/Providers/WebVitalsReporter.tsx`:

```tsx
"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: Math.round(metric.value),
      rating: metric.rating, // "good" | "needs-improvement" | "poor"
      id: metric.id,
    });
  });

  return null;
}
```

- [ ] **Step 2: Thêm WebVitalsReporter vào root layout**

Mở `src/app/layout.tsx`, thêm import và component:

```tsx
// Thêm import sau các import hiện có
import { WebVitalsReporter } from "@/components/Providers/WebVitalsReporter";
```

Trong `<body>`, thêm `<WebVitalsReporter />` trước `<NavigationProgress />`:

```tsx
<body className={`${geistSans.variable} font-sans antialiased`}>
  <WebVitalsReporter />
  <Suspense fallback={null}>
    <NavigationProgress />
  </Suspense>
  <QueryProvider>
    <ToastProvider>
      <AuthInitializer />
      <ToastContainer />
      {children}
    </ToastProvider>
  </QueryProvider>
</body>
```

- [ ] **Step 3: Verify**

```bash
npm run dev
# Mở browser DevTools → Console
# Navigate giữa các trang
# Phải thấy logs dạng:
# [Web Vitals] LCP: { value: 1234, rating: "good", id: "..." }
# [Web Vitals] CLS: { value: 0, rating: "good", id: "..." }
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Providers/WebVitalsReporter.tsx src/app/layout.tsx
git commit -m "feat: add Web Vitals console logging for performance monitoring"
```

---

## Task 3a: RSC Streaming — Layout Level

**Mục tiêu:** Tách header và footer thành Suspense boundaries độc lập. Hiện tại children render 2 lần (skeleton + real), fix bằng cách đưa Suspense ra ngoài children.

**Files:**
- Modify: `src/app/(public)/layout.tsx`

- [ ] **Step 1: Cập nhật public layout với independent Suspense**

Thay toàn bộ nội dung `src/app/(public)/layout.tsx`:

```tsx
import { Suspense } from "react";
import { getSystemConfig } from "@/lib/api/public/general";
import { getPublicMenus } from "@/lib/api/public/menu";
import { PublicHeader, PublicFooter } from "@/components/Layouts/Public";
import FloatingContactChannels from "@/components/Layouts/Public/contact-channels/FloatingContactChannels";
import { BackToTop } from "@/components/UI/Navigation/BackToTop";
import ErrorBoundary from "@/components/UI/Feedback/ErrorBoundary";
import { ReadingPageGuard } from "@/components/Layouts/Public/ReadingPageGuard";

// Async Server Component — fetch header data
async function AsyncHeader() {
  const [systemConfig, menus] = await Promise.all([
    getSystemConfig("general"),
    getPublicMenus(),
  ]);
  return <PublicHeader systemConfig={systemConfig} initialMenus={menus} />;
}

// Async Server Component — fetch footer data (React.cache() deduplicates getSystemConfig)
async function AsyncFooter() {
  const systemConfig = await getSystemConfig("general");
  return <PublicFooter systemConfig={systemConfig} />;
}

// Async Server Component — fetch floating contact channels
async function AsyncFloatingChannels() {
  const systemConfig = await getSystemConfig("general");
  return (
    <FloatingContactChannels
      channels={systemConfig?.contact_channels ?? {}}
    />
  );
}

// Skeleton cho header khi đang load
function HeaderSkeleton() {
  return (
    <div className="h-20 bg-white border-b border-gray-100 animate-pulse fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-200 rounded" />
        <div className="hidden md:flex gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-16 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header — independent Suspense, không block children */}
      <Suspense fallback={<HeaderSkeleton />}>
        <AsyncHeader />
      </Suspense>

      {/* Main content — render ngay, không chờ header hay footer */}
      <main className="flex-1 min-h-screen pt-20">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      {/* Footer + floating channels — ẩn trên trang đọc truyện */}
      <ReadingPageGuard>
        <Suspense fallback={null}>
          <AsyncFooter />
        </Suspense>
        <Suspense fallback={null}>
          <AsyncFloatingChannels />
        </Suspense>
        <BackToTop />
      </ReadingPageGuard>
    </div>
  );
}
```

- [ ] **Step 2: Tạo ReadingPageGuard client component**

Tạo `src/components/Layouts/Public/ReadingPageGuard.tsx`:

```tsx
"use client";

import { usePathname } from "next/navigation";

interface ReadingPageGuardProps {
  children: React.ReactNode;
}

export function ReadingPageGuard({ children }: ReadingPageGuardProps) {
  const pathname = usePathname();
  if (pathname?.includes("/chapters/")) return null;
  return <>{children}</>;
}
```

- [ ] **Step 3: Verify layout vẫn hoạt động**

```bash
npm run dev
# Mở http://localhost:3000
# Kiểm tra:
# - Header hiện ra với skeleton trước, sau đó load real header
# - Content (children) render ngay lập tức, không chờ header
# - Footer hiện ra sau khi header load xong (cùng React.cache())
# - Trang /chapters/* không có footer và floating channels
```

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/layout.tsx src/components/Layouts/Public/ReadingPageGuard.tsx
git commit -m "perf: independent Suspense for header/footer streaming, eliminate double children render"
```

---

## Task 3b: RSC Streaming — Comic Detail Page

**Mục tiêu:** Trang comic detail hiện await tất cả data trước khi render. Chuyển chapters + comments sang async server components riêng để stream độc lập.

**Files:**
- Modify: `src/app/(public)/comics/[slug]/page.tsx`
- Modify: `src/components/Features/Comics/ComicList/Public/ComicDetail.tsx`

- [ ] **Step 1: Tạo async server components cho chapters và comments trong page.tsx**

Thay toàn bộ `src/app/(public)/comics/[slug]/page.tsx`:

```tsx
import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
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
      {/* "Đọc từ đầu" button — cần chapters data nên đặt ở đây */}
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
  const commentsData = await getComicComments(comicId, 1);
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

        {/* Chapters — stream độc lập */}
        <Suspense fallback={<ChapterSkeleton />}>
          <AsyncChapterList slug={slug} comicSlug={comic.slug} />
        </Suspense>

        {/* Comments — stream độc lập */}
        <Suspense fallback={<CommentSkeleton />}>
          <AsyncComments comicId={comic.id} />
        </Suspense>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Tạo ComicInfo server component (tách từ ComicDetail.tsx)**

Tạo `src/components/Features/Comics/ComicList/Public/ComicInfo.tsx` — copy toàn bộ phần breadcrumbs + cover + info từ `ComicDetail.tsx`, bỏ phần `chaptersData` và buttons "Đọc từ đầu" (đã chuyển sang `AsyncChapterList`):

```tsx
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
```

- [ ] **Step 3: Verify CommentSection props khớp**

`CommentSection` nhận prop `comments: ComicComment[]` (đã xác nhận từ source). `AsyncComments` truyền `comments={commentsData?.data || []}` — đúng rồi, không cần thay đổi gì.

- [ ] **Step 4: Xóa ComicDetail.tsx nếu không còn dùng**

Sau khi tách xong, kiểm tra xem còn nơi nào import `ComicDetail`:

```bash
grep -r "ComicDetail" src/ --include="*.tsx" --include="*.ts"
```

Nếu không còn import nào, xóa file `ComicDetail.tsx`.

- [ ] **Step 5: Verify build**

```bash
npm run build
# Phải build thành công, không có lỗi TypeScript
```

- [ ] **Step 6: Commit**

```bash
git add src/app/(public)/comics/[slug]/page.tsx \
        src/components/Features/Comics/ComicList/Public/ComicInfo.tsx
git commit -m "perf: stream comic detail page — chapters and comments load independently"
```

---

## Task 4a: Remove Unnecessary "use client"

**Mục tiêu:** Một số components có "use client" nhưng không dùng bất kỳ hooks hay event handlers — có thể là Server Components.

**Files:**
- Modify: `src/components/UI/Navigation/Breadcrumbs.tsx`
- Modify: `src/components/UI/DataDisplay/StatusBadge.tsx`

- [ ] **Step 1: Remove "use client" từ Breadcrumbs**

`Breadcrumbs.tsx` chỉ dùng `Link` (hoạt động trong Server Component) và `ChevronRight`, `Home` từ lucide-react. Không có hooks hay events.

Sửa `src/components/UI/Navigation/Breadcrumbs.tsx` — xóa dòng 1:

```
"use client";
```

File sau khi sửa bắt đầu bằng:
```tsx
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
// ... phần còn lại giữ nguyên
```

- [ ] **Step 2: Remove "use client" từ StatusBadge**

`StatusBadge.tsx` là pure display component, không có hooks hay events.

Sửa `src/components/UI/DataDisplay/StatusBadge.tsx` — xóa dòng 1:

```
"use client";
```

- [ ] **Step 3: Verify build không có lỗi**

```bash
npm run build
# Nếu có lỗi dạng "... is not valid in a Server Component",
# kiểm tra xem component đó có được dùng trong Server Component không
# và liệu nó có cần hooks không
```

- [ ] **Step 4: Commit**

```bash
git add src/components/UI/Navigation/Breadcrumbs.tsx \
        src/components/UI/DataDisplay/StatusBadge.tsx
git commit -m "perf: convert Breadcrumbs and StatusBadge to Server Components"
```

---

## Task 4b: Leaf Client Islands — FaqsPage

**Mục tiêu:** `FaqsPage.tsx` bao gồm cả static content (h1, breadcrumbs, CTA) lẫn interactive filter. Tách để static content render ở server.

**Files:**
- Modify: `src/app/(public)/faqs/page.tsx`
- Modify: `src/components/Features/Introduction/Faqs/Public/FaqsPage.tsx`

- [ ] **Step 1: Cập nhật page.tsx — thêm static header và CTA, thu nhỏ client component**

Thay toàn bộ `src/app/(public)/faqs/page.tsx`:

```tsx
import { Metadata } from "next";
import FaqsPage from "@/components/Features/Introduction/Faqs/Public/FaqsPage";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";
import { serverFetch } from "@/lib/api/server-client";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description: "Tìm câu trả lời cho các câu hỏi phổ biến về dịch vụ của chúng tôi.",
};

export const revalidate = 3600;

export default async function FAQsPage() {
  const { data: faqs } = await serverFetch("/api/faqs", { revalidate: 3600 });

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
      <div className="container mx-auto px-4 mt-8">
        {/* Static — render ở server */}
        <Breadcrumbs items={[{ label: "Câu hỏi thường gặp" }]} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">
          Câu hỏi thường gặp
        </h1>

        {/* Interactive — client island */}
        <FaqsPage initialFaqs={faqs || []} />

        {/* Static CTA — render ở server */}
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy câu trả lời bạn cần?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nếu bạn có câu hỏi khác chưa được trả lời, đừng ngần ngại liên hệ với chúng tôi.
          </p>
          <Link
            href="/contacts"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Thu gọn FaqsPage.tsx — chỉ giữ phần interactive**

Thay toàn bộ `src/components/Features/Introduction/Faqs/Public/FaqsPage.tsx`:

```tsx
"use client";

import { useFaqFilter, FAQ } from "@/hooks/ui-ux/public/useFaqFilter";

interface FaqsPageProps {
  initialFaqs: FAQ[];
}

export default function FaqsPage({ initialFaqs }: FaqsPageProps) {
  const { filteredFAQs, categories, filters, setFilters, expandedItems, toggleExpanded } =
    useFaqFilter(initialFaqs);

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              Danh mục
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm cursor-pointer"
            >
              <option key="all" value="all">Tất cả</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* FAQs List */}
      {filteredFAQs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <p className="text-xl font-medium text-gray-900">Không tìm thấy câu hỏi nào.</p>
          <p className="text-gray-500 mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-12">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleExpanded(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none transition-colors"
              >
                <h3 className="text-base font-semibold text-gray-900 pr-4">{faq.question}</h3>
                <svg
                  className={`h-5 w-5 text-gray-400 flex-shrink-0 transform transition-transform duration-200 ${
                    expandedItems.has(faq.id) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedItems.has(faq.id) && (
                <div className="px-6 pb-5">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run build
# Mở http://localhost:3000/faqs
# Header h1 + breadcrumbs render ngay (server)
# Filter và FAQ list render sau (client)
```

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/faqs/page.tsx \
        src/components/Features/Introduction/Faqs/Public/FaqsPage.tsx
git commit -m "perf: extract static layout from FaqsPage to Server Component"
```

---

## Task 4c: Leaf Client Islands — GalleryGrid

**Mục tiêu:** `GalleryGrid.tsx` bao gồm cả static layout (h1, breadcrumbs, HeroBanner, CTA) lẫn interactive filter+grid. Tách phần static sang page.tsx (server), giữ interactive trong client component mới `GalleryInteractive.tsx`.

**Files:**
- Modify: `src/app/(public)/gallery/page.tsx`
- Create: `src/components/Features/Introduction/Gallery/Public/GalleryInteractive.tsx`
- Modify: `src/components/Features/Introduction/Gallery/Public/GalleryGrid.tsx` (xóa static parts)

- [ ] **Step 1: Tạo GalleryInteractive.tsx — chỉ phần filter + grid**

Tạo `src/components/Features/Introduction/Gallery/Public/GalleryInteractive.tsx`:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/UI/Navigation/Button";
import { useGalleryFilter, GalleryItem } from "@/hooks/ui-ux/public/useGalleryFilter";

interface GalleryInteractiveProps {
  initialItems: GalleryItem[];
}

export default function GalleryInteractive({ initialItems }: GalleryInteractiveProps) {
  const { filteredItems, search, setSearch, viewMode, setViewMode } =
    useGalleryFilter(initialItems);

  return (
    <>
      {/* Filters and View Mode */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Tìm kiếm dự án..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Xem:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden p-1 gap-1 bg-gray-50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <p className="text-xl font-medium text-gray-900">Không tìm thấy dự án nào.</p>
          <p className="text-gray-500 mt-2">Thử thay đổi từ khóa tìm kiếm.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item) => (
            <div
              key={item.id || Math.random()}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-300"
            >
              <div className="h-56 bg-gray-100 relative overflow-hidden">
                {item.cover_image ? (
                  <Image
                    src={item.cover_image}
                    alt={item.title || "Project Image"}
                    width={500}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <span className="text-4xl">🖼️</span>
                  </div>
                )}
                {item.featured && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-white px-2.5 py-1 text-xs rounded-lg font-bold">
                    Nổi bật
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {item.category || "Dự án"}
                  </span>
                  <Link href={`/gallery/${item.slug || item.id}`} className="inline-block">
                    <Button size="sm">Xem chi tiết</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-12">
          {filteredItems.map((item) => (
            <div
              key={item.id || Math.random()}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex group hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-44 h-40 bg-gray-100 flex-shrink-0 relative overflow-hidden">
                {item.cover_image ? (
                  <Image
                    src={item.cover_image}
                    alt={item.title || "Project Image"}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <span className="text-4xl">🖼️</span>
                  </div>
                )}
                {item.featured && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs rounded font-bold">
                    Nổi bật
                  </div>
                )}
              </div>
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <span className="text-xs text-gray-400 ml-4 flex-shrink-0">{item.date}</span>
                </div>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {item.category || "Dự án"}
                  </span>
                  <Link href={`/gallery/${item.slug || item.id}`} className="inline-block">
                    <Button size="sm">Xem chi tiết</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Cập nhật gallery/page.tsx — thêm static layout**

Thay toàn bộ `src/app/(public)/gallery/page.tsx`:

```tsx
import { Metadata } from "next";
import { serverFetch } from "@/lib/api/server-client";
import HeroBanner from "@/components/Features/Marketing/Banners/Public/HeroBanner";
import { Breadcrumbs } from "@/components/UI/Navigation/Breadcrumbs";
import GalleryInteractive from "@/components/Features/Introduction/Gallery/Public/GalleryInteractive";
import { Button } from "@/components/UI/Navigation/Button";

export const metadata: Metadata = {
  title: "Thư viện dự án",
  description: "Khám phá các thiết kế và giải pháp xây dựng tiêu biểu của chúng tôi.",
};

export const revalidate = 3600;

export default async function GalleryPage() {
  const { data: galleryItems } = await serverFetch("/api/gallery", { revalidate: 3600 });

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 transition-colors duration-300">
      {/* Static — server rendered */}
      <HeroBanner locationCode="gallery" imageOnly={true} />

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <Breadcrumbs items={[{ label: "Thư viện" }]} />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 border-l-8 border-primary pl-6">
          Thư viện dự án
        </h1>

        {/* Interactive client island */}
        <GalleryInteractive initialItems={galleryItems || []} />

        {/* Static CTA — server rendered */}
        <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cần dự án tương tự?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Chúng tôi chuyên tạo các giải pháp tùy chỉnh theo nhu cầu cụ thể của bạn.
          </p>
          <Button size="lg">Bắt đầu dự án mới</Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Xóa GalleryGrid.tsx nếu không còn import nào**

```bash
grep -r "GalleryGrid" src/ --include="*.tsx" --include="*.ts"
```

Nếu không còn import nào ngoài file bị xóa, xóa `GalleryGrid.tsx`.

- [ ] **Step 4: Verify**

```bash
npm run build
# Mở http://localhost:3000/gallery
# h1, breadcrumbs, HeroBanner render ở server (trong page source)
# Filter + grid render ở client
```

- [ ] **Step 5: Commit**

```bash
git add src/app/(public)/gallery/page.tsx \
        src/components/Features/Introduction/Gallery/Public/GalleryInteractive.tsx
git commit -m "perf: extract static layout from GalleryGrid to Server Component"
```

---

## Tóm tắt kết quả mong đợi

| Metric | Trước | Sau |
|--------|-------|-----|
| System config cache | In-memory Map, mất khi restart | Redis, persistent |
| "use client" components | 238 | ~233 (Breadcrumbs, StatusBadge + container wrappers) |
| Comic detail TTFB | Chờ chapters + comments | Render ngay, stream sau |
| Public layout | Children render 2 lần (skeleton + real) | Children render 1 lần |
| Web Vitals | Không có visibility | Logged ra console |
| Header/Footer Suspense | Cùng 1 boundary | Độc lập, fail-safe |
