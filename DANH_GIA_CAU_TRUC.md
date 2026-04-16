# Đánh giá cấu trúc thư mục & file - Comic-FE

> Đánh giá bởi AI dựa trên khảo sát toàn bộ 432 files trong dự án.
> Ngày: 2026-04-16

---

## Tổng quan

| Hạng mục | Điểm | Ghi chú |
|----------|------|---------|
| Cấu trúc thư mục tổng thể | 8/10 | Phân tầng rõ ràng, đúng convention Next.js |
| Components | 7/10 | Feature-based tốt, nhưng nesting quá sâu & duplication nhiều |
| Hooks | 8.5/10 | Phân loại tốt, abstraction hợp lý |
| Lib/API | 8/10 | Client/Server tách biệt tốt, endpoint type-safe |
| Config | 7/10 | Quá đơn giản, thiếu centralized constants |
| Utils | 8/10 | Gọn gàng, đúng trách nhiệm |
| Types | 7.5/10 | Tốt nhưng thiếu tổ chức theo domain |
| **Tổng** | **7.5/10** | **Trên trung bình, có nền tảng tốt nhưng cần refactor một số điểm** |

---

## 1. Cấu trúc thư mục tổng thể

### Điểm mạnh

```
src/
├── app/           # Route groups rõ ràng: (admin), (auth), (public), (user)
├── components/    # Feature-based organization
├── config/        # Centralized env
├── contexts/      # React contexts
├── hooks/         # Phân loại theo chức năng
├── lib/           # Business logic & API
├── styles/        # Global styles
├── types/         # TypeScript types
└── utils/         # Pure utility functions
```

- Sử dụng **Route Groups** `(admin)`, `(auth)`, `(public)`, `(user)` rất đúng convention Next.js App Router
- Tách biệt rõ ràng giữa `lib` (business logic), `hooks` (React hooks), `utils` (pure functions)
- Barrel exports (`index.ts`) ở hooks và utils giúp import gọn gàng

### Điểm yếu

- **Thiếu thư mục `constants/`**: Nhiều magic strings, status options, filter options đang bị hardcode rải rác trong components
- **Thiếu thư mục `validations/`**: Zod schemas đang nằm trong từng component thay vì tập trung
- **File `test.js` ở root**: File test rác, không nên để ở root

---

## 2. Components - Phân tích chi tiết

### 2.1. Cấu trúc phân tầng

```
components/
├── Features/      # Feature-specific components
│   ├── Comics/
│   ├── Core/
│   ├── Introduction/
│   ├── Marketing/
│   └── Posts/
├── Layouts/       # Admin & Public layouts
├── Providers/     # QueryProvider, AuthInitializer
├── Shared/        # Shared across features
└── UI/            # Atomic UI components
    ├── DataDisplay/
    ├── Feedback/
    ├── Filters/
    ├── Forms/
    ├── Loading/
    ├── Media/
    └── Navigation/
```

**Điểm mạnh:**
- Phân tầng `UI → Shared → Features → Layouts` rất rõ ràng, đúng Atomic Design
- UI components (DataTable, Modal, FormField...) tái sử dụng tốt
- Tách Admin/Public trong mỗi feature domain

### 2.2. Vấn đề NGHIÊM TRỌNG: Nesting quá sâu

```
src/components/Features/Comics/Categories/Admin/ComicCategoryForm.tsx
│   │          │       │          │       │
│   │          │       │          │       └── 6 levels deep
│   │          │       │          └── 5
│   │          │       └── 4
│   │          └── 3
│   └── 2
└── 1
```

**6 cấp thư mục** trước khi đến file thực tế. Import path trở nên rất dài:
```ts
import { ComicCategoryForm } from '@/components/Features/Comics/Categories/Admin/ComicCategoryForm'
```

**Gợi ý:** Bỏ tầng `Features/` hoặc flat hơn:
```
components/comics/admin/CategoryForm.tsx
components/comics/public/ComicCard.tsx
```

