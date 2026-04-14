# KE HOACH NANG CAP HIEU NANG - Comic FE

> Ngay tao: 2026-04-15
> Framework: Next.js 15 + React 19 (App Router)
> Trang thai hien tai: Hoat dong nhung hieu nang chua toi uu, thieu hieu ung chuyen trang

---

## TONG QUAN VAN DE

### Trieu chung
- Chuyen trang mat ~2s, khong co hieu ung loading/transition
- Click menu hoac link khong co phan hoi truc quan
- Trang tai cham, nguoi dung khong biet dang tai hay bi loi

### Nguyen nhan goc (da phan tich)

| # | Van de | Muc do | Anh huong |
|---|--------|--------|-----------|
| 1 | `NavigationProgress` da viet nhung **KHONG DUOC SU DUNG** trong layout | NGHIEM TRONG | Khong co thanh progress bar khi chuyen trang |
| 2 | `GlobalLoadingOverlay` hien thi fullscreen spinner gia tao (bat su kien click) | NGHIEM TRONG | UX te - che toan bo man hinh bang overlay trang |
| 3 | Chi co **2 file loading.tsx** cho toan bo ~75+ trang | NGHIEM TRONG | Hau het trang khong co loading state |
| 4 | `@tanstack/react-query` da cai nhung **KHONG SU DUNG** | CAO | Khong cache API, moi lan mount component lai fetch |
| 5 | Chi co **1 component** dung `next/dynamic` (code splitting) | CAO | Bundle JS qua lon, tai cham |
| 6 | CKEditor5 + TinyMCE cung ton tai trong dependencies | CAO | Thua ~1-2MB bundle |
| 7 | **0 component** dung `React.memo` | TRUNG BINH | Re-render khong can thiet |
| 8 | 7 component dung pattern `isMounted` (anti-pattern) | TRUNG BINH | Double render, hydration mismatch |
| 9 | 250+ component dung `"use client"` | TRUNG BINH | Nhieu component co the la Server Component |

---

## KE HOACH THUC HIEN CHI TIET

### GIAI DOAN 1: HIEU UNG CHUYEN TRANG (Uu tien cao nhat)
> Muc tieu: Nguoi dung luon thay phan hoi khi click - khong con cam giac "treo"
> Thoi gian uoc tinh: 1-2 ngay

#### 1.1. Kich hoat NavigationProgress (Top Loading Bar)

**Van de**: File `src/components/UI/Navigation/NavigationProgress.tsx` da viet san nhung KHONG DUOC IMPORT vao bat ky layout nao.

**Giai phap**: Import `NavigationProgress` vao root layout (`src/app/layout.tsx`)

```tsx
// src/app/layout.tsx - Them NavigationProgress
import { NavigationProgress } from "@/components/UI/Navigation/NavigationProgress";

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <NavigationProgress />           {/* <-- THEM DONG NAY */}
        <Suspense fallback={null}>
          <GlobalLoadingOverlay />
        </Suspense>
        ...
      </body>
    </html>
  );
}
```

**Ket qua**: Moi lan chuyen trang se co thanh do chay o tren cung (giong YouTube, GitHub).

#### 1.2. Cai thien GlobalLoadingOverlay

**Van de hien tai**: `GlobalLoadingOverlay` che toan bo man hinh bang overlay trang + spinner fullscreen. Rat te cho UX.

**Giai phap**: Chuyen tu fullscreen overlay sang hieu ung nhe hon:
- Xoa hoac thay the `GlobalLoadingOverlay` vi da co `NavigationProgress` lam nhiem vu tuong tu
- Hoac doi tu fullscreen spinner sang skeleton nhe / fade effect

**Phuong an de xuat**:
- **Phuong an A (Khuyen nghi)**: Xoa `GlobalLoadingOverlay`, chi giu `NavigationProgress` + cac `loading.tsx` rieng cho tung trang
- **Phuong an B**: Giu lai nhung doi thanh hieu ung subtle (vd: chi lam mo nhe content hien tai, khong che toan bo)

#### 1.3. Them loading.tsx cho cac route chinh

