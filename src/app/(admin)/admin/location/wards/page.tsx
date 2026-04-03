import { Suspense } from "react";
import { Metadata } from "next";
import AdminWards from "@/components/Features/Core/Locations/Wards/Admin/AdminWards";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Phường/Xã | Admin",
  description: "Quản lý danh sách phường/xã",
};

export default function AdminWardsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Phường/Xã"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Địa điểm" },
          { label: "Phường/Xã" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminWards />
      </Suspense>
    </div>
  );
}