### 2.3. Vấn đề NGHIÊM TRỌNG: Duplication pattern quá nhiều

Có **27 thư mục Admin** theo cùng 1 pattern:

| File | Vai trò |
|------|---------|
| `AdminXxx.tsx` | List page chính |
| `CreateXxx.tsx` | Wrapper gọi API create |
| `EditXxx.tsx` | Wrapper gọi API edit |
| `XxxForm.tsx` | Form dùng chung create/edit |
| `XxxFilter.tsx` | Bộ lọc |

Pattern này **nhất quán** - đó là điểm tốt. Nhưng vấn đề là:

1. **CreateXxx và EditXxx gần như giống nhau** (chỉ khác API endpoint). Ví dụ `CreateComic.tsx` (75 dòng) và `EditComic.tsx` (104 dòng) có logic upload ảnh cover **copy-paste y hệt nhau**.

2. **AdminXxx.tsx lặp pattern gần như 100%** giữa các feature:
   - `AdminComics.tsx` (280 dòng) vs `AdminPosts.tsx` (265 dòng) - cùng pattern useListPage + useModal + DataTable
   - Nhân lên 27 lần = ~7,000 dòng code lặp

3. **Status badge rendering** duplicate ở ít nhất 3 nơi

**Gợi ý:** Tạo một `GenericAdminList<T>` component hoặc higher-order component để giảm duplication.

### 2.4. Component thừa phát hiện

- **`ComicList.tsx`** (215 dòng) trong `Comics/ComicList/Admin/` - Đây là phiên bản CŨ của `AdminComics.tsx`, dùng direct API calls thay vì `useListPage` hook. **Không được export trong index.ts** → Có vẻ dead code, nên xóa.

### 2.5. Duplicate Pagination

Hai component Pagination tồn tại song song:
- `UI/DataDisplay/Pagination.tsx` (157 dòng) - Full-featured, có jump-to-page, Vietnamese labels
- `UI/Navigation/Pagination.tsx` (122 dòng) - Đơn giản hơn, dùng Next.js router

**Cần merge thành 1 component** với options configurable.

---

## 3. Hooks - Phân tích chi tiết

### Cấu trúc

```
hooks/
├── crud/           # useListPage, useModals, usePagination, useUrlApiSync, useUrlListSync
├── data/           # useApiFetch, useApiQuery, useGroup, useLazyDataLoader, useMenus, useSystemConfig
├── forms/          # useFormValidation, useTableSelection, useUpload
├── identity/       # useAuthInit, useUserManagement
├── navigation/     # useNavigation, useSeo, useUserNavigation
├── ui-ux/          # useModal, useSerialNumber, useToast
└── index.ts        # Barrel export
```

### Điểm mạnh

- **Phân loại rõ ràng**: crud, data, forms, identity, navigation, ui-ux
- **Layered abstraction** trong CRUD hooks:
  ```
  useListPage (high-level) → useUrlApiSync (mid) → useUrlListSync (base)
  ```
- `useListPage` trả về structure `{ data, actions, ui }` rất clean
- Barrel export cho phép `import { useListPage, useToast } from '@/hooks'`

### Điểm yếu

- **`usePagination.ts`** có vẻ thừa khi `useUrlListSync` đã handle pagination
- **`useApiFetch.ts`** (56 dòng) là hook đơn giản useState + useEffect - trong khi đã có React Query (`useApiQuery`). Hai cách fetch data tồn tại song song gây confuse cho developer mới
- **`useModal` ở 2 nơi**: `hooks/ui-ux/useModal.ts` và `hooks/crud/useModals.ts` (số nhiều) - dễ nhầm lẫn

---

## 4. Lib/API - Phân tích chi tiết

### Cấu trúc

