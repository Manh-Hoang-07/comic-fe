import { Suspense } from "react";
import { Metadata } from "next";
import AdminMenus from "@/components/Features/Core/Menus/Admin/AdminMenus";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý Menu | Admin",
  description: "Quản lý cấu trúc danh mục và liên kết",
};

export default function AdminMenusPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Menu"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Giao diện" },
          { label: "Menu" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminMenus />
      </Suspense>
    </div>
  );
}


