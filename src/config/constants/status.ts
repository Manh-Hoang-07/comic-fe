/**
 * Centralized status constants.
 * Dùng chung cho Filter, Form, và Badge rendering.
 */

export interface StatusOption {
  value: string;
  label: string;
}

export interface StatusBadge {
  label: string;
  className: string;
}

// ===== BASIC STATUS (Active/Inactive) =====
// Dùng cho: Tags, Categories, BannerLocations, Testimonials, Galleries, Staff,
// About, Partners, FAQs, Certificates, Contexts, Permissions, Locations, etc.

export const BASIC_STATUS: StatusOption[] = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

export const BASIC_STATUS_BADGES: Record<string, StatusBadge> = {
  active: { label: "Hoạt động", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  inactive: { label: "Ngừng hoạt động", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

// ===== COMIC STATUS =====

export const COMIC_STATUS: StatusOption[] = [
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã xuất bản" },
  { value: "completed", label: "Hoàn thành" },
  { value: "hidden", label: "Ẩn" },
];

export const COMIC_STATUS_BADGES: Record<string, StatusBadge> = {
  draft: { label: "Nháp", className: "bg-gray-100 text-gray-800" },
  published: { label: "Công khai", className: "bg-green-100 text-green-800" },
  completed: { label: "Hoàn tất", className: "bg-blue-100 text-blue-800" },
  hidden: { label: "Ẩn", className: "bg-red-100 text-red-800" },
};

// ===== CHAPTER STATUS =====

export const CHAPTER_STATUS: StatusOption[] = [
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã xuất bản" },
];

// ===== COMMENT / VISIBILITY STATUS =====

export const VISIBILITY_STATUS: StatusOption[] = [
  { value: "visible", label: "Công khai" },
  { value: "hidden", label: "Đang ẩn" },
];

// ===== PROJECT STATUS =====

export const PROJECT_STATUS: StatusOption[] = [
  { value: "planning", label: "Đang lập kế hoạch" },
  { value: "in_progres", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
  { value: "on_hold", label: "Tạm dừng" },
  { value: "cancelled", label: "Đã hủy" },
];

// ===== CONTENT TEMPLATE =====

export const CONTENT_TEMPLATE_CATEGORIES: StatusOption[] = [
  { value: "render", label: "Render (HTML/Text)" },
  { value: "file", label: "File (Word/Excel/PDF)" },
];

export const CONTENT_TEMPLATE_TYPES: StatusOption[] = [
  { value: "email", label: "Email" },
  { value: "telegram", label: "Telegram" },
  { value: "zalo", label: "Zalo" },
  { value: "sms", label: "SMS" },
  { value: "pdf_generated", label: "PDF Generated" },
  { value: "file_word", label: "File Word" },
  { value: "file_excel", label: "File Excel" },
];

// ===== ABOUT SECTION TYPES =====

export const ABOUT_SECTION_TYPES: StatusOption[] = [
  { value: "mission", label: "Sứ mệnh" },
  { value: "vision", label: "Tầm nhìn" },
  { value: "value", label: "Giá trị" },
  { value: "culture", label: "Văn hóa" },
  { value: "achievement", label: "Thành tựu" },
  { value: "other", label: "Khác" },
];

// ===== CERTIFICATE TYPES =====

export const CERTIFICATE_TYPES: StatusOption[] = [
  { value: "quality", label: "Chất lượng" },
  { value: "safety", label: "An toàn" },
  { value: "environment", label: "Môi trường" },
  { value: "license", label: "Giấy phép" },
  { value: "other", label: "Khác" },
];

// ===== PARTNER TYPES =====

export const PARTNER_TYPES: StatusOption[] = [
  { value: "partner", label: "Đối tác" },
  { value: "sponsor", label: "Nhà tài trợ" },
  { value: "other", label: "Khác" },
];

// ===== HELPER =====

export function getStatusBadge(
  status: string,
  badges: Record<string, StatusBadge>
): StatusBadge {
  return badges[status] || { label: status, className: "bg-gray-100 text-gray-800" };
}
