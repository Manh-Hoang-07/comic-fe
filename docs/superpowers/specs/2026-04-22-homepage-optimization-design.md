# Homepage Optimization Design

**Date:** 2026-04-22
**Goal:** Move homepage vào `(public)` route group để hưởng header/footer streaming, loại bỏ fetch thừa khỏi critical path, thêm Suspense skeleton để user thấy layout ngay lập tức.

---

## Problem

`src/app/page.tsx` hiện nằm ngoài `(public)` route group:
- Tự fetch `getSystemConfig` + `getPublicMenus` để render header/footer thủ công qua `PublicLayoutWrapper`
- Tất cả fetch (`getComicHomepageData` + `getSystemConfig` + `getPublicMenus`) phải hoàn thành trước khi gửi **bất kỳ HTML nào** về browser
- User thấy màn hình trắng cho đến khi API chậm nhất xong

---

## Architecture

### Route Change

```
src/app/page.tsx          →  src/app/(public)/page.tsx
src/app/layout.tsx           (root layout, không đổi)
src/app/(public)/layout.tsx  (public layout, đã có streaming)
```

`(public)/layout.tsx` đã có:
- `AsyncHeader` với independent Suspense + skeleton
- `AsyncFooter`, `AsyncFloatingChannels` streaming sau
- `ReadingPageGuard` ẩn footer trên trang đọc truyện

### Data Flow (sau khi di chuyển)

```
Request đến
 ├─ (public)/layout.tsx khởi chạy ngay
 │   ├─ Gửi HTML shell + HeaderSkeleton về browser (user thấy layout)
 │   ├─ AsyncHeader: fetch getSystemConfig + getPublicMenus (parallel)
 │   └─ AsyncFooter / AsyncFloatingChannels: fetch getSystemConfig (cached)
 │
 └─ (public)/page.tsx
     └─ Suspense fallback=<HomepageSkeleton>
         └─ AsyncHomepageContent: fetch getComicHomepageData()
```

`getSystemConfig` dùng `React.cache()` → root layout (`generateMetadata`), public layout, và bất kỳ server component nào khác đều share 1 fetch duy nhất trong cùng request.

### Component Structure

```
(public)/page.tsx  [Server Component, revalidate=60]
 ├─ <Suspense fallback={<HomepageSkeleton />}>
 │   └─ <AsyncHomepageContent />   [async Server Component]
 │       ├─ <TrendingHero />        [Client Component — carousel]
 │       ├─ <ComicSection />        [Server Component] x3
 │       ├─ <CategorySidebar />     [Server Component]
 │       └─ Top Viewed list         [inline JSX]
 └─ (header/footer handled by layout)
```

### HomepageSkeleton

Skeleton cho phần content chính khi `getComicHomepageData` đang fetch:
- Hero skeleton: 1 block lớn chiều cao ~400px, animate-pulse
- Section skeletons: 2 hàng card placeholder

---

## Files Changed

| File | Action |
|------|--------|
| `src/app/page.tsx` | Delete |
| `src/app/(public)/page.tsx` | Create |

---

## Error Handling

Giữ nguyên error state hiện tại (khi `data` là null) nhưng render trong layout thay vì `PublicLayoutWrapper`.

---

## Non-goals

- Không tách `getComicHomepageData` thành nhiều fetch riêng (backend chỉ có 1 endpoint)
- Không thay đổi `TrendingHero` (carousel hợp lệ là client component)
- Không thay đổi `revalidate = 60` (ISR đã phù hợp)
