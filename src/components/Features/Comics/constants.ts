import type { StatusOption, StatusBadge } from "@/config/constants/status";

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

export const CHAPTER_STATUS: StatusOption[] = [
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã xuất bản" },
];
