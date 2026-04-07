import { Suspense } from "react";
import { Metadata } from "next";
import AdminGroups from "@/components/Features/Core/Groups/Admin/AdminGroups";
import PageMeta from "@/components/UI/Navigation/PageMeta";

export const metadata: Metadata = {
  title: "Quản lý Nhóm | Admin",
  description: "Quản lý nhóm người dùng",
};

export default function AdminGroupsPage() {
  return (
    <div className="w-full p-4">
      <PageMeta
        title="Quản lý Nhóm"
        breadcrumbs={[
          { label: "Trang quản trị", href: "/admin", },
          { label: "Nhóm & Context", href: "/admin/core/groups" },
          { label: "Nhóm" },
        ]}
      />
      <Suspense fallback={<div>Đang tải...</div>}>
        <AdminGroups />
      </Suspense>
    </div>
  );
}


