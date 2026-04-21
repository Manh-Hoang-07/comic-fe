import type { StatusBadge } from "@/config/constants/status";

export const CONTACT_STATUS_BADGES: Record<string, StatusBadge> = {
  new: { label: "Mới", className: "bg-blue-100 text-blue-800 border-blue-200" },
  read: { label: "Đã xem", className: "bg-green-100 text-green-800 border-green-200" },
  processing: { label: "Đang xử lý", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  replied: { label: "Đã phản hồi", className: "bg-purple-100 text-purple-800 border-purple-200" },
  closed: { label: "Đã đóng", className: "bg-gray-100 text-gray-800 border-gray-200" },
};