**Van de**: Chi co 2 file `loading.tsx`:
- `src/app/loading.tsx` (root - fullscreen spinner)
- `src/app/(public)/comics/[slug]/loading.tsx` (skeleton cho trang chi tiet truyen)

**Can them loading.tsx cho**:

| Route | Kieu loading UI |
|-------|----------------|
| `src/app/(public)/loading.tsx` | Skeleton layout (header + content placeholder) |
| `src/app/(admin)/admin/loading.tsx` | Skeleton voi sidebar + content area |
| `src/app/(public)/posts/loading.tsx` | Grid skeleton cards |
| `src/app/(public)/posts/[slug]/loading.tsx` | Article skeleton |
| `src/app/(public)/comics/loading.tsx` | Grid skeleton comic cards |
| `src/app/(user)/user/loading.tsx` | Profile skeleton |
| `src/app/(auth)/loading.tsx` | Form skeleton |

Moi `loading.tsx` nen dung skeleton UI (animate-pulse) thay vi fullscreen spinner.

---

### GIAI DOAN 2: TOI UU BUNDLE SIZE
> Muc tieu: Giam kich thuoc JS tai ve, tang toc do tai trang
> Thoi gian uoc tinh: 2-3 ngay

#### 2.1. Xoa CKEditor5 khoi dependencies

**Van de**: Project dang cai **CA HAI** CKEditor5 va TinyMCE nhung chi dung TinyMCE.

**Giai phap**:
```bash
npm uninstall ckeditor5 @ckeditor/ckeditor5-react
```

Dong thoi xoa khoi `next.config.ts`:
```diff
- transpilePackages: ["ckeditor5", "@ckeditor/ckeditor5-react"],
+ transpilePackages: [],
```

Va xoa khoi `optimizePackageImports` neu co.

**Ket qua**: Giam ~1-2MB bundle size.

#### 2.2. Dynamic import cho cac component nang

**Van de**: Chi co 1 component dung `next/dynamic`. Cac component lon (400-500 dong) deu duoc import truc tiep.

**Can dynamic import**:

```tsx
// Thay vi:
import PostForm from "@/components/Features/Posts/PostList/Admin/PostForm";

// Doi thanh:
const PostForm = dynamic(
  () => import("@/components/Features/Posts/PostList/Admin/PostForm"),
  { loading: () => <SkeletonLoader type="form" />, ssr: false }
);
```

**Danh sach component can dynamic import** (uu tien file lon, chi dung trong admin):

| Component | Dong code | Ly do |
|-----------|-----------|-------|
| `PostForm.tsx` | 520 | Form phuc tap, chi dung khi tao/sua bai viet |
| `AdminPostStatistics.tsx` | 472 | Import chart.js (~75KB), chi dung trang thong ke |
| `ProjectForm.tsx` | 464 | Form phuc tap, it dung |
| `ComicForm.tsx` | Lon | Form truyen phuc tap |
| `CKEditor.tsx` (TinyMCE) | - | Editor rat nang, chi can khi chinh sua noi dung |
| `SystemConfigForm.tsx` | - | Cau hinh he thong, rat it dung |
| `UserProfileClient.tsx` | 484 | Trang profile nguoi dung |
| Toan bo component Chart.js | - | chart.js + react-chartjs-2 chi can trang thong ke |

#### 2.3. Kiem tra va loai bo unused dependencies

Chay audit:
```bash
npx depcheck
```

Danh sach nghi ngo khong dung:
- `@tanstack/react-query` - da cai nhung khong import o dau (se dung lai o Giai doan 3)
- `agentkeepalive` - kiem tra co thuc su dung khong
- `ts-morph` (devDependency) - kiem tra

---

### GIAI DOAN 3: TOI UU DATA FETCHING
> Muc tieu: Cache API response, giam so luong request, cai thien UX
> Thoi gian uoc tinh: 3-5 ngay

#### 3.1. Tich hop React Query (da cai san)

**Van de hien tai**:
- `useApiFetch` hook tu viet, KHONG co cache, KHONG co deduplication
- Moi component mount la fetch lai tu dau
- Khong co background refetch, stale-while-revalidate

