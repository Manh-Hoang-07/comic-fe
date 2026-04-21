import type { StatusOption, StatusBadge } from "@/config/constants/status";

export const PROJECT_STATUS: StatusOption[] = [
  { value: "planning", label: "Đang lập kế hoạch" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
  { value: "on_hold", label: "Tạm dừng" },
  { value: "cancelled", label: "Đã hủy" },
];

export const PROJECT_STATUS_BADGES: Record<string, StatusBadge> = {
  planning: { label: "Đang lập kế hoạch", className: "bg-gray-100 text-gray-800 border-gray-200" },
  in_progress: { label: "Đang thực hiện", className: "bg-blue-100 text-blue-800 border-blue-200" },
  completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800 border-green-200" },
  on_hold: { label: "Tạm dừng", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800 border-red-200" },
};
