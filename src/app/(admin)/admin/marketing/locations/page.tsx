import { Suspense } from "react";
import { Metadata } from "next";
import AdminBannerLocations from "@/components/Features/Marketing/Locations/Admin/AdminBannerLocations";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Vị trí Banner | Admin",
  description: "Quản lý vị trí hiển thị banner",
};

export default function AdminBannerLocationsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Vị trí Banner"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Giao diện", href: "/admin/banners" },
          { label: "Vị trí Banner" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminBannerLocations />
      </Suspense>
    </div>
  );
}




