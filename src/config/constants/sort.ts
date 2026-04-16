/**
 * Centralized sort option constants.
 * Dùng chung cho các AdminFilter components.
 */

export interface SortOption {
  value: string;
  label: string;
}

// ===== COMMON SORT OPTIONS =====

export const SORT_CREATED_AT: SortOption[] = [
  { value: "created_at:desc", label: "Ngày tạo (mới nhất)" },
  { value: "created_at:asc", label: "Ngày tạo (cũ nhất)" },
];

export const SORT_UPDATED_AT: SortOption[] = [
  { value: "updated_at:desc", label: "Ngày cập nhật (mới nhất)" },
  { value: "updated_at:asc", label: "Ngày cập nhật (cũ nhất)" },
];

export const SORT_NAME: SortOption[] = [
  { value: "name:asc", label: "Tên (A-Z)" },
  { value: "name:desc", label: "Tên (Z-A)" },
];

export const SORT_TITLE: SortOption[] = [
  { value: "title:asc", label: "Tên (A-Z)" },
  { value: "title:desc", label: "Tên (Z-A)" },
];

export const SORT_SORT_ORDER: SortOption[] = [
  { value: "sort_order:asc", label: "Thứ tự (tăng dần)" },
  { value: "sort_order:desc", label: "Thứ tự (giảm dần)" },
];

// ===== DOMAIN-SPECIFIC SORT =====

export const SORT_COMIC: SortOption[] = [
  ...SORT_CREATED_AT,
  ...SORT_TITLE,
  { value: "view_count:desc", label: "Lượt xem (giảm dần)" },
];

export const SORT_CHAPTER: SortOption[] = [
  { value: "chapter_index:desc", label: "Chương mới nhất" },
  { value: "chapter_index:asc", label: "Chương cũ nhất" },
  ...SORT_CREATED_AT,
];

export const SORT_WITH_RATING: SortOption[] = [
  ...SORT_CREATED_AT,
  ...SORT_SORT_ORDER,
  { value: "rating:desc", label: "Đánh giá cao → thấp" },
];