```
lib/
├── api/
│   ├── admin/         # Admin-specific API services (6 files)
│   ├── endpoints/     # Centralized endpoint definitions
│   │   ├── admin.ts
│   │   ├── public.ts
│   │   └── user.ts
│   ├── public/        # Public API services (7 files)
│   ├── user/          # User API services (4 files)
│   ├── client.ts      # Axios instance + interceptors (client-side)
│   ├── server-client.ts  # fetch wrapper (server-side)
│   ├── utils.ts       # Token, cache, error utilities
│   └── index.ts
├── auth/
│   └── tokens.ts
├── group/
│   └── utils.ts
├── store/
│   ├── authStore.ts   # Zustand auth store (600 dòng!)
│   └── pageStore.ts
└── metadata.ts
```

### Điểm mạnh

- **Client/Server tách biệt**: `client.ts` (Axios, client-side) vs `server-client.ts` (fetch, server-side) - đúng pattern Next.js
- **Endpoints type-safe**: Centralized endpoint definitions với TypeScript types
- **API utils comprehensive**: Token management, retry logic, caching, error handling - 289 dòng utilities tốt
- **Interceptors**: Auto-inject auth token, group ID, handle 401 redirect

### Điểm yếu

- **`authStore.ts` quá lớn (600 dòng)**: Chứa login, register, OTP, fetchUser, permission checking - nên tách thành:
  - `authStore.ts` - core auth state
  - `permissionStore.ts` hoặc `usePermissions.ts` - permission logic

- **Endpoint files thiếu nhất quán**: `lib/api/admin/` có 6 files nhưng không cover hết tất cả admin features. Nhiều API calls vẫn dùng generic `apiClient.get(endpoints.admin.xxx)` trực tiếp trong components

- **`metadata.ts`** vẫn chứa placeholder values (`example.com`, `Next.js Company`) - chưa config cho production

---

## 5. Config

### Hiện tại

```
config/
└── env.ts    # 10 dòng, chỉ export env vars
```

### Vấn đề

**Quá đơn giản.** Thiếu nhiều thứ nên centralize:

1. **Constants**: Status labels, filter options, pagination defaults đang hardcode rải rác
2. **Validation schemas**: Zod schemas đang nằm trong components
3. **Route definitions**: Admin routes, public routes đang là magic strings
4. **API response mappings**: Status badge colors, labels

**Gợi ý cấu trúc:**
```
config/
├── env.ts
├── constants/
│   ├── status.ts        # Comic/Post status labels & colors
│   ├── pagination.ts    # Default page sizes
│   └── routes.ts        # Named route constants
└── validations/
    ├── comic.ts         # Zod schemas cho comic
    └── post.ts          # Zod schemas cho post
```

---

## 6. Utils

### Cấu trúc

```
utils/
├── array.ts        # Array helpers
├── debounce.ts     # Debounce function
├── form.ts         # Form utilities
├── formatters.ts   # Number/date formatting
├── image.ts        # Image helpers
├── object.ts       # Object utilities
├── string.ts       # String manipulation
├── uuid.ts         # UUID generation
└── index.ts        # Barrel export
```

### Đánh giá: Tốt

- Mỗi file có trách nhiệm rõ ràng
- Tên file mô tả đúng nội dung
- Barrel export gọn gàng
- Không bị bloat

**Một lưu ý nhỏ**: Tên thư mục là `utils` (đúng), không phải `ultils` (typo phổ biến).

---

## 7. Types

### Cấu trúc

```
types/
├── api.ts       # 225 dòng - API types + domain types lẫn lộn
├── comic.ts     # 329 dòng - Comic domain types
└── location.ts  # Location types
```

### Vấn đề

- **`api.ts` làm quá nhiều việc**: Chứa cả API response types (HttpMethod, RetryConfig, CacheItem) lẫn domain types (Project, TeamMember, Partner, FAQ, Post...)
- **Thiếu type files cho nhiều domain**: Posts, Users, Permissions, Roles... không có file type riêng
- **Admin vs Public types lẫn trong 1 file**: `comic.ts` chứa cả `Comic` (public) và `AdminComic` (admin)

