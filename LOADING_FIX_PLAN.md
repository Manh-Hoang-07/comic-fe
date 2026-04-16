# Kế hoạch sửa Loading - Thống nhất 1 hiệu ứng duy nhất

> **Nguyên tắc:** Mỗi tình huống CHỈ có 1 loading indicator. Không chồng chéo, không nối tiếp.

---

## Tổng quan hiện trạng

Hiện tại hệ thống có **6 cơ chế loading** hoạt động độc lập, gây ra hiện tượng "load xong cái 1 rồi load cái 2":

| # | Component | Cơ chế | Vấn đề |
|---|-----------|--------|--------|
| 1 | `NavigationProgress` | Progress bar đỏ trên top (z-9999) | Trùng với #2 |
| 2 | `GlobalLoadingOverlay` | Overlay trắng mờ + spinner (z-99) | Trùng với #1, chồng lên #3 |
| 3 | 9 file `loading.tsx` | Skeleton/spinner khi route load | Bị #2 che phủ, rồi lại hiện khi #2 ẩn |
| 4 | `ContentWrapper` | Dim + spinner khi pagination/filter | Trùng với #1 + #2 khi đổi trang |
| 5 | `ComicListWrapper` | Overlay spinner khi pagination | Trùng hoàn toàn với #4 |
| 6 | `LoadingSpinner` (2 bản) | 2 component trùng tên khác folder | Gây nhầm lẫn |

---

## Chiến lược mới: 1 loading cho mỗi tình huống

```
┌─────────────────────────────────────────────────────────────────┐
│  TÌNH HUỐNG                │  LOADING DUY NHẤT                  │
├────────────────────────────┼─────────────────────────────────────┤
│  Chuyển trang (navigation) │  NavigationProgress (progress bar)  │
│  Route đang load (SSR)     │  loading.tsx (skeleton phù hợp)     │
│  Pagination / Filter       │  ContentWrapper (dim effect)        │
│  Form submit / Modal       │  Button spinner inline              │
│  Fetch data trong page     │  Skeleton inline trong component    │
└─────────────────────────────────────────────────────────────────┘
```

**Bỏ hoàn toàn:** `GlobalLoadingOverlay`, `ComicListWrapper`, `LoadingSpinner` ở `UI/Loading/`

---

## Kế hoạch chi tiết từng bước

### PHASE 1: Xoá các loading trùng lặp

#### Bước 1.1: Xoá `GlobalLoadingOverlay`

**Lý do:** Trùng 100% chức năng với `NavigationProgress`. Cả 2 đều listen click trên `<a>`, cả 2 đều watch `pathname`/`searchParams`. `NavigationProgress` nhẹ hơn (chỉ là thanh bar 1px), không dùng `backdrop-blur` tốn GPU.

**File cần sửa:**

| File | Hành động |
|------|-----------|
| `src/components/UI/Loading/GlobalLoadingOverlay.tsx` | **XOA FILE** |
| `src/app/layout.tsx` | Xoá import + xoá `<GlobalLoadingOverlay />` khỏi JSX |

**Code cần sửa trong `src/app/layout.tsx`:**

```tsx
// XOA dong nay:
import { GlobalLoadingOverlay } from "@/components/UI/Loading/GlobalLoadingOverlay";

// TRUOC:
<Suspense fallback={null}>
  <NavigationProgress />
  <GlobalLoadingOverlay />    // ← XOA
</Suspense>

// SAU:
<Suspense fallback={null}>
  <NavigationProgress />
</Suspense>
```

---

#### Bước 1.2: Xoá `ComicListWrapper`

**Lý do:** Trùng hoàn toàn với `ContentWrapper` - cùng logic listen click, cùng cách detect pagination. `ContentWrapper` tốt hơn (có dim effect thay vì overlay spinner nặng).

**File cần sửa:**

| File | Hành động |
|------|-----------|
| `src/components/Features/Comics/ComicList/Public/ComicListWrapper.tsx` | **XOA FILE** |

**Lưu ý:** Hiện không có file nào import `ComicListWrapper` (ngoài chính nó). Nếu sau này tìm thấy file nào import, thay bằng `ContentWrapper`.

---

#### Bước 1.3: Gộp 2 file `LoadingSpinner` thành 1

**Hiện trạng:** Có 2 file spinner trùng tên ở 2 folder khác nhau:

| File | Export | Dùng ở đâu |
|------|--------|------------|
| `src/components/UI/Loading/LoadingSpinner.tsx` | Named: `{ LoadingSpinner }` | `src/app/loading.tsx`, `ComicListWrapper.tsx` |
| `src/components/UI/Feedback/LoadingSpinner.tsx` | Default: `LoadingSpinner` | Không file nào import trực tiếp |

**Hành động:**

