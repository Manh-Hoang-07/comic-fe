# Kế hoạch tối ưu hiệu năng - Comic FE

## Tổng quan

Dự án sử dụng **Next.js 15 + React 19 + TanStack Query + Zustand + Tailwind CSS 4**.
Sau khi phân tích toàn bộ codebase (~428 file), tôi xác định được **10 vấn đề chính** ảnh hưởng đến tốc độ render và trải nghiệm người dùng.

---

## Mục lục

1. [Swiper load toàn cục - ảnh hưởng mọi trang](#1-swiper-load-toàn-cục)
2. [CSS Swiper import toàn cục](#2-css-swiper-import-toàn-cục)
3. [Chart.js không dynamic import](#3-chartjs-không-dynamic-import)
4. [Double-fetching dữ liệu (FAQs, Gallery)](#4-double-fetching-dữ-liệu)
5. [Trang dùng "use client" không cần thiết](#5-trang-dùng-use-client-không-cần-thiết)
6. [React Query staleTime quá ngắn](#6-react-query-staletime-quá-ngắn)
7. [Loading state khi chuyển trang/phân trang chưa rõ ràng](#7-loading-state-khi-chuyển-trangphân-trang)
8. [optimizePackageImports thiếu thư viện](#8-optimizepackageimports-thiếu-thư-viện)
9. [Header/Footer đánh dấu "use client" không cần thiết](#9-headerfooter-đánh-dấu-use-client)
10. [Pagination loading state không đồng bộ với server render](#10-pagination-loading-state-không-đồng-bộ)

---

## 1. Swiper load toàn cục

**Mức độ: NGHIÊM TRỌNG**

### Vấn đề

Component `TrendingHero.tsx` import trực tiếp Swiper (~50KB gzipped) và được sử dụng ở trang chủ. Swiper được load ngay lập tức khi trang render, dù carousel chưa cần hiển thị ngay.

```
src/components/Features/Comics/ComicList/Public/TrendingHero.tsx
  → import { Swiper, SwiperSlide } from 'swiper/react'
  → import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
```

### Ảnh hưởng

- Tăng bundle size của trang chủ ~50KB
- Người dùng phải download + parse Swiper JS trước khi trang interactive
- Ảnh hưởng trực tiếp đến thời gian First Contentful Paint (FCP)

### Hướng giải quyết

Sử dụng `next/dynamic` để lazy load `TrendingHero`:

```tsx
// Trong trang chủ hoặc component cha
const TrendingHero = dynamic(
  () => import('@/components/Features/Comics/ComicList/Public/TrendingHero'),
  {
    ssr: false,
    loading: () => <BannerSkeleton />
  }
);
```

---

## 2. CSS Swiper import toàn cục

**Mức độ: NGHIÊM TRỌNG**

### Vấn đề

File `src/styles/globals.css` import 4 file CSS của Swiper:

```css
@import "swiper/css";
@import "swiper/css/effect-fade";
@import "swiper/css/navigation";
@import "swiper/css/pagination";
```

Điều này nghĩa là CSS của Swiper được load trên **MỌI TRANG**, kể cả trang không dùng carousel.

### Ảnh hưởng

- Tăng kích thước CSS bundle toàn cục
- Tải CSS không cần thiết ở mọi trang (trang chi tiết truyện, trang admin, trang đăng nhập...)
- Ảnh hưởng đến thời gian render CSS

### Hướng giải quyết

Xóa import Swiper CSS khỏi `globals.css`, chuyển sang import trực tiếp trong component `TrendingHero.tsx`:

```tsx
// TrendingHero.tsx
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
```

Kết hợp với dynamic import ở mục 1, CSS chỉ load khi component được render.

---

## 3. Chart.js không dynamic import

**Mức độ: CAO**

### Vấn đề

Trang thống kê admin import trực tiếp Chart.js (~30KB gzipped):

```
src/app/(admin)/admin/comics/statistics/page.tsx
  → import { Bar } from 'react-chartjs-2'
  → import { Chart as ChartJS, ... } from 'chart.js'
```

### Ảnh hưởng

- Trang admin statistics load chậm hơn do phải parse Chart.js
- Nếu code splitting không hoạt động tốt, Chart.js có thể lọt vào bundle chung

### Hướng giải quyết

Dynamic import component chứa Chart:

```tsx
const StatisticsChart = dynamic(
  () => import('./StatisticsChart'),
  {
    ssr: false,
    loading: () => <SkeletonLoader type="card" />
  }
);
```

---

## 4. Double-fetching dữ liệu

**Mức độ: CAO**

### Vấn đề

Một số trang sử dụng Server Component nhưng lại wrap Client Component bên trong, và Client Component tự fetch data riêng thay vì nhận từ Server Component.

**FAQs:**
- `src/app/(public)/faqs/page.tsx` - Server Component (có thể fetch server-side)
- `src/app/(public)/faqs/FAQsClient.tsx` - Client Component, tự fetch bằng `useEffect`

**Gallery:**
- `src/app/(public)/gallery/page.tsx` - Server Component
- `src/app/(public)/gallery/GalleryClient.tsx` - Client Component, tự fetch bằng `useEffect`

### Ảnh hưởng

- Người dùng thấy trang trống → chờ client fetch → mới hiển thị data
- Tạo network waterfall: HTML load → JS load → API call → render
- Lãng phí khả năng SSR của Next.js

### Hướng giải quyết

Fetch data ở Server Component, truyền xuống Client Component qua props:

```tsx
// page.tsx (Server Component)
export default async function FAQsPage() {
  const faqs = await serverFetch('/api/faqs');
  return <FAQsClient initialData={faqs} />;
}

// FAQsClient.tsx (Client Component)
export default function FAQsClient({ initialData }) {
  const [faqs, setFaqs] = useState(initialData);
  // Không cần useEffect fetch nữa
}
```

---

## 5. Trang dùng "use client" không cần thiết

**Mức độ: CAO**

### Vấn đề

Một số trang có directive `"use client"` nhưng không sử dụng bất kỳ hook hay event handler nào:

| File | Lý do không cần "use client" |
|------|------------------------------|
| `src/app/(public)/posts/category/page.tsx` | Chỉ chứa HTML tĩnh |
| `src/app/(public)/posts/tag/page.tsx` | Chỉ chứa HTML tĩnh |
| `src/app/(public)/posts/category/[slug]/page.tsx` | Chỉ dùng `useParams` - có thể thay bằng server params prop |

### Ảnh hưởng

- Component đánh dấu `"use client"` sẽ được gửi JS bundle đến client
- Server Component (mặc định) chỉ gửi HTML, không gửi JS → nhẹ hơn nhiều
- Mỗi trang client không cần thiết = thêm JS phải download + parse

### Hướng giải quyết

Xóa `"use client"` và chuyển sang sử dụng server-side params:

```tsx
// Trước
"use client"
export default function CategoryPage() {
  const { slug } = useParams();
  // ...
}

// Sau
export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // ...
}
```

---

## 6. React Query staleTime quá ngắn

**Mức độ: TRUNG BÌNH**

### Vấn đề

File `src/components/Providers/QueryProvider.tsx` cấu hình:

```ts
staleTime: 30 * 1000,  // 30 giây
gcTime: 5 * 60 * 1000, // 5 phút
```

Với `staleTime: 30s`, mỗi khi user quay lại trang đã xem (sau 30 giây), React Query sẽ refetch lại data.

### Ảnh hưởng

- Chuyển tab rồi quay lại → refetch
- Navigate đi rồi quay lại trang trước → refetch
- Gây ra nhiều request API không cần thiết
- Trang "nhấp nháy" khi data refetch (loading → data mới)

### Hướng giải quyết

Tăng staleTime phù hợp với tính chất dữ liệu:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 phút (thay vì 30 giây)
      gcTime: 10 * 60 * 1000,    // 10 phút
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

Với data cần realtime hơn (comments, notifications), override riêng cho từng query.

---

## 7. Loading state khi chuyển trang/phân trang

**Mức độ: CAO - ẢNH HƯỞNG UX TRỰC TIẾP**

### Vấn đề

Hiện tại có 3 cơ chế loading hoạt động đồng thời nhưng không phối hợp tốt:

1. **`NavigationProgress`** (nextjs-toploader) - thanh progress bar đỏ ở trên cùng, 3px
2. **`GlobalLoadingOverlay`** - overlay trắng mờ khi click link nội bộ
3. **`ContentWrapper`** - spinner trên vùng nội dung khi phân trang

**Vấn đề cụ thể:**
- Thanh progress bar quá nhỏ (3px), màu đỏ, người dùng có thể không nhận ra
- `GlobalLoadingOverlay` dùng `pointer-events-none` nên người dùng có thể click tiếp trong khi đang load
- Khi click phân trang, `ContentWrapper` có thể không detect được nếu sử dụng `router.push()` với `{ scroll: false }`
- Không có skeleton loading cho nội dung chính khi chuyển trang

### Ảnh hưởng

- Người dùng click phân trang → không thấy phản hồi rõ ràng → tưởng bị lag → click lại
- Chuyển trang không có transition mượt mà
- Trải nghiệm "đứng hình" 1-2 giây giữa các trang

### Hướng giải quyết

**A. Cải thiện loading overlay:**

```tsx
// GlobalLoadingOverlay.tsx - Thêm visual feedback rõ ràng hơn
export function GlobalLoadingOverlay() {
  // Thêm skeleton placeholder thay vì chỉ overlay trắng mờ
  // Block interaction (bỏ pointer-events-none) để tránh double-click
  return (
    <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
```

**B. Thêm Skeleton cho nội dung phân trang:**

```tsx
// Pagination click → show skeleton grid thay vì spinner đơn giản
function ComicGrid({ comics, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <ComicCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return /* render comics */;
}
```

**C. Tăng kích thước progress bar:**

```tsx
<NextTopLoader
  color="#dc2626"
  height={4}           // Tăng từ 3px lên 4px
  showSpinner={true}   // Hiện spinner icon ở góc phải
  speed={150}          // Nhanh hơn một chút
/>
```

---

## 8. optimizePackageImports thiếu thư viện

**Mức độ: TRUNG BÌNH**

### Vấn đề

File `next.config.ts` đã cấu hình `optimizePackageImports` nhưng thiếu 2 thư viện lớn:

```ts
experimental: {
  optimizePackageImports: [
    "lucide-react",
    "date-fns",
    "react-hook-form",
    "@heroicons/react",
    "chart.js",        // ← Đã có nhưng cần verify
    "zod",
    "axios",
    "swiper",          // ← Đã có nhưng cần verify
  ],
}
```

### Hướng giải quyết

Verify rằng `chart.js`, `react-chartjs-2`, và `swiper` đều nằm trong danh sách. Thêm nếu thiếu:

```ts
optimizePackageImports: [
  "lucide-react",
  "date-fns",
  "react-hook-form",
  "@heroicons/react",
  "chart.js",
  "react-chartjs-2",
  "swiper",
  "zod",
  "axios",
  "@tinymce/tinymce-react",
],
```

---

## 9. Header/Footer đánh dấu "use client"

**Mức độ: TRUNG BÌNH**

### Vấn đề

```
src/components/Layouts/Public/footer/PublicFooter.tsx  → "use client"
src/components/Layouts/Public/header/PublicHeader.tsx  → "use client"
```

Header và Footer là các component hiển thị trên **MỌI TRANG**. Nếu chúng là Client Component, toàn bộ JS của chúng sẽ được gửi đến client.

### Hướng giải quyết

Tách phần tĩnh (logo, links, text) thành Server Component, chỉ wrap phần interactive (dropdown menu, search bar, auth state) trong Client Component nhỏ:

```tsx
// PublicHeader.tsx (Server Component - không có "use client")
export default function PublicHeader() {
  return (
    <header>
      <Logo />           {/* Server */}
      <NavLinks />       {/* Server */}
      <SearchBar />      {/* Client - interactive */}
      <UserMenu />       {/* Client - cần auth state */}
    </header>
  );
}
```

---

## 10. Pagination loading state không đồng bộ

**Mức độ: TRUNG BÌNH**

### Vấn đề

Component `Pagination.tsx` sử dụng `useTransition()` để quản lý pending state. Tuy nhiên, `startTransition` wraps `router.push()`, và React transition có thể kết thúc trước khi server thực sự trả về data mới.

```tsx
// Pagination.tsx hiện tại
const [isPending, startTransition] = useTransition();

const handlePageChange = (page: number) => {
  startTransition(() => {
    router.push(newUrl, { scroll: false });
  });
};
```

### Ảnh hưởng

- Loading spinner biến mất trước khi data mới render
- Hoặc loading spinner không hiện đủ lâu để user nhận ra

### Hướng giải quyết

Kết hợp `useTransition` với visual feedback rõ ràng hơn:

```tsx
const handlePageChange = (page: number) => {
  startTransition(() => {
    router.push(newUrl, { scroll: false });
  });
};

// Trong JSX, dim content area khi isPending
<div className={cn("transition-opacity duration-200", isPending && "opacity-50 pointer-events-none")}>
  {children}
</div>
```

---

## Thứ tự ưu tiên triển khai

| STT | Vấn đề | Mức độ | Độ khó | Thời gian ước tính |
|-----|--------|--------|--------|---------------------|
| 1 | Dynamic import Swiper + chuyển CSS | Nghiêm trọng | Dễ | ~30 phút |
| 2 | Loading state chuyển trang/phân trang | Cao (UX) | Trung bình | ~1-2 giờ |
| 3 | Fix double-fetching FAQs/Gallery | Cao | Dễ | ~30 phút |
| 4 | Xóa "use client" không cần thiết | Cao | Dễ | ~20 phút |
| 5 | Dynamic import Chart.js | Cao | Dễ | ~20 phút |
| 6 | Tăng React Query staleTime | Trung bình | Dễ | ~10 phút |
| 7 | Tối ưu Header/Footer | Trung bình | Trung bình | ~1 giờ |
| 8 | Cập nhật optimizePackageImports | Trung bình | Dễ | ~5 phút |
| 9 | Đồng bộ Pagination loading | Trung bình | Dễ | ~30 phút |

---

## Kết quả kỳ vọng sau tối ưu

- **First Contentful Paint (FCP):** Giảm ~30-40% nhờ loại bỏ Swiper/Chart.js khỏi initial bundle
- **Time to Interactive (TTI):** Giảm ~20-30% nhờ giảm JS cần parse
- **Trải nghiệm phân trang:** Người dùng thấy feedback ngay lập tức (skeleton/opacity) thay vì "đứng hình"
- **Chuyển trang:** Có loading indicator rõ ràng, mượt mà hơn
- **API calls:** Giảm ~50% request không cần thiết nhờ tăng staleTime