**Gợi ý:**
```
types/
├── api.ts          # Chỉ chứa API infra types (HttpMethod, ApiResponse, etc.)
├── comic.ts        # Comic domain
├── post.ts         # Post domain
├── user.ts         # User domain
├── introduction.ts # About, FAQ, Partner, etc.
└── common.ts       # Shared types (Pagination, Filter, etc.)
```

---

## 8. App Router (Pages)

### Điểm mạnh

- Route groups `(admin)`, `(auth)`, `(public)`, `(user)` phân chia layout rõ ràng
- Page files thin - chỉ set metadata + render feature component
- Sử dụng Suspense fallback đúng cách
- Server Components cho data fetching ở public pages

### Vấn đề phát hiện

#### Dashboard bị duplicate

Hai nơi:
- `src/app/(admin)/admin/dashboard/page.tsx` ← Route thật: `/admin/dashboard`
- `src/app/(admin)/dashboard/admin/page.tsx` ← Route: `/dashboard/admin` (orphaned?)

Thư mục `(admin)/dashboard/` có cả `layout.tsx` riêng và sub-pages `admin/posts`, `admin/users` - có vẻ là code cũ/dead code cần dọn dẹp.

#### Một số page dùng `force-dynamic` không cần thiết

```ts
export const dynamic = "force-dynamic"  // Có thật sự cần?
```

Nhiều admin pages set `force-dynamic` trong khi data có thể cache được với `revalidate`.

---

## 9. Contexts

```
contexts/
└── ToastContext.tsx   # 136 dòng
```

Chỉ có 1 context duy nhất (Toast). Auth state dùng Zustand store thay vì Context - đây là quyết định đúng vì auth state cần persist và truy cập ngoài React tree.

**Nhận xét:** Hợp lý. Không lạm dụng Context.

---

## 10. Tổng hợp vấn đề theo mức độ ưu tiên

### Cao (Nên fix sớm)

| # | Vấn đề | Ảnh hưởng |
|---|--------|-----------|
| 1 | **27 Admin components duplicate pattern** | Maintenance nightmare khi cần thay đổi chung |
| 2 | **CreateXxx/EditXxx copy-paste logic** | Bug fix 1 chỗ, quên chỗ kia |
| 3 | **authStore.ts 600 dòng** | Khó maintain, khó test |
| 4 | **Dashboard routes duplicate** | Confuse routing, dead code |

### Trung bình (Nên cải thiện)

| # | Vấn đề | Ảnh hưởng |
|---|--------|-----------|
| 5 | **Component nesting 6 levels deep** | Import path dài, DX kém |
| 6 | **2 Pagination components** | Confuse dùng cái nào |
| 7 | **Thiếu constants folder** | Magic strings rải rác |
| 8 | **api.ts chứa cả infra + domain types** | File phình to, khó navigate |
| 9 | **2 data fetching patterns** (useApiFetch + React Query) | Inconsistency |

### Thấp (Nice to have)

| # | Vấn đề | Ảnh hưởng |
|---|--------|-----------|
| 10 | **ComicList.tsx dead code** | File thừa |
| 11 | **metadata.ts placeholder values** | SEO chưa đúng |
| 12 | **test.js ở root** | File rác |
| 13 | **useModal vs useModals naming** | Dễ nhầm |

---

## 11. Điểm tích cực cần giữ

1. **Feature-based organization** - đúng hướng, chỉ cần giảm nesting
2. **Hooks phân loại theo chức năng** - crud, data, forms, identity rất rõ ràng
3. **Client/Server API tách biệt** - đúng best practice Next.js
4. **Barrel exports** - giúp import gọn
5. **UI component library riêng** - DataTable, Modal, FormField tái sử dụng tốt
6. **Zustand cho global state** - lightweight, đúng lựa chọn
7. **React Hook Form + Zod** - stack validation hiện đại
8. **Type-safe endpoints** - giảm lỗi typo API paths
9. **Route Groups** - tận dụng tốt Next.js App Router
10. **Thin page files** - pages chỉ orchestrate, logic ở components