| File | Hành động |
|------|-----------|
| `src/components/UI/Loading/LoadingSpinner.tsx` | **XOA FILE** (sau khi sửa root loading.tsx ở Bước 2.1) |
| `src/components/UI/Feedback/LoadingSpinner.tsx` | **GIU LAI** - dùng cho các trường hợp cần spinner inline (modal, form) |

---

### PHASE 2: Sửa các file `loading.tsx` - dùng skeleton thay spinner

#### Bước 2.1: Sửa root `loading.tsx`

**Vấn đề:** Hiện dùng `LoadingSpinner` fullscreen (overlay trắng + spinner to + "Đang tải...") → rất nặng và che hết content.

**File:** `src/app/loading.tsx`

```tsx
// TRUOC:
import { LoadingSpinner } from "@/components/UI/Loading/LoadingSpinner";
export default function Loading() {
    return <LoadingSpinner />;
}

// SAU - skeleton don gian, nhe:
export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            <div className="h-16 bg-white border-b border-gray-100" />
            <div className="container mx-auto px-4 py-8">
                <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
                <div className="h-4 w-96 bg-gray-200 rounded mb-8" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="aspect-[2/3] bg-gray-200 rounded-lg" />
                            <div className="h-4 w-3/4 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
```

**Lý do:** Skeleton nhẹ hơn spinner (không cần animation spin, không cần backdrop-blur). Chỉ dùng `animate-pulse` của Tailwind (GPU-friendly). Và tạo cảm giác trang đang load content thật thay vì 1 spinner chặn hết.

---

#### Bước 2.2: Các file `loading.tsx` khác - GIU NGUYEN

Các file loading.tsx sau đã dùng skeleton tốt rồi, **KHONG CAN SUA**:

| File | Trạng thái |
|------|-----------|
| `src/app/(public)/loading.tsx` | OK - skeleton grid |
| `src/app/(public)/comics/loading.tsx` | OK - skeleton grid + filter bar |
| `src/app/(public)/comics/[slug]/loading.tsx` | OK - skeleton detail |
| `src/app/(public)/posts/loading.tsx` | OK - skeleton grid |
| `src/app/(public)/posts/[slug]/loading.tsx` | OK - skeleton detail |
| `src/app/(admin)/admin/loading.tsx` | OK - skeleton table |
| `src/app/(user)/user/loading.tsx` | OK - skeleton profile |
| `src/app/(auth)/loading.tsx` | OK - skeleton form |

---

### PHASE 3: Sửa `ContentWrapper` - loading duy nhất cho pagination/filter

#### Bước 3.1: Bỏ `backdrop-blur` trong `ContentWrapper`

**File:** `src/components/UI/Loading/ContentWrapper.tsx`

Hiện tại `ContentWrapper` đã khá tốt (dim effect + spinner nhỏ). Chỉ cần điều chỉnh nhẹ:

```tsx
// TRUOC (dong 60-62):
<div className="flex flex-col items-center gap-3 bg-white/90 rounded-2xl px-8 py-6 shadow-lg">
    <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-sm font-medium text-gray-500">Đang tải...</p>
</div>

// SAU - gon hon, bo text thua:
<div className="flex items-center justify-center bg-white/90 rounded-xl px-6 py-4 shadow-md">
    <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
</div>
```

**Lý do:** Spinner nhỏ hơn (w-6 thay w-8), bỏ text "Đang tải..." (user đã thấy dim effect, không cần text nữa), bớt padding.

---

#### Bước 3.2: Đảm bảo `ContentWrapper` không xung đột với `Pagination`

**Vấn đề tiềm ẩn:** `Pagination` component dùng `useTransition` + hiện spinner trên nút page. Đồng thời `ContentWrapper` cũng detect click `[data-pagination]` và hiện dim effect. → **2 loading cho cùng 1 hành động.**

**Giải pháp:** Giữ cả 2 vì chúng bổ sung nhau (không trùng):
- `Pagination`: spinner trên **nút đang click** (feedback tức thì cho user biết nút nào được bấm)
- `ContentWrapper`: dim **toàn bộ content** (feedback cho user biết content đang thay đổi)

→ Đây là 2 vai trò khác nhau, CHẤP NHẬN giữ cả 2. **KHONG CAN SUA.**

---

### PHASE 4: Sửa `NavigationProgress` - loading duy nhất cho chuyển trang

#### Bước 4.1: Cải thiện `NavigationProgress` (tùy chọn)

**File:** `src/components/UI/Navigation/NavigationProgress.tsx`

`NavigationProgress` hiện tại đã tốt. Có thể cải thiện nhẹ để rõ ràng hơn:

```tsx
// TRUOC (dong 73):
<div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent pointer-events-none">

// SAU - day hon 1 chut de de thay:
<div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent pointer-events-none">
```

**Lý do:** `h-1` (4px) hơi mỏng, có thể khó nhận thấy. Đổi sang `h-[3px]` vừa đủ nhìn mà vẫn nhẹ nhàng. (Tuỳ chọn, có thể bỏ qua.)

