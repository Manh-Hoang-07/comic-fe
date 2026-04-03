import { Suspense } from "react";
import { Metadata } from "next";
import AdminCountries from "@/components/Features/Core/Locations/Countries/Admin/AdminCountries";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quốc gia | Admin",
  description: "Quản lý danh sách quốc gia",
};

export default function AdminCountriesPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quốc gia"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin" },
          { label: "Địa điểm" },
          { label: "Quốc gia" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminCountries />
      </Suspense>
    </div>
  );
}