**Giai phap**: Thay the `useApiFetch` bang React Query

**Buoc 1**: Tao QueryClientProvider

```tsx
// src/components/Providers/QueryProvider.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,       // 30s - du lieu "tuoi" trong 30s
        gcTime: 5 * 60 * 1000,      // 5 phut - giu cache 5 phut
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Buoc 2**: Wrap vao root layout

```tsx
// src/app/layout.tsx
<QueryProvider>
  <ToastProvider>
    ...
  </ToastProvider>
</QueryProvider>
```

**Buoc 3**: Tao hook thay the useApiFetch

```tsx
// src/hooks/data/useApiQuery.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export function useApiQuery<T>(key: string[], url: string, params?: Record<string, any>) {
  return useQuery<T>({
    queryKey: [...key, params],
    queryFn: async () => {
      const res = await apiClient.get<T>(url, { params });
      return res.data;
    },
  });
}
```

**Buoc 4**: Dan dan thay the useApiFetch trong cac component (KHONG can lam het 1 luc)

**Loi ich**:
- Tu dong cache response -> chuyen trang nhanh hon (du lieu da co san)
- Deduplication -> nhieu component goi cung API chi fetch 1 lan
- Background refetch -> du lieu luon cap nhat
- Loading/error state tu dong

#### 3.2. Prefetch du lieu cho navigation

Dung React Query prefetch khi hover vao link:

```tsx
// Khi hover vao link truyen, prefetch du lieu trang chi tiet
onMouseEnter={() => {
  queryClient.prefetchQuery({
    queryKey: ['comic', slug],
    queryFn: () => fetchComicDetail(slug),
  });
}}
```

Ket hop voi Next.js Link prefetch (da co san).

---

### GIAI DOAN 4: TOI UU RENDER PERFORMANCE
> Muc tieu: Giam re-render khong can thiet, tang FPS
> Thoi gian uoc tinh: 2-3 ngay

#### 4.1. Them React.memo cho cac list item component

**Van de**: 0 component dung React.memo. Cac component trong list (ComicCard, PostCard, UserCard...) re-render moi khi parent thay doi state.

**Component can memo**:

```tsx
// src/components/Features/Comics/Shared/ComicCard.tsx
const ComicCard = memo(function ComicCard({ comic, priority }: Props) {
  // ... existing code
});
export default ComicCard;
```

Danh sach:
- `ComicCard.tsx` - Render trong grid nhieu item
- `PostCard` - Tuong tu
- `UserCard.tsx` - Trong danh sach user
- `DataTable.tsx` - Component table dung chung
- Cac row component trong table

#### 4.2. Xoa pattern isMounted (anti-pattern)

**Van de**: 7 component dung pattern:
```tsx
const [isMounted, setIsMounted] = useState(false);
useEffect(() => { setIsMounted(true); }, []);
if (!isMounted) return <Loading />;
```

Pattern nay gay double render va hydration mismatch.

**Giai phap**:
- Voi component can client-only: dung `next/dynamic` voi `ssr: false`
- Voi component can check window: dung `typeof window !== 'undefined'` chi cho phan can thiet

**File can sua**:
1. `src/components/Features/Comics/ComicList/Public/TrendingHero.tsx`
2. `src/components/Layouts/Admin/header/UserDropdown.tsx`
3. `src/components/Features/Comics/Shared/ComicCard.tsx`
4. `src/components/Features/Comics/Homepage/Public/HomePageContent.tsx`
5. `src/components/UI/Forms/CKEditor.tsx`
6. `src/components/Layouts/Admin/sidebar/SidebarMenu.tsx`
7. `src/app/(admin)/dashboard/layout.tsx`

#### 4.3. Chuyen bot component sang Server Component

**Van de**: 250 component dung `"use client"`. Nhieu component khong can client-side JS.

**Tieu chi chuyen sang Server Component**:
- Khong dung useState, useEffect, useRef
- Khong dung event handler (onClick, onChange...)
- Chi hien thi du lieu tinh

**Uu tien kiem tra**:
- Cac layout component
- Cac component chi render HTML/text
- Cac wrapper component

---

### GIAI DOAN 5: TOI UU HINH ANH VA ASSETS
> Muc tieu: Giam thoi gian tai hinh anh, tiet kiem bandwidth
> Thoi gian uoc tinh: 1-2 ngay

#### 5.1. Them loading="lazy" cho hinh anh duoi fold

**Van de**: Nhieu hinh anh trong grid khong co lazy loading.

**Giai phap**: Trong cac list component, chi dat `priority` cho 4-8 hinh dau tien:

```tsx
{comics.map((comic, index) => (
  <ComicCard
    key={comic.id}
    comic={comic}
    priority={index < 4}  // Chi 4 hinh dau priority
  />
))}
```

#### 5.2. Sua priority trong TrendingHero

**Van de**: `TrendingHero.tsx` dat `priority={true}` cho TAT CA slide trong carousel.

**Giai phap**: Chi dat priority cho slide dau tien:
```tsx
priority={index === 0}  // Chi slide dau tien
```

#### 5.3. Thay placeholder tu external URL

**Van de**: Dang dung `https://placehold.co/300x450?text=No+Cover` - tai tu ben ngoai.