---

### PHASE 5: Xoá `OptimizedLink` (không ai dùng)

**File:** `src/components/UI/Navigation/OptimizedLink.tsx`

**Hiện trạng:** Không có file nào import `OptimizedLink`. Component này dùng `useTransition` + `router.push` để intercept link click và thêm opacity effect - nhưng đang không được sử dụng.

**Hành động:** **XOA FILE**

---

## Tóm tắt thay đổi

### Files cần XOA (3 files):

| # | File | Lý do xoá |
|---|------|-----------|
| 1 | `src/components/UI/Loading/GlobalLoadingOverlay.tsx` | Trùng với NavigationProgress |
| 2 | `src/components/Features/Comics/ComicList/Public/ComicListWrapper.tsx` | Trùng với ContentWrapper |
| 3 | `src/components/UI/Navigation/OptimizedLink.tsx` | Không ai dùng |

### Files cần SUA (3 files):

| # | File | Nội dung sửa |
|---|------|-------------|
| 1 | `src/app/layout.tsx` | Xoá import + JSX của GlobalLoadingOverlay |
| 2 | `src/app/loading.tsx` | Đổi từ LoadingSpinner sang skeleton |
| 3 | `src/components/UI/Loading/ContentWrapper.tsx` | Thu gọn spinner (tuỳ chọn) |

### Files cần XOA SAU KHI SUA XONG (1 file):

| # | File | Lý do |
|---|------|-------|
| 1 | `src/components/UI/Loading/LoadingSpinner.tsx` | Không còn ai import sau khi sửa root loading.tsx |

### Files GIU NGUYEN:

| Component | Vai trò duy nhất | File |
|-----------|-----------------|------|
| `NavigationProgress` | Progress bar khi chuyển trang | `src/components/UI/Navigation/NavigationProgress.tsx` |
| `ContentWrapper` | Dim + spinner khi pagination/filter | `src/components/UI/Loading/ContentWrapper.tsx` |
| `Pagination` | Spinner trên nút page đang click | `src/components/UI/Navigation/Pagination.tsx` |
| `Feedback/LoadingSpinner` | Spinner inline cho modal/form | `src/components/UI/Feedback/LoadingSpinner.tsx` |
| 8 file `loading.tsx` (trừ root) | Skeleton cho từng route group | `src/app/(...)/loading.tsx` |

---

## Kết quả sau khi sửa

### Luồng loading MỚI khi chuyển trang:

```
Bước 1: User click link
    → NavigationProgress hiện (progress bar đỏ ở top)
    → CHỈ CÓ 1 indicator

Bước 2: Route đang load
    → loading.tsx hiện skeleton phù hợp (comic grid / table / form...)
    → NavigationProgress vẫn chạy ở top
    → User thấy skeleton = "trang đang chuẩn bị content"

Bước 3: Route load xong
    → NavigationProgress chạy 100% rồi ẩn
    → Skeleton biến mất, content thật hiện ra
    → XONG. Không có loading lần 2.
```

### Luồng loading MỚI khi pagination/filter:

```
Bước 1: User click nút trang 2
    → Pagination: spinner trên nút "2"
    → ContentWrapper: dim content hiện tại

Bước 2: Server trả data mới
    → Content mới hiện ra
    → Spinner + dim biến mất
    → XONG. 1 bước duy nhất.
```

### So sánh trước/sau:

| Tình huống | TRUOC | SAU |
|------------|-------|-----|
| Chuyển trang | 3-4 loading nối tiếp | 1 progress bar + 1 skeleton |
| Pagination | 2-3 loading chồng nhau | 1 dim effect + 1 nút spinner |
| Filter thay đổi | Overlay + spinner + skeleton | 1 dim effect |
| Form submit | OK (giữ nguyên) | OK (giữ nguyên) |

---

## Thứ tự thực hiện

```
Phase 1 (15 phut) ← LÀM TRƯỚC, thấy hiệu quả ngay
├── 1.1 Xoá GlobalLoadingOverlay + sửa layout.tsx
├── 1.2 Xoá ComicListWrapper
└── 1.3 Xoá LoadingSpinner ở UI/Loading/ (sau Phase 2)

Phase 2 (5 phut)
└── 2.1 Sửa root loading.tsx → skeleton

Phase 3 (5 phut, tùy chọn)
└── 3.1 Thu gọn ContentWrapper spinner

Phase 4 (2 phut, tùy chọn)
└── 4.1 Tăng height NavigationProgress

Phase 5 (1 phut)
└── 5.1 Xoá OptimizedLink
```

**Tổng thời gian ước tính: ~30 phút cho toàn bộ, 15 phút nếu chỉ làm Phase 1+2 (đã thấy hiệu quả rõ rệt).**
