/**
 * Centralized filter option constants.
 * Dùng chung cho các Filter components.
 */

export interface FilterOption {
  value: string;
  label: string;
}

// ===== FEATURED =====

export const FEATURED_OPTIONS: FilterOption[] = [
  { value: "", label: "Tất cả" },
  { value: "true", label: "Nổi bật" },
  { value: "false", label: "Không nổi bật" },
];

// ===== INCLUDE DELETED =====

export const INCLUDE_DELETED_OPTIONS: FilterOption[] = [
  { value: "", label: "Mặc định" },
  { value: "true", label: "Bao gồm đã xóa" },
  { value: "false", label: "Chỉ chưa xóa" },
];

// ===== RATING =====

export const RATING_OPTIONS: FilterOption[] = [
  { value: "", label: "Tất cả" },
  { value: "5", label: "5 sao" },
  { value: "4", label: "4 sao" },
  { value: "3", label: "3 sao" },
  { value: "2", label: "2 sao" },
  { value: "1", label: "1 sao" },
];
