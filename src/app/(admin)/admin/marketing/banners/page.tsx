import { Suspense } from "react";
import { Metadata } from "next";
import AdminBanners from "@/components/Features/Marketing/Banners/Admin/AdminBanners";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý Banner | Admin",
  description: "Quản lý danh sách banner quảng cáo",
};

export default function AdminBannersPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Banner"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Giao diện", href: "/admin/banners" },
          { label: "Banner" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminBanners />
      </Suspense>
    </div>
  );
}