---

## 12. Kiến nghị cải tổ (nếu có thời gian)

### Phase 1: Dọn dẹp (Effort thấp, Impact cao) - DONE
- [x] Xóa `ComicList.tsx` dead code
- [x] Xóa/merge dashboard routes duplicate (`src/app/(admin)/dashboard/`)
- [ ] Xóa `test.js` ở root - để lại cho tôi
- [x] Merge 2 Pagination components → `UI/DataDisplay/Pagination.tsx` (hỗ trợ cả callback + URL mode)
- [x] Cập nhật `metadata.ts` → dùng `env` config thay placeholder

### Phase 2: Tổ chức lại (Effort trung bình) - DONE
- [x] Tạo `src/config/constants/` → `status.ts`, `sort.ts`, `filters.ts` + barrel `index.ts`
- [x] Tách `authStore.ts` → types ra `authTypes.ts`, extract helpers (`userToState`, `handleAuthError`, etc.), 600→280 dòng
- [x] Tách `types/api.ts` → `types/post.ts`, `types/introduction.ts`, `types/system.ts` + re-exports backward compat
- [x] Xóa `useApiFetch` (unused) → cập nhật barrel export `hooks/index.ts`

### Phase 3: Giảm duplication (Effort cao, Impact cao) - DONE (foundation)
- [x] Tạo `useAdminCrud` hook → gộp useListPage + 3 modals + delete handler + toast (thay cho ~50 dòng boilerplate/file)
- [x] Tạo `useFormModal` hook → gộp logic Create/Edit (state, fetch, submit, error handling)
- [x] Extract 35 Zod schemas ra `config/validations/` → `common.ts` (reusable fields), `auth.ts`, `post.ts`, `introduction.ts`, `core.ts`
- [x] Demo refactor `AdminPostTags` + `CreateTag` + `EditTag` dùng hooks + schemas mới
- [ ] Áp dụng pattern mới cho 26 admin components còn lại (incremental)
- [ ] Flatten component nesting (bỏ tầng `Features/`) — bỏ qua vì quá nhiều import phải sửa

### Cách áp dụng pattern mới cho các component còn lại

**AdminXxx.tsx** — thay `useListPage` + `useModal` x3 + `handleDeleteConfirm` bằng:
```ts
const { data, actions, ui, createModal, editModal, deleteModal, handleDeleteConfirm, openCreate, openEdit, openDelete } = useAdminCrud({
  endpoint: adminEndpoints.xxx.list,
  deleteSuccessMessage: "Xóa thành công",
});
```

**CreateXxx.tsx / EditXxx.tsx** — thay useState + useToastContext + try/catch bằng:
```ts
// Create mode
const { loading, apiErrors, handleSubmit } = useFormModal(
  { mode: "create", show, createApi },
  { createSuccessMessage: "...", onSuccess, onClose }
);

// Edit mode
const { entityData, loading, apiErrors, handleSubmit } = useFormModal(
  { mode: "edit", show, target },
  { updateSuccessMessage: "...", onSuccess, onClose }
);
```

**XxxForm.tsx** — thay inline `z.object()` bằng import từ `@/config/validations/`:
```ts
import { xxxSchema, type XxxFormValues } from "@/config/validations/domain";
import { BASIC_STATUS } from "@/config/constants/status";
```

---

*Đánh giá tổng thể: Codebase đã được cải thiện đáng kể qua 3 phases. Nền tảng hooks (`useAdminCrud`, `useFormModal`) và centralized config (`constants/`, `validations/`) đã sẵn sàng. Việc áp dụng cho 26 admin components còn lại là incremental — mỗi lần sửa 1 feature chỉ mất vài phút theo pattern đã demo.*