**Giai phap**: Tao placeholder image cuc bo tai `/public/images/no-cover.webp` hoac dung CSS gradient.

---

### GIAI DOAN 6: CAI THIEN NEXT.JS CONFIG
> Muc tieu: Toi uu build output va caching
> Thoi gian uoc tinh: 0.5-1 ngay

#### 6.1. Bat Partial Prerendering (PPR) - Experimental

```ts
// next.config.ts
experimental: {
  ppr: true,  // Partial Prerendering
  optimizePackageImports: [...],
}
```

#### 6.2. Cau hinh Webpack bundle analyzer (de debug)

```bash
npm install --save-dev @next/bundle-analyzer
```

```ts
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);
```

Chay: `ANALYZE=true npm run build` de xem bundle size chi tiet.

#### 6.3. Them cac trang tinh vao generateStaticParams

Cac trang public it thay doi nen duoc pre-render:
- Trang gioi thieu, lien he, FAQ
- Cac trang comic pho bien

---

## THU TU UU TIEN THUC HIEN

```
GIAI DOAN 1 (1-2 ngay)  ->  Hieu ung chuyen trang (thay doi lon nhat ve cam nhan)
    |
GIAI DOAN 2 (2-3 ngay)  ->  Giam bundle size (trang tai nhanh hon)
    |
GIAI DOAN 3 (3-5 ngay)  ->  React Query (cache API, chuyen trang "tuc thi")
    |
GIAI DOAN 4 (2-3 ngay)  ->  Toi uu render (muot hon khi tuong tac)
    |
GIAI DOAN 5 (1-2 ngay)  ->  Hinh anh & assets
    |
GIAI DOAN 6 (0.5-1 ngay) -> Config & build
```

---

## DU KIEN KET QUA SAU NANG CAP

| Chi so | Hien tai | Muc tieu |
|--------|----------|----------|
| Thoi gian chuyen trang (cam nhan) | ~2s (khong feedback) | <0.5s (co progress bar + skeleton) |
| Initial JS bundle | Lon (chua do) | Giam 30-40% |
| First Contentful Paint | Cham | Cai thien 40-50% |
| So luong API request | Nhieu (khong cache) | Giam 50-60% (nho React Query cache) |
| Trai nghiem nguoi dung | Khong co feedback | Moi thao tac deu co phan hoi truc quan |

---

## GHI CHU

- Giai doan 1 la QUAN TRONG NHAT vi thay doi cam nhan nguoi dung ngay lap tuc
- Giai doan 3 (React Query) mang lai hieu qua lon nhat ve performance thuc te
- Nen chay `npm run build` va kiem tra sau moi giai doan
- Su dung Lighthouse trong Chrome DevTools de do luong truoc/sau
- Cac thay doi trong moi giai doan deu backward-compatible, co the lam tung buoc
