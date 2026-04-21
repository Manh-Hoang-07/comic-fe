/**
 * Shared status constants — dùng chung cho nhiều features.
 * Feature-specific constants nằm trong folder của feature đó.
 */

export interface StatusOption {
  value: string;
  label: string;
  name?: string;
}

export interface StatusBadge {
  label: string;
  className: string;
}

// ===== BASIC STATUS (Active/Inactive) =====
// Dùng chung cho: Tags, Categories, BannerLocations, Testimonials, Galleries, Staff,
// About, Partners, FAQs, Certificates, Contexts, Permissions, Locations, etc.

export const BASIC_STATUS: StatusOption[] = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
];

export const BASIC_STATUS_BADGES: Record<string, StatusBadge> = {
  active: { label: "Hoạt động", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  inactive: { label: "Ngừng hoạt động", className: "bg-gray-100 text-gray-800 border-gray-200" },
};

// ===== HELPER =====

export function getStatusBadge(
  status: string,
  badges: Record<string, StatusBadge>
): StatusBadge {
  return badges[status] || { label: status, className: "bg-gray-100 text-gray-800" };
}
