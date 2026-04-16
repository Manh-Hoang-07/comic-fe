# Đánh giá Hiệu năng & UI/UX - Comic FE

> **Ngày đánh giá:** 2026-04-16
> **Stack:** Next.js 15.1.3 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + React Query 5 + Zustand

---

## Mục lục

1. [Tổng quan](#1-tổng-quan)
2. [VẤN ĐỀ NGHIÊM TRỌNG: Double Loading (2 lớp loading chồng nhau)](#2-vấn-đề-nghiêm-trọng-double-loading)
3. [Vấn đề hiệu năng render](#3-vấn-đề-hiệu-năng-render)
4. [Vấn đề Bundle Size](#4-vấn-đề-bundle-size)
5. [Vấn đề Data Fetching](#5-vấn-đề-data-fetching)
6. [Vấn đề CSS/Animation](#6-vấn-đề-cssanimation)
7. [Vấn đề Image Optimization](#7-vấn-đề-image-optimization)
8. [Điểm tốt đã làm được](#8-điểm-tốt-đã-làm-được)
9. [Bảng tổng hợp & Ưu tiên sửa](#9-bảng-tổng-hợp--ưu-tiên-sửa)
10. [Hướng khắc phục gợi ý](#10-hướng-khắc-phục-gợi-ý)

---

## 1. Tổng quan

Hệ thống hiện tại có kiến trúc tốt, sử dụng các công nghệ hiện đại. Tuy nhiên, có **nhiều lớp loading UI chồng chéo** gây ra trải nghiệm "load xong cái 1 rồi load tiếp cái 2" mà bạn mô tả. Ngoài ra còn có các vấn đề về bundle size, thiếu memoization, và data fetching chưa tối ưu.

**Mức độ nghiêm trọng tổng thể: 🔴 Cần xử lý sớm**

---

## 2. VẤN ĐỀ NGHIÊM TRỌNG: Double Loading

### Đây chính là nguyên nhân "load 2 lần" mà bạn gặp phải.

### 2.1. Có tới 4 lớp loading UI hoạt động đồng thời

Khi người dùng click vào 1 link, hệ thống hiện tại có thể hiển thị **tới 4 loading indicator cùng lúc hoặc nối tiếp nhau**:

| Lớp | Component | Z-index | Khi nào hiện | File |
|-----|-----------|---------|--------------|------|
| 1 | `NavigationProgress` | 9999 | Click link nội bộ → hiện progress bar đỏ | `src/components/UI/Navigation/NavigationProgress.tsx` |
| 2 | `GlobalLoadingOverlay` | 99 | Click link nội bộ → hiện overlay trắng + spinner "Đang chuyển trang..." | `src/components/UI/Loading/GlobalLoadingOverlay.tsx` |
| 3 | `loading.tsx` (route) | -- | Next.js tự động hiện Suspense fallback khi route đang load | `src/app/loading.tsx`, `src/app/(public)/loading.tsx`, `src/app/(admin)/admin/loading.tsx` |
| 4 | Component loading state | -- | `useUrlListSync` / `useListPage` set `loading: true` khi fetch data | Trong từng page component |

### 2.2. Luồng loading thực tế khi chuyển trang (Public)

```
Bước 1: User click link
    → NavigationProgress hiện (progress bar đỏ ở top)
    → GlobalLoadingOverlay hiện (overlay trắng mờ + spinner "Đang chuyển trang...")

Bước 2: Route bắt đầu load
    → Next.js hiện loading.tsx (LoadingSpinner "Đang tải..." hoặc Skeleton)
    → GlobalLoadingOverlay VẪN CÒN HIỆN (chờ pathname thay đổi)
    ⚠️ USER THẤY 2 SPINNER CHỒNG NHAU

Bước 3: Route đã load xong, component mount
    → GlobalLoadingOverlay ẩn (pathname đã đổi)
    → NavigationProgress chạy tới 100% rồi ẩn
    → NHƯNG component gọi useUrlListSync → loading: true → hiện skeleton/spinner LẦN NỮA
    ⚠️ USER THẤY LOAD LẦN 2

Bước 4: API trả về data
    → loading: false → hiện nội dung thực
```

**Kết quả: User thấy ít nhất 2-3 lần loading nối tiếp nhau.**

### 2.3. Trùng lặp logic click detection

Cả `NavigationProgress` và `GlobalLoadingOverlay` đều:
- Listen `document.addEventListener('click')`
- Check `link.origin === currentOrigin && link.pathname !== pathname`
- Cùng watch `pathname` và `searchParams` để reset

→ **2 component làm cùng 1 việc, tạo 2 loading indicator.**

### 2.4. Nested loading.tsx files

```
src/app/loading.tsx                          ← Root level (LoadingSpinner fullscreen)
src/app/(public)/loading.tsx                 ← Public group (Skeleton grid)
src/app/(public)/comics/loading.tsx          ← Comics page (nếu có)
src/app/(public)/comics/[slug]/loading.tsx   ← Comic detail (nếu có)
src/app/(admin)/admin/loading.tsx            ← Admin group (Skeleton table)
```

Khi navigate từ `/` sang `/comics`, Next.js có thể hiện:
1. Root `loading.tsx` (LoadingSpinner) trước
2. Rồi `(public)/loading.tsx` (Skeleton) sau

→ **2 skeleton/spinner nối tiếp nhau.**

### 2.5. ContentWrapper thêm 1 lớp loading nữa

`ContentWrapper` (`src/components/UI/Loading/ContentWrapper.tsx`) cũng listen click events và hiện spinner riêng khi pagination/filter thay đổi. Kết hợp với `NavigationProgress` + `GlobalLoadingOverlay`, user có thể thấy **3 loading cùng lúc** khi thay đổi trang.

---

## 3. Vấn đề hiệu năng render

### 3.1. Thiếu React.memo trên các component list item

Các component được render nhiều lần trong danh sách nhưng không được memo:

| Component | File | Vấn đề |
|-----------|------|--------|
| `ComicSection` | `src/components/Features/Comics/ComicList/Public/ComicSection.tsx` | Không memo, re-render mỗi khi parent update |
| `TextFilter` | `src/components/UI/Filters/TextFilter.tsx` | Không memo |
| `UserCard` | `src/components/UI/DataDisplay/UserCard.tsx` | Không memo |
| Các filter components | `src/components/UI/Filters/` | Không memo |

**Ảnh hưởng:** Mỗi khi state thay đổi (ví dụ: loading), tất cả list items đều re-render không cần thiết.

> **Ngoại lệ tốt:** `ComicCard` đã dùng `React.memo` đúng cách.

### 3.2. `useUrlListSync` tạo dependency chain gây re-render

```typescript
// src/hooks/crud/useUrlListSync.ts
const getUrlParams = useCallback(() => {...}, [searchParams]);        // ← deps: searchParams
const fetchFromUrl = useCallback(async () => {...}, [endpoint, getUrlParams, transformItem]); // ← deps: getUrlParams
useEffect(() => { fetchFromUrl(); }, [fetchFromUrl]);                  // ← deps: fetchFromUrl
```

Mỗi khi `searchParams` thay đổi:
1. `getUrlParams` tạo reference mới
2. `fetchFromUrl` tạo reference mới
3. `useEffect` chạy lại → fetch API
4. `setLoading(true)` → re-render toàn bộ component tree

**Vấn đề:** `getUrlParams` được gọi 2 lần trong `fetchFromUrl` (dòng 54 và dòng 86), tạo 2 lần parse searchParams không cần thiết.

### 3.3. `mounted` state pattern không cần thiết

```typescript
// src/components/Features/Comics/ComicList/Public/TrendingHero.tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
if (!mounted) return <skeleton/>;
```

Pattern này buộc component render 2 lần: 1 lần skeleton + 1 lần nội dung thật. Có thể thay bằng CSS hoặc Suspense.

### 3.4. Styled JSX Global trong component

```tsx
// src/components/Features/Comics/ComicList/Public/TrendingHeroSwiper.tsx
<style jsx global>{`...`}</style>
```

Global styles được inject/re-inject mỗi khi component re-render → ảnh hưởng performance.

---

## 4. Vấn đề Bundle Size

### 4.1. Các dependency nặng không được lazy-load

| Package | Kích thước ước tính | Dùng ở đâu | Vấn đề |
|---------|---------------------|-------------|--------|
| `@tinymce/tinymce-react` | ~2MB+ | Form editor (admin) | Không code-split, load cùng admin bundle |
| `chart.js` + `react-chartjs-2` | ~200KB+ | 2 trang statistics | Không lazy-load, có thể ảnh hưởng các trang admin khác |
| `swiper` | ~150KB+ | Hero carousel (1 component) | CSS import trong component |

### 4.2. Swiper CSS import trong component

```typescript
// src/components/Features/Comics/ComicList/Public/TrendingHeroSwiper.tsx
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
```

CSS được import trực tiếp trong component → có thể bị duplicate trong bundle nếu component được import ở nhiều nơi.

### 4.3. CSS utility classes bị duplicate với Tailwind

`src/components/Features/Posts/PostList/Admin/AdminPostStatistics.css` (462 dòng) định nghĩa lại nhiều utility class như `.flex`, `.items-center`, `.justify-center`, `.text-gray-500` mà Tailwind đã có sẵn → bundle CSS phình to không cần thiết.

---

## 5. Vấn đề Data Fetching

### 5.1. Public Layout blocking render

```typescript
// src/app/(public)/layout.tsx
const [systemConfig, menus] = await Promise.all([
  getSystemConfig("general"),
  getPublicMenus()
]);
```

Layout là **Server Component async** → nó **block toàn bộ children** cho đến khi cả 2 API trả về. Nếu 1 trong 2 API chậm, user sẽ thấy blank screen.

**Ảnh hưởng:** Đây là 1 trong những lý do render chậm. Layout phải fetch xong mới bắt đầu render page content.

### 5.2. `generateMetadata` cũng fetch API

```typescript
// src/app/layout.tsx
export async function generateMetadata(): Promise<Metadata> {
  const systemConfig = await getSystemConfig("general");
  // ...
}
```

`generateMetadata` trong root layout CŨNG gọi `getSystemConfig("general")`. Nếu không có request deduplication ở server level, đây là API call thừa (đã gọi trong public layout).

### 5.3. Thiếu Error Boundary cho server-side fetches

Nếu API trong `(public)/layout.tsx` fail, layout crash → toàn bộ public site không hiển thị được. Không có `error.tsx` để catch.

### 5.4. `useApiFetch` duplicate với React Query

Hook `useApiFetch` (`src/hooks/data/useApiFetch.ts`) là 1 custom fetch hook không có caching, trong khi `useApiQuery` dùng React Query đã có caching + deduplication. Hai pattern này tồn tại song song gây nhầm lẫn và dùng không nhất quán.

### 5.5. Client-side re-fetch sau Server-side fetch

Một số component (ví dụ: `PublicHeader`) nhận data từ server qua props (`initialMenus`) nhưng vẫn setup `useApiQuery` để fetch lại client-side:

```typescript
const { data: fetchedMenus } = useApiQuery(
  ["menus", "public"], publicEndpoints.menus.list,
  undefined, { enabled: initialMenus.length === 0 }
);
```

Nếu `initialMenus` rỗng (API fail ở server), sẽ fetch lại ở client → double fetch.

---

## 6. Vấn đề CSS/Animation

### 6.1. `backdrop-blur` trên loading overlay

```tsx
// GlobalLoadingOverlay.tsx
<div className="... backdrop-blur-[2px] ...">
```

`backdrop-blur` là CSS filter **rất tốn GPU**, đặc biệt trên mobile. Khi overlay hiện ở fullscreen, nó blur toàn bộ page content phía dưới → có thể gây lag/jank trên thiết bị yếu.

### 6.2. LoadingSpinner cũng dùng `backdrop-blur`

```tsx
// LoadingSpinner.tsx
<div className="... bg-white/80 backdrop-blur-sm ...">
```

Tương tự, spinner fullscreen cũng dùng backdrop-blur → kết hợp với GlobalLoadingOverlay = **2 lớp blur chồng nhau**.

### 6.3. `min-h-[100vh]` trên LoadingSpinner

```tsx
<div className="... min-h-[100vh]">
```

Force chiều cao 100vh ngay cả khi spinner ở variant `local` → có thể gây layout shift khi spinner xuất hiện/biến mất.

### 6.4. Inline styles trong loop (TrendingHeroSwiper)

```tsx
{[...Array(20)].map((_, i) => (
  <div style={{ animationDelay: `${i * 0.1}s` }}>
```

Inline styles trong map loop tạo unique style object mỗi render → không thể optimize bởi React.

---

## 7. Vấn đề Image Optimization

### 7.1. Quality quá thấp cho background images

```tsx
// TrendingHeroSwiper.tsx & TrendingHero.tsx
<Image quality={10} ... />
```

`quality={10}` tạo hình ảnh rất pixelated, ngay cả cho blur background. Nên dùng tối thiểu `quality={25-30}`.

### 7.2. Wildcard remote patterns

```typescript
// next.config.ts
{ protocol: "https", hostname: "**" },
{ protocol: "http", hostname: "**" },
```

Cho phép optimize image từ **bất kỳ domain nào** → rủi ro bảo mật (SSRF) và không kiểm soát được nguồn ảnh.

---

## 8. Điểm tốt đã làm được

| Mục | Chi tiết |
|-----|----------|
| React Query caching | staleTime 5 phút, gcTime 10 phút, request deduplication |
| Parallel data fetching | `Promise.all()` cho multiple API calls |
| `requestIdleCallback` cho auth | Không block hydration |
| Auth 30s cache | Tránh duplicate auth checks |
| Tree-shaking config | `usedExports: true`, `sideEffects: true` |
| `optimizePackageImports` | 11 packages được optimize |
| Static asset caching | 1 năm immutable cache |
| Security headers | X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| Middleware auth guard | Nhanh, không fetch nặng |
| `useTransition` cho pagination | Smooth transition khi chuyển trang |
| `ComicCard` dùng React.memo | Best practice |
| `sharp` cho image optimization | Server-side image processing |

---

## 9. Bảng tổng hợp & Ưu tiên sửa

| # | Mức độ | Vấn đề | Ảnh hưởng | Effort |
|---|--------|--------|-----------|--------|
| 1 | 🔴 Critical | 4 lớp loading UI chồng nhau | UX rất tệ, user thấy load 2-3 lần | Trung bình |
| 2 | 🔴 Critical | `NavigationProgress` + `GlobalLoadingOverlay` trùng logic | Code duplicate, 2 spinner cùng lúc | Thấp |
| 3 | 🟠 High | Public Layout blocking render | Trang trắng khi API chậm | Trung bình |
| 4 | 🟠 High | `generateMetadata` + layout fetch trùng API | Double API call | Thấp |
| 5 | 🟠 High | TinyMCE, Chart.js không lazy-load | Bundle size lớn, load chậm | Thấp |
| 6 | 🟡 Medium | Thiếu React.memo trên list components | Unnecessary re-renders | Thấp |
| 7 | 🟡 Medium | `backdrop-blur` trên 2 loading overlays | Lag trên mobile | Thấp |
| 8 | 🟡 Medium | CSS duplicate trong AdminPostStatistics.css | Bundle CSS phình | Thấp |
| 9 | 🟡 Medium | Wildcard image remote patterns | Rủi ro bảo mật | Thấp |
| 10 | 🟢 Low | `mounted` state pattern | Extra render cycle | Thấp |
| 11 | 🟢 Low | Inline styles trong loop | Minor perf impact | Thấp |
| 12 | 🟢 Low | Background image quality=10 | Hình ảnh pixelated | Thấp |

---

## 10. Hướng khắc phục gợi ý

### 10.1. Sửa Double Loading (Ưu tiên #1)

**Chiến lược:** Chỉ giữ 1 loading indicator duy nhất cho mỗi tình huống.

```
Chuyển trang (navigation):  CHỈ dùng NavigationProgress (progress bar)
Route loading:              CHỈ dùng loading.tsx skeleton (bỏ LoadingSpinner fullscreen)
Data fetching trong page:   CHỈ dùng skeleton/placeholder inline
Pagination/filter:          CHỈ dùng ContentWrapper dim effect
```

**Cần làm:**
- **Loại bỏ `GlobalLoadingOverlay`** - NavigationProgress đã đủ để thông báo navigation
- **Sửa root `loading.tsx`** - đổi từ `LoadingSpinner` (fullscreen spinner) sang skeleton phù hợp, hoặc bỏ hẳn nếu route groups đã có loading.tsx riêng
- **Bỏ `min-h-[100vh]` trên LoadingSpinner** khi dùng variant `local`

### 10.2. Sửa Public Layout blocking

```tsx
// Thay vì await trong layout:
export default async function PublicLayout({ children }) {
  // Wrap data-dependent parts trong Suspense
  return (
    <PublicLayoutWrapper>
      <Suspense fallback={<HeaderSkeleton />}>
        <AsyncHeader />  {/* Server component fetch data */}
      </Suspense>
      {children}  {/* Render ngay, không chờ header data */}
      <Suspense fallback={<FooterSkeleton />}>
        <AsyncFooter />
      </Suspense>
    </PublicLayoutWrapper>
  );
}
```

### 10.3. Lazy-load heavy packages

```tsx
// Chart.js
const StatsChart = dynamic(() => import('./StatsChart'), {
  loading: () => <SkeletonLoader type="card" />,
  ssr: false
});

// TinyMCE
const RichEditor = dynamic(() => import('./RichEditor'), {
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded" />,
  ssr: false
});
```

### 10.4. Thêm React.memo cho list components

```tsx
export const ComicSection = React.memo(function ComicSection({ ... }) {
  // ...
});
```

### 10.5. Loại bỏ backdrop-blur trên loading

```tsx
// Thay: bg-white/60 backdrop-blur-[2px]
// Bằng: bg-white/80 (đủ che content, không cần blur)
```

---

## Kết luận

Vấn đề chính bạn gặp phải (**"load 2 lần"**) là do hệ thống có **quá nhiều lớp loading UI chồng chéo**: `NavigationProgress` + `GlobalLoadingOverlay` + route `loading.tsx` + component loading state. Chúng hoạt động độc lập, không phối hợp với nhau, dẫn đến UX "load xong cái 1 rồi load tiếp cái 2".

**Ưu tiên sửa:** Loại bỏ `GlobalLoadingOverlay`, thống nhất loading strategy, và chuyển public layout sang streaming với Suspense.
