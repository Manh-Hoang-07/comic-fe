import { Suspense } from "react";
import { Metadata } from "next";
import AdminProvinces from "@/components/Features/Core/Locations/Provinces/Admin/AdminProvinces";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Tỉnh/Thành phố | Admin",
  description: "Quản lý danh sách tỉnh/thành phố",
};

export default function AdminProvincesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Tỉnh/Thành phố"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Địa điểm" },
          { label: "Tỉnh/Thành phố" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminProvinces />
      </Suspense>
    </div>
  );
}

